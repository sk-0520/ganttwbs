import { FC, useEffect, useState } from "react";

import { AreaSize } from "@/models/data/AreaSize";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { Types } from "@/models/Types";

type Highlight = "hover" | "active";

interface Props extends ConfigurationProps, TimelineStoreProps, CalendarInfoProps {
	areaSize: AreaSize;
	highlight: Highlight;
}

const HighlightTimeline: FC<Props> = (props: Props) => {

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

export default HighlightTimeline;
