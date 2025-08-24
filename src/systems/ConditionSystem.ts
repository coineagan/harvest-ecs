// applies/updates/removes conditions (sleep, poison, etc.).

import { EventBus } from '../core/EventBus'
import conditions from '../../data/conditions.json'
import { ConditionComponent } from '../components/ConditionComponent'

export class ConditionSystem {
	constructor(private bus: EventBus) {}

	applyCondition(entityId: number, conditionId: string) {
		const def = conditions[conditionId]
		if (!def) return

		this.bus.emit('entityAppliedCondition', { entityId, conditionId })

		// Save to component (pseudo-code)
		const comp = this.getConditionComp(entityId)
		comp.conditions.set(conditionId, { id: conditionId })

		if (def.onApply) {
			def.onApply.forEach((step) => this.executeAction(step, entityId))
		}
	}

	removeCondition(entityId: number, conditionId: string) {
		const def = conditions[conditionId]
		if (!def) return

		this.bus.emit('entityRemovedCondition', { entityId, conditionId })

		// Remove from component
		const comp = this.getConditionComp(entityId)
		comp.conditions.delete(conditionId)

		if (def.onRemove) {
			def.onRemove.forEach((step) => this.executeAction(step, entityId))
		}
	}

	private executeAction(step: any, entityId: number) {
		if (step.action === 'log') {
			console.log(`[Entity ${entityId}] ${step.params.message}`)
		}
		if (step.action === 'emit') {
			this.bus.emit(step.params.event, { entityId })
		}
	}

	private getConditionComp(entityId: number): ConditionComponent {
		// stub: you'd pull from ECS registry
		return new ConditionComponent()
	}
}
