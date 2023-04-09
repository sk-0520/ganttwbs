import { NextPage } from "next";

import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import { DateTime } from "@/models/DateTime";
import { TimeZone } from "@/models/TimeZone";
import { ReactNode } from "react";

const Page: NextPage = () => {
	const router = useRouter();

	if (process.env.NODE_ENV === "production") {
		router.push("/");
		return <></>;
	}

	function show(date: DateTime): ReactNode {
		return (
			<table>
				<tbody>
					<tr>
						<td>year</td>
						<td>{date.year}</td>
					</tr>
					<tr>
						<td>month</td>
						<td>{date.month}</td>
					</tr>
					<tr>
						<td>day</td>
						<td>{date.day}</td>
					</tr>
					<tr>
						<td>hour</td>
						<td>{date.hour}</td>
					</tr>
					<tr>
						<td>minute</td>
						<td>{date.minute}</td>
					</tr>
					<tr>
						<td>second</td>
						<td>{date.second}</td>
					</tr>
					<tr>
						<td>TZ</td>
						<td>{date.timeZone.serialize()}</td>
					</tr>
					<tr>
						<td>U</td>
						<td>{date.format("U")}</td>
					</tr>
					<tr>
						<td>L</td>
						<td>{date.format("L")}</td>
					</tr>
					<tr>
						<td>I</td>
						<td>{date.format("I")}</td>
					</tr>
				</tbody>
			</table>
		);
	}

	return (
		<Layout mode='page' layoutId='debug' title={process.env.NODE_ENV}>
			<dl>
				<dt>YYYY-MM-DDThh:mm:ss</dt>
				<dd>
					{show(DateTime.parse("2023-04-10T00:00:00", TimeZone.getClientTimeZone()))}
				</dd>

				<dt>YYYY-MM-DD</dt>
				<dd>
					{show(DateTime.parse("2023-04-10", TimeZone.getClientTimeZone()))}
				</dd>
			</dl>
		</Layout>
	);
};

export default Page;
