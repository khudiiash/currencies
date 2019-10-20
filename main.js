const { app, BrowserWindow,Menu,MenuItem,Tray} = require('electron');
const shell = require('electron').shell;
const ipc = require('electron').ipcMain;
const { webContents } = require('electron')
var mainCurrency = 'UAH'

let win;

let tray = null
var menu;

function createWindow () {

  win = new BrowserWindow({
    icon: 'assets/images/tray.png',
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight:500,
    webPreferences: {
    nodeIntegration: true
    }
  })
  win.setAspectRatio(16/9[600,400])
  
  
  win.loadFile('src/index.html')

  // win.webContents.openDevTools()

  var tray = new Tray('src/assets/images/tray.png')

  var contextMenu = Menu.buildFromTemplate([
      {
          label: 'Show App', click: function () {
              win.show()
          }
      },
      {
          label: 'Quit', click: function () {
              app.isQuiting = true
              app.quit()
          }
      }
  ])
  tray.setToolTip('Currency') 
  tray.setContextMenu(contextMenu)
  
  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show()
  })
  

    win.on('close', function (event) {
        win = null
    })

    win.on('minimize', function (event) {
        event.preventDefault()
        win.hide()
    })

    win.on('show', function () {
        tray.setHighlightMode('always')
    })
  
  currenciesMenu = [
    {label: 'USD', id: 'USD', type:'checkbox',click() {addCurrency('USD')}},
    {label: 'EUR', id: 'EUR', type:'checkbox',click() {addCurrency('EUR')}},
    {label: 'PLN', id: 'PLN', type:'checkbox',click() {addCurrency('PLN')}},
    {label: 'RUB', id: 'RUB', type:'checkbox',click() {addCurrency('RUB')}},
    {label: 'UAH', id: 'UAH', type:'checkbox',click() {addCurrency('UAH')}}
  ]

  menu = Menu.buildFromTemplate([{
        label: "Menu",
        submenu: [
            {label: 'Home Currency', submenu: [
                {label: 'UAH',id:'mainUAH', type: 'radio', click(){assignMainCurrency('UAH')}},
                {label: 'PLN',id:'mainPLN',  type: 'radio', click(){assignMainCurrency('PLN')}},
                {label: 'RUB',id:'mainRUB',  type: 'radio', click(){assignMainCurrency('RUB')}},
            ]},
            {label: 'Currencies', submenu: currenciesMenu},
            {role: 'reload',accelerator:'Ctrl+R'},
            {type: 'separator'},
            {label: 'Exit', click(){app.quit()}, accelerator: 'Ctrl+Q'},
        ]

        }])
        Menu.setApplicationMenu(menu);



        
}

function assignMainCurrency(main) {
  mainCurrency = main
  win.webContents.send('mainCurrency',main)
  
}

function addCurrency(currency) {
  if (currency !== mainCurrency){
    win.webContents.send('currency',currency)
  }
  


}


app.on('ready',createWindow);


//Quit the app when all windows closed 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
//USD
ipc.on('usd-update-notify-value-up', function(event,arg) {
    win.webContents.send('usdTargetPriceValUp',arg)
})
ipc.on('usd-update-notify-value-down', function(event,arg) {
  win.webContents.send('usdTargetPriceValDown',arg)
})
//EUR
ipc.on('eur-update-notify-value-up', function(event,arg) {
  win.webContents.send('eurTargetPriceValUp',arg)
})
ipc.on('eur-update-notify-value-down', function(event,arg) {
  win.webContents.send('eurTargetPriceValDown',arg)
})
//PLN
ipc.on('pln-update-notify-value-up', function(event,arg) {
  win.webContents.send('plnTargetPriceValUp',arg)
})
ipc.on('pln-update-notify-value-down', function(event,arg) {
  win.webContents.send('plnTargetPriceValDown',arg)
})
//RUB
ipc.on('rub-update-notify-value-up', function(event,arg) {
  win.webContents.send('rubTargetPriceValUp',arg)
})
ipc.on('rub-update-notify-value-down', function(event,arg) {
  win.webContents.send('rubTargetPriceValDown',arg)
})
//UAH
ipc.on('uah-update-notify-value-up', function(event,arg) {
  win.webContents.send('uahTargetPriceValUp',arg)
})
ipc.on('uah-update-notify-value-down', function(event,arg) {
  win.webContents.send('uahTargetPriceValDown',arg)
})





ipc.on('currency-on', function(event,currencies) {
  currencies.forEach(function(currency) {
    currencySwitcher = menu.getMenuItemById(currency)
    try{currencySwitcher.checked = true}catch(e){console.log(e)}
  })
  
})
ipc.on('currency-off', function(event,currencies) {
  
  currencies.forEach(function(currency) {
    currencySwitcher = menu.getMenuItemById(currency)
    try{currencySwitcher.checked = false}catch(e){console.log(e)}
})

})
var counter = 3;
ipc.on('notifyMe-currency',function(event,currency){

  function sendToAdd(){
    
    try {   
      for (let i = 0;i<=30;i++) {
        try {webContents.fromId(i).send('mainCurrencyToAdd',mainCurrency)}catch{}  
        try {webContents.fromId(i).send('notify-me-currency',currency)}catch{}
        
      }
    } catch(e){console.log(e)}

  }
  
  setTimeout(sendToAdd,500)
})
ipc.on('mainCurrency-radio', function(event,checkedMainCurrency){
  var mainCurrencyRadio = menu.getMenuItemById(`main${checkedMainCurrency}`)
  
  mainCurrencyRadio.checked = true
  mainCurrency = checkedMainCurrency

})