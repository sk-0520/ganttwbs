import { FC } from "react";

import { IconImage, IconKind } from "@/components/elements/Icon";

interface Props {
	visibleLabel?: boolean;
	callbackClick(): void;
}

const DefaultButton: FC<Props> = (props: Props) => {
	return (
		<button
			type="button"
			title="デフォルト設定"
			onClick={props.callbackClick}
		>
			<IconImage
				kind={IconKind.Reset}
			/>
			{props.visibleLabel && "デフォルト設定"}
		</button>
	);
};

export default DefaultButton;
