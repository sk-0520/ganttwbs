import { NextPage } from "next";

import { EditProps } from "@/models/data/props/EditProps";

interface Props extends EditProps { }

const Component: NextPage<Props> = (props: Props) => {
	return (
		<div id='cross-header'>
			<h1>{props.editData.setting.name}</h1>
			<div className='timeline-header'>
				<div className='timeline-id'>ID</div>
				<div className='timeline-subject'>作業</div>
				<div className='timeline-workload'>工数</div>
				<div className='timeline-resource'>割当</div>
				<div className="timeline-relation">💩</div>
				<div className='timeline-range-from'>開始</div>
				<div className='timeline-range-to'>終了</div>
				<div className='timeline-progress'>進捗率</div>
				<div className='timeline-controls'>操作</div>
			</div>
		</div>
	);
};

export default Component;
