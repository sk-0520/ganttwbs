import { FC } from "react";

import RangeViewer from "@/components/elements/pages/editor/analytics/RangeViewer";
import WorkViewer from "@/components/elements/pages/editor/analytics/WorkViewer";
import { EditorData } from "@/models/data/EditorData";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { Exports } from "@/models/Exports";
import { createLogger } from "@/models/Logging";

const logger = createLogger("AnalyticsViewer");

interface Props extends ConfigurationProps {
	isVisible: boolean;
	editorData: EditorData;
}

const AnalyticsViewer: FC<Props> = (props: Props) => {
	if (!props.isVisible) {
		return <></>;
	}

	const calculatedData = Exports.calculate(props.editorData.setting);

	logger.debug("calcData", calculatedData);

	const totalSuccessWorkRange = calculatedData.workRange.totalSuccessWorkRange.success
		? calculatedData.workRange.totalSuccessWorkRange.value
		: undefined
	;

	return (
		<div id="analytics">
			<p className="develop-warning">
				ここの処理はクソほど怪しい。<br />
				実働だけでやってるからなーんかおかしいんちゃうかな。
			</p>

			<RangeViewer
				totalSuccessWorkRange={totalSuccessWorkRange}
			/>
			<WorkViewer
				sequenceTimelines={calculatedData.sequenceTimelines}
				successWorkRanges={calculatedData.workRange.successWorkRanges}
				totalSuccessWorkRange={totalSuccessWorkRange}
				configuration={props.configuration}
			/>
		</div>
	);
};

export default AnalyticsViewer;
