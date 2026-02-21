// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { NavView } from "./store/useAppStore";

// AGALKSDJFA;LSDJK WHY IS THIS NOT WORKING.....THE TUTORIAL SAID IT WOULDDDDD
contextBridge.exposeInMainWorld("electronAPI", {
    onNavView: (callback: (view: NavView) => void) => {
        ipcRenderer.on("set-nav-view", (_event, view: NavView) =>
            callback(view),
        );
    },

    openFile: () => ipcRenderer.invoke("dialog:openFile"),
    saveFile: (filepath: string, content: string) =>
        ipcRenderer.invoke("file:save", filepath, content),

    removeAllListeners: (channel: string) => {
        ipcRenderer.removeAllListeners(channel);
    },
});
