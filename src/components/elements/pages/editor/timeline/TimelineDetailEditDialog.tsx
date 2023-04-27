import { FC } from "react";

import Dialog from "@/components/elements/Dialog";
import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { AnyTimeline } from "@/models/data/Setting";

interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps {
	callbackSubmit(timeline: AnyTimeline | null): void;
}

const TimelineDetailEditDialog: FC<Props> = (props: Props) => {
	function handleSubmit() {
		console.debug(1);
	}

	return (
		<Dialog
			button="submit"
			title="edit"
			callbackClose={type => {
				if (type === "submit") {
					handleSubmit();
				} else {
					props.callbackSubmit(null);
				}
			}}
		>
			<span>asd</span>
		</Dialog>
	);
};

export default TimelineDetailEditDialog;
