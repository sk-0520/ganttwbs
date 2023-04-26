import { Arrays } from "@/models/Arrays";
import { DisplayTimelineId } from "@/models/data/DisplayTimelineId";
import { AnyTimeline, DateOnly, GroupTimeline, Holiday, HolidayEvent, Progress, RootTimeline, TaskTimeline, TimeOnly, TimelineId } from "@/models/data/Setting";
import { RecursiveCalculationErrorWorkRange, SuccessWorkRange, WorkRange, WorkRangeKind } from "@/models/data/WorkRange";
import { DateTime, WeekIndex } from "@/models/DateTime";
import { IdFactory } from "@/models/IdFactory";
import { Limiter } from "@/models/Limiter";
import { Settings } from "@/models/Settings";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";
import { Types } from "@/models/Types";
import { WorkRanges } from "@/models/WorkRanges";

interface Holidays {
	dates: ReadonlyArray<DateTime>;
	weeks: ReadonlyArray<WeekIndex>;
}

type TimeLineIdOrObject = TimelineId | AnyTimeline;

export abstract class Timelines {

	private static getId(timeline: TimeLineIdOrObject): string {
		return typeof timeline === "string" ? timeline : timeline.id;
	}

	public static toNodePreviousId(timeline: TimeLineIdOrObject): string {
		return "timeline-node-previous-" + this.getId(timeline);
	}

	public static toDaysId(date: DateTime): string {
		return "days-" + date.format("yyyy_MM_dd");
	}

	public static toChartId(timeline: TimeLineIdOrObject): string {
		return "timeline-chart-" + this.getId(timeline);
	}

	public static serializeWorkload(workload: TimeSpan): TimeOnly {
		return workload.toString("readable");
	}

	public static serializeDateTime(date: DateTime): TimeOnly {
		return date.format("yyyy-MM-dd");
	}

	public static createRootTimeline(): RootTimeline {
		const item: RootTimeline = {
			id: IdFactory.rootTimelineId,
			kind: "group",
			subject: "ROOT",
			comment: "top level timeline",
			children: [],
		};

		return item;
	}

	public static createGroupTimeline(): GroupTimeline {
		const item: GroupTimeline = {
			id: IdFactory.createTimelineId(),
			kind: "group",
			subject: "",
			children: [],
			comment: "",
		};

		return item;
	}

	public static createTaskTimeline(): TaskTimeline {
		const workload = TimeSpan.fromDays(1);
		const item: TaskTimeline = {
			id: IdFactory.createTimelineId(),
			kind: "task",
			subject: "",
			comment: "",
			previous: [],
			workload: this.serializeWorkload(workload),
			memberId: "",
			progress: 0,
		};

		return item;
	}

	public static toIndexNumber(index: DisplayTimelineId): string {
		return index.tree.join(".");
	}

	private static flatCore(timeline: AnyTimeline): Array<AnyTimeline> {
		const result = new Array<AnyTimeline>();

		if (Settings.maybeTaskTimeline(timeline)) {
			result.push(timeline);
		} else if (Settings.maybeGroupTimeline(timeline)) {
			result.push(timeline);
			const children = timeline.children.flatMap(a => this.flatCore(a));
			for (const child of children) {
				result.push(child);
			}
		}

		return result;
	}

	public static flat(timelineNodes: ReadonlyArray<AnyTimeline>): Array<AnyTimeline> {
		return timelineNodes.flatMap(a => this.flatCore(a));
	}

	public static toIndexes(timelines: ReadonlyArray<AnyTimeline>): Map<TimelineId, number> {
		return new Map(timelines.map((a, i) => [a.id, i]));
	}

	public static displayWorkload(workload: number): string {
		return workload.toFixed(2);
	}

	public static sumWorkloads(timelines: ReadonlyArray<GroupTimeline | TaskTimeline>): TimeSpan {
		const workloads: Array<TimeSpan> = [];

		for (const timeline of timelines) {
			if (Settings.maybeGroupTimeline(timeline)) {
				const summary = this.sumWorkloads(timeline.children);
				workloads.push(summary);
			} else if (Settings.maybeTaskTimeline(timeline)) {
				const span = TimeSpan.parse(timeline.workload);
				workloads.push(span);
			}
		}

		const sumMs = workloads.reduce(
			(r, a) => r + a.totalMilliseconds,
			0
		);

		return TimeSpan.fromMilliseconds(sumMs);
	}

