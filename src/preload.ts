// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: any, data: any) => ipcRenderer.send(channel, data),
    on: (channel: any, callback: any) => ipcRenderer.on(channel, callback)
  }
});
