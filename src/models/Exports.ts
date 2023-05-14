import { Calendars } from "@/models/Calendars";
import { Resources } from "@/models/Resources";
import { Timelines } from "@/models/Timelines";
import { EditorData } from "@/models/data/EditorData";
import { Workbook } from "exceljs";

export abstract class Exports {

	public static async createWorkbook(editorData: EditorData): Promise<Workbook> {
		const workbook = new Workbook();

		const calendarInfo = Calendars.createCalendarInfo(editorData.setting.timeZone, editorData.setting.calendar);
		const resourceInfo = Resources.createResourceInfo(editorData.setting.groups);
		const sequenceTimelines = Timelines.flat(editorData.setting.rootTimeline.children);
		const timelineMap = Timelines.getTimelinesMap(editorData.setting.rootTimeline);
		const workRanges = Timelines.getWorkRanges([...timelineMap.values()], editorData.setting.calendar.holiday, editorData.setting.recursive, calendarInfo.timeZone);
		const dayInfos = Timelines.calcDayInfos(timelineMap, new Set([...workRanges.values()]), resourceInfo);

		const timelineSheet = workbook.addWorksheet("timeline");

		const dates = Calendars.getDays(calendarInfo.range.begin, calendarInfo.range.end).map(a => a.toDate());

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
