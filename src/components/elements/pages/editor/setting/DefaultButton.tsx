import { IconImage, IconKind } from "@/components/elements/Icon";
import { FC } from "react";

interface Props {
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
		</button>
	);
};

export default DefaultButton;
