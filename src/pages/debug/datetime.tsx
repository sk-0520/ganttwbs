import { NextPage } from "next";
import { FC } from "react";

import Layout from "@/components/layout/Layout";
import { DateTime } from "@/models/DateTime";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";

interface DebugDateTimeItemProps {
	timeZone: TimeZone;
}

const DebugDateTimeItem: FC<DebugDateTimeItemProps> = (props: DebugDateTimeItemProps) => {
	const date = DateTime.today(props.timeZone);

	function render(title: string, func: (dateTime: DateTime) => DateTime) {
		return (
			<tr>
				<td>{title}</td>
				<td suppressHydrationWarning>{func(date).format("U")}</td>
			</tr>
		);
	}

	return (
		<table>
			<caption suppressHydrationWarning style={{ fontWeight: "bold" }}>{date.format("U")}</caption>
			<tbody>
				{render("add 1 day", d => d.add(TimeSpan.fromDays(1)))}
				{render("add 10 day", d => d.add(TimeSpan.fromDays(10)))}
				{render("add 1+1 day", d => d.add(TimeSpan.fromDays(1)).add(TimeSpan.fromDays(1)))}
				{render("dateOnly", d => d.toDateOnly())}
			</tbody>
		</table>
	);
};

const DebugDateTimePage: NextPage = () => {
	const times = [
		"UTC",
		"Asia/Tokyo",
	];

	return (
		<Layout title="DateTime" mode="page" layoutId="debug-datetime">
			<div>
				{times.map(a => {
					return DebugDateTimeItem({
						timeZone: TimeZone.parse(a),
					});
				})}
			</div>
		</Layout>
	);
};

export default DebugDateTimePage;
