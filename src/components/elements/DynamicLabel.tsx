import { NextPage } from "next";

interface Props {
	htmlFor?: string;
	/** label タグで囲うか */
	wrap: boolean;
	/** 子要素 明示的な指定不要。 */
	children?: React.ReactNode;
}

/**
 * ラベルで囲ったり囲わなかったり。
 * @param props
 */
const Component: NextPage<Props> = (props: Props) => {
	return (
		props.wrap
			? (
				<label htmlFor={props.htmlFor}>
					{props.children}
				</label>
			) : (
				<>{props.children}</>
			)
	);
};

export default Component;
