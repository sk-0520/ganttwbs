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

	const input = {
		YYYYMMDDhhmmss: "2023-04-10T23:24:25",
		YYYYMMDD: "2023-04-10",
	} as const;

	function renderDateTime(timeZone: TimeZone): ReactNode {
		return (
			<>
				<tr>
					<td colSpan={2} style={{ fontWeight: "bold" }}>{timeZone.serialize()}</td>
				</tr>
				<tr>
					<td style={{ color: "red" }}>YYYY-MM-DDThh:mm:ss</td>
					<td>
						{renderPattern(DateTime.parse(input.YYYYMMDDhhmmss, timeZone))}
					</td>
				</tr>
				<tr>
					<td style={{ color: "green", marginTop: "1ex" }}>YYYY-MM-DD</td>
					<td>
						{renderPattern(DateTime.parse(input.YYYYMMDD, timeZone))}
					</td>
				</tr>
			</>
		);
	}

	function renderPattern(date: DateTime): ReactNode {
		return (
			<table >
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
				</tbody>
			</table>
		);
	}

	return (
		<Layout mode='page' layoutId='debug' title={process.env.NODE_ENV}>
			<table>
				<thead>
					<tr>
						<th>YYYY-MM-DDThh:mm:ss</th>
						<th>{input.YYYYMMDDhhmmss}</th>
					</tr>
					<tr>
						<th>YYYY-MM-DD</th>
						<th>{input.YYYYMMDD}</th>
					</tr>
				</thead>

				<tbody>
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
					{renderDateTime(TimeZone.create("Asia/Baghdad"))/* +3 */}
					{renderDateTime(TimeZone.create("Asia/Baku"))/* +4 */}
					{renderDateTime(TimeZone.create("Asia/Dhaka"))/* +5 */}
					{renderDateTime(TimeZone.create("Asia/Dhaka"))/* +6 */}
					{renderDateTime(TimeZone.create("Asia/Jakarta"))/* +7 */}
					{renderDateTime(TimeZone.create("Asia/Krasnoyarsk"))/* +8 */}
					{renderDateTime(TimeZone.create("Asia/Tokyo"))/* +9 */}
					{renderDateTime(TimeZone.create("Australia/Sydney"))/* +10 */}
				</tbody>
			</table>
		</Layout>
	);
};

export default Page;
