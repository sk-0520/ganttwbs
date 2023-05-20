import { atom, useAtomValue, useSetAtom } from "jotai";

import { AtomReader, AtomType, AtomWriter } from "@/models/data/atom/AtomHelper";
import { SelectingBeginDate } from "@/models/data/BeginDate";

const SelectingBeginDateAtom = atom<SelectingBeginDate | undefined>(undefined);

export function useSelectingBeginDateAtomReader(): AtomReader<AtomType<typeof SelectingBeginDateAtom>> {
	return {
		data: useAtomValue(SelectingBeginDateAtom),
	};
}

export function useSelectingBeginDateAtomWriter(): AtomWriter<AtomType<typeof SelectingBeginDateAtom>> {
	return {
		write: useSetAtom(SelectingBeginDateAtom),
	};
}
