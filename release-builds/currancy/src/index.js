const electron = require('electron');
const path = require('path');
const Store = require('electron-store');

const request = require('request');
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require('axios');


const ipc = electron.ipcRenderer;


var sign;
var signs = {
    usd: '$',
    eur: '€',
    uah: '₴',
    pln: 'zł',
    rub: '₽',
}





var schema = {
    mainCurrency: {type: 'string', default: 'UAH'},
    currencies: {default: []},

    menu: {
        mainCurrency: {
            uah: {default: true},
            pln: {default: false},
            rub: {default: false},
                },
          currencies: {
              usd: {default: false},
              eur: {default: false},
              uah: {default: false},
              pln: {default: false},
              rub: {default: false},
          }
    },
    usdUAH: {
        type: "number",
        default: 0
    },
    eurUAH: {
        type: "number",
        default: 0
    },
    plnUAH: {
        type: "number",
        default: 0
    },
    rubUAH: {
        type: "number",
        default: 0
    },

    usdUp: {
        type: 'number',
        default: 0,
    },
    usdDown: {
        type: 'number',
        default: 0,
    },

    eurUp: {
        type: 'number',
        default: 0,
    },
    eurDown: {
        type: 'number',
        default: 0,
    },
    plnUp: {
        type: 'number',
        default: 0,
    },
    plnDown: {
        type: 'number',
        default: 0,
    },
    rubUp: {
        type: 'number',
        default: 0,
    },
    rubDown: {
        type: 'number',
        default: 0,
    },
    uahUp: {
        type: 'number',
        default: 0,
    },
    uahDown: {
        type: 'number',
        default: 0,
    },
}

var usdBtn = false;
var eurBtn = false;
var plnBtn = false;
var rubBtn = false;
var uahBtn = false;

const store = new Store({schema});
var usdUAH = store.get('usdUAH')
var eurUAH = store.get('eurUAH')
var plnUAH = store.get('plnUAH')
var rubUAH = store.get('rubUAH')


request('https://minfin.com.ua/currency/', function(err, res, body) {  

             arrayOfPage = body.split("var curWgtJSON = ")
             newString = arrayOfPage[1].split("</script>")
             string = newString[0]
             string = string.substring(0,string.length-4)
                data = JSON.parse(string)
                usdUAH = data.USD.buy.nbu
                store.set('usdUAH',Number(usdUAH))
                eurUAH = data.EUR.buy.nbu
                store.set('eurUAH',Number(eurUAH))
                plnUAH = data.PLN.buy.nbu
                store.set('plnUAH',Number(plnUAH))
                rubUAH = data.RUB.buy.nbu  
                store.set('rubUAH',Number(rubUAH))
            
            });
var mainCurrency = store.get('mainCurrency');
ipc.send('mainCurrency-radio',mainCurrency)
var mainSign;

if(mainCurrency==='UAH') {mainSign = signs.uah}
if(mainCurrency==='PLN') {mainSign = signs.pln}
if(mainCurrency==='RUB') {mainSign = signs.rub}

var currencies = store.get('currencies');
var mainArea = document.getElementById('currencies');

var convertedSum = document.getElementById('converted-h2')
var leftInput = document.getElementById('left-input')
var rightInput = document.getElementById('right-input')
var convertFrom ='USD', convertInto = mainCurrency;


var usdTargetPriceUp ,usdTargetPriceDown,eurTargetPriceUp ,eurTargetPriceDown,plnTargetPriceUp ,plnTargetPriceDown,rubTargetPriceUp ,rubTargetPriceDown,uahTargetPriceUp,uahTargetPriceDown











ipc.send('currency-on',currencies)

// var currencies = [];
// store.set('currencies',currencies)

var displayedNodes = []

var usdNotifiedUp = false;
var usdNotifiedDown = false;

var eurNotifiedUp = false;
var eurNotifiedDown = false;

var plnNotifiedUp = false;
var plnNotifiedDown = false;

var rubNotifiedUp = false;
var rubNotifiedDown = false;

var uahNotifiedUp = false;
var uahNotifiedDown = false;


var displayedCurrencies = [];
var displayedRows = [];

const notification = {}