	public static sumWorkloadByGroup(groupTimeline: GroupTimeline): TimeSpan {
		return this.sumWorkloads(groupTimeline.children);
	}

	public static displayProgress(progress: number): string {
		return Math.round(progress * 100.0).toFixed(0);
	}

	public static sumProgress(timelines: ReadonlyArray<AnyTimeline>): Progress {
		const progress: Array<Progress> = [];

		for (const timeline of timelines) {
			if (Settings.maybeGroupTimeline(timeline)) {
				const summary = this.sumProgress(timeline.children);
				progress.push(summary);
			} else if (Settings.maybeTaskTimeline(timeline)) {
				progress.push(timeline.progress);
			}
		}

		if (!progress.length) {
			return 0;
		}

		const sumProgress = progress.filter(a => !isNaN(a)).reduce(
			(r, a) => r + a,
			0.0
		);

		return sumProgress / progress.length;
	}

	public static sumProgressByGroup(groupTimeline: GroupTimeline): Progress {
		return this.sumProgress(groupTimeline.children);
	}

	/**
	 * 対象グループとその子孫をマッピング
	 * @param groupTimeline
	 * @returns マップデータ
	 */
	public static getTimelinesMap(groupTimeline: GroupTimeline): Map<TimelineId, AnyTimeline> {
		const result = new Map<TimelineId, AnyTimeline>();

		result.set(groupTimeline.id, groupTimeline);

		for (const timeline of groupTimeline.children) {
			if (Settings.maybeGroupTimeline(timeline)) {
				const map = this.getTimelinesMap(timeline);
				for (const [key, value] of map) {
					result.set(key, value);
				}
			}

			result.set(timeline.id, timeline);
		}

		return result;
	}

	public static findTimeline(timelineId: TimelineId, groupTimeline: Readonly<GroupTimeline>): AnyTimeline | null {
		if (timelineId === groupTimeline.id) {
			return groupTimeline;
		}

		for (const node of groupTimeline.children) {
			if (node.id === timelineId) {
				return node;
			}
			if (Settings.maybeGroupTimeline(node)) {
				const result = this.findTimeline(timelineId, node);
				if (result) {
					return result;
				}
			}
		}

		return null;
	}

	/**
	 * 指定のタイムラインが所属するグループを取得する。
	 * @param timeline 子タイムライン。
	 * @param groupTimeline 検索対象のグループタイムライン(再帰的に参照される)。
	 * @returns 親グループの配列。最小で1、何も見つからない場合は 空配列。
	 */
	public static getParentGroups(timeline: Readonly<AnyTimeline>, groupTimeline: Readonly<GroupTimeline>): Array<GroupTimeline> {

		for (const child of groupTimeline.children) {
			if (child.id === timeline.id) {
				return [groupTimeline];
			}
		}

		const groupChildren = groupTimeline.children.filter(Settings.maybeGroupTimeline);

		for (const child of groupChildren) {
			const nodes = this.getParentGroups(timeline, child);
			if (nodes && nodes.length) {
				return [groupTimeline, ...nodes];
			}
		}

		return [];

	}

	public static calcDisplayId(timeline: Readonly<AnyTimeline>, rootTimeline: Readonly<GroupTimeline>): DisplayTimelineId {

		const groups = Timelines.getParentGroups(timeline, rootTimeline);
		if (!groups.length) {
			// 削除時に呼ばれた場合、すでに存在しない
			return {
				level: 0,
				tree: [],
			};
		}

		const tree = new Array<number>();

		// 子孫のレベル設定
		for (let i = 1; i < groups.length; i++) {
			const parent = groups[i - 1];
			const group = groups[i];
			const index = parent.children.findIndex(a => a.id === group.id);
			if (index === -1) {
				throw new Error();
			}
			tree.push(index + 1);
		}
		// 最終アイテム・ルートのレベル設定
		const last = Arrays.last(groups);
		const index = last.children.findIndex(a => a.id === timeline.id);
		if (index === -1) {
			throw new Error();
		}
		tree.push(index + 1);

		const result: DisplayTimelineId = {
			level: tree.length,
			tree: tree,
		};

		return result;
	}

