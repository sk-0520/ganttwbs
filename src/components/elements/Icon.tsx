import { NextPage } from "next";
import { ReactNode } from "react";
import { IconBaseProps } from "react-icons";
import * as Md from "react-icons/md";

// 基本的に Material Design icons を使用する
// https://react-icons.github.io/react-icons/icons?name=md
type IconKind
	= "timeline-task"
	| "timeline-group"
	| "relation-mixin"
	| "relation-static"
	| "relation-previous"
	| "confirm-positive"
	| "confirm-negative"
	;

const Icons: { [key in IconKind]: (params: Parameters) => ReactNode } = {
	"timeline-task": (params) => <Md.MdTaskAlt {...convertParameter(params)} />,
	"timeline-group": (params) => <Md.MdFolder {...convertParameter(params)} />,
	"relation-mixin": (params) => <Md.MdCompareArrows {...convertParameter(params)} />,
	"relation-static": (params) => <Md.MdOutlineCalendarMonth {...convertParameter(params)} />,
	"relation-previous": (params) => <Md.MdSubdirectoryArrowRight {...convertParameter(params)} />,
	"confirm-positive": (params) => <Md.MdCheck {...convertParameter(params)} />,
	"confirm-negative": (params) => <Md.MdOutlineCancel {...convertParameter(params)} />,
} as const;

function convertParameter(params: Parameters): IconBaseProps {
	const attr: IconBaseProps = {
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
