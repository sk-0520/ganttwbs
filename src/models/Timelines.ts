import { AnyTimeline, DateOnly, GroupTimeline, Holiday, HolidayEvent, Progress, TaskTimeline, TimeOnly, Timeline, TimelineId, WeekIndex } from "./data/Setting";
import { TimeSpan } from "./TimeSpan";
import { Settings } from "./Settings";
import { SuccessWorkRange, WorkRange } from "./data/WorkRange";
import { WorkRanges } from "./WorkRanges";
import { DateTime } from "./DateTime";
import { TimeZone } from "./TimeZone";
import { CalendarRange } from "./data/CalendarRange";
import { IdFactory } from "./IdFacotory";

interface Holidays {
	dates: ReadonlyArray<DateTime>;
	weeks: ReadonlyArray<WeekIndex>;
}

type TimeLineIdOrObject = TimelineId | Timeline;

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

	public static moveTimelineOrder(timelines: Array<Timeline>, moveUp: boolean, currentTimeline: Timeline): boolean {
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

	public static moveTimelineIndex(timelines: Array<Timeline>, sourceIndex: number, destinationIndex: number): void {
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
				const summary = this.sumWorkloads(timeline.children)
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

	public static sumProgress(timelines: ReadonlyArray<Timeline>): Progress {
		const progress: Array<Progress> = [];

		for (const timeline of timelines) {
			if (Settings.maybeGroupTimeline(timeline)) {
				const summary = this.sumProgress(timeline.children)
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
	public static getParentGroup(timeline: Timeline, timelineNodes: ReadonlyArray<GroupTimeline | TaskTimeline>): Array<GroupTimeline> | null {
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

	private static createSuccessTimeRange(holidays: Holidays, timeline: Timeline, beginDate: DateTime, workload: TimeSpan, timeZone: TimeZone): SuccessWorkRange {
		//TODO: 非稼働日を考慮（開始から足す感じいいはず）
		const endDate = DateTime.convert(beginDate.getTime() + workload.totalMilliseconds, timeZone);
		const result: SuccessWorkRange = {
			kind: "success",
			timeline: timeline,
			begin: beginDate,
			end: endDate,
		}

		return result;
	}

	public static getDateTimeRanges(flatTimelines: ReadonlyArray<Timeline>, holiday: Holiday, recursiveMaxCount: Readonly<number>, timeZone: TimeZone): Map<TimelineId, WorkRange> {
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
			const beginDate = DateTime.parse(timeline.static!, timeZone);
			const workload = TimeSpan.parse(timeline.workload);
			const timeRange = this.createSuccessTimeRange(holidays, timeline, beginDate, workload, timeZone);
			result.set(timeline.id, timeRange);
			cache.statics.set(timeline.id, timeline);
		}
		// 固定・前工程のないタスクを未入力設定
		const emptyTimelines = taskTimelines
			.filter(a => !a.static && !a.previous.length)
			;
		for (const timeline of emptyTimelines) {
			const range: WorkRange = {
				kind: "no-input",
				timeline: timeline,
			}
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
			if (!prevRange || !WorkRanges.maybeSuccessWorkRange(prevRange)) {
				continue;
			}

			const workload = TimeSpan.parse(timeline.workload);

			const timeRange = this.createSuccessTimeRange(holidays, timeline, prevRange.end, workload, timeZone);
			result.set(timeline.id, timeRange);
		}

		// グループ・タスクをそれぞれ算出
		const targetTimelines = new Set(flatTimelines.filter(a => !result.has(a.id)));
		let recursiveCount = 0;
		while (result.size < flatTimelines.length) {
			if (recursiveMaxCount <= ++recursiveCount) {
				console.error("デバッグ制限超過")
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

					const resultDateTimeRanges = timeline.previous
						.map(a => result.get(a))
						.filter((a): a is WorkRange => a !== undefined)
						;
					if (resultDateTimeRanges.some(a => WorkRanges.isError(a))) {
						// 前工程にエラーがあれば自身は関係ミス扱いにする
						result.set(timeline.id, {
							kind: "relation-error",
							timeline: timeline,
						});
						continue;
					}

					// 多分これで算出可能
					const successDateTimeRanges = resultDateTimeRanges.filter(WorkRanges.maybeSuccessWorkRange);
					if (resultDateTimeRanges.length !== successDateTimeRanges.length) {
						// わからん
						continue;
					}

					const maxTimeRange = WorkRanges.maxByEndDate(successDateTimeRanges);
					if (maxTimeRange === undefined) {
						debugger;
					}
					let prevDate = maxTimeRange.end;
					if (timeline.static) {
						const staticDate = DateTime.parse(timeline.static, timeZone);
						const targetTime = Math.max(staticDate.getTime(), maxTimeRange.end.getTime());
						prevDate = DateTime.convert(targetTime, timeZone);
					}

					const workload = TimeSpan.parse(timeline.workload);
					const timeRange = this.createSuccessTimeRange(holidays, timeline, prevDate, workload, timeZone);
					result.set(timeline.id, timeRange);

				} else if (Settings.maybeGroupTimeline(timeline)) {
					// グループ

					if (!timeline.children.length) {
						// 子がいないならエラっとっく
						const range: WorkRange = {
							kind: "no-children",
							timeline: timeline,
						}
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

					const resultDateTimeRanges = resultChildren
						.map(a => result.get(a.id))
						.filter((a): a is WorkRange => a !== undefined)
						;
					if (resultDateTimeRanges.some(a => WorkRanges.isError(a))) {
						// 前工程にエラーがあれば自身は関係ミス扱いにする
						result.set(timeline.id, {
							kind: "relation-error",
							timeline: timeline,
						});
						continue;
					}
					// まぁまぁ(たぶん条件漏れあり)
					const items = resultDateTimeRanges.filter(WorkRanges.maybeSuccessWorkRange);
					if (items.length) {
						const totalSuccessWorkRange = WorkRanges.getTotalSuccessWorkRange(items);
						const timeRange: SuccessWorkRange = {
							timeline: timeline,
							kind: "success",
							begin: totalSuccessWorkRange.minimum.begin,
							end: totalSuccessWorkRange.maximum.end,
						}
						result.set(timeline.id, timeRange);
					}
				}
			}
		}

		console.debug("反復実施数", recursiveCount, "result", result.size, "flatTimelines", flatTimelines.length)

		return result;
	}

}
