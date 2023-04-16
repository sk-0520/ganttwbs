import { NextPage } from "next";

import DynamicLabel from "@/components/elements/DynamicLabel";
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
						? "共"
						: relations === Relations.Static
							? "静"
							: relations === Relations.Previous
								? "前"
								: relations === Relations.Empty
									? "📁"
									: "💩"
				}
			</DynamicLabel>
		</div>
	);
};

export default Component;
