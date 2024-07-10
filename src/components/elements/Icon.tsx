import classNames from "classnames";
import type { FC, ReactNode } from "react";
import type { IconBaseProps } from "react-icons";
import * as Ai from "react-icons/ai";
import * as Md from "react-icons/md";

import { Types } from "@/models/Types";

// 基本的に Material Design icons を使用する
// https://react-icons.github.io/react-icons/icons?name=md

export enum IconKind {
	TimelineTask = 0,
	TimelineGroup = 1,
	TimelineAddTask = 2,
	TimelineAddGroup = 3,
	TimelineImport = 4,

	CheckBoxTimelinePreviousOn = 5,
	CheckBoxTimelinePreviousOff = 6,

	RelationHeader = 7,
	RelationMix = 8,
	RelationStatic = 9,
	RelationPrevious = 10,
	RelationJoin = 11,
	RelationClear = 12,

	MoveUp = 13,
	MoveDown = 14,
	MovePrev = 15,
	MoveNext = 16,
	MoveTarget = 17,

	NavigatePrev = 18,
	NavigateNext = 19,

	CalendarToday = 20,

	ConfirmPositive = 21,
	ConfirmNegative = 22,
	ConfirmCancel = 23,

	Warning = 24,
	Error = 25,

	Reset = 26,
	Clear = 27,
	Option = 28,
	Edit = 29,
	Remove = 30,
	Save = 31,

	SoftwareExcel = 32,
	SoftwareTable = 33,
}

const Icons: { [key in IconKind]: (props: Props) => ReactNode } = {
	[IconKind.TimelineTask]: (props) => (
		<Md.MdTaskAlt {...convertParameter(props)} />
	),
	[IconKind.TimelineGroup]: (props) => (
		<Md.MdFolder {...convertParameter(props)} />
	),
	[IconKind.TimelineAddTask]: (props) => (
		<Md.MdOutlineAddTask {...convertParameter(props)} />
	),
	[IconKind.TimelineAddGroup]: (props) => (
		<Md.MdCreateNewFolder {...convertParameter(props)} />
	),
	[IconKind.TimelineImport]: (props) => (
		<Md.MdOutlineEditNote {...convertParameter(props)} />
	),

	[IconKind.RelationHeader]: (props) => (
		<Md.MdOutlineSyncAlt {...convertParameter(props)} />
	),
	[IconKind.RelationMix]: (props) => (
		<Md.MdOutlineStart {...convertParameter(props)} />
	),
	[IconKind.RelationStatic]: (props) => (
		<Md.MdOutlineCalendarMonth {...convertParameter(props)} />
	),
	[IconKind.RelationPrevious]: (props) => (
		<Md.MdSubdirectoryArrowRight {...convertParameter(props)} />
	),
	[IconKind.RelationJoin]: (props) => (
		<Md.MdLink {...convertParameter(props)} />
	),
	[IconKind.RelationClear]: (props) => (
		<Md.MdLinkOff {...convertParameter(props)} />
	),

	[IconKind.CheckBoxTimelinePreviousOn]: (props) => (
		<Md.MdOutlineCheckBox {...convertParameter(props)} />
	),
	[IconKind.CheckBoxTimelinePreviousOff]: (props) => (
		<Md.MdOutlineCheckBoxOutlineBlank {...convertParameter(props)} />
	),

	[IconKind.MoveUp]: (props) => (
		<Md.MdArrowUpward {...convertParameter(props)} />
	),
	[IconKind.MoveDown]: (props) => (
		<Md.MdArrowDownward {...convertParameter(props)} />
	),
	[IconKind.MovePrev]: (props) => (
		<Md.MdArrowBack {...convertParameter(props)} />
	),
	[IconKind.MoveNext]: (props) => (
		<Md.MdArrowForward {...convertParameter(props)} />
	),
	[IconKind.MoveTarget]: (props) => (
		<Md.MdKeyboardDoubleArrowRight {...convertParameter(props)} />
	),

	[IconKind.NavigatePrev]: (props) => (
		<Md.MdNavigateBefore {...convertParameter(props)} />
	),
	[IconKind.NavigateNext]: (props) => (
		<Md.MdNavigateNext {...convertParameter(props)} />
	),

	[IconKind.CalendarToday]: (props) => (
		<Md.MdToday {...convertParameter(props)} />
	),

	[IconKind.ConfirmPositive]: (props) => (
		<Md.MdCheck {...convertParameter(props)} />
	),
	[IconKind.ConfirmNegative]: (props) => (
		<Md.MdOutlineBlock {...convertParameter(props)} />
	),
	[IconKind.ConfirmCancel]: (props) => (
		<Md.MdOutlineRemoveCircleOutline {...convertParameter(props)} />
	),

	[IconKind.Warning]: (props) => <Md.MdWarning {...convertParameter(props)} />,
	[IconKind.Error]: (props) => <Md.MdError {...convertParameter(props)} />,

	[IconKind.Reset]: (props) => <Md.MdRestartAlt {...convertParameter(props)} />,
	[IconKind.Clear]: (props) => (
		<Md.MdOutlineClear {...convertParameter(props)} />
	),
	[IconKind.Option]: (props) => <Md.MdBuild {...convertParameter(props)} />,
	[IconKind.Edit]: (props) => <Md.MdModeEdit {...convertParameter(props)} />,
	[IconKind.Remove]: (props) => (
		<Md.MdOutlineDelete {...convertParameter(props)} />
	),
	[IconKind.Save]: (props) => <Md.MdOutlineSave {...convertParameter(props)} />,

	[IconKind.SoftwareExcel]: (props) => (
		<Ai.AiFillFileExcel {...convertParameter(props)} />
	),
	[IconKind.SoftwareTable]: (props) => (
		<Md.MdOutlineGridOn {...convertParameter(props)} />
	),
} as const;

function convertColor(
	kind: IconKind,
	color: string | null | undefined,
): string | undefined {
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

			case IconKind.Warning:
				return "yellow";

			case IconKind.Error:
			case IconKind.ConfirmCancel:
				return "red";

			case IconKind.SoftwareExcel:
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
		stroke: props.stroke,
		strokeWidth: props.strokeWidth,
	};

	return attr;
}

interface Props {
	kind: IconKind;
	/** 色。 未設定(`undefined`)の場合はデフォルト処理が行われる。 `null` は何もしない */
	fill?: string | null;
	stroke?: string;
	strokeWidth?: string;
	title?: string;
}

export const IconImage: FC<Props> = (props: Props) => {
	const factory = Icons[props.kind];

	return (
		<span className="icon">
			<>{factory(props)}</>
		</span>
	);
};

interface LabelProps extends Props {
	className?: string;
	direction?: "left" | "right" | "bottom";
	label: string;
}

export const IconLabel: FC<LabelProps> = (props: LabelProps) => {
	return (
		<div
			className={classNames(
				"icon-label-wrapper",
				props.className,
				props.direction ?? "left",
			)}
		>
			<IconImage {...props} />
			<span className="label" title={props.title}>
				{props.label}
			</span>
		</div>
	);
};
