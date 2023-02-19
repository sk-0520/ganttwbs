import { NextPage } from "next";

interface Props {
	fileName: string;
}

const Component: NextPage<Props> = (props: Props) => {
	return (
		<form>
			<dl className="inputs">
				<dt>ファイル名</dt>
				<dd>
					<input />
				</dd>

				<dt>定期的にファイルをDLする</dt>
				<dd>
					<input />
				</dd>
			</dl>
		</form>
	);
};

export default Component;
