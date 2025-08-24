export class Entity {
	private entities = new Map<number, Map<string, any>>()
	private nextId = 1

	createEntity(components: Record<string, any>) {
		const id = this.nextId++
		this.entities.set(id, new Map(Object.entries(components)))
		return id
	}

	getComponent<T>(id: number, name: string): T | undefined {
		return this.entities.get(id)?.get(name)
	}

	getEntitiesWith(...names: string[]) {
		return [...this.entities.entries()].filter(([_, comps]) => names.every((n) => comps.has(n)))
	}
}
