// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {
	ipcRenderer
} = require('electron')

const selectDirBtn = document.getElementById('select-directory')

selectDirBtn.addEventListener('click', function() {
	ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-directory', function(event, path) {
	document.getElementById('selected-file').innerHTML = `You selected: ${path}`
})
