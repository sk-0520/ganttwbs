export interface AtomReader<T> {
	data: Readonly<T>;
}

export interface AtomWriter<T> {
	write(arg: T): void;
}

