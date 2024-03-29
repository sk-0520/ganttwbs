import { FC } from "react";

import MemberSelector from "@/components/elements/pages/editor/timeline/MemberSelector";
import { MemberGroupPair } from "@/models/data/MemberGroupPair";
import { AnyTimeline, MemberId } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";

interface Props {
	readonly currentTimeline: Readonly<AnyTimeline>;
	selectedMemberId: MemberId;
	disabled: boolean;
	callbackChangeMember(memberGroupPair: MemberGroupPair | undefined): void;
	callbackFocus(isFocus: boolean): void;
}

const ResourceCell: FC<Props> = (props: Props) => {

	return (
		<td className="timeline-cell timeline-resource">
			{Settings.maybeTaskTimeline(props.currentTimeline) && (
				<MemberSelector
					className="edit"
					disabled={props.disabled}
					defaultValue={props.selectedMemberId}
					callbackChangeMember={props.callbackChangeMember}
					callbackFocus={props.callbackFocus}
				/>
			)}
		</td>
	);

};

export default ResourceCell;
