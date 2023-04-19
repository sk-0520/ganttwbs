import { NextPage } from "next";

import { DateTime } from "@/models/DateTime";

interface Props {
	date: DateTime | null;
	format: "date" | "time" | "datetime"
}

const Component: NextPage<Props> = (props: Props) => {
	if (props.date) {
		const values = convert(props.format);

		return (
			<time className={values.className} dateTime={props.date.format("U")}>
				{props.date.format(values.format)}
			</time>
		);
	}

	return <></>;
};

export default Component;

function convert(propsFormat: string): { className: string, format: string } {
	let format: string;

	switch (propsFormat) {
		case "date":
			format = "yyyy/MM/dd";
			break;

		case "time":
			format = "hh:mm:ss";
			break;

		case "datetime":
			format = "yyyy/MM/dd hh:mm:ss";
			break;

		default:
			throw new Error();
	}

	return {
		className: "timestamp-" + propsFormat,
		format: format,
	};
}
