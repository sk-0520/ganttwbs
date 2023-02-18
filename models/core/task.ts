import { TimeSpan } from './time';

/**
 * 非同期待機
 *
 * @param timeSpan 停止時間
 */
export function sleepAsync(timeSpan: TimeSpan): Promise<void> {
	return new Promise((resolve, _) => {
		setTimeout(() => {
			resolve()
		}, timeSpan.totalMilliseconds);
	});
}
