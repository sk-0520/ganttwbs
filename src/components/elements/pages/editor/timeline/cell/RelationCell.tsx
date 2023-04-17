import { NextPage } from "next";

import DynamicLabel from "@/components/elements/DynamicLabel";
import Icon from "@/components/elements/Icon";
import { AnyTimeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";

const enum Relations {
	Unknown = 0,
	Empty = 0b0001,
	Static = 0b0010,
	Previous = 0b0100,
}

interface Props {
	readonly currentTimeline: Readonly<AnyTimeline>;
	selectable: boolean;
	htmlFor: string;
}

const Component: NextPage<Props> = (props: Props) => {
	let relations: Relations = Relations.Unknown;

	if (Settings.maybeTaskTimeline(props.currentTimeline)) {
		if (props.currentTimeline.static) {
			relations |= Relations.Static;
		}
		if (props.currentTimeline.previous.length) {
			relations |= Relations.Previous;
		}
	} else {
		relations = Relations.Empty;
	}

	return (
		<div className="timeline-cell timeline-relation">
			<DynamicLabel
				wrap={props.selectable}
				htmlFor={props.htmlFor}
			>
				{
					relations === (Relations.Static | Relations.Previous)
						? <Icon kind="relation-mixin" title="前工程 + 開始固定" />
						: relations === Relations.Static
							? <Icon kind="relation-static" title="開始固定" />
							: relations === Relations.Previous
								? <Icon kind="relation-previous" title="前工程あり" />
								: relations === Relations.Empty
									? <Icon kind="timeline-group" />
									: "💩"
				}
			</DynamicLabel>
		</div>
	);
};

export default Component;
