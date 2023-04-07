import { Timelines } from "@/models/Timelines";
import { NextPage } from "next";

interface Props {
	treeIndexes: ReadonlyArray<number>;
	currentIndex: number;
}

const Component: NextPage<Props> = (props: Props) => {
	const className = "_dynamic_programmable_indexNumber_level-" + props.treeIndexes.length;

	return (
		<span className={className}>
			{Timelines.toIndexNumber(props.treeIndexes, props.currentIndex)}
		</span>
	);
};

export default Component;
