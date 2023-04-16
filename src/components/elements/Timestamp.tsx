import { NextPage } from "next";

import { DateTime } from "@/models/DateTime";

interface Props {
	date: DateTime | null;
	format: "date" | "time" | "datetime"
}

const Component: NextPage<Props> = (props: Props) => {
	if (props.date) {
		let format = null;
		switch (props.format) {
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

		return (
			<time className={"timestamp-" + props.format} dateTime={props.date.format("U")}>
				{props.date.format(format)}
			</time>
		);
	}

	return <></>;
};

export default Component;
