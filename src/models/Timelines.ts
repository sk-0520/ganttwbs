import { Arrays } from "@/models/Arrays";
import { AnyTimeline, DateOnly, GroupTimeline, Holiday, HolidayEvent, Progress, TaskTimeline, TimeOnly, TimelineId, WeekIndex } from "@/models/data/Setting";
import { SuccessWorkRange, WorkRange } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { IdFactory } from "@/models/IdFactory";
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

	public static createNewGroup(): GroupTimeline {
		const item: GroupTimeline = {
			id: IdFactory.createTimelineId(),
			kind: "group",
			subject: "",
			children: [],
			comment: "",
		};

		return item;
	}

	public static createNewTask(): TaskTimeline {
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

	public static toIndexNumber(indexTree: ReadonlyArray<number>, currentIndex: number): string {
		const currentNumber = currentIndex + 1;

		if (indexTree.length) {
			return indexTree.map(a => a + 1).join(".") + "." + currentNumber;
		}

		return currentNumber.toString();
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

	public static moveTimelineOrder(timelines: Array<AnyTimeline>, moveUp: boolean, currentTimeline: AnyTimeline): boolean {
		const currentIndex = timelines.findIndex(a => a === currentTimeline);

		if (moveUp) {
			if (currentIndex && timelines.length) {
				const nextIndex = currentIndex - 1;
				const tempTimeline = timelines[nextIndex];
				timelines[nextIndex] = currentTimeline;
				timelines[currentIndex] = tempTimeline;
				return true;
			}
		} else {
			if (currentIndex < timelines.length - 1) {
				const nextIndex = currentIndex + 1;
				const tempTimeline = timelines[nextIndex];
				timelines[nextIndex] = currentTimeline;
				timelines[currentIndex] = tempTimeline;
				return true;
			}
		}

		return false;
	}

	public static moveTimelineIndex(timelines: Array<AnyTimeline>, sourceIndex: number, destinationIndex: number): void {
		const sourceTimeline = timelines[sourceIndex];
		timelines.splice(sourceIndex, 1);
		timelines.splice(destinationIndex, 0, sourceTimeline);
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

	public static getTimelinesMap(timelineNodes: ReadonlyArray<AnyTimeline>): Map<TimelineId, AnyTimeline> {
		const result = new Map<TimelineId, AnyTimeline>();

		for (const timeline of timelineNodes) {
			if (Settings.maybeGroupTimeline(timeline)) {
				const map = this.getTimelinesMap(timeline.children);
				for (const [key, value] of map) {
					result.set(key, value);
				}
			}

			result.set(timeline.id, timeline);
		}

		return result;
	}

	public static findTimeline(timelineId: TimelineId, timelineNodes: ReadonlyArray<AnyTimeline>): AnyTimeline | null {
		for (const node of timelineNodes) {
			if (node.id === timelineId) {
				return node;
			}
			if (Settings.maybeGroupTimeline(node)) {
				const result = this.findTimeline(timelineId, node.children);
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
	 * @param timelineNodes タイムラインノード。
	 * @returns 親グループの配列。空の場合、最上位に位置している。 見つかんなかった場合は null を返す。
	 */
	public static getParentGroup(timeline: AnyTimeline, timelineNodes: ReadonlyArray<GroupTimeline | TaskTimeline>): Array<GroupTimeline> | null {
		if (timelineNodes.find(a => a.id === timeline.id)) {
			// 最上位なので空配
			return [];
		}

		const rootGroups = timelineNodes.filter(Settings.maybeGroupTimeline);
		for (const groupTimeline of rootGroups) {
			const nodes = this.getParentGroup(timeline, groupTimeline.children);
			if (!nodes) {
				continue;
			}
			return [groupTimeline, ...nodes];
		}

		return null;
	}


	private static convertDatesByHolidayEvents(events: { [key: DateOnly]: HolidayEvent }, timeZone: TimeZone): Array<DateTime> {
		const result = new Array<DateTime>();

		for (const [key, _] of Object.entries(events)) {
			const date = DateTime.parse(key, timeZone);
			result.push(date);
		}

		return result;
	}

	private static createSuccessWorkRange(holidays: Holidays, timeline: AnyTimeline, beginDate: DateTime, workload: TimeSpan, timeZone: TimeZone): SuccessWorkRange {
		//TODO: 非稼働日を考慮（開始から足す感じいいはず）
		const endDate = DateTime.convert(beginDate.getTime() + workload.totalMilliseconds, timeZone);
		const result: SuccessWorkRange = {
			kind: "success",
			timeline: timeline,
			begin: beginDate,
			end: endDate,
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
			.filter(a => a.static && !a.previous.length);
		for (const timeline of staticTimelines) {
			if (!Types.isString(timeline.static)) {
				throw new Error();
			}
			const beginDate = DateTime.parse(timeline.static, timeZone);
			const workload = TimeSpan.parse(timeline.workload);
			const successWorkRange = this.createSuccessWorkRange(holidays, timeline, beginDate, workload, timeZone);
			result.set(timeline.id, successWorkRange);
			cache.statics.set(timeline.id, timeline);
		}
		// 固定・前工程のないタスクを未入力設定
		const emptyTimelines = taskTimelines
			.filter(a => !a.static && !a.previous.length);
		for (const timeline of emptyTimelines) {
			const range: WorkRange = {
				kind: "no-input",
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

			const successWorkRange = this.createSuccessWorkRange(holidays, timeline, prevRange.end, workload, timeZone);
			result.set(timeline.id, successWorkRange);
		}

		// グループ・タスクをそれぞれ算出
		const targetTimelines = new Set(flatTimelines.filter(a => !result.has(a.id)));
		let recursiveCount = 0;
		while (result.size < flatTimelines.length) {
			if (recursiveMaxCount <= ++recursiveCount) {
				console.error("デバッグ制限超過");
				for (const timeline of flatTimelines) {
					if (!result.has(timeline.id)) {
						result.set(timeline.id, {
							kind: "recursive-error",
							timeline: timeline,
						});
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
							kind: "self-selected-error",
							timeline: timeline,
						});
						continue;
					}

					if (timeline.previous.some(a => cache.noInputs.has(a))) {
						// 前工程に未入力項目があれば自身は関係ミス扱いにする
						result.set(timeline.id, {
							kind: "relation-no-input",
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
							kind: "relation-error",
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
					const successWorkRange = this.createSuccessWorkRange(holidays, timeline, prevDate, workload, timeZone);
					result.set(timeline.id, successWorkRange);

				} else if (Settings.maybeGroupTimeline(timeline)) {
					// グループ

					if (!timeline.children.length) {
						// 子がいないならエラっとっく
						const range: WorkRange = {
							kind: "no-children",
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
							kind: "relation-error",
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
							kind: "success",
							begin: totalSuccessWorkRange.minimum.begin,
							end: totalSuccessWorkRange.maximum.end,
						};
						result.set(timeline.id, successWorkRange);
					}
				}
			}
		}

		console.debug("反復実施数", recursiveCount, "result", result.size, "flatTimelines", flatTimelines.length);

		return result;
	}

	/**
	 * タイムラインから最初に見つかったタスクを返す。
	 * ここでいう最初は層の浅い部分となる。
	 * @param timeline
	 * @returns
	 */
	public static getFirstTaskTimeline(timeline: AnyTimeline): TaskTimeline | null {
		if(Settings.maybeTaskTimeline(timeline)) {
			return timeline;
		} else if(Settings.maybeGroupTimeline(timeline)) {
			const taskChildren = timeline.children.filter(Settings.maybeTaskTimeline);
			if(taskChildren.length) {
				return taskChildren[0];
			}

			const groupChildren = timeline.children.filter(Settings.maybeGroupTimeline);
			for(const groupTImeline of groupChildren) {
				const taskTimeline = this.getFirstTaskTimeline(groupTImeline);
				if(taskTimeline) {
					return taskTimeline;
				}
			}
		} else {
			throw new Error();
		}

		return null;
	}

	/**
	 * 直近のタイムラインを取得。
	 * @param timeline 基準タイムライン。
	 * @param timelineNodes ノード状態全タイムライン。
	 * @returns 直近のタイムライン、あかんときは `null`
	 */
	public static getPrevTimeline(timeline: AnyTimeline, timelineNodes: ReadonlyArray<AnyTimeline>): AnyTimeline | null {
		const rootIndex = timelineNodes.findIndex(a => a.id === timeline.id);
		if (!rootIndex) {
			return null;
		}

		if (rootIndex !== -1) {
			return timelineNodes[rootIndex - 1];
		}

		const groups = this.getParentGroup(timeline, timelineNodes);
		const timelines = groups
			? Arrays.last(groups).children
			: timelineNodes
		;

		const childIndex = timelines.findIndex(a => a.id === timeline.id);

		if(childIndex) {
			return timelines[childIndex - 1];
		}
		if(!groups) {
			return null;
		}

		// 直接お爺さん見ていいのか問題(ルートは対応してるからいいはず。。。自信ない)
		const group = Arrays.last(groups);
		const parent = groups[groups.length - 2];
		const parentIndex = parent.children.findIndex(a => a.id === group.id);

		if(parentIndex === -1) {
			throw new Error();
		}

		if(parentIndex) {
			return parent.children[childIndex - 1];
		}

		return null;
	}

}
