

export type Color = string;

export type DateTime = string;
export type DateOnly = string;
export type TimeOnly = string;

/**
 * 反復計算最大数。
 */
export const DefaultRecursiveMaxCount = 1000;

export type WeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WeekDay =
	"monday"
	|
	"tuesday"
	|
	"wednesday"
	|
	"thursday"
	|
	"friday"
	|
	"saturday"
	|
	"sunday"
	;

export type HolidayKind =
	"holiday"
	|
	"special"
	;

export type MemberId = string;

export type TimelineKind =
	"group"
	|
	"task"
	;

export type TaskTimelineWorkState =
	"enabled"
	|
	"disabled"
	|
	"sleep"
	;

export interface HolidayEvent {
	display: string;
	kind: HolidayKind;
}

/**
 * 休日設定。
 */
export interface Holiday {
	/** 定休曜日 */
	regulars: Array<WeekDay>;
	events: { [key: DateOnly]: HolidayEvent }
}


export interface WorkDateRange {
	from: DateOnly;
	to: DateOnly;
}

export interface Calendar {
	range: WorkDateRange;
	holiday: Holiday;
}


export type TimelineId = string;
export type Progress = number;


export interface Timeline {
	id: TimelineId;
	kind: TimelineKind;
	subject: string;
	comment: string;
}

export interface GroupTimeline extends Timeline {
	kind: "group";
	children: Array<GroupTimeline | TaskTimeline>;
}


export type TaskTimelineWorkProgress = number;

export interface TaskTimelineWorkHistory {
	progress: TaskTimelineWorkProgress;
	version: VersionId;
	more: TimeOnly;
}

export interface TaskTimeline extends Timeline {
	kind: "task";
	memberId: MemberId;
	static?: DateTime;
	previous: Array<TimelineId>;
	workload: TimeOnly;
	progress: Progress;
}

export type AnyTimeline = GroupTimeline | TaskTimeline;

export type VersionId = string;

export interface VersionItem {
	id: VersionId;
	timestamp: DateTime;
}

export interface Theme {
	holiday: {
		regulars: { [key in WeekDay]?: Color };
		events: { [key in HolidayKind]: Color };
	};
	groups: Array<Color>;
	timeline: {
		group: Color;
		defaultGroup: Color;
		defaultTask: Color;
		completed: Color;
	};
}


export interface Member {
	id: MemberId;
	name: string;
	color: Color;
	price: Price;
}

/** 1日単価 */
export interface Price {
	/** 原価 */
	cost: number;
	/** 売上 */
	sales: number;
}

export interface Group {
	name: string;
	members: Array<Member>;
}


export interface Setting {
	name: string;
	/** 反復計算数 */
	recursive: number;
	calendar: Calendar;
	theme: Theme;
	groups: Array<Group>;
	timelineNodes: Array<GroupTimeline | TaskTimeline>;
	versions: Array<VersionItem>;
}


