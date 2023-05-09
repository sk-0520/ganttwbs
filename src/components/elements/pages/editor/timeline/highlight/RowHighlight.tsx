import classNames from "classnames";
import { CSSProperties, FC } from "react";

import { AreaData } from "@/models/data/Area";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineStoreProps } from "@/models/data/props/TimelineStoreProps";
import { TimelineId } from "@/models/data/Setting";
import { Types } from "@/models/Types";

interface Props extends ConfigurationProps, TimelineStoreProps {
	mode: "active" | "hover" | "highlight";
	timelineId: TimelineId;
	areaData: AreaData;
	crossHeaderWidth: number;
}

const RowHighlight: FC<Props> = (props: Props) => {


	const index = props.timelineStore.indexItemMap.get(props.timelineId);
	if (Types.isUndefined(index)) {
		return null;
	}

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
		/>
	);
};

export default RowHighlight;
