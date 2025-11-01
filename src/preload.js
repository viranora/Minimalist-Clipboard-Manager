const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Main'den gelen 'clipboard-updated' olayını dinle
  onClipboardUpdate: (callback) => 
    ipcRenderer.on('clipboard-updated', (event, value) => callback(value)),
  
  // Main'e 'write-to-clipboard' isteği gönder
  writeToClipboard: (text) => 
    ipcRenderer.invoke('write-to-clipboard', text)
});

