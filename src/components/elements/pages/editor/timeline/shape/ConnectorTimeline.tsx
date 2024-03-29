
import { FC } from "react";

import { useCalendarInfoAtomReader, useResourceInfoAtomReader, useRootTimelineAtomReader, useSettingAtomReader, useTimelineIndexMapAtomReader, useTotalTimelineMapAtomReader, useWorkRangesAtomReader } from "@/models/atom/editor/TimelineAtoms";
import { Charts } from "@/models/Charts";
import { AreaSize } from "@/models/data/Area";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import { TaskTimeline } from "@/models/data/Setting";
import { Require } from "@/models/Require";
import { Settings } from "@/models/Settings";
import { WorkRanges } from "@/models/WorkRanges";

interface Props extends ConfigurationProps, TimelineCallbacksProps {
	currentIndex: number;
	currentTimeline: TaskTimeline;

	areaSize: AreaSize;
}

const ConnectorTimeline: FC<Props> = (props: Props) => {
	const settingAtomReader = useSettingAtomReader();
	const rootTimelineReader = useRootTimelineAtomReader();
	const workRangesAtomReader = useWorkRangesAtomReader();
	const calendarInfoAtomReader = useCalendarInfoAtomReader();
	const resourceInfoAtomReader = useResourceInfoAtomReader();
	const timelineIndexMapAtomReader = useTimelineIndexMapAtomReader();
	const totalTimelineMapAtomReader = useTotalTimelineMapAtomReader();

	if (!props.currentTimeline.previous.length) {
		return null;
	}

	const currentWorkRange = workRangesAtomReader.data.get(props.currentTimeline.id);
	if (!WorkRanges.maybeSuccessWorkRange(currentWorkRange)) {
		return null;
	}

	const cell = props.configuration.design.seed.cell;

	const markerBox = {
		width: cell.width.value * 0.3,
		height: cell.height.value * 0.3,
	} as const;
	const markerCommon = {
		viewBox: `0 0 ${markerBox.width} ${markerBox.height}`,
		endPoint: [
			[0, 0],
			[markerBox.width, markerBox.width / 2],
			[0, markerBox.height],
		].map(([x, y]) => x + "," + y).join(" "),
	};

	const currentTimeSpanRange = Charts.getTimeSpanRange(calendarInfoAtomReader.data.range.begin, currentWorkRange);
	const currentChartArea = Charts.createChartArea(currentTimeSpanRange, props.currentIndex, cell, props.areaSize);

	const currentColor = Charts.getTaskBackground(props.currentTimeline, resourceInfoAtomReader.data.memberMap, settingAtomReader.data.theme);

	return (
		<>
			{props.currentTimeline.previous.map(b => {
				const previousIndex = Require.get(timelineIndexMapAtomReader.data, b);
				const previousTimeline = Require.get(totalTimelineMapAtomReader.data, b);

				const previewColor = Settings.maybeGroupTimeline(previousTimeline)
					? Charts.getGroupBackground(previousTimeline, rootTimelineReader.data, settingAtomReader.data.theme)
					: Charts.getTaskBackground(previousTimeline, resourceInfoAtomReader.data.memberMap, settingAtomReader.data.theme)
					;

				const previewWorkRange = workRangesAtomReader.data.get(previousTimeline.id);
				if (!WorkRanges.maybeSuccessWorkRange(previewWorkRange)) {
					return null;
				}

				const previousTimeSpanRange = Charts.getTimeSpanRange(calendarInfoAtomReader.data.range.begin, previewWorkRange);
				const previousChartArea = Charts.createChartArea(previousTimeSpanRange, previousIndex, cell, props.areaSize);

				// 基準座標を設定
				const position = {
					from: {
						x: previousChartArea.x + previousChartArea.width,
						y: previousChartArea.y + (cell.height.value / 2),
					},
					to: {
						x: currentChartArea.x,
						y: currentChartArea.y + (cell.height.value / 2),
					}
				};

				// 現工程は前工程より上に位置する(線は上向きにする)
				const toTop = currentChartArea.y < previousChartArea.y;

				// 現工程と前工程が隣接しているので上下から生える(アプリの仕組み上 となりには誰もいない)
				const fromHeadTail = currentChartArea.x === previousChartArea.x + previousChartArea.width;

				const draws = [];

				if (fromHeadTail) {
					const diff = previousChartArea.width / 2;
					if (Settings.maybeTaskTimeline(previousTimeline)) {
						position.from.y += toTop ? -(cell.height.value / 2) : (cell.height.value / 2);
					}

					draws.push(`M ${position.from.x - diff} ${position.from.y}`);
					draws.push("C");
					draws.push(`${position.from.x - diff} ${position.to.y}`);
					draws.push(`${position.from.x - diff} ${position.to.y}`);
					draws.push(`${position.to.x} ${position.to.y}`);
				} else {
					const width = position.to.x - position.from.x;
					const begin = width * 0.7;
					const curve = width * 0.1;

					draws.push(`M ${position.from.x} ${position.from.y}`);
					draws.push(`L ${position.from.x + begin} ${position.from.y}`);
					draws.push("C");
					draws.push(`${position.from.x + begin + curve} ${position.from.y}`);
					draws.push(`${position.from.x + begin} ${position.to.y}`);
					draws.push(`${position.from.x + begin + curve} ${position.to.y}`);
					draws.push(`L ${position.to.x} ${position.to.y}`);
				}

				const connecterColorId = Charts.toConnecterColorId(b, props.currentTimeline.id);
				const markerId = {
					start: Charts.toMarkerId(b, props.currentTimeline.id, "start"),
					end: Charts.toMarkerId(b, props.currentTimeline.id, "end"),
				};

				return (
					<g
						key={b}
					>
						<defs>
							<marker
								id={markerId.start}
								viewBox={markerCommon.viewBox}
								refX={markerBox.width / 2}
								refY={markerBox.height / 2}
							>
								<circle
									cx={markerBox.width / 2}
									cy={markerBox.height / 2}
									r={markerBox.width / 2}
									stroke="#ffffff"
									strokeWidth={1.5}
									fill={currentColor}
								/>
							</marker>
							<marker id={markerId.end}
								viewBox={markerCommon.viewBox}
								refX={markerBox.width / 2}
								refY={markerBox.height / 2}
								markerUnits="strokeWidth"
								markerWidth={markerBox.width}
								markerHeight={markerBox.height}
								orient="auto"
							>
								<polygon points={markerCommon.endPoint}
									fill={previewColor}
									stroke="#000000"
									strokeWidth={1}
									paintOrder="stroke"
								/>
							</marker>

							<linearGradient
								id={connecterColorId}
							>
								<stop className="previous" offset="0%" stopColor={previewColor} />
								<stop className="current" offset="100%" stopColor={currentColor} />
							</linearGradient>
						</defs>
						<path
							d={draws.join(" ")}
							fill="none"
							stroke={Charts.toReference(connecterColorId)}
							strokeWidth={1.5}
							strokeDasharray={2}
							opacity={0.8}
							markerStart={Charts.toReference(markerId.start)}
							markerEnd={Charts.toReference(markerId.end)}
						/>
					</g>
				);
			})}
		</>
	);
};

export default ConnectorTimeline;
