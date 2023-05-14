import { Workbook } from "exceljs";

import { Calendars } from "@/models/Calendars";
import { CalcData } from "@/models/data/CalcData";
import { Setting } from "@/models/data/Setting";
import { Resources } from "@/models/Resources";
import { Timelines } from "@/models/Timelines";
import { WorkRanges } from "@/models/WorkRanges";

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
		const totalSuccessWorkRange = WorkRanges.getTotalSuccessWorkRange(successWorkRanges);

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

	public static async createWorkbook(calcData: CalcData): Promise<Workbook> {
		const workbook = new Workbook();


		const timelineSheet = workbook.addWorksheet("timeline");

		const dates = Calendars.getDays(calcData.calendarInfo.range.begin, calcData.calendarInfo.range.end).map(a => a.toDate());

		// ヘッダ
		// 1. タイトル - 月
		// 2. 集計 - 日付
		// 3. ヘッダ - 曜日
		const header1 = timelineSheet.addRow([
			"ID",
			"作業",
			"個数",
			"割当",
			"開始",
			"終了",
			"進捗率",
			...dates
		]);
		const baseColumnLength = header1.cellCount - dates.length;
		for (let i = 0; i < dates.length; i++) {
			const cell = header1.getCell(baseColumnLength + i + 1);
			cell.style.numFmt = "mm";
		}

		const header2 = timelineSheet.addRow([
			"ID",
			"作業",
			"個数",
			"割当",
			"開始",
			"終了",
			"進捗率",
			...dates
		]);
		for (let i = 0; i < dates.length; i++) {
			const cell = header2.getCell(baseColumnLength + i + 1);
			cell.style.numFmt = "dd";
		}

		const header3 = timelineSheet.addRow([
			"ID",
			"作業",
			"個数",
			"割当",
			"開始",
			"終了",
			"進捗率",
			...dates
		]);
		for (let i = 0; i < dates.length; i++) {
			const cell = header3.getCell(baseColumnLength + i + 1);
			cell.style.numFmt = "aaa";
		}

		return workbook;
	}
}
