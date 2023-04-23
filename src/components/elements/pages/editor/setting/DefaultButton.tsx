import { IconImage, IconKind } from "@/components/elements/Icon";
import { FC } from "react";

interface Props {
	callbackClick(): void;
}

const DefaultButton: FC<Props> = (props: Props) => {
	return (
		<button
			type="button"
			onClick={props.callbackClick}
		>
			<IconImage
				kind={IconKind.Reset}
			/>
			デフォルト設定
		</button>
	);
};

export default DefaultButton;
