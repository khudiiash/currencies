const electron = require('electron')
const remote = electron.remote;
var notifyMeCurrency = document.getElementById('notifyMe-currency')
var workingCurrency;
var mainCurrency;
var notifyValUp = document.getElementById('notifyValUp');
var notifyValDown = document.getElementById('notifyValDown');
const ipc =  electron.ipcRenderer;



ipc.on('mainCurrencyToAdd',function(event,mainCurrencyArg){
    mainCurrency = mainCurrencyArg
})
ipc.on('notify-me-currency',function(event,currency){
    console.log(currency)
    workingCurrency = currency
    notifyValUp.setAttribute('placeholder',mainCurrency.toUpperCase())
    notifyValDown.setAttribute('placeholder',mainCurrency.toUpperCase())
    notifyMeCurrency.innerHTML = currency
    
})
const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', function(event) {
    var window = remote.getCurrentWindow()
    window.close()
})


const updateBtn = document.getElementById('updateBtn');

updateBtn.addEventListener('click', function() {
    var channelUp = workingCurrency.toLowerCase()+'-update-notify-value-up'
    var channelDown= workingCurrency.toLowerCase()+'-update-notify-value-down'

    if (notifyValUp.value > 0 && !notifyValDown.value) {
        ipc.send(channelUp,notifyValUp.value);
    }
    else if (notifyValDown.value > 0 && !notifyValUp.value) {
        ipc.send(channelDown,notifyValDown.value);
    }
    else {
        ipc.send(channelUp,notifyValUp.value);
        ipc.send(channelDown,notifyValDown.value);
    }
    
    var window = remote.getCurrentWindow();
    window.close();
})





