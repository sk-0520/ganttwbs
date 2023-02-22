import { EditContext } from '@/models/data/context/EditContext';
import { NextPage } from 'next';
import { useContext } from 'react';

const Component: NextPage = () => {
	const editContext = useContext(EditContext);

	return (
		<div id='hidariue'>
			<h1>{editContext.data.setting.name}</h1>
			<div className='mark'>mark</div>
			<div className='task'>task</div>
			<div className='kind'>kind</div>
			<div className='workload'>workload</div>
			<div className='resource'>resource</div>
			<div className='from'>from</div>
			<div className='to'>to</div>
			<div className='percent'>percent</div>
		</div>
	);
};

export default Component;
