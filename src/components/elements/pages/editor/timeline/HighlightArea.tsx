import { CalendarInfoProps } from "@/models/data/props/CalendarInfoProps";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { HighlightValueStoreProps } from "@/models/data/props/HighlightStoreProps";
import { SettingProps } from "@/models/data/props/SettingProps";
import { FC } from "react";

interface Props extends ConfigurationProps, SettingProps, CalendarInfoProps, HighlightValueStoreProps {

}

const HighlightArea: FC<Props> = (props: Props) => {


	return (
		<div id="highlight-area">
		</div>
	);
};

export default HighlightArea;
