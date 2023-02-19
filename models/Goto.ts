import { NextRouter } from 'next/router';
import { EditData } from '@/models/data/EditData';

export function edit(editData: EditData, router: NextRouter): Promise<boolean> {
	const sessionData = JSON.stringify(editData);
	sessionStorage.setItem('data', sessionData);
	return router.push('/edit');
}