function createNode(currency,cryptos) {
    var row = document.createElement('div');
        row.className = 'row';
        //
        var imgPath = path.join('assets\\images\\',currency.toLowerCase()+'.svg')
        var priceContainer = document.createElement('div');
        priceContainer.className = 'price-container';
        
        
        var subtext = document.createElement('p'); // $USD
        subtext.className = 'subtext parallax'; // assigning class to the $USD label
        subtext.setAttribute('data-speed',2)
        var curr = document.createTextNode(currency); // creating text node with the label
        subtext.appendChild(curr); // adding the text node to the subtext element

        var priceLabel = document.createElement('h1');
        priceLabel.className = 'price parallax';
        priceLabel.setAttribute('id',currency.toLowerCase()+'-price'); // setting ID
        priceLabel.setAttribute('data-speed',4)
        var priceValue = document.createTextNode(mainSign+' '+cryptos); // '$ 25.02'
        priceLabel.appendChild(priceValue);

        priceContainer.appendChild(subtext);
        priceContainer.appendChild(priceLabel);
        priceContainer.style.background = 'linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.6)), url("assets/images/'+currency.toLowerCase()+'.jpg")'
        priceContainer.style.backgroundSize = 'cover'
        

    
        // Arrows Container
        var goalContainer = document.createElement('div');
        goalContainer.className = 'goal-container';
        
        // UP Row
        var rowUp = document.createElement('div');
        rowUp.className = 'row2';
        var imgUp = document.createElement('img');
        imgUp.setAttribute('src','assets/images/up.svg');
        imgUp.className='arrow';
        imgUp.setAttribute('id',currency.toLowerCase()+'-up');
        spanUp = document.createElement('span');
        spanUp.setAttribute('id',currency.toLowerCase()+'-targetPriceUp');
        if (currency === 'USD'){if (store.get('usdUp')){spanUp.innerHTML = mainSign+store.get('usdUp')}}
        if (currency === 'EUR'){if (store.get('eurUp')){spanUp.innerHTML = mainSign+store.get('eurUp')}}
        if (currency === 'PLN'){if (store.get('plnUp')){spanUp.innerHTML = mainSign+store.get('plnUp')}}
        if (currency === 'RUB'){if (store.get('rubUp')){spanUp.innerHTML = mainSign+store.get('rubUp')}}
        if (currency === 'UAH'){if (store.get('uahUp')){spanUp.innerHTML = mainSign+store.get('uahUp')}}
        spanUp.setAttribute('class','targetPrice')
        rowUp.appendChild(imgUp,spanUp);
        rowUp.appendChild(spanUp);
        //DOWN Row
        var rowDown = document.createElement('div');
        rowDown.className = 'row2';
        var imgDown = document.createElement('img');
        imgDown.setAttribute('src','assets/images/down.svg');
        imgDown.className='arrow'; 
        imgDown.setAttribute('id',currency+'-down');
        spanDown = document.createElement('span');
        spanDown.setAttribute('id',currency.toLowerCase()+'-targetPriceDown');
        spanDown.setAttribute('class','targetPrice')
        if (currency === 'USD'){if (store.get('usdDown')){spanDown.innerHTML = mainSign+store.get('usdDown')}}
        if (currency === 'EUR'){if (store.get('eurDown')){spanDown.innerHTML = mainSign+store.get('eurDown')}}
        if (currency === 'PLN'){if (store.get('plnDown')){spanDown.innerHTML = mainSign+store.get('plnDown')}}
        if (currency === 'RUB'){if (store.get('rubDown')){spanDown.innerHTML = mainSign+store.get('rubDown')}}
        if (currency === 'UAH'){if (store.get('uahDown')){spanDown.innerHTML = mainSign+store.get('uahDown')}}
        rowDown.appendChild(imgDown);
        rowDown.appendChild(spanDown);

        goalContainer.appendChild(rowUp);
        goalContainer.appendChild(rowDown);

        // Notification Button

        rightContainer = document.createElement('div');
        rightContainer.className = 'right-container';

        notificationBtn = document.createElement('button');
        notificationBtn.setAttribute('id',currency.toLowerCase()+'-notifyBtn')
        notifyMeButton = document.createTextNode('Оповестить Меня...');
        notificationBtn.appendChild(notifyMeButton);

        rightContainer.appendChild(notificationBtn);
        
        row.appendChild(priceContainer);
        row.appendChild(goalContainer);
        row.appendChild(rightContainer);
        row.setAttribute('id',currency.toLowerCase())
        
        
        return row
}

