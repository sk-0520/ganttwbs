import { Arrays } from "@/models/Arrays";
import { DayInfo } from "@/models/data/DayInfo";
import { DateTimeRange } from "@/models/data/Range";
import { ReadableTimelineId } from "@/models/data/ReadableTimelineId";
import { ResourceInfo } from "@/models/data/ResourceInfo";
import { AnyTimeline, DateOnly, GroupTimeline, Holiday, HolidayEvent, Member, Progress, RootTimeline, TaskTimeline, TimeOnly, TimelineId, Timestamp } from "@/models/data/Setting";
import { RecursiveCalculationErrorWorkRange, SuccessWorkRange, WorkRange, WorkRangeKind } from "@/models/data/WorkRange";
import { DateTime, DateTimeTicks, WeekIndex } from "@/models/DateTime";
import { IdFactory } from "@/models/IdFactory";
import { Limiter } from "@/models/Limiter";
import { TimeLogMethod, createLogger } from "@/models/Logging";
import { Settings } from "@/models/Settings";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";
import { Types } from "@/models/Types";
import { WorkRanges } from "@/models/WorkRanges";

const logger = createLogger("Timelines");

interface Holidays {
	dates: ReadonlyArray<DateTime>;
	weeks: ReadonlyArray<WeekIndex>;
}

export type TimelineIdOrObject = TimelineId | AnyTimeline;

export abstract class Timelines {

	private static getId(timeline: TimelineIdOrObject): string {
		return typeof timeline === "string" ? timeline : timeline.id;
	}

	public static toRowId(timeline: TimelineIdOrObject): string {
		return "timeline-row-" + this.getId(timeline);
	}

	public static toSubjectId(timeline: TimelineIdOrObject): string {
		return "timeline-cell-subject-" + this.getId(timeline);
	}

	public static toWorkloadId(timeline: TimelineIdOrObject): string {
		return "timeline-cell-workload-" + this.getId(timeline);
	}

	public static toNodePreviousId(timeline: TimelineIdOrObject): string {
		return "timeline-node-previous-" + this.getId(timeline);
	}

	public static toDaysId(date: DateTime): string {
		return "days-" + date.format("yyyy_MM_dd");
	}

	public static toChartId(timeline: TimelineIdOrObject): string {
		return "timeline-chart-" + this.getId(timeline);
	}

	public static getReadableTimelineIdClassName(displayTimelineId: ReadableTimelineId): string {
		return "_dynamic_programmable_readableTimelineId_level-" + displayTimelineId.level;
	}


	public static serializeWorkload(workload: TimeSpan): TimeOnly {
		return workload.format("readable");
	}
	public static deserializeWorkload(workload: TimeOnly): TimeSpan {
		return TimeSpan.parse(workload);
	}

