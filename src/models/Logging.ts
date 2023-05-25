/* eslint-disable @typescript-eslint/no-explicit-any */

import { Browsers } from "@/models/Browsers";

/**
 * 通常ログメソッド。
 */
type LogMethod = (message?: any, ...optionalParams: any[]) => void;

type TableMethod = (tabularData?: any, properties?: string[] | undefined) => void;
type DirMethod = (item?: any, options?: any) => void;
//type TimeDumpMethod = () => void;
//type TimeMethod = (label: string, callback: (dump: TimeDumpMethod) => void) => void;

// console.time()
// console.timeLog(LOG_GWR, "各グループ・タスク");
// console.timeEnd(LOG_GWR);

/**
 * ログレベル。
 */
export enum LogLevel {
	Trace,
	Debug,
	Log,
	Information,
	Warning,
	Error,
}

export interface LogOption {
	level: LogLevel;

	table: boolean,
	dir: boolean,

	//time: boolean;
}

export interface LogOptions {
	//#region property

	client: LogOption;
	server: LogOption;

	//#endregion
}

function toLogLevel(level: string): LogLevel {
	switch (level) {
		case "trace":
			return LogLevel.Trace;

		case "debug":
			return LogLevel.Debug;

		case "log":
			return LogLevel.Log;

		case "info":
		case "information":
			return LogLevel.Information;

		case "warn":
		case "warning":
			return LogLevel.Warning;

		case "err":
		case "error":
			return LogLevel.Error;

		default:
			throw new Error();
	}
}

export interface Logger {
	readonly level: LogLevel;
	readonly header: string;

	/** `LogLevel.Trace` 以上のログ出力処理 */
	trace: LogMethod;
	/** `LogLevel.Debug` 以上のログ出力処理 */
	debug: LogMethod;
	/** `LogLevel.Log` 以上のログ出力処理 */
	log: LogMethod;
	/** `LogLevel.Information` 以上のログ出力処理 */
	info: LogMethod;
	/** `LogLevel.Warning` 以上のログ出力処理 */
	warn: LogMethod;
	/** `LogLevel.Error` 以上のログ出力処理 */
	error: LogMethod;

	table: TableMethod;
	dir: DirMethod;

	//time: TimeMethod;
}

function nopLog(message?: any, ...optionalParams: any[]): void {
	//nop
}

function nopTable(message?: any, ...optionalParams: any[]): void {
	//nop
}

function nopDir(item?: any, options?: any): void {
	//nop
}

function toMethod(currentLevel: LogLevel, targetLevel: LogLevel, method: LogMethod): LogMethod {
	return currentLevel <= targetLevel
		? method
		: nopLog
		;
}

export function createLogger(header: string, options?: LogOptions): Logger {
	const level = {
		client: toLogLevel(process.env.NEXT_PUBLIC_APP_LOG_LEVEL ?? "info"),
		server: toLogLevel(process.env.APP_LOG_LEVEL ?? "info"),
	} as const;

	const table = {
		client: level.client < LogLevel.Information,
		server: level.server < LogLevel.Information,
	} as const;

	const dir = {
		client: level.client < LogLevel.Information,
		server: level.server < LogLevel.Information,
	} as const;

	// const time = {
	// 	client: level.client < LogLevel.Information,
	// 	server: level.server < LogLevel.Information,
	// } as const;

	const logOption = options ?? {
		client: {
			level: level.client,
			table: table.client,
			dir: dir.client,
			//time: time.client,
		},
		server: {
			level: level.server,
			table: table.server,
			dir: dir.server,
			//time: time.server,
		}
	};

	return new ConsoleLogger(header, logOption);
}

function getOption(logOptions: LogOptions): LogOption {
	return Browsers.running
		? logOptions.client
		: logOptions.server
		;
}

class ConsoleLogger implements Logger {
	public constructor(public readonly header: string, private readonly options: LogOptions) {
		const logHeader = "[" + this.header + "]";

		const option = getOption(options);

		this.trace = toMethod(option.level, LogLevel.Trace, console.trace.bind(console, logHeader));
		this.debug = toMethod(option.level, LogLevel.Debug, console.debug.bind(console, logHeader));
		this.log = toMethod(option.level, LogLevel.Log, console.log.bind(console, logHeader));
		this.info = toMethod(option.level, LogLevel.Information, console.info.bind(console, logHeader));
		this.warn = toMethod(option.level, LogLevel.Warning, console.warn.bind(console, logHeader));
		this.error = toMethod(option.level, LogLevel.Error, console.error.bind(console, logHeader));

		this.table = option.table ? console.table.bind(console) : nopTable;
		this.dir = option.dir ? console.dir.bind(console) : nopDir;
	}

	//#region Logger

	public get level(): LogLevel {
		return getOption(this.options).level;
	}

	trace: LogMethod;
	debug: LogMethod;
	log: LogMethod;
	info: LogMethod;
	warn: LogMethod;
	error: LogMethod;

	table: TableMethod;
	dir: DirMethod;

	//#endregion
}

// class TimerLogger {
// 	constructor(
// 		private header: string,
// 		private label: string
// 	) {
// 		this.logHeader = `[${this.header}][${this.label}]`;
// 		console.info.bind(console, this.logHeader);
// 	}

// 	public readonly logHeader:string;
// }
