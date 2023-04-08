import { z } from "zod";

const ColorSchema = z.string();
export type Color = z.infer<typeof ColorSchema>;

const DateTimeSchema = z.string();
export type DateTime = z.infer<typeof DateTimeSchema>;
const DateOnlySchema = z.string();
export type DateOnly = z.infer<typeof DateOnlySchema>;
const TimeOnlySchema = z.string();
export type TimeOnly = z.infer<typeof TimeOnlySchema>;

/**
 * 反復計算最大数。
 */
export const DefaultRecursiveMaxCount = 1000;

export type WeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const WeekDaySchema = z.enum([
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
]);
export type WeekDay = z.infer<typeof WeekDaySchema>;

const HolidayKindSchema = z.enum([
	"holiday",
	"special",
]);
export type HolidayKind = z.infer<typeof HolidayKindSchema>;

const MemberIdSchema = z.string();
export type MemberId = z.infer<typeof MemberIdSchema>;

const TimelineKindSchema = z.enum([
	"group",
	"task",
]);
export type TimelineKind = z.infer<typeof TimelineKindSchema>;

const TaskTimelineWorkStateSchema = z.enum([
	"enabled",
	"disabled",
	"sleep",
]);
export type TaskTimelineWorkState = z.infer<typeof TaskTimelineWorkStateSchema>;

const HolidayEventSchema = z.object({
	display: z.string(),
	kind: HolidayKindSchema,
})

export type HolidayEvent = z.infer<typeof HolidayEventSchema>;

/**
 * 休日設定。
 */
const HolidaySchema = z.object({
	/** 定休曜日 */
	regulars: z.array(WeekDaySchema),
	events: z.record(DateOnlySchema, HolidayEventSchema)
})
/** @inheritdoc */
export type Holiday = z.infer<typeof HolidaySchema>;

const WorkDateRangeSchema = z.object({
	from: DateOnlySchema,
	to: DateOnlySchema,
});
/** @inheritdoc */
export type WorkDateRange = z.infer<typeof WorkDateRangeSchema>;

const CalendarSchema = z.object({
	range: WorkDateRangeSchema,
	holiday: HolidaySchema,
});
/** @inheritdoc */
export type Calendar = z.infer<typeof CalendarSchema>;


const TimelineIdSchema = z.string();
/** @inheritdoc */
export type TimelineId = z.infer<typeof TimelineIdSchema>;

/** 0-1 */
const ProgressSchema = z.number();
/** @inheritdoc */
export type Progress = z.infer<typeof ProgressSchema>;


/** @inheritdoc */
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


