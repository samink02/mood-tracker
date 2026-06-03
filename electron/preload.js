/**
 * Electron Preload Script
 *
 * Runs in a sandboxed context before the web page loads.
 * Exposes a limited API to the renderer process via contextBridge.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  /** Get the application version */
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  /** Get the current platform (win32, darwin, linux) */
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  /** Whether the app is running in Electron */
  isElectron: true,
});
