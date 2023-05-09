import { useSetAtom } from "jotai";
import { FC, MouseEvent, ReactNode, useMemo } from "react";

import GanttChartTimeline from "@/components/elements/pages/editor/timeline/GanttChartTimeline";
import ConnectorTimeline from "@/components/elements/pages/editor/timeline/shape/ConnectorTimeline";
import { Calendars } from "@/models/Calendars";
import { Charts } from "@/models/Charts";
import { HoverTimelineIdAtom } from "@/models/data/atom/HighlightAtoms";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { HighlightCallbackStoreProps } from "@/models/data/props/HighlightStoreProps";
import { ResourceInfoProps } from "@/models/data/props/ResourceInfoProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { ColorString } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { TimeSpan } from "@/models/TimeSpan";

interface Props extends ConfigurationProps, SettingProps, TimelineStoreProps, CalendarInfoProps, ResourceInfoProps, HighlightCallbackStoreProps {
	//nop
}

const TimelineViewer: FC<Props> = (props: Props) => {
	const setHoverTimelineIdAtom = useSetAtom(HoverTimelineIdAtom);

	const areaData = useMemo(() => {
		return Charts.createAreaData(props.configuration.design.seed.cell, props.calendarInfo.range, props.timelineStore.totalItemMap.size);
	}, [props.configuration, props.calendarInfo, props.timelineStore.totalItemMap.size]);

	const gridNodes = useMemo(() => {
		const width = areaData.cell.width.value * (areaData.days + props.configuration.design.dummy.width);
		const height = areaData.cell.height.value * (props.timelineStore.totalItemMap.size + props.configuration.design.dummy.height);

		// 横軸
		const gridHorizontals = new Array<ReactNode>();
		for (let i = 0; i < (props.timelineStore.totalItemMap.size + props.configuration.design.dummy.height); i++) {
			const y = areaData.cell.height.value + areaData.cell.height.value * i;
			gridHorizontals.push(
				<line
					key={i}
					x1={0}
					x2={width}
					y1={y - 0.5}
					y2={y - 0.5}
					stroke="black"
					strokeWidth={1}
					strokeDasharray={1}
				/>
			);
		}

		// 縦軸
		const gridHolidays = new Array<ReactNode>();
		const gridVerticals = new Array<ReactNode>();
		for (let i = 0; i < (areaData.days + props.configuration.design.dummy.width); i++) {
			const date = props.calendarInfo.range.begin.add(TimeSpan.fromDays(i));

			const gridX = areaData.cell.width.value + areaData.cell.width.value * i;

			gridVerticals.push(
				<line
					key={i}
					x1={gridX - 0.5}
					x2={gridX - 0.5}
					y1={0}
					y2={height}
					stroke="gray"
					strokeWidth={1}
					strokeDasharray={1.5}
				/>
			);

			if (areaData.days < i) {
				// 曜日とかの判定すらもういらない
				continue;
			}

			let color: ColorString | undefined = undefined;

			// 祝日判定
			const holidayEventValue = Calendars.getHolidayEventValue(date, props.calendarInfo.holidayEventMap);
			if (holidayEventValue) {
				color = props.setting.theme.holiday.events[holidayEventValue.event.kind];
			}
			// 曜日判定
			if (!color) {
				const week = Settings.toWeekDay(date.week);
				if (props.setting.calendar.holiday.regulars.includes(week)) {
					color = props.setting.theme.holiday.regulars[week];
				}
			}
			if (color) {
				const holidayX = areaData.cell.width.value * i;

				gridHolidays.push(
					<rect
						key={holidayX}
						x={holidayX}
						y={0}
						width={areaData.cell.width.value}
						height={height}
						fill={color}
					/>
				);
			}
		}

		return (
			<g>
				<g>
					{gridHolidays.map(a => a)}
				</g>
				<g>
					{gridHorizontals.map(a => a)}
				</g>
				<g>
					{gridVerticals.map(a => a)}
				</g>
			</g>
		);
	}, [areaData, props.calendarInfo, props.configuration, props.setting, props.timelineStore.totalItemMap.size]);

	function handleMouseMove(ev: MouseEvent) {
		// 下でグダグダやってるけどこっち(か算出方法)が間違ってる感あるなぁ
		if (ev.nativeEvent.offsetY < 0 || areaData.size.height <= ev.nativeEvent.offsetY) {
			setHoverTimelineIdAtom(undefined);
			return;
		}

		const sequenceIndex = Math.floor(ev.nativeEvent.offsetY / areaData.cell.height.value);
		// ここのグダグダ感
		if(props.timelineStore.sequenceItems.length <= sequenceIndex) {
			setHoverTimelineIdAtom(undefined);
			return;
		}

		const timeline = props.timelineStore.sequenceItems[sequenceIndex];
		setHoverTimelineIdAtom(timeline.id);
	}

	return (
		<div id="viewer" onMouseMove={handleMouseMove}>
			<svg
				id="canvas"
				width={(areaData.size.width + (areaData.cell.width.value * props.configuration.design.dummy.width)) + "px"}
				height={(areaData.size.height + (areaData.cell.height.value * (props.configuration.design.dummy.height - 1))) + "px"}
			>
				{gridNodes}
				{props.timelineStore.sequenceItems.map((a, i) => {
					return (
						<GanttChartTimeline
							key={a.id}
							configuration={props.configuration}
							setting={props.setting}
							parentGroup={null}
							currentTimeline={a}
							currentIndex={i}
							calendarInfo={props.calendarInfo}
							resourceInfo={props.resourceInfo}
							areaSize={areaData.size}
							timelineStore={props.timelineStore}
						/>
					);
				})}
				{props.timelineStore.sequenceItems.map((a, i) => {
					if (!Settings.maybeTaskTimeline(a)) {
						return null;
					}
					return (
						<ConnectorTimeline
							key={a.id}
							configuration={props.configuration}
							setting={props.setting}
							currentTimeline={a}
							currentIndex={i}
							calendarInfo={props.calendarInfo}
							resourceInfo={props.resourceInfo}
							areaSize={areaData.size}
							timelineStore={props.timelineStore}
						/>
					);
				})}
			</svg>

		</div>
	);
};

export default TimelineViewer;
