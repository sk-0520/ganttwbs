import { FC } from "react";

import RangeViewer from "@/components/elements/pages/editor/analytics/RangeViewer";
import WorkViewer from "@/components/elements/pages/editor/analytics/WorkViewer";
import { EditorData } from "@/models/data/EditorData";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { Exports } from "@/models/Exports";

interface Props extends ConfigurationProps {
	isVisible: boolean;
	editorData: EditorData;
}

const AnalyticsViewer: FC<Props> = (props: Props) => {
	if (!props.isVisible) {
		return <></>;
	}

	const calcData = Exports.calc(props.editorData.setting);

	console.debug("calcData", calcData);

	const totalSuccessWorkRange = calcData.workRange.totalSuccessWorkRange.success
		? calcData.workRange.totalSuccessWorkRange.value
		: undefined
	;

	return (
		<div id="analytics">
			<RangeViewer
				totalSuccessWorkRange={totalSuccessWorkRange}
			/>
			<WorkViewer
				sequenceTimelines={calcData.sequenceTimelines}
				totalSuccessWorkRange={totalSuccessWorkRange}
			/>
		</div>
	);
};

export default AnalyticsViewer;
