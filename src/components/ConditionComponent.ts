// applied conditions (poisoned, asleep).

export interface Condition {
	id: string
	stacks?: number
}

export class ConditionComponent {
	conditions: Map<string, Condition> = new Map()
}
