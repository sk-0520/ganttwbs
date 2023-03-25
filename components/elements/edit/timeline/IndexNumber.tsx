import Timelines from "@/models/Timelines";
import { NextPage } from "next";
import { CSSProperties } from "react";

interface Props {
	treeIndexes: ReadonlyArray<number>;
	currentIndex: number;
}

const Component: NextPage<Props> = (props: Props) => {
	const styles: CSSProperties = {
		display: 'inline-block',
		paddingLeft: (props.treeIndexes.length * 0.5) + 'ch',
	}

	return (
		<span style={styles}>
			{Timelines.toIndexNumber(props.treeIndexes, props.currentIndex)}
		</span>
	);
};

export default Component;