	public static serializeDateTime(date: DateTime): Timestamp {
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

	public static toReadableTimelineId(index: ReadableTimelineId): string {
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
				const span = this.deserializeWorkload(timeline.workload);
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

	public static calcReadableTimelineId(timeline: Readonly<AnyTimeline>, rootTimeline: Readonly<GroupTimeline>): ReadableTimelineId {

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

		const result: ReadableTimelineId = {
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

			if (holidays.dates.some(a => a.ticks === dateOnly.ticks)) {
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

			const date = begin.truncateTime();
			if (isHoliday(date)) {
				begin = date.add(1, "day");
				continue;
			}
			break;
		}

		// 補正された開始日に対して工数を追加
		let end = begin.add(TimeSpan.fromMilliseconds(workload.totalMilliseconds));

		// 開始日から終了日までにある休日を加算
		let count = begin.truncateTime().diff(begin).totalDays + begin.diff(end).totalDays;
		let endDays = 0;
		limiter.reset();
		for (let i = 0; i < count; i++) {
			if (limiter.increment()) {
				return this.createRecursiveCalculatorWorkRange(timeline);
			}

			const date = begin.add(i, "day").truncateTime();
			if (isHoliday(date)) {
				endDays += 1;
				count += 1;
			}
		}
		end = end.add(endDays, "day");

		const result: SuccessWorkRange = {
			kind: WorkRangeKind.Success,
			timeline: timeline,
			begin: begin,
			end: end,
		};

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

	private static getWorkRangesCore(flatTimelines: ReadonlyArray<AnyTimeline>, holiday: Holiday, recursiveMaxCount: Readonly<number>, timeZone: TimeZone, log: TimeLogMethod): Map<TimelineId, WorkRange> {
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
			const workload = this.deserializeWorkload(timeline.workload);
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

			const workload = this.deserializeWorkload(timeline.workload);

			const successWorkRange = this.createSuccessWorkRange(holidays, timeline, prevRange.end, workload, timeZone, recursiveMaxCount);
			result.set(timeline.id, successWorkRange);
		}

		// グループ・タスクをそれぞれ算出
		log("各グループ・タスク");
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
				// すでに結果セットに格納されているものは無視
				if (result.has(timeline.id)) {
					targetTimelines.delete(timeline); //NOTE: 列挙中に削除できることにカルチャーショック。多分動いてる
					continue;
				}

				if (Settings.maybeTaskTimeline(timeline)) {
					// タスク
					if (timeline.previous.includes(timeline.id)) {
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
						.filter((a): a is WorkRange => a !== undefined)
						;
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
						continue;
					}
					let prevDate = maxWorkRange.end;
					if (timeline.static) {
						const staticDate = DateTime.parse(timeline.static, timeZone);
						prevDate = DateTime.getMaximum(staticDate, maxWorkRange.end);
					}

					const workload = this.deserializeWorkload(timeline.workload);
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
						.filter((a): a is WorkRange => a !== undefined)
						;
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

		log("反復実施数", limiter.count, "result", result.size, "flatTimelines", flatTimelines.length);

		return result;
	}

	public static getWorkRanges(flatTimelines: ReadonlyArray<AnyTimeline>, holiday: Holiday, recursiveMaxCount: Readonly<number>, timeZone: TimeZone): Map<TimelineId, WorkRange> {
		let result: Map<TimelineId, WorkRange> | undefined;

		logger.time("作業範囲算出", log => {
			result = this.getWorkRangesCore(flatTimelines, holiday, recursiveMaxCount, timeZone, log);
		});
		if (result === undefined) {
			throw new Error();
		}

		return result;
	}

	private static calculateDayInfosCore(timelineMap: ReadonlyMap<TimelineId, Readonly<AnyTimeline>>, workRanges: ReadonlySet<Readonly<WorkRange>>, resourceInfo: Readonly<ResourceInfo>, log: TimeLogMethod): Map<DateTimeTicks, DayInfo> {
		type SuccessWorkRangeTimeline = Omit<SuccessWorkRange, "kind" | "timeline"> & {
			timeline: TaskTimeline,
		}

		const successWorkRanges = new Set(
			[...workRanges]
				.filter(WorkRanges.maybeSuccessWorkRange)
				.filter(a => Settings.maybeTaskTimeline(a.timeline))
				.map(a => ({
					begin: a.begin,
					end: a.end,
					timeline: a.timeline as TaskTimeline
				} satisfies SuccessWorkRangeTimeline))
		);

		if (!successWorkRanges.size) {
			// 重複チェックするにはそもそも範囲算出が成功してないとなんもできない
			return new Map();
		}

		const result = new Map<DateTimeTicks, DayInfo>();

		// 作業範囲一覧を総なめ
		for (const currentWorkRange of successWorkRanges) {
			for (const otherWorkRange of successWorkRanges) {
				if (otherWorkRange === currentWorkRange) {
					// 自分は無視
					continue;
				}

				let range: DateTimeRange | undefined = undefined;

				if (
					// 自身の後半に対象が存在する
					(currentWorkRange.begin.ticks < otherWorkRange.begin.ticks)
					&&
					(otherWorkRange.begin.ticks < currentWorkRange.end.ticks)
					&&
					(currentWorkRange.end.ticks < otherWorkRange.end.ticks)
				) {
					range = {
						begin: otherWorkRange.begin,
						end: currentWorkRange.end,
					};
				} else if (
					// 自身の中に対象が存在する
					(currentWorkRange.begin.ticks <= otherWorkRange.begin.ticks)
					&&
					(otherWorkRange.begin.ticks < otherWorkRange.end.ticks)
					&&
					(otherWorkRange.end.ticks <= currentWorkRange.end.ticks)
				) {
					range = {
						begin: otherWorkRange.begin,
						end: otherWorkRange.end,
					};
				} else if (
					// 自身の前半に対象が存在する
					(otherWorkRange.begin.ticks < currentWorkRange.begin.ticks)
					&&
					(currentWorkRange.begin.ticks < otherWorkRange.end.ticks)
					&&
					(otherWorkRange.end.ticks < currentWorkRange.end.ticks)
				) {
					range = {
						begin: currentWorkRange.begin,
						end: otherWorkRange.end,
					};
				} else if (
					// 自身が対象の中に納まる
					(otherWorkRange.begin.ticks <= currentWorkRange.begin.ticks)
					&&
					(currentWorkRange.begin.ticks < currentWorkRange.end.ticks)
					&&
					(currentWorkRange.end.ticks <= otherWorkRange.end.ticks)
				) {
					range = {
						begin: currentWorkRange.begin,
						end: currentWorkRange.end,
					};
				}

				if (range) {
					if (currentWorkRange.timeline.memberId === otherWorkRange.timeline.memberId && resourceInfo.memberMap.has(currentWorkRange.timeline.memberId)) {
						const setInfo = (date: DateTime) => {
							let info = result.get(date.ticks);
							if (!info) {
								info = {
									duplicateMembers: new Set(),
									targetTimelines: new Set(),
								};
								result.set(date.ticks, info);
							}

							info.duplicateMembers.add(currentWorkRange.timeline.memberId);
							info.targetTimelines.add(currentWorkRange.timeline.id);
						};

						const length = range.begin.diff(range.end).totalDays;
						for (let i = 0; i < length; i++) {
							const date = i
								? range.begin.add(i, "day").truncateTime()
								: range.begin
								;
							setInfo(date);
						}
						// 終端(中途半端な終了時間を考慮)
						if (!range.end.truncateTime().equals(range.end)) {
							setInfo(range.end);
						}
					}
				}
			}
		}

		return result;
	}

	public static calculateDayInfos(timelineMap: ReadonlyMap<TimelineId, Readonly<AnyTimeline>>, workRanges: ReadonlySet<Readonly<WorkRange>>, resourceInfo: Readonly<ResourceInfo>): Map<DateTimeTicks, DayInfo> {
		let result: Map<DateTimeTicks, DayInfo> | undefined;

		logger.time("日情報算出", log => {
			result = this.calculateDayInfosCore(timelineMap, workRanges, resourceInfo, log);
		});
		if (result === undefined) {
			throw new Error();
		}

		return result;
	}

	public static isCompleted(progress: Progress): boolean {
		return 1 <= progress;
	}

	/**
	 * 指定した日の集合から該当メンバーの稼働率を算出。
	 *
	 * @param member
	 * @param workDays
	 * @param taskTimelines
	 * @param successWorkRanges
	 * @returns
	 */
	public static calculateWorkPercent(member: Member, workDays: ReadonlyArray<DateTime>, taskTimelines: ReadonlyArray<TaskTimeline>, successWorkRanges: ReadonlyArray<SuccessWorkRange>): number {

		const memberTimelines = taskTimelines.filter(a => a.memberId === member.id);
		const memberWorkRanges = successWorkRanges.filter(a => memberTimelines.some(b => b.id === a.timeline.id));

		const memberWorkDays = new Array<DateTime>();
		for (const workDay of workDays) {
			for (const memberWorkRange of memberWorkRanges) {
				if (workDay.isIn(memberWorkRange.begin, memberWorkRange.end)) {
					memberWorkDays.push(workDay);
				}
			}
		}

		return memberWorkDays.length / workDays.length;
	}

}
