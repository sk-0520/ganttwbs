import { Workbook } from "exceljs";

import { Calendars } from "@/models/Calendars";
import { CalcData } from "@/models/data/CalcData";
import { ResultFactory } from "@/models/data/Result";
import { Progress, RootTimeline, Setting } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { IdFactory } from "@/models/IdFactory";
import { Require } from "@/models/Require";
import { Resources } from "@/models/Resources";
import { Settings } from "@/models/Settings";
import { Timelines } from "@/models/Timelines";
import { WorkRanges } from "@/models/WorkRanges";
import { Color } from "@/models/Color";

type CellInputType = string | Progress | DateTime | Date;
const ColumnKeys = [
	"id",
	"subject",
	"workload",
	"resource",
	"range-begin",
	"range-end",
	"progress",
] as const;
type ColumnKey = typeof ColumnKeys[number];
type BaseCells = { [key in ColumnKey]: CellInputType };

// class CellValue {
// 	public constructor(
// 		public readonly value: CellInputType,
// 		public readonly format: string
// 	) { }
// }

export abstract class Exports {

	/**
	 * 編集データから出力用の計算済みデータを生成。
	 *
	 * 出力やある時点での一括データ表示に使用する想定。
	 *
	 * @param editorData 編集データ。
	 * @returns 計算済みデータ。
	 */
	public static calc(setting: Setting): CalcData {
		const calendarInfo = Calendars.createCalendarInfo(setting.timeZone, setting.calendar);
		const resourceInfo = Resources.createResourceInfo(setting.groups);
		const sequenceTimelines = Timelines.flat(setting.rootTimeline.children);
		const timelineMap = Timelines.getTimelinesMap(setting.rootTimeline);
		const workRanges = Timelines.getWorkRanges([...timelineMap.values()], setting.calendar.holiday, setting.recursive, calendarInfo.timeZone);
		const dayInfos = Timelines.calcDayInfos(timelineMap, new Set([...workRanges.values()]), resourceInfo);

		const successWorkRanges = [...workRanges.values()].filter(WorkRanges.maybeSuccessWorkRange);

		const totalSuccessWorkRange = successWorkRanges.length
			? ResultFactory.success(WorkRanges.getTotalSuccessWorkRange(successWorkRanges))
			: ResultFactory.failure<never>(undefined as never)
			;

		return {
			calendarInfo,
			resourceInfo,
			sequenceTimelines,
			timelineMap,
			dayInfos,
			workRange: {
				baseRanges: workRanges,
				successWorkRanges: successWorkRanges,
				totalSuccessWorkRange: totalSuccessWorkRange,
			},
		};
	}

	private static createBaseCells(baseCells: BaseCells): Array<string | number | Date> {
		const result: ReturnType<typeof this.createBaseCells> = [];

		for (const columnKey of ColumnKeys) {
			const rawValue = baseCells[columnKey];

			if (rawValue instanceof DateTime) {
				result.push(rawValue.toDate());
			} else {
				result.push(rawValue);
			}
		}

		return result;
	}

	private static getBaseCellsNumberMap(): Map<ColumnKey, number> {
		const result = new Map<ColumnKey, number>(
			ColumnKeys.map((a, i) => [a, i + 1])
		);

		return result;
	}

	private static toArgbColor(color: Color): string {
		return color.a.toString(16).padStart(2, "0")
			+ color.r.toString(16).padStart(2, "0")
			+ color.g.toString(16).padStart(2, "0")
			+ color.b.toString(16).padStart(2, "0")
			;
	}

