import { atom, useAtomValue, useSetAtom } from "jotai";

import type {
	AtomReader,
	AtomType,
	AtomWriter,
} from "@/models/atom/AtomHelper";
import type { SelectingBeginDate } from "@/models/data/BeginDate";

const SelectingBeginDateAtom = atom<SelectingBeginDate | undefined>(undefined);

export function useSelectingBeginDateAtomReader(): AtomReader<
	AtomType<typeof SelectingBeginDateAtom>
> {
	return {
		data: useAtomValue(SelectingBeginDateAtom),
	};
}

export function useSelectingBeginDateAtomWriter(): AtomWriter<
	AtomType<typeof SelectingBeginDateAtom>
> {
	return {
		write: useSetAtom(SelectingBeginDateAtom),
	};
}
