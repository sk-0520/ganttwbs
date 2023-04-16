import { DateTime } from "./DateTime";
import { TimeSpan } from "./TimeSpan";
import { Timelines } from "./Timelines";
import { CellBox } from "./data/CellBox";
import { ChartArea } from "./data/ChartArea";
import { ChartSize } from "./data/ChartSize";
import { MemberMapValue } from "./data/MemberMapValue";
import { GroupTimeline, MemberId, TaskTimeline, Theme, TimelineId } from "./data/Setting";
import { TimeSpanRange } from "./data/TimeSpanRange";
import { SuccessWorkRange } from "./data/WorkRange";

export abstract class Charts {

	public static toConnecterColorId(fromTimelineId: TimelineId, toTimelineId: TimelineId): string {
		return "connecter_" + fromTimelineId + "_" + toTimelineId;
	}

	public static toMarkerId(fromTimelineId: TimelineId, toTimelineId: TimelineId, marker: "start" | "end"): string {
		return "marker-" + marker + "_" + fromTimelineId + "_" + toTimelineId;
	}

	public static toReference(target: string): string {
		return "url(#" + target + ")";
	}

	public static getTimeSpanRange(startDate: DateTime, workRange: SuccessWorkRange): TimeSpanRange {
		const startDiffTime = workRange.begin.getTime() - startDate.getTime();
		const startDiffSpan = TimeSpan.fromMilliseconds(startDiffTime);
		//const startDiffDays = startDiffSpan.totalDays;

		const endDiffTime = workRange.end.getTime() - workRange.begin.getTime();
		const endDiffSpan = TimeSpan.fromMilliseconds(endDiffTime);
		//const endDiffDays = endDiffSpan.totalDays;

		return {
			start: startDiffSpan,
			end: endDiffSpan,
		};
	}

	public static createChartArea(timeSpanRange: TimeSpanRange | null, index: number, cell: CellBox, chartSize: ChartSize): ChartArea {
		const width = typeof cell.width === "number" ? cell.width : cell.width.value;
		const height = typeof cell.height === "number" ? cell.height : cell.height.value;

		const result: ChartArea = {
			timeSpanRange: timeSpanRange,
			x: timeSpanRange ? timeSpanRange.start.totalDays * width : 0,
			y: index * height,
			width: timeSpanRange ? timeSpanRange.end.totalDays * width : 0,
			height: height,
			chartSize: chartSize,
		};

		return result;
	}

	public static getGroupBackground(timeline: GroupTimeline, nodes: ReadonlyArray<GroupTimeline | TaskTimeline>, theme: Theme): string {
		// 未設定とグループラインの扱いが微妙過ぎる
		const parents = Timelines.getParentGroup(timeline, nodes);
		if (parents) {
			if (parents.length < theme.groups.length) {
				// これはこれで正しいのだ(-1 したい気持ちは抑えるべし)
				const index = parents.length;
				if (index in theme.groups) {
					return theme.groups[index];
				}
				return theme.timeline.defaultGroup;
			}
		}

		return theme.timeline.group;
	}

	public static getTaskBackground(timeline: TaskTimeline, memberMap: ReadonlyMap<MemberId, MemberMapValue>, theme: Theme): string {
		const member = memberMap.get(timeline.memberId);
		if (member) {
			return member.member.color;
		}

		return theme.timeline.defaultTask;
	}


}
