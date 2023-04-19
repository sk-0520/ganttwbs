import { NextPage } from "next";

import { CalendarInfo } from "@/models/data/CalendarInfo";
import { Configuration } from "@/models/data/Configuration";
import { TimelineStore } from "@/models/store/TimelineStore";
import { AreaSize } from "@/models/data/AreaSize";
import { useEffect, useState } from "react";
import { Types } from "@/models/Types";

type Highlight = "hover" | "active";

interface Props {
	configuration: Configuration;
	areaSize: AreaSize;
	highlight: Highlight;
	calendarInfo: CalendarInfo;
	timelineStore: TimelineStore;
}

const Component: NextPage<Props> = (props: Props) => {

	const [visible, setVisible] = useState(false);
	const [y, setY] = useState(0);

	useEffect(() => {
		const timeline = props.highlight === "hover"
			? props.timelineStore.hoverItem
			: props.timelineStore.activeItem
			;

		if (!timeline) {
			setVisible(false);
			return;
		}

		const index = props.timelineStore.indexItemMap.get(timeline.id);
		if(Types.isUndefined(index)) {
			return;
		}

		const cell = props.configuration.design.honest.cell;

		const y = cell.height.value + cell.height.value * index;

		setY(y);
		setVisible(true);

	}, [props.configuration, props.highlight, props.timelineStore]);

	if (visible) {
		return (
			<rect
				x={0}
				y={y}
				width={props.areaSize.width}
				height={3}
			/>
		);
	}

	return <></>;
};

export default Component;
