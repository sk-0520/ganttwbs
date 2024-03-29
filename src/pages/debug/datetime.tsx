import { cdate } from "cdate";
import { NextPage } from "next";
import { FC, useEffect, useState } from "react";

import Layout from "@/components/layout/Layout";
import { DateTime, DateTimeTicks } from "@/models/DateTime";
import { TimeSpan } from "@/models/TimeSpan";
import { TimeZone } from "@/models/TimeZone";

interface DebugDateTimeItemProps {
	date: DateTime;
}

const DebugDateTimeItem: FC<DebugDateTimeItemProps> = (props: DebugDateTimeItemProps) => {
	function render(title: string, func: (dateTime: DateTime) => DateTime) {
		return (
			<tr>
				<td>{title}</td>
				<td>{func(props.date).format("U")}</td>
			</tr>
		);
	}

	return (
		<table>
			<caption style={{ fontWeight: "bold" }}>{props.date.format("U")}</caption>
			<tbody>
				{render("add 1 day", d => d.add(TimeSpan.fromDays(1)))}
				{render("add 10 day", d => d.add(TimeSpan.fromDays(10)))}
				{render("add 40 day", d => d.add(TimeSpan.fromDays(40)))}
				{render("add 1+1 day", d => d.add(TimeSpan.fromDays(1)).add(TimeSpan.fromDays(1)))}
				{render("dateOnly", d => d.truncateTime())}
				{render("add 1 second", d => d.add(1, "second"))}
				{render("add 1 minute", d => d.add(1, "minute"))}
				{render("add 1 hour", d => d.add(1, "hour"))}
				{render("add 1 week", d => d.add(1, "week"))}
				{render("add 1 day", d => d.add(1, "day"))}
				{render("add 1 month", d => d.add(1, "month"))}
				{render("add -1 month", d => d.add(-1, "month"))}
				{render("add 3 month", d => d.add(3, "month"))}
				{render("add 6 month", d => d.add(6, "month"))}
				{render("add 12 month", d => d.add(12, "month"))}
				{render("add 2 year", d => d.add(2, "year"))}
				{render("[cdate] add 1 month", d => DateTime.convert(Number(cdate(d.ticks).add(1, "month")) as unknown as DateTimeTicks, d.timeZone))}
				{render("[cdate] add 3 month", d => DateTime.convert(Number(cdate(d.ticks).add(3, "month")) as unknown as DateTimeTicks, d.timeZone))}
				{render("[cdate] add 6 month", d => DateTime.convert(Number(cdate(d.ticks).add(6, "month")) as unknown as DateTimeTicks, d.timeZone))}
				{render("[cdate] add 12 month", d => DateTime.convert(Number(cdate(d.ticks).add(12, "month")) as unknown as DateTimeTicks, d.timeZone))}
				{render("[cdate] add 1 months", d => DateTime.convert(Number(cdate(d.ticks).add(1, "months")) as unknown as DateTimeTicks, d.timeZone))}
				{render("[cdate] add 3 months", d => DateTime.convert(Number(cdate(d.ticks).add(3, "months")) as unknown as DateTimeTicks, d.timeZone))}
				{render("[cdate] add 6 months", d => DateTime.convert(Number(cdate(d.ticks).add(6, "months")) as unknown as DateTimeTicks, d.timeZone))}
				{render("[cdate] add 12 months", d => DateTime.convert(Number(cdate(d.ticks).add(12, "months")) as unknown as DateTimeTicks, d.timeZone))}
				{render("create add 13 month", d => DateTime.create(d.timeZone, d.year, d.month + 13, d.day, d.hour, d.minute, d.second, d.millisecond))}
				{render("getLastDayOfMonth add 0", d => d.add(0, "month").getLastDayOfMonth())}
				{render("getLastDayOfMonth add 1", d => d.add(1, "month").getLastDayOfMonth())}
				{render("getLastDayOfMonth add 2", d => d.add(2, "month").getLastDayOfMonth())}
				{render("getLastDayOfMonth add 3", d => d.add(3, "month").getLastDayOfMonth())}
			</tbody>
		</table>
	);
};

const times = [
	"UTC",
	"Asia/Tokyo",
];

const DebugDateTimePage: NextPage = () => {
	const [dates, setDates] = useState<Array<DateTime>>([]);

	useEffect(() => {
		setDates(times.map(a => DateTime.today(TimeZone.parse(a))));
	}, []);

	return (
		<Layout title="DateTime" mode="page" layoutId="debug-datetime">
			<div>
				{dates.map(a => {
					return DebugDateTimeItem({
						date: a,
					});
				})}
			</div>
		</Layout>
	);
};

export default DebugDateTimePage;
