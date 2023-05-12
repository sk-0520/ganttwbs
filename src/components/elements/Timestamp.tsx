
import { FC } from "react";

import { DateTime } from "@/models/DateTime";
import { Locale, useLocale } from "@/locales/locale";


interface Props {
	date: DateTime | null;
	format: "date" | "time" | "datetime"
}

const Timestamp: FC<Props> = (props: Props) => {
	const locale = useLocale();

	if (props.date) {
		const values = convert(props.format, locale);

		return (
			<time className={values.className} dateTime={props.date.format("U")}>
				{props.date.format(values.format)}
			</time>
		);
	}

	return <></>;
};

export default Timestamp;

function convert(propsFormat: string, locale: Locale): { className: string, format: string } {
	let format: string;

	switch (propsFormat) {
		case "date":
			format = locale.common.calendar.dateOnlyFormat;
			break;

		case "time":
			format = locale.common.calendar.timeOnlyFormat;
			break;

		case "datetime":
			format = locale.common.calendar.dateTimeFormat;
			break;

		default:
			throw new Error();
	}

	return {
		className: "timestamp-" + propsFormat,
		format: format,
	};
}
