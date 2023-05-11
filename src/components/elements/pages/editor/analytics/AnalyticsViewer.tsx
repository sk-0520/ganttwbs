import { FC } from "react";

import { EditorData } from "@/models/data/EditorData";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";

interface Props extends ConfigurationProps {
	isVisible: boolean;
	editorData: EditorData;
}

const AnalyticsViewer: FC<Props> = (props: Props) => {
	if (!props.isVisible) {
		return <></>;
	}

	return (
		<p>あとでやる</p>
	);
};

export default AnalyticsViewer;