	private static convertDatesByHolidayEvents(events: { [key: DateOnly]: HolidayEvent }, timeZone: TimeZone): Array<DateTime> {
		const result = new Array<DateTime>();

		for (const [key, _] of Object.entries(events)) {
			const date = DateTime.parse(key, timeZone);
			result.push(date);
		}

		return result;
	}

	private static createRecursiveCalculatorWorkRange(timeline: AnyTimeline): RecursiveCalculationErrorWorkRange {
		return {
			kind: WorkRangeKind.RecursiveError,
			timeline: timeline,
		};
	}

	private static createSuccessWorkRange(holidays: Holidays, timeline: AnyTimeline, beginDate: DateTime, workload: TimeSpan, timeZone: TimeZone, recursiveMaxCount: number): SuccessWorkRange | RecursiveCalculationErrorWorkRange {

		function isHoliday(dateOnly: DateTime): boolean {
			if (holidays.weeks.includes(dateOnly.week)) {
				return true;
			}

			if (holidays.dates.some(a => a.getTime() === dateOnly.getTime())) {
				return true;
			}

			return false;
		}

		const limiter = new Limiter(recursiveMaxCount);

		// 開始が休日に当たる場合は平日まで移動
		let begin = beginDate;
		while (true) {
			if (limiter.increment()) {
				return this.createRecursiveCalculatorWorkRange(timeline);
			}

			const date = begin.toDateOnly();
			if (isHoliday(date)) {
				begin = date.add(TimeSpan.fromDays(1));
				continue;
			}
			break;
		}

		// 補正された開始日に対して工数を追加
		let end = begin.add(TimeSpan.fromMilliseconds(workload.totalMilliseconds));

		// 開始日から終了日までにある休日を加算
		let count = begin.toDateOnly().diff(begin).totalDays + begin.diff(end).totalDays;
		let endDays = 0;
		limiter.reset();
		for (let i = 0; i < count; i++) {
			if (limiter.increment()) {
				return this.createRecursiveCalculatorWorkRange(timeline);
			}

			const date = begin.add(TimeSpan.fromDays(1)).toDateOnly();
			if (isHoliday(date)) {
				endDays += 1;
				count += 1;
			}
		}
		end = end.add(TimeSpan.fromDays(endDays));

		const result: SuccessWorkRange = {
			kind: WorkRangeKind.Success,
			timeline: timeline,
			begin: begin,
			end: end,
		};

		return result;
	}

