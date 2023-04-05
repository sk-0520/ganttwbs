import { v4 } from "uuid";

import { AnyTimeline, DateOnly, GroupTimeline, Holiday, HolidayEvent, Progress, TaskTimeline, TimeOnly, Timeline, TimelineId, WeekIndex } from "./data/Setting";
import { TimeSpan } from "./TimeSpan";
import { Settings } from "./Settings";
import { Dates } from "./Dates";
import { DateTimeRange, SuccessDateTimeRange } from "./data/DateTimeRange";
import { DateTimeRanges } from "./DateTimeRanges";

interface Holidays {
	dates: ReadonlyArray<Date>;
	weeks: ReadonlyArray<WeekIndex>;
}

export abstract class Timelines {

	public static toNodePreviousId(timeline: Timeline): string {
		return "timeline-node-previous-" + timeline.id;
	}

	public static toDaysId(date: Date): string {
		return "days-" + Dates.format(date, "yyyy_MM_dd");
	}


	public static serializeWorkload(workload: TimeSpan): TimeOnly {
		return workload.toString("readable");
	}

	public static createNewGroup(): GroupTimeline {
		const item: GroupTimeline = {
			id: v4(),
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
			id: v4(),
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
		return Math.floor(progress).toFixed(0);
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

	private static convertDatesByHolidayEvents(events: { [key: DateOnly]: HolidayEvent }): Array<Date> {
		const result = new Array<Date>();

		for (const [key, _] of Object.entries(events)) {
			const date = new Date(key);
			result.push(date);
		}

		return result;
	}

	private static createSuccessTimeRange(holidays: Holidays, timeline: Timeline, beginDate: Date, workload: TimeSpan): SuccessDateTimeRange {
		//TODO: 非稼働日を考慮（開始から足す感じいいはず）
		const endDate = new Date(beginDate.getTime() + workload.totalMilliseconds);
		const result: SuccessDateTimeRange = {
			kind: "success",
			timeline: timeline,
			begin: beginDate,
			end: endDate,
		}

		return result;
	}

	public static getDateTimeRanges(flatTimelines: ReadonlyArray<Timeline>, holiday: Holiday, recursiveMaxCount: Readonly<number>): Map<TimelineId, DateTimeRange> {
		const result = new Map<TimelineId, DateTimeRange>();

		const holidays: Holidays = {
			dates: this.convertDatesByHolidayEvents(holiday.events),
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
			const beginDate = new Date(timeline.static!);
			const workload = TimeSpan.parse(timeline.workload);
			const timeRange = this.createSuccessTimeRange(holidays, timeline, beginDate, workload);
			result.set(timeline.id, timeRange);
			cache.statics.set(timeline.id, timeline);
		}
		// 固定・前工程のないタスクを未入力設定
		const emptyTimelines = taskTimelines
			.filter(a => !a.static && !a.previous.length)
			;
		for (const timeline of emptyTimelines) {
			const range: DateTimeRange = {
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
			if (!prevRange || !DateTimeRanges.maybeSuccessTimeRange(prevRange)) {
				continue;
			}

			const workload = TimeSpan.parse(timeline.workload);

			const timeRange = this.createSuccessTimeRange(holidays, timeline, prevRange.end, workload);
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
						.filter((a): a is DateTimeRange => a !== undefined)
						;
					if (resultDateTimeRanges.some(a => DateTimeRanges.isError(a))) {
						// 前工程にエラーがあれば自身は関係ミス扱いにする
						result.set(timeline.id, {
							kind: "relation-error",
							timeline: timeline,
						});
						continue;
					}

					// 多分これで算出可能
					const successDateTimeRanges = resultDateTimeRanges.filter(DateTimeRanges.maybeSuccessTimeRange);
					if (resultDateTimeRanges.length !== successDateTimeRanges.length) {
						// わからん
						continue;
					}

					const maxTimeRange = DateTimeRanges.maxByEndDate(successDateTimeRanges);
					if (maxTimeRange === undefined) {
						debugger;
					}
					let prevDate = maxTimeRange.end;
					if (timeline.static) {
						const staticDate = new Date(timeline.static);
						const targetTime = Math.max(staticDate.getTime(), maxTimeRange.end.getTime());
						prevDate = new Date(targetTime);
					}

					const workload = TimeSpan.parse(timeline.workload);
					const timeRange = this.createSuccessTimeRange(holidays, timeline, prevDate, workload);
					result.set(timeline.id, timeRange);

				} else if (Settings.maybeGroupTimeline(timeline)) {
					// グループ

					if (!timeline.children.length) {
						// 子がいないならエラっとっく
						const range: DateTimeRange = {
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
						.filter((a): a is DateTimeRange => a !== undefined)
						;
					if (resultDateTimeRanges.some(a => DateTimeRanges.isError(a))) {
						// 前工程にエラーがあれば自身は関係ミス扱いにする
						result.set(timeline.id, {
							kind: "relation-error",
							timeline: timeline,
						});
						continue;
					}
					// まぁまぁ(たぶん条件漏れあり)
					const items = resultDateTimeRanges.filter(DateTimeRanges.maybeSuccessTimeRange);
					if (items.length) {
						const minMax = DateTimeRanges.getMinMaxRange(items);
						const timeRange: SuccessDateTimeRange = {
							timeline: timeline,
							kind: "success",
							begin: minMax.minimum.begin,
							end: minMax.maximum.end,
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
