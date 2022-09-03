const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const url = require('url')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
         electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

let mainWindow
let newProductWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({})
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true,

    }))

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.on('closed', () => {
        app.quit()
    })
})

function createNewProduct() {
    newProductWindow = new BrowserWindow({
        width: 400,
        height: 330,
        title: 'New Product'
    });
    //newProductWindow.setMenu(null)
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true,

    }))

    newProductWindow.on('closed', () => {
        newProductWindow = null
    })
}

ipcMain.on('product:new', (e, newProduct) => { 
    mainWindow.webContents.send('product:new', newProduct)
    newProductWindow.close()
})

const menu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Product',
                accelerator: 'Ctrl+N',
                click() {
                    createNewProduct()
                }
            },
            {
                label: 'Remove All',
                click() {
                    mainWindow.webContents.send('products:remove-all')
                }
            },
            {
                label: 'Exit',
                accelerator: process.platform === 'darwin' ? 'command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    }

]

if (process.platform === 'darwin') {
    menu.unshift({
        label: app.getName()
    })
}

if (process.env.NODE_ENV !== 'production') {
    menu.push({
        label: 'DevTools',
        submenu: [ 
            {
                label: 'Show/Hide DevTools',
                accelerator: 'Ctrl+D',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
