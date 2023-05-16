import classNames from "classnames";
import { CSSProperties, FC } from "react";

import { AreaData } from "@/models/data/Area";
import { RowHighlightMode } from "@/models/data/Highlight";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { TimelineId } from "@/models/data/Setting";
import { Require } from "@/models/Require";

interface Props extends ConfigurationProps, TimelineStoreProps {
	mode: RowHighlightMode;
	timelineId: TimelineId;
	areaData: AreaData;
	crossHeaderWidth: number;
	callbackAnimationEnd(): void;
}

const RowHighlight: FC<Props> = (props: Props) => {

	const index = Require.get(props.timelineStore.indexItemMap, props.timelineId);

	const baseY = props.areaData.cell.height.value * index;

	const style: CSSProperties = {
		top: `${baseY}px`,
		height: `${props.areaData.cell.height.value}px`,
		width: `${props.crossHeaderWidth + props.areaData.size.width}px`,
	};

	return (
		<div
			className={
				classNames(
					"highlight-row",
					props.mode
				)
			}
			style={style}
			onAnimationEnd={props.callbackAnimationEnd}
		/>
	);
};

export default RowHighlight;