	public static async createWorkbook(setting: Setting, calcData: CalcData): Promise<Workbook> {
		const dates = Calendars.getDays(calcData.calendarInfo.range.begin, calcData.calendarInfo.range.end).map(a => a.toDate());

		const rootTimelineItem = Require.get(calcData.timelineMap, IdFactory.rootTimelineId) as RootTimeline;
		const rootSuccessWorkRanges = calcData.workRange.successWorkRanges.find(a => a.timeline.id === rootTimelineItem.id);

		const baseCellsNumberMap = this.getBaseCellsNumberMap();

		const workbook = new Workbook();
		const timelineSheet = workbook.addWorksheet("timeline");

		// ヘッダ
		// 1. タイトル - 月
		// 2. 集計 - 日付
		// 3. ヘッダ - 曜日
		const header1: BaseCells = {
			"id": setting.name,
			"subject": "",
			"workload": "",
			"resource": "",
			"range-begin": "",
			"range-end": "",
			"progress": "",
		};
		const headerRow1 = timelineSheet.addRow([
			...this.createBaseCells(header1),
			...dates
		]);
		for (let i = 0; i < dates.length; i++) {
			const cell = headerRow1.getCell(ColumnKeys.length + i + 1);
			cell.style.numFmt = "mm";
		}
		timelineSheet.mergeCells(1, 1, 1, ColumnKeys.length);

		for (const key of ColumnKeys) {
			const column = timelineSheet.getColumn(Require.get(baseCellsNumberMap, key));
			column.width = Require.switch(key as ColumnKey, {
				"id": () => 6,
				"subject": () => 14,
				"workload": () => 6,
				"resource": () => 10,
				"range-begin": () => 10,
				"range-end": () => 10,
				"progress": () => 6,
			});
		}

		const beginDate = calcData.calendarInfo.range.begin.toDateOnly();
		for (let i = 0; i < dates.length; i++) {
			const date = beginDate.add(i, "day");
			const column = timelineSheet.getColumn(ColumnKeys.length + i + 1);
			column.width = 4;
			column.fill = {
				type: "pattern",
				pattern: "none",
			};

			if (setting.theme.holiday.regulars) {
				const weekDay = Settings.toWeekDay(date.week);
				if (weekDay in setting.theme.holiday.regulars && setting.calendar.holiday.regulars.includes(weekDay)) {
					const color = Color.tryParse(setting.theme.holiday.regulars[weekDay] || "");
					if (color) {
						column.fill = {
							type: "pattern",
							pattern: "solid",
							fgColor: {
								argb: this.toArgbColor(color),
							},
						};
					}
				}
			}

			const eventValue = calcData.calendarInfo.holidayEventMap.get(date.ticks);
			if (eventValue) {
				if (eventValue.event.kind in setting.theme.holiday.events) {
					const color = Color.tryParse(setting.theme.holiday.events[eventValue.event.kind] || "");
					if (color) {
						column.fill = {
							type: "pattern",
							pattern: "solid",
							fgColor: {
								argb: this.toArgbColor(color),
							},
						};
					}
				}
			}
		}

		const header2: BaseCells = {
			"id": `${calcData.sequenceTimelines.filter(Settings.maybeTaskTimeline).length}/${calcData.sequenceTimelines.length}`,
			"subject": "",
			"workload": Timelines.sumWorkloadByGroup(rootTimelineItem).totalDays,
			"resource": "",
			"range-begin": rootSuccessWorkRanges?.begin ?? "",
			"range-end": rootSuccessWorkRanges?.end ?? "",
			"progress": Timelines.sumProgressByGroup(rootTimelineItem),
		};
		const headerRow2 = timelineSheet.addRow([
			...this.createBaseCells(header2),
			...dates
		]);
		for (let i = 0; i < dates.length; i++) {
			const cell = headerRow2.getCell(ColumnKeys.length + i + 1);
			cell.style.numFmt = "dd";
		}
		headerRow2.getCell(Require.get(baseCellsNumberMap, "progress")).numFmt = "0%";

		const header3: BaseCells = {
			"id": "ID",
			"subject": "作業",
			"workload": "工数",
			"resource": "割当",
			"range-begin": "開始",
			"range-end": "終了",
			"progress": "進捗率",
		};
		const headerRow3 = timelineSheet.addRow([
			...this.createBaseCells(header3),
			...dates
		]);
		for (let i = 0; i < dates.length; i++) {
			const cell = headerRow3.getCell(ColumnKeys.length + i + 1);
			cell.style.numFmt = "aaa";
		}

		// ウィンドウ枠固定
		timelineSheet.views = [
			{
				state: "frozen",
				xSplit: ColumnKeys.length,
				ySplit: 3,
			}
		];

		// タイムラインをどさっと出力
		for (const timeline of calcData.sequenceTimelines) {
			const readableTimelineId = Timelines.calcReadableTimelineId(timeline, rootTimelineItem);
			const workload = Settings.maybeGroupTimeline(timeline)
				? Timelines.sumWorkloadByGroup(timeline)
				: Timelines.deserializeWorkload(timeline.workload)
				;
			const memberGroupPair = Settings.maybeGroupTimeline(timeline)
				? undefined
				: calcData.resourceInfo.memberMap.get(timeline.memberId)
				;
			const successWorkRange = calcData.workRange.successWorkRanges.find(a => a.timeline.id === timeline.id);
			const workRange = successWorkRange
				? { begin: successWorkRange.begin.toDate(), end: successWorkRange.end.toDate() }
				: { begin: "#ERROR", end: "" }
				;
			const progress = Settings.maybeGroupTimeline(timeline)
				? Timelines.sumProgressByGroup(timeline)
				: timeline.progress
				;

			const timelineBaseCells: BaseCells = {
				"id": Timelines.toReadableTimelineId(readableTimelineId),
				"subject": timeline.subject,
				"workload": workload.totalDays,
				"resource": memberGroupPair ? `${memberGroupPair.member.name}(${memberGroupPair.group.name})` : "",
				"range-begin": workRange.begin,
				"range-end": workRange.end,
				"progress": progress,
			};

			const timelineRow = timelineSheet.addRow([
				...this.createBaseCells(timelineBaseCells),
			]);

			timelineRow.getCell(Require.get(baseCellsNumberMap, "progress")).numFmt = "0%";

		}

		return workbook;
	}
}
