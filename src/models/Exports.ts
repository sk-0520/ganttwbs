import { Border, Row, Workbook, Worksheet } from "exceljs";

import { Locale } from "@/locales/locale";
import { Calendars } from "@/models/Calendars";
import { Color } from "@/models/Color";
import { CalcData } from "@/models/data/CalcData";
import { ResultFactory } from "@/models/data/Result";
import { Progress, RootTimeline, Setting } from "@/models/data/Setting";
import { DateTime } from "@/models/DateTime";
import { DefaultSettings } from "@/models/DefaultSettings";
import { IdFactory } from "@/models/IdFactory";
import { Require } from "@/models/Require";
import { Resources } from "@/models/Resources";
import { Settings } from "@/models/Settings";
import { Strings } from "@/models/Strings";
import { Timelines } from "@/models/Timelines";
import { WorkRanges } from "@/models/WorkRanges";

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

const ExcelFormat = {
	Workload: "0.00",
	Progress: "0%",
	Chart: ";;;",
} as const;

const DefaultBorders = {
	BaseCell: {
		style: "thin",
		color: {
			argb: "ff000000",
		},
	} satisfies Border,
	DaysCell: {
		style: "thin",
		color: {
			argb: "ff000000",
		},
	} satisfies Border,
	TimelineCell: {
		style: "hair",
		color: {
			argb: "ff000000",
		},
	} satisfies Border,
	TimelineRangeCell: {
		style: "thin",
		color: {
			argb: "ff000000",
		},
	} satisfies Border,
};

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

	private static getExcelBaseCellsNumberMap(): Map<ColumnKey, number> {
		const result = new Map<ColumnKey, number>(
			ColumnKeys.map((a, i) => [a, i + 1])
		);

		return result;
	}

	private static toExcelArgbColor(color: Color): string {
		return (color.a * 255).toString(16).padStart(2, "0")
			+ color.r.toString(16).padStart(2, "0")
			+ color.g.toString(16).padStart(2, "0")
			+ color.b.toString(16).padStart(2, "0")
			;
	}

	// private static toAbsoluteAddress(address:string):string {
	// 	const ret = /(?<COL>[A-Z]+)(?<ROW>\d+)/.exec(address);
	// 	if(!ret || !ret.groups) {
	// 		throw new Error();
	// 	}

	// 	return "$" + ret.groups.COL + "$" + ret.groups.ROW;
	// }

	private static createExcelRow1(timelineSheet: Worksheet, calcData: CalcData, setting: Setting, dates: ReadonlyArray<Readonly<Date>>, baseCellsNumberMap: ReadonlyMap<ColumnKey, number>, beginDate: DateTime, locale: Locale): Row {
		const monthEqualColor = Color.create(0xcc, 0xcc, 0xcc);

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
			cell.style.numFmt = locale.file.excel.export.monthOnlyFormat;
			// カラム設定が効かないっぽい(順序依存？)
			cell.style.alignment = {
				vertical: "middle",
				horizontal: "center",
			};
			cell.style.border = {
				top: DefaultBorders.DaysCell,
				bottom: DefaultBorders.DaysCell,
				left: DefaultBorders.DaysCell,
				right: DefaultBorders.DaysCell,
			};
			if (i) {
				const prev = beginDate.add(i - 1, "day");
				const current = beginDate.add(i, "day");
				if (prev.month === current.month) {
					cell.font = {
						color: {
							argb: this.toExcelArgbColor(monthEqualColor),
						},
					};
				}
			}
		}
		timelineSheet.mergeCells(1, 1, 1, ColumnKeys.length);
		const titleCell = headerRow1.getCell(Require.get(baseCellsNumberMap, "id"));
		titleCell.font = {
			bold: true
		};
		titleCell.alignment = {
			horizontal: "justify",
			vertical: "middle",
		};

		for (const key of ColumnKeys) {
			const column = timelineSheet.getColumn(Require.get(baseCellsNumberMap, key));
			column.outlineLevel = 1;
			column.width = Require.switch(key as ColumnKey, {
				"id": () => 14,
				"subject": () => 20,
				"workload": () => 8,
				"resource": () => 14,
				"range-begin": () => 12,
				"range-end": () => 12,
				"progress": () => 8,
			});
			column.style.alignment = {
				vertical: "middle"
			};
			column.style.border = {
				top: DefaultBorders.BaseCell,
				bottom: DefaultBorders.BaseCell,
				left: DefaultBorders.BaseCell,
				right: DefaultBorders.BaseCell,
			};
		}

		for (let i = 0; i < dates.length; i++) {
			const date = beginDate.add(i, "day");
			const column = timelineSheet.getColumn(ColumnKeys.length + i + 1);
			column.width = 4;
			column.style.alignment = {
				vertical: "middle",
				horizontal: "center",
			};
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
								argb: this.toExcelArgbColor(color),
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
								argb: this.toExcelArgbColor(color),
							},
						};
					}
				}
			}

			column.style.border = {
				top: DefaultBorders.DaysCell,
				bottom: DefaultBorders.DaysCell,
				left: DefaultBorders.DaysCell,
				right: DefaultBorders.DaysCell,
			};
		}

		return headerRow1;
	}

	private static createExcelRow2(timelineSheet: Worksheet, calcData: CalcData, setting: Setting, dates: ReadonlyArray<Readonly<Date>>, baseCellsNumberMap: ReadonlyMap<ColumnKey, number>, rootTimelineItem: RootTimeline, locale: Locale): Row {
		const rootSuccessWorkRanges = calcData.workRange.successWorkRanges.find(a => a.timeline.id === rootTimelineItem.id);

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
			cell.style.numFmt = locale.file.excel.export.dayOnlyFormat;
		}

		headerRow2.getCell(Require.get(baseCellsNumberMap, "workload")).numFmt = ExcelFormat.Workload;
		headerRow2.getCell(Require.get(baseCellsNumberMap, "progress")).numFmt = ExcelFormat.Progress;
		headerRow2.getCell(Require.get(baseCellsNumberMap, "range-begin")).numFmt = locale.file.excel.export.workRangeFormat;
		headerRow2.getCell(Require.get(baseCellsNumberMap, "range-end")).numFmt = locale.file.excel.export.workRangeFormat;
		const totalColor = Color.parse("ccc");
		for (const key of ColumnKeys) {
			const cell = headerRow2.getCell(Require.get(baseCellsNumberMap, key));
			cell.style.alignment = {
				horizontal: "center",
				vertical: "middle",
			};
			cell.font = {
				color: {
					argb: this.toExcelArgbColor(totalColor.getAutoColor()),
				},
			};
			cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: {
					argb: this.toExcelArgbColor(totalColor),
				},
			};
		}

		return headerRow2;
	}

	private static createExcelRow3(timelineSheet: Worksheet, calcData: CalcData, setting: Setting, dates: ReadonlyArray<Readonly<Date>>, baseCellsNumberMap: ReadonlyMap<ColumnKey, number>, locale: Locale): Row {
		const header3: BaseCells = {
			"id": locale.pages.editor.timeline.header.columns.id,
			"subject": locale.pages.editor.timeline.header.columns.subject,
			"workload": locale.pages.editor.timeline.header.columns.workload,
			"resource": locale.pages.editor.timeline.header.columns.resource,
			"range-begin": locale.pages.editor.timeline.header.columns.workRangeBegin,
			"range-end": locale.pages.editor.timeline.header.columns.workRangeEnd,
			"progress": locale.pages.editor.timeline.header.columns.progress,
		};
		const headerRow3 = timelineSheet.addRow([
			...this.createBaseCells(header3),
			...dates
		]);
		for (let i = 0; i < dates.length; i++) {
			const cell = headerRow3.getCell(ColumnKeys.length + i + 1);
			cell.style.numFmt = locale.file.excel.export.weekOnlyFormat;
		}
		const columnColor = Color.parse("444");
		for (const key of ColumnKeys) {
			const cell = headerRow3.getCell(Require.get(baseCellsNumberMap, key));
			cell.style.alignment = {
				horizontal: "center",
				vertical: "middle",
			};
			cell.font = {
				color: {
					argb: this.toExcelArgbColor(columnColor.getAutoColor()),
				},
			};
			cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: {
					argb: this.toExcelArgbColor(columnColor),
				},
			};
		}

		return headerRow3;
	}

	public static async createWorkbook(setting: Setting, calcData: CalcData, locale: Locale): Promise<Workbook> {
		const dates = Calendars.getDays(calcData.calendarInfo.range.begin, calcData.calendarInfo.range.end).map(a => a.toDate());

		const rootTimelineItem = Require.get(calcData.timelineMap, IdFactory.rootTimelineId) as RootTimeline;

		const baseCellsNumberMap = this.getExcelBaseCellsNumberMap();

		const workbook = new Workbook();
		const timelineSheet = workbook.addWorksheet(Strings.replaceMap(locale.file.excel.export.timelineSheetNameFormat, {
			"NAME": setting.name
		}));
		const beginDate = calcData.calendarInfo.range.begin.toDateOnly();

		// ヘッダ
		// 1. タイトル - 月
		this.createExcelRow1(timelineSheet, calcData, setting, dates, baseCellsNumberMap, beginDate, locale);
		// 2. 集計 - 日付
		this.createExcelRow2(timelineSheet, calcData, setting, dates, baseCellsNumberMap, rootTimelineItem, locale);
		// 3. ヘッダ - 曜日
		this.createExcelRow3(timelineSheet, calcData, setting, dates, baseCellsNumberMap, locale);

		// ウィンドウ枠固定
		timelineSheet.views = [
			{
				state: "frozen",
				xSplit: ColumnKeys.length,
				ySplit: 3,
			}
		];

		// 印刷設定
		timelineSheet.pageSetup = {
			printTitlesColumn: "A:G",
			printTitlesRow: "1:3",
			paperSize: 9, //A4, 諸事情でenumじゃない
			orientation: "landscape",
			fitToPage: true,
			fitToHeight: 1,
			fitToWidth: 0,
			margins: {
				top: 0.5,
				left: 0.5,
				bottom: 0.5,
				right: 0.5,
				header: 0.25,
				footer: 0.25,
			}
		};

		// ヘッダ・フッタ設定
		timelineSheet.headerFooter = {
			oddHeader: "&A",
			oddFooter: "&P/&N"
		};

		const groupColors = setting.theme.groups.map(a => Color.tryParse(a) ?? DefaultSettings.UnknownMemberColor);
		const defaultGroupColor = Color.parse(setting.theme.timeline.defaultGroup);
		const defaultTaskColor = Color.parse(setting.theme.timeline.defaultTask);
		const completedColor = Color.parse(setting.theme.timeline.completed);

		// タイムラインをどさっと出力
		//let n = 1;
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
				...dates.map(_ => ""),
			]);

			timelineRow.getCell(Require.get(baseCellsNumberMap, "id")).alignment = {
				vertical: "middle",
				horizontal: "left",
				indent: readableTimelineId.level - 1,
			};
			const progressCell = timelineRow.getCell(Require.get(baseCellsNumberMap, "progress"));

			timelineRow.getCell(Require.get(baseCellsNumberMap, "id")).numFmt = "@";
			timelineRow.getCell(Require.get(baseCellsNumberMap, "workload")).numFmt = ExcelFormat.Workload;
			progressCell.numFmt = ExcelFormat.Progress;
			timelineRow.getCell(Require.get(baseCellsNumberMap, "range-begin")).numFmt = locale.file.excel.export.workRangeFormat;
			timelineRow.getCell(Require.get(baseCellsNumberMap, "range-end")).numFmt = locale.file.excel.export.workRangeFormat;

			for (let i = 0; i < dates.length; i++) {
				const cell = timelineRow.getCell(ColumnKeys.length + i + 1);
				cell.style.border = {
					top: DefaultBorders.TimelineCell,
					bottom: DefaultBorders.TimelineCell,
					left: DefaultBorders.TimelineCell,
					right: DefaultBorders.TimelineCell,
				};
			}

			if (successWorkRange) {
				const beginSpan = beginDate.diff(successWorkRange.begin.toDateOnly());
				const beginCell = timelineRow.getCell(ColumnKeys.length + Math.floor(beginSpan.totalDays) + 1);

				beginCell.value = {
					formula: progressCell.address,
					result: progress,
					date1904: false,
				};
				beginCell.numFmt = ExcelFormat.Chart;

				const days = Calendars.getDays(successWorkRange.begin, successWorkRange.end);

				const targetColor = Settings.maybeGroupTimeline(timeline)
					? groupColors[readableTimelineId.level - 1] ?? defaultGroupColor
					: (memberGroupPair?.member.color ? Color.parse(memberGroupPair.member.color) : defaultTaskColor)
					;

				beginCell.style.border = {
					left: DefaultBorders.TimelineRangeCell,
					top: DefaultBorders.TimelineCell,
					bottom: DefaultBorders.TimelineCell,
					right: DefaultBorders.TimelineCell,
				};
				const endCell = timelineRow.getCell(beginCell.fullAddress.col + days.length);
				endCell.style.border = {
					left: DefaultBorders.TimelineRangeCell,
					top: DefaultBorders.TimelineCell,
					bottom: DefaultBorders.TimelineCell,
					right: DefaultBorders.TimelineCell,
				};

				const step = 1 / days.length;
				for (let i = 0; i < days.length; i++) {
					const cell = timelineRow.getCell(beginCell.fullAddress.col + i);
					const isCompletedArea = ((step * i) + step) <= progress;
					const fillColor = isCompletedArea
						? this.toExcelArgbColor(completedColor)
						: this.toExcelArgbColor(targetColor)
						;
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: {
							argb: fillColor,
						},
					};
					// cell.font = {
					// 	color: {
					// 		argb: fillColor,
					// 	}
					// };
					// cell.value = isCompletedArea;
				}

				// データバー無理だった
				// beginCell.value = progress;
				// timelineSheet.mergeCells(beginCell.fullAddress.row, beginCell.fullAddress.col, beginCell.fullAddress.row, beginCell.fullAddress.col + diff);
				// const endCell = timelineRow.getCell(ColumnKeys.length + Math.floor(beginSpan.totalDays) + diff);

				// const timelineRowCells = {
				// 	begin: timelineRow.getCell(ColumnKeys.length + 1),
				// 	end: timelineRow.getCell(ColumnKeys.length + 1 + dates.length),
				// };

				// const absoluteAddresses = {
				// 	begin: this.toAbsoluteAddress(timelineRowCells.begin.address),
				// 	end: this.toAbsoluteAddress(timelineRowCells.end.address),
				// };

				// console.debug(`${absoluteAddresses.begin}:${absoluteAddresses.end}`);

				// timelineSheet.addConditionalFormatting({
				// 	ref: `${absoluteAddresses.begin}:${absoluteAddresses.end}`,
				// 	rules: [
				// 		{
				// 			type: "dataBar",
				// 			priority: n++,
				// 			gradient: false,
				// 			border: true,
				// 			cfvo: [
				// 				{
				// 					type: "min",
				// 					value: 0
				// 				},
				// 				{
				// 					type: "max",
				// 					value: 1
				// 				},
				// 			],
				// 		} satisfies DataBarRuleType,
				// 	],
				// });


			}

			//const date = beginDate.add(i, "day");



			if (Settings.maybeGroupTimeline(timeline)) {
				const groupColor = (readableTimelineId.level - 1) in groupColors
					? groupColors[readableTimelineId.level - 1]
					: defaultGroupColor
					;
				timelineRow.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: {
						argb: this.toExcelArgbColor(Color.create(groupColor.r, groupColor.g, groupColor.b)),
					},
				};
			}
		}

		return workbook;
	}
}