function getCryptos(currency,mainCurrency,res) {

    var cryptos;
    
        
        if (mainCurrency === 'UAH') {
            mainSign = signs.uah;
            if (currency === 'USD') {cryptos = Number(usdUAH).toFixed(2), sign = signs.usd}
            if (currency === 'EUR') {cryptos = Number(eurUAH).toFixed(2), sign = signs.eur}
            if (currency === 'PLN') {cryptos =  Number(plnUAH).toFixed(2),
            sign = signs.pln }
            if (currency === 'RUB') {cryptos = Number(rubUAH).toFixed(2), sign = signs.rub }}
            
        
        if (mainCurrency === 'PLN') {
            mainSign = signs.pln;
            if (currency === 'USD') {cryptos = res.data.USD.PLN, sign = signs.usd }
            if (currency === 'EUR') {cryptos = res.data.EUR.PLN, sign = signs.eur }
            if (currency === 'UAH') {cryptos = res.data.UAH.PLN, sign = signs.pln }
            if (currency === 'RUB') {cryptos = res.data.RUB.PLN, sign = signs.rub }}

        if (mainCurrency === 'RUB') {
            mainSign = signs.rub;
            if (currency === 'USD') {cryptos = res.data.USD.RUB, sign = signs.usd }
            if (currency === 'EUR') {cryptos = res.data.EUR.RUB, sign = signs.eur }
            if (currency === 'PLN') {cryptos = (1/res.data.RUB.PLN).toFixed(2), sign = signs.pln }
            if (currency === 'UAH') {cryptos = res.data.UAH.RUB, sign = signs.uah }}
        
        if (mainCurrency === 'USD') {
            mainSign = signs.usd;
            if (currency === 'RUB') {cryptos = res.data.RUB.USD, sign = signs.rub }
            if (currency === 'EUR') {cryptos = res.data.EUR.USD, sign = signs.eur }
            if (currency === 'PLN') {cryptos = (1/res.data.USD.PLN).toFixed(2), sign = signs.pln }
            if (currency === 'UAH') {cryptos = res.data.UAH.USD, sign = signs.uah }}
        
        if (mainCurrency === 'EUR') {
            mainSign = signs.eur;
            if (currency === 'RUB') {cryptos = res.data.RUB.EUR, sign = signs.rub }
            if (currency === 'USD') {cryptos = res.data.USD.EUR, sign = signs.usd }
            if (currency === 'PLN') {cryptos = (1/res.data.EUR.PLN).toFixed(2), sign = signs.pln }
            if (currency === 'UAH') {cryptos = res.data.UAH.EUR, sign = signs.uah }}
            
       
        cryptos = Number(cryptos).toFixed(2)
        return cryptos
    
}

