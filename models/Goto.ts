import { NextRouter } from 'next/router';
import { EditData } from '@/models/data/EditData';
import * as Storage from "@/models/Storage";

export function edit(editData: EditData, router: NextRouter): Promise<boolean> {
	Storage.saveEditData(editData);
	return router.push('/edit');
}
