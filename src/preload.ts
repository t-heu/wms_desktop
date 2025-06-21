// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

const validSendChannels = ["download-all-pdfs", "download-single-pdf", "cancel-pdf"];
const validReceiveChannels = ["pdf-cancelled", "pdf-completed"];

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: string, data?: unknown) => {
      if (validSendChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel: string, callback: (...args: any[]) => void) => {
      if (validReceiveChannels.includes(channel)) {
        ipcRenderer.on(channel, callback);
      }
    },
    removeListener: (channel: string, callback: (...args: any[]) => void) => {
      if (validReceiveChannels.includes(channel)) {
        ipcRenderer.removeListener(channel, callback);
      }
    }
  }
});