	public static getWorkRanges(flatTimelines: ReadonlyArray<AnyTimeline>, holiday: Holiday, recursiveMaxCount: Readonly<number>, timeZone: TimeZone): Map<TimelineId, WorkRange> {
		const result = new Map<TimelineId, WorkRange>();

		const holidays: Holidays = {
			dates: this.convertDatesByHolidayEvents(holiday.events, timeZone),
			weeks: holiday.regulars.map(a => Settings.toWeekIndex(a)),
		};

		// 算出済みキャッシュ
		const cache = {
			// 開始固定のみ
			statics: new Map<TimelineId, TaskTimeline>(),
			// 未入力
			noInputs: new Map<TimelineId, TaskTimeline>(),
		} as const;

		// タスクのみ
		const taskTimelines = flatTimelines
			.filter(Settings.maybeTaskTimeline)
			;
		// 開始固定だけのタスクを算出
		const staticTimelines = taskTimelines
			.filter(a => a.static && !a.previous.length)
			;
		for (const timeline of staticTimelines) {
			if (!Types.isString(timeline.static)) {
				throw new Error();
			}
			const beginDate = DateTime.parse(timeline.static, timeZone);
			const workload = TimeSpan.parse(timeline.workload);
			const successWorkRange = this.createSuccessWorkRange(holidays, timeline, beginDate, workload, timeZone, recursiveMaxCount);
			result.set(timeline.id, successWorkRange);
			cache.statics.set(timeline.id, timeline);
		}
		// 固定・前工程のないタスクを未入力設定
		const emptyTimelines = taskTimelines
			.filter(a => !a.static && !a.previous.length);
		for (const timeline of emptyTimelines) {
			const range: WorkRange = {
				kind: WorkRangeKind.NoInput,
				timeline: timeline,
			};
			result.set(timeline.id, range);
			cache.noInputs.set(timeline.id, timeline);
		}

		// 前工程が開始固定で算出済みのタスクを埋める
		for (const timeline of taskTimelines) {
			if (timeline.previous.length !== 1 || timeline.static) {
				continue;
			}

			const prev = cache.statics.get(timeline.previous[0]);
			if (!prev) {
				continue;
			}

			const prevRange = result.get(prev.id);
			if (!WorkRanges.maybeSuccessWorkRange(prevRange)) {
				continue;
			}

			const workload = TimeSpan.parse(timeline.workload);

			const successWorkRange = this.createSuccessWorkRange(holidays, timeline, prevRange.end, workload, timeZone, recursiveMaxCount);
			result.set(timeline.id, successWorkRange);
		}

		// グループ・タスクをそれぞれ算出
		console.time("反復");
		const limiter = new Limiter(recursiveMaxCount);
		const targetTimelines = new Set(flatTimelines.filter(a => !result.has(a.id)));
		while (result.size < flatTimelines.length) {
			if (limiter.increment()) {
				for (const timeline of flatTimelines) {
					if (!result.has(timeline.id)) {
						result.set(timeline.id, this.createRecursiveCalculatorWorkRange(timeline));
					}
				}

				break;
			}

			for (const timeline of targetTimelines) {
				if (result.has(timeline.id)) {
					// すでに結果セットに格納されているものは無視
					continue;
				}

				if (Settings.maybeTaskTimeline(timeline)) {
					// タスク

					if (timeline.previous.some(a => a === timeline.id)) {
						// 前工程に自分がいればもうなんもできん
						result.set(timeline.id, {
							kind: WorkRangeKind.SelfSelectedError,
							timeline: timeline,
						});
						continue;
					}

					if (timeline.previous.some(a => cache.noInputs.has(a))) {
						// 前工程に未入力項目があれば自身は関係ミス扱いにする
						result.set(timeline.id, {
							kind: WorkRangeKind.RelationNoInput,
							timeline: timeline,
						});
						continue;
					}

					if (!timeline.previous.every(a => result.has(a))) {
						// 前工程が結果セットに全て格納されていなければ無視する
						continue;
					}

					const resultWorkRanges = timeline.previous
						.map(a => result.get(a))
						.filter((a): a is WorkRange => a !== undefined);
					if (resultWorkRanges.some(a => WorkRanges.isError(a))) {
						// 前工程にエラーがあれば自身は関係ミス扱いにする
						result.set(timeline.id, {
							kind: WorkRangeKind.RelationError,
							timeline: timeline,
						});
						continue;
					}

					// 多分これで算出可能
					const successWorkRanges = resultWorkRanges.filter(WorkRanges.maybeSuccessWorkRange);
					if (resultWorkRanges.length !== successWorkRanges.length) {
						// わからん
						continue;
					}

					const maxWorkRange = WorkRanges.maxByEndDate(successWorkRanges);
					if (maxWorkRange === undefined) {
						debugger;
					}
					let prevDate = maxWorkRange.end;
					if (timeline.static) {
						const staticDate = DateTime.parse(timeline.static, timeZone);
						const targetTime = Math.max(staticDate.getTime(), maxWorkRange.end.getTime());
						prevDate = DateTime.convert(targetTime, timeZone);
					}

					const workload = TimeSpan.parse(timeline.workload);
					const successWorkRange = this.createSuccessWorkRange(holidays, timeline, prevDate, workload, timeZone, recursiveMaxCount);
					result.set(timeline.id, successWorkRange);

				} else if (Settings.maybeGroupTimeline(timeline)) {
					// グループ

					if (!timeline.children.length) {
						// 子がいないならエラっとっく
						const range: WorkRange = {
							kind: WorkRangeKind.NoChildren,
							timeline: timeline,
						};
						result.set(timeline.id, range);
						continue;
					}

					const resultChildren = timeline.children.filter(a => result.has(a.id));
					if (timeline.children.length !== resultChildren.length) {
						// 子の長さが違う場合、反復がまだ達成できていない可能性あり
						continue;
					}

					if (!resultChildren.every(a => result.has(a.id))) {
						// 結果セットに全て格納されていないのであれば算出できない
						continue;
					}

					const resultWorkRanges = resultChildren
						.map(a => result.get(a.id))
						.filter((a): a is WorkRange => a !== undefined);
					if (resultWorkRanges.some(a => WorkRanges.isError(a))) {
						// 前工程にエラーがあれば自身は関係ミス扱いにする
						result.set(timeline.id, {
							kind: WorkRangeKind.RelationError,
							timeline: timeline,
						});
						continue;
					}
					// まぁまぁ(たぶん条件漏れあり)
					const items = resultWorkRanges.filter(WorkRanges.maybeSuccessWorkRange);
					if (items.length) {
						const totalSuccessWorkRange = WorkRanges.getTotalSuccessWorkRange(items);
						const successWorkRange: SuccessWorkRange = {
							timeline: timeline,
							kind: WorkRangeKind.Success,
							begin: totalSuccessWorkRange.minimum.begin,
							end: totalSuccessWorkRange.maximum.end,
						};
						result.set(timeline.id, successWorkRange);
					}
				}
			}
		}

		console.timeEnd("反復");
		console.debug("反復実施数", limiter.count, "result", result.size, "flatTimelines", flatTimelines.length);

		return result;
	}

