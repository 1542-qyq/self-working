const { app, BrowserWindow, Menu, Tray, nativeImage, shell } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

function createWindow(){
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    title: '喵喵编辑部 · 猫咪生活报',
    icon: path.join(__dirname, '../assets/avatar.jpg'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../workbench-desktop.html'));

  // 打开 DevTools 便于调试（生产环境可注释）
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  createTray();
}

function createTray(){
  const iconPath = path.join(__dirname, '../assets/avatar.jpg');
  try {
    const img = nativeImage.createFromPath(iconPath);
    tray = new Tray(img.resize({ width: 16, height: 16 }));
  } catch(e) {
    tray = new Tray(nativeImage.createEmpty());
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示主窗口', click: () => { if(mainWindow){ mainWindow.show(); } } },
    { label: '隐藏到托盘', click: () => { if(mainWindow){ mainWindow.hide(); } } },
    { type: 'separator' },
    { label: '退出', click: () => { app.quit(); } }
  ]);

  tray.setToolTip('喵喵编辑部 · 猫咪生活报');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if(mainWindow){
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
}

// 创建原生菜单
function createMenu(){
  const template = [
    {
      label: '文件',
      submenu: [
        { label: '刷新', accelerator: 'CmdOrCtrl+R', click: () => mainWindow?.reload() },
        { label: '导出数据', click: () => mainWindow?.webContents.send('action-export') },
        { label: '导入数据', click: () => mainWindow?.webContents.send('action-import') },
        { type: 'separator' },
        { label: '退出', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: '视图',
      submenu: [
        { label: '全屏', accelerator: 'F11', click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()) },
        { label: '重置缩放', click: () => mainWindow?.webContents.setZoomLevel(0) }
      ]
    },
    {
      label: '帮助',
      submenu: [
        { label: '关于', click: () => {
          const { dialog } = require('electron');
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: '关于',
            message: '喵喵编辑部 · 猫咪生活报 v1.0\n个人桌面工作台',
            buttons: ['确定']
          });
        }}
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0){
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('before-quit', () => {
  if(tray){ tray.destroy(); }
});