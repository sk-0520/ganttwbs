import { AreaSize } from "@/models/data/AreaSize";
import { CellBox } from "@/models/data/CellBox";
import { ChartArea } from "@/models/data/ChartArea";
import { MemberGroupPair } from "@/models/data/MemberGroupPair";
import { GroupTimeline, MemberId, TaskTimeline, Theme, TimelineId } from "@/models/data/Setting";
import { TimeSpanRange } from "@/models/data/TimeSpanRange";
import { SuccessWorkRange } from "@/models/data/WorkRange";
import { DateTime } from "@/models/DateTime";
import { Timelines } from "@/models/Timelines";
import { TimeSpan } from "@/models/TimeSpan";

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

	public static getTimeSpanRange(startDate: Readonly<DateTime>, workRange: SuccessWorkRange): TimeSpanRange {
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

	public static createChartArea(timeSpanRange: TimeSpanRange | null, index: number, cell: CellBox, chartSize: AreaSize): ChartArea {
		const width = typeof cell.width === "number" ? cell.width : cell.width.value;
		const height = typeof cell.height === "number" ? cell.height : cell.height.value;

		const result: ChartArea = {
			timeSpanRange: timeSpanRange,
			x: timeSpanRange ? timeSpanRange.start.totalDays * width : 0,
			y: index * height,
			width: timeSpanRange ? timeSpanRange.end.totalDays * width : 0,
			height: height,
			areaSize: chartSize,
		};

		return result;
	}

	public static getGroupBackground(timeline: Readonly<GroupTimeline>, rootGroupTimeline: Readonly<GroupTimeline>, theme: Readonly<Theme>): string {
		// 未設定とグループラインの扱いが微妙過ぎる
		const parents = Timelines.getParentGroups(timeline, rootGroupTimeline);
		if (parents.length <= theme.groups.length) {
			const index = parents.length - 1;
			if (index in theme.groups) {
				return theme.groups[index];
			}
			return theme.timeline.defaultGroup;
		}

		return theme.timeline.group;
	}

	public static getTaskBackground(timeline: TaskTimeline, memberMap: ReadonlyMap<MemberId, MemberGroupPair>, theme: Readonly<Theme>): string {
		const member = memberMap.get(timeline.memberId);
		if (member) {
			return member.member.color;
		}

		return theme.timeline.defaultTask;
	}


}
