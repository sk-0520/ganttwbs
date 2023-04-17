import { NextPage } from "next";
import { ReactNode } from "react";
import { IconBaseProps } from "react-icons";
import * as Md from "react-icons/md";

import { IconKind } from "@/models/IconKind";

// 基本的に Material Design icons を使用する
// https://react-icons.github.io/react-icons/icons?name=md

const Icons: { [key in IconKind]: (params: Parameters) => ReactNode } = {
	[IconKind.TimelineTask]: (params) => <Md.MdTaskAlt {...convertParameter(params)} />,
	[IconKind.TimelineGroup]: (params) => <Md.MdFolder {...convertParameter(params)} />,
	[IconKind.RelationMix]: (params) => <Md.MdOutlineStart {...convertParameter(params)} />,
	[IconKind.RelationStatic]: (params) => <Md.MdOutlineCalendarMonth {...convertParameter(params)} />,
	[IconKind.RelationPrevious]: (params) => <Md.MdSubdirectoryArrowRight {...convertParameter(params)} />,
	[IconKind.ConfirmPositive]: (params) => <Md.MdCheck {...convertParameter(params)} />,
	[IconKind.ConfirmNegative]: (params) => <Md.MdOutlineBlock {...convertParameter(params)} />,
	[IconKind.ConfirmCancel]: (params) => <Md.MdOutlineRemoveCircleOutline {...convertParameter(params)} />,
	[IconKind.Operation]: (params) => <Md.MdBuild {...convertParameter(params)} />,
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
