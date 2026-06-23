const { ipcRenderer } = require('electron');

window.electronAPI = {
  onTaskComplete: (callback) => ipcRenderer.on('task-complete', callback),
  onSetState: (callback) => ipcRenderer.on('set-state', callback),
  sendStateChange: (state) => ipcRenderer.send('duck-state-change', state),
  sendQuack: () => ipcRenderer.send('duck-quack')
};
