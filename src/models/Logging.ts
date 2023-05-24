/* eslint-disable @typescript-eslint/no-explicit-any */

import { Browsers } from "@/models/Browsers";

/**
 * 通常ログメソッド。
 */
export type LogMethod = (message?: any, ...optionalParams: any[]) => void;

// console.time()
// console.timeLog(LOG_GWR, "各グループ・タスク");
// console.timeEnd(LOG_GWR);
// console.table();
// console.dir();


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

export interface LogOptions {
	//#region property

	clientLevel: LogLevel;
	serverLevel: LogLevel;

	//#endregion

	//#region function


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
			return LogLevel.Information;

		case "warn":
			return LogLevel.Warning;

		case "err":
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
}

export function nop(message?: any, ...optionalParams: any[]): void {
	//nop
}

export function toMethod(currentLevel: LogLevel, targetLevel: LogLevel, method: LogMethod): LogMethod {
	return currentLevel <= targetLevel
		? method
		: nop
		;
}

export function createLogger(header: string, options?: LogOptions): Logger {
	const logOption = options ?? {
		clientLevel: toLogLevel(process.env.NEXT_PUBLIC_APP_LOG_LEVEL ?? "info"),
		serverLevel: toLogLevel(process.env.APP_LOG_LEVEL ?? "info"),
	};

	return new ConsoleLogger(header, logOption);
}

class ConsoleLogger implements Logger {
	public constructor(public readonly header: string, private readonly options: LogOptions) {
		const logHeader = "[" + this.header + "] ";

		const level = Browsers.running
			? options.clientLevel
			: options.serverLevel
			;

		this.trace = toMethod(level, LogLevel.Trace, console.trace.bind(console, logHeader));
		this.debug = toMethod(level, LogLevel.Debug, console.debug.bind(console, logHeader));
		this.log = toMethod(level, LogLevel.Log, console.log.bind(console, logHeader));
		this.info = toMethod(level, LogLevel.Information, console.info.bind(console, logHeader));
		this.warn = toMethod(level, LogLevel.Warning, console.warn.bind(console, logHeader));
		this.error = toMethod(level, LogLevel.Error, console.error.bind(console, logHeader));
	}

	//#region property

	//#endregion

	//#region function
	//#endregion

	//#region Logger

	public get level(): LogLevel {
		return this.options.clientLevel;
	}

	trace: LogMethod;
	debug: LogMethod;
	log: LogMethod;
	info: LogMethod;
	warn: LogMethod;
	error: LogMethod;

	//#endregion
}
