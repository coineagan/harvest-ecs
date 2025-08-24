import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
	ping: () => ipcRenderer.invoke('ping'),
	platform: process.platform,
})
