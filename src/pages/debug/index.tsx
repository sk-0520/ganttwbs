import { NextPage } from "next";

import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import { DateTime } from "@/models/DateTime";
import { TimeZone } from "@/models/TimeZone";
import { ReactNode } from "react";
import { TimeSpan } from "@/models/TimeSpan";

const Page: NextPage = () => {
	const router = useRouter();

	if (process.env.NODE_ENV === "production") {
		router.push("/");
		return <></>;
	}

	function renderDateTime(timeZone: TimeZone): ReactNode {
		return (
			<>
				<div>{timeZone.serialize()}</div>
				<dt>YYYY-MM-DDThh:mm:ss</dt>
				<dd>
					{renderPattern(DateTime.parse("2023-04-10T01:02:03", timeZone))}
				</dd>

				<dt style={{ marginTop: "1ex" }}>YYYY-MM-DD</dt>
				<dd>
					{renderPattern(DateTime.parse("2023-04-10", timeZone))}
				</dd>
				<div><hr /></div>
			</>
		);
	}

	function renderPattern(date: DateTime): ReactNode {
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
				<>
					{renderDateTime(TimeZone.getClientTimeZone())}
					{renderDateTime(TimeZone.create(TimeSpan.fromHours(9)))}
					{renderDateTime(TimeZone.create(TimeSpan.fromHours(0)))}

					{renderDateTime(TimeZone.create("America/Phoenix"))/* -7 */}
					{renderDateTime(TimeZone.create("America/Guatemala"))/* -6 */}
					{renderDateTime(TimeZone.create("America/New_York"))/* -5 */}
					{renderDateTime(TimeZone.create("America/Halifax"))/* -4 */}
					{renderDateTime(TimeZone.create("America/Montevideo"))/* -3 */}
					{renderDateTime(TimeZone.create("America/Noronha"))/* -2 */}
					{renderDateTime(TimeZone.create("Atlantic/Azores"))/* -1 */}

					{renderDateTime(TimeZone.create("UTC"))/* 0 */}

					{renderDateTime(TimeZone.create("Africa/Lagos"))/* +1 */}
					{renderDateTime(TimeZone.create("Africa/Johannesburg"))/* +2 */}
					{renderDateTime(TimeZone.create("Africa/Baghdad"))/* +3 */}
					{renderDateTime(TimeZone.create("Asia/Baku"))/* +4 */}
					{renderDateTime(TimeZone.create("Asia/Dhaka"))/* +5 */}
					{renderDateTime(TimeZone.create("Asia/Dhaka"))/* +6 */}
					{renderDateTime(TimeZone.create("Asia/Jakarta"))/* +7 */}
					{renderDateTime(TimeZone.create("Africa/Krasnoyarsk"))/* +8 */}
					{renderDateTime(TimeZone.create("Asia/Tokyo"))/* +9 */}
					{renderDateTime(TimeZone.create("Australia/Sydney"))/* +10 */}
				</>
			</dl>
		</Layout>
	);
};

export default Page;
