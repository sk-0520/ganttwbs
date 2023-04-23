import { NextPage } from "next";

import DynamicLabel from "@/components/elements/DynamicLabel";
import { IconImage, IconKind } from "@/components/elements/Icon";
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

const RelationCell: NextPage<Props> = (props: Props) => {
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
		<td className="timeline-cell timeline-relation">
			<DynamicLabel
				wrap={props.selectable}
				htmlFor={props.htmlFor}
			>
				{
					relations === (Relations.Static | Relations.Previous)
						? <IconImage kind={IconKind.RelationMix} fill={null} title="前工程 + 開始固定" />
						: relations === Relations.Static
							? <IconImage kind={IconKind.RelationStatic} fill={null} title="開始固定" />
							: relations === Relations.Previous
								? <IconImage kind={IconKind.RelationPrevious} fill={null} title="前工程あり" />
								: relations === Relations.Empty
									? <IconImage kind={IconKind.TimelineGroup} fill={null} />
									: "💩"
				}
			</DynamicLabel>
		</td>
	);
};

export default RelationCell;
