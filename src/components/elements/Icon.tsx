import { NextPage } from "next";
import { ReactNode } from "react";
import { IconBaseProps } from "react-icons";
import * as Md from "react-icons/md";

// 基本的に Material Design icons を使用する
// https://react-icons.github.io/react-icons/icons?name=md
type IconKind
	= "task"
	| "group"
	;

const Icons: { [key: string]: (params: Parameters) => ReactNode } = {
	"task": (params) => <Md.MdTaskAlt {...convertParameter(params)} />,
	"group": (params) => <Md.MdFolder {...convertParameter(params)} />,
};

function convertParameter(params: Parameters): IconBaseProps {
	const attr: IconBaseProps= {
		title: params.title,
		color: params.fill,
	};

	return attr;
}

interface Parameters {
	fill?: string;
	stroke?: string;
	title?: string;
}

interface Props extends Parameters {
	kind: IconKind;
}

const Component: NextPage<Props> = (props: Props) => {
	const factory = Icons[props.kind];

	return (
		<span className="icon">
			<>{factory(props)}</>
		</span>
	);
};

export default Component;
