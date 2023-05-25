/* eslint-disable @typescript-eslint/no-explicit-any */

import { Browsers } from "@/models/Browsers";

/**
 * 通常ログメソッド。
 */
type LogMethod = (message?: any, ...optionalParams: any[]) => void;

type TableMethod = (tabularData?: any, properties?: string[] | undefined) => void;
type DirMethod = (item?: any, options?: any) => void;
export type TimeLogMethod = (...data: any[]) => void;
type TimeMethod = (label: string, callback: (log: TimeLogMethod) => void) => void;

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

	time: boolean;
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

	time: TimeMethod;
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

function nopTimeLog(...data: any[]): void {
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

	const time = {
		client: level.client < LogLevel.Information,
		server: level.server < LogLevel.Information,
	} as const;

	const logOption = options ?? {
		client: {
			level: level.client,
			table: table.client,
			dir: dir.client,
			time: time.client,
		},
		server: {
			level: level.server,
			table: table.server,
			dir: dir.server,
			time: time.server,
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
	private readonly option: LogOption;

	public constructor(public readonly header: string, private readonly options: LogOptions) {
		const logHeader = "[" + this.header + "]";

		this.option = getOption(options);

		this.trace = toMethod(this.option.level, LogLevel.Trace, console.trace.bind(console, logHeader));
		this.debug = toMethod(this.option.level, LogLevel.Debug, console.debug.bind(console, logHeader));
		this.log = toMethod(this.option.level, LogLevel.Log, console.log.bind(console, logHeader));
		this.info = toMethod(this.option.level, LogLevel.Information, console.info.bind(console, logHeader));
		this.warn = toMethod(this.option.level, LogLevel.Warning, console.warn.bind(console, logHeader));
		this.error = toMethod(this.option.level, LogLevel.Error, console.error.bind(console, logHeader));

		this.table = this.option.table ? console.table.bind(console) : nopTable;
		this.dir = this.option.dir ? console.dir.bind(console) : nopDir;
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

	public time(label: string, callback: (log: TimeLogMethod) => void): void {
		if (!this.option.time) {
			callback(nopTimeLog);
			return;
		}

		const timeHeader = `[${this.header}@${label}]`;
		const log = console.timeLog.bind(console, timeHeader, "…");

		console.time(timeHeader);

		try {
			callback(log);
		} finally {
			console.timeEnd(timeHeader);
		}
	}

	//#endregion
}
