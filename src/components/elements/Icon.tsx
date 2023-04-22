import { NextPage } from "next";
import { ReactNode } from "react";
import { IconBaseProps } from "react-icons";
import * as Md from "react-icons/md";

import { IconKind } from "@/models/IconKind";
import { Types } from "@/models/Types";

// 基本的に Material Design icons を使用する
// https://react-icons.github.io/react-icons/icons?name=md

const Icons: { [key in IconKind]: (props: Props) => ReactNode } = {
	[IconKind.TimelineTask]: (props) => <Md.MdTaskAlt {...convertParameter(props)} />,
	[IconKind.TimelineGroup]: (props) => <Md.MdFolder {...convertParameter(props)} />,
	[IconKind.TimelineAddTask]: (props) => <Md.MdOutlineAddTask {...convertParameter(props)} />,
	[IconKind.TimelineAddGroup]: (props) => <Md.MdCreateNewFolder {...convertParameter(props)} />,
	[IconKind.TimelineImport]: (props) => <Md.MdOutlineEditNote {...convertParameter(props)} />,

	[IconKind.RelationMix]: (props) => <Md.MdOutlineStart {...convertParameter(props)} />,
	[IconKind.RelationStatic]: (props) => <Md.MdOutlineCalendarMonth {...convertParameter(props)} />,
	[IconKind.RelationPrevious]: (props) => <Md.MdSubdirectoryArrowRight {...convertParameter(props)} />,

	[IconKind.MoveUp]: (props) => <Md.MdArrowUpward {...convertParameter(props)} />,
	[IconKind.MoveDown]: (props) => <Md.MdArrowDownward {...convertParameter(props)} />,
	[IconKind.MovePrev]: (props) => <Md.MdArrowBack {...convertParameter(props)} />,
	[IconKind.MoveNext]: (props) => <Md.MdArrowForward {...convertParameter(props)} />,

	[IconKind.CalendarToday]: (props) => <Md.MdToday {...convertParameter(props)} />,

	[IconKind.ConfirmPositive]: (props) => <Md.MdCheck {...convertParameter(props)} />,
	[IconKind.ConfirmNegative]: (props) => <Md.MdOutlineBlock {...convertParameter(props)} />,
	[IconKind.ConfirmCancel]: (props) => <Md.MdOutlineRemoveCircleOutline {...convertParameter(props)} />,

	[IconKind.Operation]: (props) => <Md.MdBuild {...convertParameter(props)} />,
	[IconKind.Remove]: (props) => <Md.MdOutlineDelete {...convertParameter(props)} />,
} as const;

function convertColor(kind: IconKind, color: string | null | undefined): string | undefined {
	if (color === null) {
		return undefined;
	}

	if (Types.isUndefined(color)) {
		switch (kind) {
			case IconKind.TimelineGroup:
			case IconKind.TimelineAddGroup:
				return "gold";

			case IconKind.TimelineTask:
			case IconKind.TimelineAddTask:
				return "green";

			default:
				break;
		}
	}

	return color;
}

function convertParameter(props: Props): IconBaseProps {

	const attr: IconBaseProps = {
		title: props.title,
		color: convertColor(props.kind, props.fill),
	};

	return attr;
}

interface Props {
	kind: IconKind;
	/** 色。 未設定(`undefined`)の場合はデフォルト処理が行われる。 `null` は何もしない */
	fill?: string | null;
	stroke?: string;
	title?: string;
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
