import { NextPage } from "next";

import { Charts } from "@/models/Charts";
import { CalendarInfo } from "@/models/data/CalendarInfo";
import { ChartSize } from "@/models/data/ChartSize";
import { MemberMapValue } from "@/models/data/MemberMapValue";
import { EditProps } from "@/models/data/props/EditProps";
import { MemberId, TaskTimeline, TimelineId } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { TimelineStore } from "@/models/store/TimelineStore";
import { WorkRanges } from "@/models/WorkRanges";

interface Props extends EditProps {
	currentIndex: number;
	currentTimeline: TaskTimeline;
	timelineIndexes: ReadonlyMap<TimelineId, number>;

	calendarInfo: CalendarInfo;
	chartSize: ChartSize;

	memberMap: ReadonlyMap<MemberId, MemberMapValue>;

	updateRelations: () => void;

	timelineStore: TimelineStore;

}

const Component: NextPage<Props> = (props: Props) => {

	if (!props.currentTimeline.previous.length) {
		return null;
	}

	const currentWorkRange = props.timelineStore.workRanges.get(props.currentTimeline.id);
	if (!currentWorkRange || !WorkRanges.maybeSuccessWorkRange(currentWorkRange)) {
		return null;
	}

	const cell = props.configuration.design.honest.cell;

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

	const currentTimeSpanRange = Charts.getTimeSpanRange(props.calendarInfo.range.from, currentWorkRange);
	const currentChartArea = Charts.createChartArea(currentTimeSpanRange, props.currentIndex, cell, props.chartSize);

	const currentColor = Charts.getTaskBackground(props.currentTimeline, props.memberMap, props.editData.setting.theme);

	return (
		<>
			{props.currentTimeline.previous.map(b => {
				const previousIndex = props.timelineIndexes.get(b);
				if (typeof previousIndex === "undefined") {
					return null;
				}

				const previousTimeline = props.timelineStore.totalItems.get(b);
				if (!previousTimeline) {
					return null;
				}

				const previewColor = Settings.maybeGroupTimeline(previousTimeline)
					? Charts.getGroupBackground(previousTimeline, props.timelineStore.nodeItems, props.editData.setting.theme)
					: Charts.getTaskBackground(previousTimeline, props.memberMap, props.editData.setting.theme)
					;

				const previewWorkRange = props.timelineStore.workRanges.get(previousTimeline.id);
				if (!previewWorkRange || !WorkRanges.maybeSuccessWorkRange(previewWorkRange)) {
					return null;
				}

				const previousTimeSpanRange = Charts.getTimeSpanRange(props.calendarInfo.range.from, previewWorkRange);
				const previousChartArea = Charts.createChartArea(previousTimeSpanRange, previousIndex, cell, props.chartSize);

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
					const diff = {
						x: position.to.x - position.from.x,
						y: position.to.y - position.from.y,
					};

					draws.push(`M ${position.from.x} ${position.from.y}`);
					draws.push("C");
					draws.push(`${position.from.x} ${position.from.y}`);
					draws.push(`${position.to.x - diff.x} ${position.to.y}`);
					draws.push(`${position.to.x} ${position.to.y}`);
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
						<text
							x={position.from.x}
							y={position.from.y}
						>
							x1={position.from.x},
							y1={position.from.y},
							x2={position.to.x},
							y2={position.to.y}
						</text>
					</g>
				);
			})}
		</>
	);
};

export default Component;
