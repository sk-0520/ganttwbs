import { FC } from "react";

import Dialog from "@/components/elements/Dialog";
import { useLocale } from "@/locales/locale";
import { useCalendarInfoAtomReader, useDayInfosAtomReader } from "@/models/data/atom/editor/TimelineAtoms";
import { ConfigurationProps } from "@/models/data/props/ConfigurationProps";
import { TimelineCallbacksProps } from "@/models/data/props/TimelineStoreProps";
import { DateTime } from "@/models/DateTime";

interface Props extends ConfigurationProps, TimelineCallbacksProps {
	callbackClose(date: DateTime | undefined): void;
}

const InformationDialog: FC<Props> = (props: Props) => {
	const locale = useLocale();
	const dayInfosAtomReader = useDayInfosAtomReader();
	const calendarInfoAtomReader = useCalendarInfoAtomReader();

	const dates = new Set(
		[...dayInfosAtomReader.data]
			.map(([k, v]) => DateTime.convert(k, calendarInfoAtomReader.data.timeZone).truncateTime())
			.map(a => a.ticks)
			.sort((a, b) => Number(a) - Number(b))
	);

	function handleClickDate(date: DateTime): void {
		props.callbackClose(date);
	}

	return (
		<Dialog
			button="close"
			title={locale.pages.editor.timeline.informationDialog.title}
			callbackClose={ev => {
				props.callbackClose(undefined);
			}}
		>
			<ul>
				{[...dates].map(a => {
					const date = DateTime.convert(a, calendarInfoAtomReader.data.timeZone);
					return (
						<li key={a}>
							<a
								className="event"
								href="#"
								onClick={ev => handleClickDate(date)}
							>
								{date.format(locale.common.calendar.dateOnlyFormat)}
							</a>
						</li>
					);
				})}

			</ul>
		</Dialog>
	);
};

export default InformationDialog;
