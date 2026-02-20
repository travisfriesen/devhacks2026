import { app, Menu, BrowserWindow } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 750,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
        },
    });

    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [{ role: "quit" }],
        },
        {
            label: "View",
            submenu: [
                {
                    label: "Decks",
                    accelerator: "CmdOrCtrl+1",
                    click: () => {
                        mainWindow.webContents.send("set-nav-view", "decks");
                    },
                },
                {
                    label: "Stats",
                    accelerator: "CmdOrCtrl+2",
                    click: () => {
                        mainWindow.webContents.send("set-nav-view", "stats");
                    },
                },
                {
                    label: "Settings",
                    accelerator: "CmdOrCtrl+3",
                    click: () => {
                        mainWindow.webContents.send("set-nav-view", "settings");
                    },
                },
                { type: "separator" },
                { role: "reload" },
                { role: "forceReload" },
                { role: "toggleDevTools" },
            ],
        },
        {
            label: "File",
            submenu: [
                {
                    label: "Open Deck...",
                    accelerator: "CmdOrCtrl+O",
                    click: () =>
                        mainWindow.webContents.send("open-file-dialog"),
                },
            ],
        },
    ]);

    Menu.setApplicationMenu(menu);

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
            ),
        );
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