function getCurrency(currency,mainCurrency){
    var link;


    
    if (currency !== 'PLN') {
         link = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms='+currency+'&tsyms='+mainCurrency
    }
    else {
        link = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms='+mainCurrency+'&tsyms='+currency
    }
    axios.get(link)
    .then(res => {
        var cryptos = getCryptos(currency,mainCurrency,res)
        var row = createNode(currency,cryptos)

        displayedNodes = []
        mainArea.childNodes.forEach(function(child){
            if (child.id != undefined) {
                displayedNodes.push(child.id.toUpperCase())
                }
        })

        if (!displayedNodes.includes(row.id.toUpperCase())) {
            mainArea.appendChild(row);
        }
        else {
            mainArea.childNodes.forEach(function(childRow) {   
                
                if (currency.toLowerCase() === childRow.id) {
                   
                    var priceLabel = getPriceNodeByID(currency)[0]
                    newValue = document.createTextNode(mainSign+' '+cryptos)
                    priceLabel.replaceChild(newValue,priceLabel.childNodes[0])
                    }
                })
            }
        displayedNodes = currencies
  

        var offCurrencies = ['USD','EUR','PLN','RUB','UAH']
        var onCurrencies = []
        mainArea.childNodes.forEach(function(child){
            if (child.id !== undefined) {
                index = offCurrencies.indexOf(child.id.toUpperCase())
                offCurrencies.splice(index,1)
                onCurrencies.push(child.id.toUpperCase())
                
            }
       
       })
     
       ipc.send('currency-on',onCurrencies)
       ipc.send('currency-off',offCurrencies)


        var buttons = getButtons();
        buttons.forEach(function(button){
            if (button.id.includes('usd') && !usdBtn){activeButton(button),usdBtn = true}
            if (button.id.includes('eur') && !eurBtn){activeButton(button),eurBtn = true}
            if (button.id.includes('pln') && !plnBtn){activeButton(button),plnBtn = true}
            if (button.id.includes('rub') && !rubBtn){activeButton(button),rubBtn = true}
            if (button.id.includes('uah') && !uahBtn){activeButton(button),uahBtn = true}
            });
            
        if(currency==='USD'){usdTargetPriceUp = getPriceUp('USD')[0]
        usdTargetPriceDown = getPriceDown('USD')[0]
        notifyMe(currency,cryptos,usdTargetPriceUp,usdTargetPriceDown)
            usdTargetPriceUp.addEventListener('click',function(){
                usdTargetPriceUp.innerHTML = ''
                usdNotifiedUp = false
                store.set('usdUp',0)

            })
            usdTargetPriceDown.addEventListener('click',function(){
                usdTargetPriceDown.innerHTML = ''
                usdNotifiedUp = false
                store.set('usdDown',0)
            })}
    
        if(currency==='EUR'){eurTargetPriceUp = getPriceUp('EUR')[0]
        eurTargetPriceDown = getPriceDown('EUR')[0]
        notifyMe(currency,cryptos,eurTargetPriceUp,eurTargetPriceDown)
            eurTargetPriceUp.addEventListener('click',function(){
                eurTargetPriceUp.innerHTML = ''
                eurNotifiedUp = false
                store.set('eurUp',0)
            })
            eurTargetPriceDown.addEventListener('click',function(){
                eurTargetPriceDown.innerHTML = ''
                eurNotifiedUp = false
                store.set('eurDown',0)
            })}

        if(currency==='PLN'){plnTargetPriceUp = getPriceUp('PLN')[0]
        plnTargetPriceDown = getPriceDown('PLN')[0]
        notifyMe(currency,cryptos,plnTargetPriceUp,plnTargetPriceDown)
            plnTargetPriceUp.addEventListener('click',function(){
                plnTargetPriceUp.innerHTML = ''
                plnNotifiedUp = false
                store.set('plnUp',0)
            })
            plnTargetPriceDown.addEventListener('click',function(){
                plnTargetPriceDown.innerHTML = ''
                plnNotifiedUp = false
                store.set('plnDown',0)
        })}
        
        if(currency==='RUB'){rubTargetPriceUp = getPriceUp('RUB')[0]
        rubTargetPriceDown = getPriceDown('RUB')[0]
        notifyMe(currency,cryptos,rubTargetPriceUp,rubTargetPriceDown)
            rubTargetPriceUp.addEventListener('click',function(){
                rubTargetPriceUp.innerHTML = ''
                rubNotifiedUp = false
                store.set('rubUp',0)
            })
            rubTargetPriceDown.addEventListener('click',function(){
                rubTargetPriceDown.innerHTML = ''
                rubNotifiedUp = false
                store.set('rubDown',0)
        })}
        if(currency==='UAH'){uahTargetPriceUp = getPriceUp('UAH')[0]
        uahTargetPriceDown = getPriceDown('UAH')[0]
        notifyMe(currency,cryptos,uahTargetPriceUp,uahTargetPriceDown)
            uahTargetPriceUp.addEventListener('click',function(){
                uahTargetPriceUp.innerHTML = ''
                uahNotifiedUp = false
                store.set('uahUp',0)
            })
            uahTargetPriceDown.addEventListener('click',function(){
                uahTargetPriceDown.innerHTML = ''
                uahNotifiedUp = false
                store.set('uahDown',0)
        })}

        
        

        
                         
})};


function activeButton(button) {
    button.addEventListener('click',function(){
       
       
        const modulePath = path.join('file://',__dirname,'add.html')
        let win = new BrowserWindow({frame: false, transparent: false, alwaysOnTop: true,width: 320,height:200,webPreferences: {nodeIntegration: true}})
        win.on('close', function(){win=null})
        // win.openDevTools()
        win.loadURL(modulePath)
        win.show()
        ipc.send('notifyMe-currency',button.id.substring(0,3).toUpperCase())

    })
}


