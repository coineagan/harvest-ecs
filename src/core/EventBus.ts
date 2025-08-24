type Callback = (payload: any) => void

export class EventBus {
	private listeners: Map<string, Callback[]> = new Map()

	on(event: string, cb: Callback) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, [])
		}
		this.listeners.get(event)!.push(cb)
	}

	emit(event: string, payload: any) {
		if (!this.listeners.has(event)) return
		this.listeners.get(event)!.forEach((cb) => cb(payload))
	}
}
