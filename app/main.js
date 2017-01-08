import 'babel-polyfill'; // generators
const {
    app,
    ipcMain,
    dialog,
    BrowserWindow
} = require('electron')
    // Module to control application life.
const {
    readdir,
    stat
} = require('fs')
    // const app = electron.app
    // Module to create native browser window.
    // const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const isVideo = require('is-video')
const async = require('async')

const readdirRecur = require('./utils/RecurFile')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1080,
        height: 670,
        resizable: false
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('open-file-dialog', function(event) {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function(dir) {
        if (dir) {
            //打开文件夹发送通知
            event.sender.send('selected-directory', dir);
        }
    })
})

ipcMain.on('readdir', function(event, path) {
	"use strict";
	readdirRecur(path, event, function(err, files) {
		event.sender.send('allfiles-get', files);
	})
})

function getVideos(_path, videoList, event) {
    readdir(_path, function(err, fileList) {
        async.each(fileList,
            function(file, cb) {
                let filePath = path.join(_path, file);
                stat(filePath, function(err, stats) {
                    if (isVideo(file)) {
                        let video = {
                            "_id": filePath,
                            "name": file,
                            "size": stats.size,
                            // "path": filePath,
                            "times": 0
                        };
                        videoList.push(video);
                        event.sender.send("onefile-get", video)
                    } else if (stats.isDirectory()) {
                        // event.sender.send('onefile-get', filePath)
                        getVideos(filePath, videoList, event)
                    }
                })
            },
            function(err) {
              event.sender.send("allfile-get")
            })
    })
}




ipcMain.on('read-files', function(event, dir) {
    readdir(dir[0], function(err, files) {
        if (err) throw err;
        event.sender.send('finish-read', files)
    })
})