const notifyMe = function(currency,cryptos,targetPriceUp,targetPriceDown) {

    if (targetPriceUp.innerText !== undefined) {targetPriceUp = Number(targetPriceUp.innerText.substring(1,targetPriceUp.length))}
    
    if(targetPriceDown.innerText !== undefined) {targetPriceDown= Number(targetPriceDown.innerText.substring(1,targetPriceUp.length))}
    
    if (targetPriceUp != '' && cryptos>targetPriceUp) {
        notification.title = currency+' превысил '+mainSign+targetPriceUp
        notification.body = 'На данный момент, '+currency+' равняется '+cryptos
        notification.icon = path.join(__dirname,'assets/images/'+currency.toLowerCase()+'.png')
        
        
        if(currency==='USD'&&!usdNotifiedUp){usdNotifiedUp = true
            const myNotification = new window.Notification(notification.title,notification)}
        if(currency==='EUR'&&!eurNotifiedUp){eurNotifiedUp = true
            const myNotification = new window.Notification(notification.title,notification)}
        if(currency==='PLN'&&!plnNotifiedUp){plnNotifiedUp = true
            const myNotification = new window.Notification(notification.title,notification)}
        if(currency==='RUB'&&!eurNotifiedUp){rubNotifiedUp = true
            const myNotification = new window.Notification(notification.title,notification)}
        if(currency==='UAH'&&!uahNotifiedUp){uahNotifiedUp = true
            const myNotification = new window.Notification(notification.title,notification)}
        }
   
    if (targetPriceDown != '' && cryptos<targetPriceDown) {
        notification.title = currency+' опустился ниже '+mainSign+targetPriceDown
        notification.body = 'На данный момент, '+currency+' равняется '+cryptos
        notification.icon = path.join(__dirname,'assets/images/'+currency.toLowerCase()+'.png')
        const myNotification = new window.Notification(notification.title,notification)
        if(currency==='USD'){usdNotifiedDown = true}
        if(currency==='EUR'){eurNotifiedDown = true}
        if(currency==='PLN'){plnNotifiedDown = true}
        if(currency==='RUB'){rubNotifiedDown = true}
        if(currency==='UAH'){uahNotifiedDown = true}
        }
        
}


function mainLoop () {
   currencies.forEach(function(currency){
       getCurrency(currency,mainCurrency)
   })
    
}




    
mainLoop();
setInterval(mainLoop, 2000);


function clearConverter(){
    
    leftInput.value =''
    rightInput.value =''
    convertedSum.innerHTML = "<img id='exchange' width=45 height=25 class='exchange-img' src='assets/images/exchange.svg' alt=''>"

    
    
}

function maxLengthCheck(input){ 
    if (input.value.length>input.maxLength){
        input.value = input.value.slice(0,input.maxLength)
    }
}

function activateConverterCurrencies(){
    var leftCurrencies = document.getElementsByClassName('left currencies')
    var rightCurrencies = document.getElementsByClassName('right currencies')
    for (let element of leftCurrencies){
        element.childNodes.forEach(function(a){
            if (a.innerText === convertFrom){a.style.opacity = '1'}
            a.addEventListener('click',function(){
                
                a.style.opacity = '1'
                leftInput.focus()
                element.childNodes.forEach(function(curr){
                    if(curr.innerText!==a.innerText){
                        curr.style.opacity = '0.3'}})
                convertFrom = a.innerText
                leftInput.setAttribute('placeholder',a.innerText)
                if (!leftInput.value && rightInput.value){convertInto = a.innerText}
                if (leftInput.value){
                    convertCurrencies(leftInput)
                } else {
                    for(let a of rightCurrencies){
                        for(let currency of a.childNodes){
                            if(currency.style.opacity==='1'){convertInto=currency.innerText}
                            convertCurrencies(rightInput)}}
                        }
        })})
    }
    for (let element of rightCurrencies){
        element.childNodes.forEach(function(a){
            if (a.innerText === mainCurrency){a.style.opacity = '1'}
            a.addEventListener('click',function(){
                a.style.opacity = '1'
                element.childNodes.forEach(function(curr){
                    if(curr.innerText!==a.innerText){
                        curr.style.opacity = '0.3'}})
                convertInto= a.innerText
                rightInput.setAttribute('placeholder',a.innerText)
                if (leftInput.value){
                    convertCurrencies(leftInput)
                } else {
                    for(let a of leftCurrencies){
                        for(let currency of a.childNodes){
                            if(currency.style.opacity==='1'){convertInto=currency.innerText}
                            convertCurrencies(rightInput)}}
                        }
                    
                   
                
        })})
    } 
}

activateConverterCurrencies()