	/**
	 * タイムラインから最初に見つかったタスクを返す。
	 * ここでいう最初は層の浅い部分となる。
	 * @param timeline
	 * @returns
	 */
	public static getFirstTaskTimeline(timeline: AnyTimeline): TaskTimeline | null {
		if (Settings.maybeTaskTimeline(timeline)) {
			return timeline;
		} else if (Settings.maybeGroupTimeline(timeline)) {
			const taskChildren = timeline.children.filter(Settings.maybeTaskTimeline);
			if (taskChildren.length) {
				return taskChildren[0];
			}

			const groupChildren = timeline.children.filter(Settings.maybeGroupTimeline);
			for (const groupTImeline of groupChildren) {
				const taskTimeline = this.getFirstTaskTimeline(groupTImeline);
				if (taskTimeline) {
					return taskTimeline;
				}
			}
		} else {
			throw new Error();
		}

		return null;
	}

	/**
	 * 指定タイムラインは前工程タイムラインとして選択可能か
	 * @param targetTimeline 前工程になりうるかチェックするタイムライン。
	 * @param baseTimeline 基準となるタイムライン。
	 * @param rootTimeline
	 * @returns
	 */
	public static canSelect(targetTimeline: AnyTimeline, baseTimeline: AnyTimeline, rootTimeline: GroupTimeline): boolean {
		const groups = Timelines.getParentGroups(baseTimeline, rootTimeline);
		if (groups.length) {
			return !groups.some(a => a.id === targetTimeline.id);
		}

		return true;
	}

	/**
	 * 前工程タイムラインを検索。
	 * @param timeline タイムライン。
	 * @param rootTimeline
	 * @returns
	 */
	public static searchBeforeTimeline(timeline: AnyTimeline, rootTimeline: GroupTimeline): AnyTimeline | undefined {
		const sequenceTimelines = this.flat(rootTimeline.children);

		const index = sequenceTimelines.findIndex(a => a.id === timeline.id);
		if (index === -1) {
			throw new Error();
		}

		const groups = Timelines.getParentGroups(timeline, rootTimeline);
		const group = Arrays.last(groups);

		for (let i = index - 1; 0 <= i; i--) {
			const beforeTimeline = sequenceTimelines[i];
			if (Settings.maybeGroupTimeline(beforeTimeline)) {
				// 前項目が自身の属するグループの場合、直近タイムラインにはなりえない
				if (groups.find(a => a.id === beforeTimeline.id)) {
					continue;
				}
				return beforeTimeline;
			}
			if (Settings.maybeTaskTimeline(beforeTimeline)) {
				const beforeGroups = Timelines.getParentGroups(beforeTimeline, rootTimeline);
				const beforeGroup = Arrays.last(beforeGroups);
				// 前項目のグループと自身のグループが同じ場合、兄弟として直近として扱える
				if (beforeGroup.id === group.id) {
					return beforeTimeline;
				}

				if (this.canSelect(beforeTimeline, timeline, rootTimeline)) {
					// タスク自体は直近として扱える場合でも、異なるグループのためそのグループ自体を選択する
					if (1 < beforeGroups.length) {
						const target = beforeGroup;
						if (this.canSelect(target, timeline, rootTimeline)) {
							return target;
						}
					}

					return beforeTimeline;
				}
			}
		}

		return undefined;
	}
}
