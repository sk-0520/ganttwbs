import { FC, MouseEvent, ReactNode, useMemo } from "react";

import GanttChartTimeline from "@/components/elements/pages/editor/timeline/GanttChartTimeline";
import ConnectorTimeline from "@/components/elements/pages/editor/timeline/shape/ConnectorTimeline";
import { Charts } from "@/models/Charts";
import { useHoverTimelineIdAtomWriter } from "@/models/data/atom/editor/HighlightAtoms";
import { useCalendarInfoAtomReader, useSequenceTimelinesAtomReader, useSettingAtomReader, useTotalTimelineMapAtomReader } from "@/models/data/atom/editor/TimelineAtoms";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import { ColorString } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { TimeSpan } from "@/models/TimeSpan";

interface Props extends ConfigurationProps, TimelineCallbacksProps {
	//nop
}

const TimelineViewer: FC<Props> = (props: Props) => {
	const settingAtomReader = useSettingAtomReader();
	const sequenceTimelinesAtomReader = useSequenceTimelinesAtomReader();
	const hoverTimelineIdAtomWriter = useHoverTimelineIdAtomWriter();
	const calendarInfoAtomReader = useCalendarInfoAtomReader();
	const totalTimelineMapAtomReader = useTotalTimelineMapAtomReader();

	const areaData = useMemo(() => {
		return Charts.createAreaData(props.configuration.design.seed.cell, calendarInfoAtomReader.data.range, totalTimelineMapAtomReader.data.size);
	}, [props.configuration, calendarInfoAtomReader.data, totalTimelineMapAtomReader.data.size]);

	const gridNodes = useMemo(() => {
		const width = areaData.cell.width.value * (areaData.days + props.configuration.design.dummy.width);
		const height = areaData.cell.height.value * (totalTimelineMapAtomReader.data.size + props.configuration.design.dummy.height);

		// 横軸
		const gridHorizontals = new Array<ReactNode>();
		for (let i = 0; i < (totalTimelineMapAtomReader.data.size + props.configuration.design.dummy.height); i++) {
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
			const date = calendarInfoAtomReader.data.range.begin.add(TimeSpan.fromDays(i));

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
			const holidayEventValue = calendarInfoAtomReader.data.holidayEventMap.get(date.ticks);
			if (holidayEventValue) {
				color = settingAtomReader.data.theme.holiday.events[holidayEventValue.event.kind];
			}
			// 曜日判定
			if (!color) {
				if (calendarInfoAtomReader.data.holidayRegulars.has(date.week)) {
					const week = Settings.toWeekDay(date.week);
					color = settingAtomReader.data.theme.holiday.regulars[week];
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
	}, [areaData, calendarInfoAtomReader.data, props.configuration, settingAtomReader.data, totalTimelineMapAtomReader.data.size]);

	function handleMouseMove(ev: MouseEvent) {
		// 下でグダグダやってるけどこっち(か算出方法)が間違ってる感あるなぁ
		if (ev.nativeEvent.offsetY < 0 || areaData.size.height <= ev.nativeEvent.offsetY) {
			hoverTimelineIdAtomWriter.write(undefined);
			return;
		}

		const sequenceIndex = Math.floor(ev.nativeEvent.offsetY / areaData.cell.height.value);
		// ここのグダグダ感
		if (sequenceTimelinesAtomReader.data.length <= sequenceIndex) {
			hoverTimelineIdAtomWriter.write(undefined);
			return;
		}

		const timeline = sequenceTimelinesAtomReader.data[sequenceIndex];
		hoverTimelineIdAtomWriter.write(timeline.id);
	}

	return (
		<div id="viewer" onMouseMove={handleMouseMove}>
			<svg
				id="canvas"
				width={(areaData.size.width + (areaData.cell.width.value * props.configuration.design.dummy.width)) + "px"}
				height={(areaData.size.height + (areaData.cell.height.value * (props.configuration.design.dummy.height - 1))) + "px"}
			>
				{gridNodes}
				{sequenceTimelinesAtomReader.data.map((a, i) => {
					return (
						<GanttChartTimeline
							key={a.id}
							configuration={props.configuration}
							parentGroup={null}
							currentTimeline={a}
							currentIndex={i}
							areaSize={areaData.size}
							timelineCallbacks={props.timelineCallbacks}
						/>
					);
				})}
				{sequenceTimelinesAtomReader.data.map((a, i) => {
					if (!Settings.maybeTaskTimeline(a)) {
						return null;
					}
					return (
						<ConnectorTimeline
							key={a.id}
							configuration={props.configuration}
							currentTimeline={a}
							currentIndex={i}
							areaSize={areaData.size}
							timelineCallbacks={props.timelineCallbacks}
						/>
					);
				})}
			</svg>

		</div>
	);
};

export default TimelineViewer;