function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function convertCurrencies(from){
    var link;
    var into = convertInto;
    var convertedSign;
    fromCurrency = from.placeholder
    // console.log(from.id,leftInput.value)
    if (from.id === 'right-input' && leftInput.value){clearConverter(),convertInto = [convertFrom, convertFrom = convertInto][0],into = convertInto,fromCurrency = convertFrom} 
    if (from.id === 'left-input' && rightInput.value){clearConverter(),convertInto = [convertFrom, convertFrom = convertInto][0],into = convertInto,fromCurrency = convertFrom}
    
    
    if (fromCurrency !== into) {
    
        if(leftInput.value && !rightInput.value) {
            // console.log("left")
            // console.log(fromCurrency,into)

        
       

        if (fromCurrency !== 'PLN') {link = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms='+fromCurrency+'&tsyms='+into}
        else {link = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms='+into+'&tsyms='+fromCurrency}
            axios.get(link)
            .then(res => {
                var cryptos;
                cryptos = getCryptos(fromCurrency,into,res)
            if (into==='USD'){convertedSign=signs.usd}
            if (into==='EUR'){convertedSign=signs.eur}
            if (into==='PLN'){convertedSign=signs.pln}
            if (into==='RUB'){convertedSign=signs.rub}
            if (into==='UAH'){convertedSign=signs.uah}

    
            convertedSum.innerText= convertedSign+' '+numberWithCommas(Math.floor((from.value*cryptos)*100 /100)) 
        })}

    if (rightInput.value && !leftInput.value){
        var link;

        // console.log("right")
        // console.log(fromCurrency,into)
    
        if (fromCurrency !== 'PLN') {link = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms='+fromCurrency+'&tsyms='+into}
        else {link = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms='+into+'&tsyms='+fromCurrency}
            axios.get(link)
            .then(res => {
        
                const cryptos = getCryptos(fromCurrency,into,res)
            if (into==='USD'){convertedSign=signs.usd}
            if (into==='EUR'){convertedSign=signs.eur}
            if (into==='PLN'){convertedSign=signs.pln}
            if (into==='RUB'){convertedSign=signs.rub}
            if (into==='UAH'){convertedSign=signs.uah}

        
            convertedSum.innerText= convertedSign+' '+numberWithCommas(Math.floor((from.value*cryptos)*100 /100)) 
        })}
    } else {
        // console.log('Equal')
        if (into==='USD'){convertedSign=signs.usd}
        if (into==='EUR'){convertedSign=signs.eur}
        if (into==='PLN'){convertedSign=signs.pln}
        if (into==='RUB'){convertedSign=signs.rub}
        if (into==='UAH'){convertedSign=signs.uah}
        if (leftInput.value)
        {convertedSum.innerText = convertedSign+" "+leftInput.value}
        if (rightInput.value)
        {convertedSum.innerText = convertedSign+" "+rightInput.value}

    }
}
    


function getButtons(){
    var buttons = []
    mainArea.childNodes.forEach(function(child){
            child.childNodes.forEach(function(grandChild){
                grandChild.childNodes.forEach(function(notifyBtn){
                    if (notifyBtn.id.includes('notifyBtn')){
                        buttons.push(notifyBtn)}})})})
    return buttons}




function getPriceNodeByID(currency){
    var priceLabelList = []
    mainArea.childNodes.forEach(function(child){
        if(child.id === currency.toLowerCase()) {
            child.childNodes.forEach(function(container){
                container.childNodes.forEach(function(label) {
                if(label.id === currency.toLowerCase()+'-price'){
                    container.childNodes.forEach(function(priceLabel){
                        if (priceLabel.id === currency.toLowerCase()+'-price'){
                            priceLabelList.push(priceLabel)}});
                        }})})}})
    return priceLabelList}


    function getPriceNodeByID(currency){
        var priceLabelList = []
        mainArea.childNodes.forEach(function(child){
            if(child.id === currency.toLowerCase()) {
                child.childNodes.forEach(function(container){
                    container.childNodes.forEach(function(label) {
                    if(label.id === currency.toLowerCase()+'-price'){
                        container.childNodes.forEach(function(priceLabel){
                            if (priceLabel.id === currency.toLowerCase()+'-price'){
                                priceLabelList.push(priceLabel)}});
                            }})})}})
        return priceLabelList}



function getPriceUp(currency){
    var priceUp = []
    mainArea.childNodes.forEach(function(child){
        if(child.id === currency.toLowerCase()) {
            child.childNodes.forEach(function(container){
                if (container.className === 'goal-container') {
                    container.childNodes.forEach(function(row2) {
                        row2.childNodes.forEach(function(element){
                        if (element.id === currency.toLowerCase()+'-targetPriceUp'){
                            priceUp.push(element)}})})}})}})
    return priceUp}



function getPriceDown(currency){
    var priceDown = []
    mainArea.childNodes.forEach(function(child){
        if(child.id === currency.toLowerCase()) {
            child.childNodes.forEach(function(container){
                if (container.className === 'goal-container') {
                    container.childNodes.forEach(function(row2) {
                        row2.childNodes.forEach(function(element){
                        if (element.id === currency.toLowerCase()+'-targetPriceDown'){
                            priceDown.push(element)}})})}})}})
    return priceDown}





//IPC

//USD
ipc.on('usdTargetPriceValUp',function(event,arg) {
    usdTargetPriceValUp = Number(arg);
    store.set('usdUp',usdTargetPriceValUp);
    usdTargetPriceUp = getPriceUp('USD')[0]
    
    usdTargetPriceUp.innerHTML = mainSign+usdTargetPriceValUp.toLocaleString('en')
})
ipc.on('usdTargetPriceValDown',function(event,arg) {
    usdTargetPriceValDown = Number(arg)
    store.set('usdDown',usdTargetPriceValDown);
    usdTargetPriceDown = getPriceDown('USD')[0]
    usdTargetPriceDown.addEventListener('click',function(){
        usdTargetPriceDown.innerHTML = ''
        usdNotifiedDown = false
    })
    usdTargetPriceDown.innerHTML = mainSign+usdTargetPriceValDown.toLocaleString('en')
})

//EUR
ipc.on('eurTargetPriceValUp',function(event,arg) {
    eurTargetPriceValUp = Number(arg)
    store.set('eurUp',eurTargetPriceValUp);
    eurTargetPriceUp = getPriceUp('EUR')[0];
    eurTargetPriceUp.addEventListener('click', function(){
        eurTargetPriceUp.innerHTML = ''
        eurNotifiedUp = false
    })
    eurTargetPriceUp.innerHTML = mainSign+eurTargetPriceValUp.toLocaleString('en')
})
ipc.on('eurTargetPriceValDown',function(event,arg) {
    eurTargetPriceValDown = Number(arg);
    store.set('eurDown',eurTargetPriceValDown);
    eurTargetPriceDown = getPriceDown('EUR')[0];
    eurTargetPriceDown.addEventListener('click', function(){
        eurTargetPriceDown.innerHTML = ''
        eurNotifiedDown = false
    })
    eurTargetPriceDown.innerHTML = mainSign+eurTargetPriceValDown.toLocaleString('en')
})

//PLN
ipc.on('plnTargetPriceValUp',function(event,arg) {
    plnTargetPriceValUp = Number(arg)
    store.set('plnUp',plnTargetPriceValUp);
    plnTargetPriceUp = getPriceUp('PLN')[0]
    plnTargetPriceUp.addEventListener('click',function(){
        plnTargetPriceUp.innerHTML = ''
        plnNotifiedUp = false
    })
    plnTargetPriceUp.innerHTML = mainSign+plnTargetPriceValUp.toLocaleString('en')
})
ipc.on('plnTargetPriceValDown',function(event,arg) {
    plnTargetPriceValDown = Number(arg);
    store.set('eurDown',plnTargetPriceValDown);
    plnTargetPriceDown = getPriceDown('PLN')[0]
    plnTargetPriceDown.addEventListener('click',function(){
        plnTargetPriceDown.innerHTML = ''
        plnNotifiedDown = false
    })
    plnTargetPriceDown.innerHTML = mainSign+plnTargetPriceValDown.toLocaleString('en')
})

//RUB
ipc.on('rubTargetPriceValUp',function(event,arg) {
    rubTargetPriceValUp = Number(arg)
    store.set('rubUp',rubTargetPriceValUp);
    rubTargetPriceUp = getPriceUp('RUB')[0]
    rubTargetPriceUp.addEventListener('click',function(){
        rubTargetPriceUp.innerHTML=''
        rubNotifiedUp = false
    })
    rubTargetPriceUp.innerHTML = mainSign+rubTargetPriceValUp.toLocaleString('en')
})
ipc.on('rubTargetPriceValDown',function(event,arg) {
    rubTargetPriceValDown = Number(arg);
    store.set('rubDown',rubTargetPriceValDown);
    rubTargetPriceDown = getPriceDown('RUB')[0]
    rubTargetPriceUp.addEventListener('click',function(){
        rubTargetPriceDown.innerHTML=''
        rubNotifiedDown = false
    })
    rubTargetPriceDown.innerHTML = mainSign+rubTargetPriceValDown.toLocaleString('en')
})

//UAH

ipc.on('uahTargetPriceValUp',function(event,arg) {
    uahTargetPriceValUp = Number(arg)
    store.set('uahUp',uahTargetPriceValUp);
    uahTargetPriceUp = getPriceUp('UAH')[0]
    uahTargetPriceUp.addEventListener('click',function(){
        uahTargetPriceUp.innerHTML=''
        uahNotifiedUp = false
    })
    uahTargetPriceUp.innerHTML = mainSign+uahTargetPriceValUp.toLocaleString('en')
})
ipc.on('uahTargetPriceValDown',function(event,arg) {
    uahTargetPriceValDown = Number(arg);
    store.set('uahDown',uahTargetPriceValDown);
    uahTargetPriceDown = getPriceDown('UAH')[0]
    uahTargetPriceUp.addEventListener('click',function(){
        uahTargetPriceDown.innerHTML=''
        uahNotifiedDown = false
    })
    uahTargetPriceDown.innerHTML = mainSign+uahTargetPriceValDown.toLocaleString('en')
})








ipc.on('mainCurrency', function(event,arg) {
    mainCurrency = arg
    
    
    usdTargetPriceUp = getPriceUp('USD')[0]
    usdTargetPriceDown = getPriceDown('USD')[0]
    eurTargetPriceUp = getPriceUp('EUR')[0]
    eurTargetPriceDown = getPriceDown('EUR')[0]
    plnTargetPriceUp  = getPriceUp('PLN')[0]
    plnTargetPriceDown = getPriceDown('PLN')[0]
    rubTargetPriceUp  = getPriceUp('RUB')[0]
    rubTargetPriceDown = getPriceDown('RUB')[0]
    uahTargetPriceUp = getPriceUp('UAH')[0]
    uahTargetPriceDown = getPriceDown('UAH')[0]
    
    try{if (usdTargetPriceUp!==''){usdTargetPriceUp.innerHTML = ''}} catch(e){}
    try{if (usdTargetPriceDown!==''){usdTargetPriceDown.innerHTML = ''}} catch(e){}
    try{if (eurTargetPriceUp!==''){eurTargetPriceUp.innerHTML = ''}} catch(e){}
    try{if (eurTargetPriceDown!==''){eurTargetPriceDown.innerHTML = ''}} catch(e){}
    try{if (plnTargetPriceUp!==''){plnTargetPriceUp.innerHTML = ''}} catch(e){}
    try{if (plnTargetPriceDown!==''){plnTargetPriceDown.innerHTML = ''}} catch(e){}
    try{if (rubTargetPriceUp!==''){rubTargetPriceUp.innerHTML = ''}} catch(e){}
    try{if (rubTargetPriceDown!==''){rubTargetPriceDown.innerHTML = ''}} catch(e){}
    try{if (uahTargetPriceUp!==''){uahTargetPriceUp.innerHTML = ''}} catch(e){}
    try{if (uahTargetPriceDown!==''){uahTargetPriceDown.innerHTML = ''}} catch(e){}

    store.set('mainCurrency',mainCurrency)

    if (currencies.includes(mainCurrency)){
        var index = currencies.indexOf(mainCurrency)
        currencies.splice(index,1)
        store.set('currencies',currencies)
        mainArea.childNodes.forEach(function(child){
            if (child.id === mainCurrency.toLowerCase()){
                mainArea.removeChild(child)
            }
        })
    }



})
ipc.on('currency', function(event,arg) {

    if (!currencies.includes(arg) && !displayedNodes.includes(arg) && arg!==mainCurrency) {
        currencies.push(arg);
        getCurrency(arg,mainCurrency)
        store.set('currencies',currencies)
        // ipc.send('currency-on',currencies)
    }
    else {
            index = currencies.indexOf(arg)
            currencies.splice(index,1)
            if (arg === 'USD'){usdBtn = false}
            if (arg === 'EUR'){eurBtn = false}
            if (arg === 'PLN'){plnBtn = false}
            if (arg === 'RUB'){rubBtn = false}
            if (arg === 'UAH'){uahBtn = false}
            store.set('currencies',currencies)
            mainArea.childNodes.forEach(function(child){
                if(child.id === arg.toLowerCase()) {
                    mainArea.removeChild(child)
                    var toDelete = []
                    toDelete.push(arg)

                }
            })
    }
   
})





