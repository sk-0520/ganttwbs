import classNames from "classnames";
import type { CSSProperties, FC } from "react";

import { useTimelineIndexMapAtomReader } from "@/models/atom/editor/TimelineAtoms";
import type { AreaData } from "@/models/data/Area";
import type { RowHighlightMode } from "@/models/data/Highlight";
import type { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import type { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import type { TimelineId } from "@/models/data/Setting";
import { Require } from "@/models/Require";

interface Props extends ConfigurationProps, TimelineCallbacksProps {
	mode: RowHighlightMode;
	timelineId: TimelineId;
	areaData: AreaData;
	crossHeaderWidth: number;
	callbackAnimationEnd(): void;
}

const RowHighlight: FC<Props> = (props: Props) => {
	const timelineIndexMapAtomReader = useTimelineIndexMapAtomReader();

	const index = Require.get(timelineIndexMapAtomReader.data, props.timelineId);

	const baseY = props.areaData.cell.height.value * index;

	const style: CSSProperties = {
		top: `${baseY}px`,
		height: `${props.areaData.cell.height.value}px`,
		width: `${props.crossHeaderWidth + props.areaData.size.width}px`,
	};

	return (
		<div
			className={classNames("highlight-row", props.mode)}
			style={style}
			onAnimationEnd={props.callbackAnimationEnd}
		/>
	);
};

export default RowHighlight;
