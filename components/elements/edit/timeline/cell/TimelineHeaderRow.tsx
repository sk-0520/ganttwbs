import { SelectingBeginDate } from "@/models/data/BeginDate";
import DraggingTimeline from "@/models/data/DraggingTimeline";
import { Timeline } from "@/models/data/Setting";
import { Settings } from "@/models/Settings";
import { NextPage } from "next";
import { CSSProperties, ReactNode, useEffect, useState } from "react";

interface Props {
	currentTimeline: Timeline;
	selectingBeginDate: SelectingBeginDate | null;
	draggingTimeline: DraggingTimeline | null;
	heightStyle: CSSProperties;
	children: ReactNode;
}

const Component: NextPage<Props> = (props: Props) => {

	const [dropEventClassName, setDropEventClassName] = useState('');
	const [mouseEnterClassName, setMouseEnterClassName] = useState('');

	useEffect(() => {
		if (!props.draggingTimeline) {
			setDropEventClassName('');
		}
	}, [props.draggingTimeline]);

	function handleDragOver() {
		setDropEventClassName('drag-over')
	}
	function handleDragLeave() {
		setDropEventClassName('')
	}

	function handleMouseEnter() {
		if (!props.draggingTimeline && !props.selectingBeginDate) {
			setMouseEnterClassName('hover');
		}
	}
	function handleMouseLeave() {
		setMouseEnterClassName('');
	}

	return (
		<div
			className={
				'timeline-header'
				+ ' ' + mouseEnterClassName
				+ (Settings.maybeTaskTimeline(props.currentTimeline) ? props.selectingBeginDate?.timeline.id === props.currentTimeline.id ? ' ' + 'hover' : '' : '')
				+ (props.draggingTimeline?.sourceTimeline.id === props.currentTimeline.id ? ' dragging' : '')
				+ ' ' + dropEventClassName
			}
			style={props.heightStyle}
			onDragEnter={ev => props.draggingTimeline?.onDragEnter(ev, props.currentTimeline)}
			onDragOver={ev => props.draggingTimeline?.onDragOver(ev, props.currentTimeline, handleDragOver)}
			onDragLeave={ev => props.draggingTimeline?.onDragLeave(ev, props.currentTimeline, handleDragLeave)}
			onDrop={ev => props.draggingTimeline?.onDrop(ev, props.currentTimeline)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{props.children}
		</div>
	);
};

export default Component;
