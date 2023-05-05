import { z } from "zod";

import { IdFactory } from "@/models/IdFactory";

const ColorStringSchema = z.string();
export type ColorString = z.infer<typeof ColorStringSchema>;

const TimestampSchema = z.string();
export type Timestamp = z.infer<typeof TimestampSchema>;
const DateOnlySchema = z.string();
export type DateOnly = z.infer<typeof DateOnlySchema>;
const TimeOnlySchema = z.string();
export type TimeOnly = z.infer<typeof TimeOnlySchema>;


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
	"normal",
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
});

export type HolidayEvent = z.infer<typeof HolidayEventSchema>;

/**
 * 休日設定。
 */
const HolidaySchema = z.object({
	/** 定休曜日 */
	regulars: z.array(WeekDaySchema),
	events: z.record(DateOnlySchema, HolidayEventSchema)
});
/** @inheritdoc */
export type Holiday = z.infer<typeof HolidaySchema>;

const WorkDateRangeSchema = z.object({
	begin: DateOnlySchema,
	end: DateOnlySchema,
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

const RootTimelineIdSchema = z.literal(IdFactory.rootTimelineId);
/** @inheritdoc */
export type RootTimelineId = z.infer<typeof RootTimelineIdSchema>;

/** 0-1 */
const ProgressSchema = z.number();
/** @inheritdoc */
export type Progress = z.infer<typeof ProgressSchema>;

const TimelineSchema = z.object({
	id: TimelineIdSchema,
	kind: TimelineKindSchema,
	subject: z.string(),
	comment: z.string(),
});
/** @inheritdoc */
type Timeline = z.infer<typeof TimelineSchema>;

interface IGroupTimeline extends Timeline {
	kind: "group";
	children: Array<IGroupTimeline | ITaskTimeline>;
}

interface IRootTimeline extends IGroupTimeline {
	id: RootTimelineId,
}

interface ITaskTimeline extends Timeline {
	kind: "task";
	memberId: MemberId;
	static?: Timestamp;
	previous: Array<TimelineId>;
	workload: TimeOnly;
	progress: Progress;
}

const GroupTimelineSchema: z.ZodSchema<IGroupTimeline> = z.lazy(() => TimelineSchema.extend({
	kind: z.literal("group"),
	children: z.array(z.union([GroupTimelineSchema, TaskTimelineSchema])),
}));
/** @inheritdoc */
export type GroupTimeline = z.infer<typeof GroupTimelineSchema>;

const RootTimelineSchema: z.ZodSchema<IRootTimeline> = z.lazy(() => TimelineSchema.extend({
	id: RootTimelineIdSchema,
	kind: z.literal("group"),
	children: z.array(z.union([GroupTimelineSchema, TaskTimelineSchema])),
}));
/** @inheritdoc */
export type RootTimeline = z.infer<typeof RootTimelineSchema>;


const TaskTimelineSchema = TimelineSchema.extend({
	kind: z.literal("task"),
	memberId: MemberIdSchema,
	static: TimestampSchema.optional(),
	previous: z.array(TimelineIdSchema),
	workload: TimeOnlySchema,
	progress: ProgressSchema,
});
/** @inheritdoc */
export type TaskTimeline = z.infer<typeof TaskTimelineSchema>;

const AnyTimelineSchema = z.union([GroupTimelineSchema, TaskTimelineSchema]);
/** @inheritdoc */
export type AnyTimeline = z.infer<typeof AnyTimelineSchema>;

const VersionIdSchema = z.string();
/** @inheritdoc */
export type VersionId = z.infer<typeof VersionIdSchema>;

/**
 * バージョン。
 */
const VersionItemSchema = z.object({
	id: VersionIdSchema,
	timestamp: TimestampSchema,
});
/** {@inheritDoc VersionItemSchema} */
export type VersionItem = z.infer<typeof VersionItemSchema>;

const HolidayThemeSchema = z.object({
	regulars: z.record(WeekDaySchema, ColorStringSchema),
	events: z.record(HolidayKindSchema, ColorStringSchema),
});
export type HolidayTheme = z.infer<typeof HolidayThemeSchema>;

const TimelineThemeSchema = z.object({
	defaultGroup: ColorStringSchema,
	defaultTask: ColorStringSchema,
	completed: ColorStringSchema,
});
export type TimelineTheme = z.infer<typeof TimelineThemeSchema>;

const ThemeSchema = z.object({
	holiday: HolidayThemeSchema,
	groups: z.array(ColorStringSchema),
	timeline: TimelineThemeSchema,
});
export type Theme = z.infer<typeof ThemeSchema>;


/** 1日単価 */
const PriceSchema = z.object({
	/** 原価 */
	cost: z.number(),
	/** 売上 */
	sales: z.number(),
});
export type Price = z.infer<typeof PriceSchema>;

const MemberSchema = z.object({
	id: MemberIdSchema,
	name: z.string(),
	color: ColorStringSchema,
	price: PriceSchema,
});
export type Member = z.infer<typeof MemberSchema>;

const GroupSchema = z.object({
	name: z.string(),
	members: z.array(MemberSchema),
});
export type Group = z.infer<typeof GroupSchema>;

export const SettingSchema = z.object({
	name: z.string(),
	/** 反復計算数 */
	recursive: z.number(),
	/** 設定ファイルバージョン */
	version: z.number().int(),
	/** タイムゾーン */
	timeZone: z.string(),
	calendar: CalendarSchema,
	theme: ThemeSchema,
	groups: z.array(GroupSchema),
	rootTimeline: RootTimelineSchema,
	versions: z.array(VersionItemSchema),
});
export type Setting = z.infer<typeof SettingSchema>;
