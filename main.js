const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let duckState = 'idle';

function createWindow() {
  console.log('[main] Creating window...');
  mainWindow = new BrowserWindow({
    width: 120,
    height: 120,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  console.log('[main] Window loaded, opening DevTools...');
  
  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();
  
  mainWindow.setPosition(
    Math.floor((require('electron').screen.getPrimaryDisplay().workAreaSize.width - 120) / 2),
    require('electron').screen.getPrimaryDisplay().workAreaSize.height - 160
  );
  console.log('[main] Window positioned, ready.');

  // Make window click-through for right-click context menu
  mainWindow.setIgnoreMouseEvents(false);
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets/icon.png'));
  tray = new Tray(icon.resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'DuckDuckTimee',
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Show/Hide Duck',
      click: () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
      }
    },
    {
      label: 'State: Idle',
      id: 'state-label',
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ]);

  tray.setToolTip('DuckDuckTimee - Your AI CLI Companion');
  tray.setContextMenu(contextMenu);
  // Store menu reference for later updates
  tray._menu = contextMenu;
}

// IPC handlers for duck state
ipcMain.on('duck-state-change', (event, state) => {
  duckState = state;
  if (tray && tray._menu) {
    const stateItem = tray._menu.getMenuItemById('state-label');
    if (stateItem) stateItem.label = `State: ${state}`;
  }
});

ipcMain.on('duck-quack', () => {
  // Play quack sound if available
  console.log('QUACK QUACK!');
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Global shortcut to toggle duck visibility
app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Shift+D', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
});