import * as ISO8601 from './ISO8601';

export type VersionId = string;

export interface VersionItem {
	id: VersionId;
	timestamp: ISO8601.DateTime;
}
