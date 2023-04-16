export type IconName
	=
	"timeline-group"
	|
	"timeline-task"
	;

export type IconPosition
	=
	"before"
	|
	"after"
	;

export abstract class Icon {

	public static getClassNames(name: IconName, position: IconPosition): ReadonlyArray<string> {
		return [
			"icon",
			name,
			position,
		];
	}

	public static getClassName(name: IconName, position: IconPosition): string {
		return this.getClassNames(name, position).join(" ");
	}
}
