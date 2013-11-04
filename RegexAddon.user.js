// ==UserScript==
// @name        RegexAddon
// @namespace   RegexAddon
// @version     1
// @include     *
// @require     utils.user.js
// @require     takeUrls.user.js
// @require     phpToJavascriptRegex.user.js
// @resource    regexAddonCSS style.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// ==/UserScript==
// author: Alex Toro - alex@volcanicinternet.com

//////////////////////////////////////////////////// HTML FRAMEWORK ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// HTML FRAMEWORK ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// HTML FRAMEWORK ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// HTML FRAMEWORK ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// HTML FRAMEWORK ///////////////////////////////////////////////////////////

var newCSS = GM_getResourceText ("regexAddonCSS");
GM_addStyle (newCSS);

if (window.self === window.top) {
    createGlobalDiv();
    addRegexShowButton();
    addRegexHtmlInput();
    var htmlOriginal = false;
    document.getElementById('regexAddonHidden').style.display = "block";
}


function createGlobalDiv() {
    var wholeDiv = document.createElement('div');
    wholeDiv.id = "wholeRegexAddon";
    
    var html = document.getElementsByTagName('html')[0];
    html.appendChild(wholeDiv);
}


function addRegexShowButton() {
    var regexShow = document.createElement('img');
    regexShow.id = "regexAddonHidden";
    regexShow.src = 'http://img132.imageshack.us/img132/5729/3o4e.jpg';

    var addon = document.getElementById('wholeRegexAddon');
    addon.appendChild(regexShow);

    addShowButtonListener();
}

function addResultsTag(element) {
    var resultsTable = document.createElement('table');
    resultsTable.id = "resultsTableRegexAddon";

    var resultsListDiv = document.createElement('div');
    resultsListDiv.id = "resultsListDivRegexAddon";
    resultsListDiv.appendChild(resultsTable);

    var resultsExpand = document.createElement('button');
    resultsExpand.id = "resultsLabelRegexAddon";
    resultsExpand.innerHTML = 'Results';
    resultsExpand.className = 'pestanaRegexAddon';
    
    var handImage = document.createElement('img');
    handImage.id = 'handImageRegexAddon';
    handImage.src = 'http://img96.imageshack.us/img96/1623/sh9v.png';
    
    var handButton = document.createElement('button');
    handButton.id = "handButtonRegexAddon";
    handButton.className = 'pestanaRegexAddon';
    handButton.appendChild(handImage);
    handButton.innerHTML += '<code> </code>';
    
    var portapapelesImage = document.createElement('img');
    portapapelesImage.id = 'portapapelesImageRegexAddon';
    portapapelesImage.src = 'http://img33.imageshack.us/img33/5530/8bw.gif';
    
    var portapapelesButton = document.createElement('button');
    portapapelesButton.id = "portapapelesButtonRegexAddon";
    portapapelesButton.className = 'pestanaRegexAddon';
    portapapelesButton.appendChild(portapapelesImage);
    portapapelesButton.innerHTML += '<code> </code>';
    
    var resetImage = document.createElement('img');
    resetImage.id = 'resetImageRegexAddon';
    resetImage.src = 'http://img5.imageshack.us/img5/8195/n8k5.gif';
    
    var resetButton = document.createElement('button');
    resetButton.id = "resetButtonRegexAddon";
    resetButton.className = 'pestanaRegexAddon';
    resetButton.appendChild(resetImage);
    resetButton.innerHTML += '<code> </code>';
    
    var pestanaDiv = document.createElement('div');
    pestanaDiv.id = "pestanaDivRegexAddon";
    pestanaDiv.appendChild(handButton);
    pestanaDiv.appendChild(portapapelesButton);
    pestanaDiv.appendChild(resetButton);
    pestanaDiv.appendChild(resultsExpand);
    

    element.appendChild(pestanaDiv);
    element.appendChild(resultsListDiv);


}

function addRegexHtmlInput() {
    var regexInput = document.createElement('input');
    regexInput.style.width = '1500px';
    regexInput.type = "text";
    regexInput.id = 'regexInput';


    var regexHide = document.createElement('img');
    regexHide.src = 'http://img22.imageshack.us/img22/4160/1gnp.png';
    regexHide.id = "hideRegexAddon";

    var regexDivFooter = document.createElement('div');
    regexDivFooter.id = "regexAddonFooter";
    
    regexDivFooter.appendChild(regexInput);
    regexDivFooter.appendChild(regexHide);

    var regexAddonFull = document.createElement('div');
    regexAddonFull.id = "regexAddonFull";
    
    addResultsTag(regexAddonFull);
    regexAddonFull.appendChild(regexDivFooter);

    var addon = document.getElementById('wholeRegexAddon');
    addon.appendChild(regexAddonFull);

    addRegexInputListener();
    addHideButtonListener();
    addHideShowResultsButtonListener();
    addHandButtonListener();
    addResetButtonListener();
    addPortapapelesButtonListener();
}


//////////////////////////////////////////////////// HTML FUNCTIONS ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// HTML FUNCTIONS ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// HTML FUNCTIONS ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// HTML FUNCTIONS ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// HTML FUNCTIONS ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// HTML FUNCTIONS ///////////////////////////////////////////////////////////

function cleanResultsList() {
    document.getElementById("resultsTableRegexAddon").innerHTML = '';
}

function addResultToList(match, id) {
    var tdCount = document.createElement('td');
    tdCount.className = 'tdCount';
    tdCount.innerHTML = '<b style="margin:inherit">' + id + '</b>';

    var tr = document.createElement('tr');
    tr.appendChild(tdCount);
    var i = 0;
    var str = '';
    while (str = match[i]) {
        str = htmldecode(str);
        var tdResult = document.createElement('td');
        tdResult.className = 'tdResult';
        tdResult.innerHTML = '<pre style="margin:inherit">' + str + '</pre>';

        tr.appendChild(tdResult);
        i++;
    }

    var table = document.getElementById("resultsTableRegexAddon");
    table.appendChild(tr);

}

function addResultTopInfoToList(maxResults) {
    var tdCount = document.createElement('td');
    tdCount.className = 'tdCount';
    tdCount.innerHTML = '<b>#</b>';

    var tr = document.createElement('tr');
    tr.appendChild(tdCount);

    var tr = document.createElement('tr');
    tr.appendChild(tdCount);
    var i = 0;
    while (i < maxResults) {

        var tdResult = document.createElement('td');
        tdResult.className = 'tdResult';
        tdResult.style.color = 'black';
        tdResult.innerHTML = '<b><pre style="margin:inherit">Output ' + i + '</pre></b>';

        tr.appendChild(tdResult);
        i++;
    }
    var table = document.getElementById("resultsTableRegexAddon");
    table.appendChild(tr);
}

//////////////////////////////////////////////////// LISTENERS ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// LISTENERS ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// LISTENERS ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// LISTENERS ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// LISTENERS ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////// LISTENERS ///////////////////////////////////////////////////////////

/*
 * 
 * listener of portapapelesButton
 * copy input in a pseudo-clipboard
 */
function addPortapapelesButtonListener() {
    var portapapelesButton = document.getElementById("portapapelesButtonRegexAddon");
    portapapelesButton.addEventListener('click', copy_to_clipboard, true);
}

/*
 * 
 * listener of addResetButtonListener
 * reset the addon to start the process again without refreshing the site
 */
function addResetButtonListener() {
    var resetButton = document.getElementById("resetButtonRegexAddon");
    resetButton.addEventListener('click', resetAddonToIni, true);
}

function resetAddonToIni(){
    resetTakeUrls();
    document.getElementsByTagName('body')[0].innerHTML = htmlOriginal;
    handleIframes();
    cleanResultsList();
    document.getElementById('resultsListDivRegexAddon').style.display = "none";
    document.getElementById('resultsLabelRegexAddon').innerHTML = 'Results';
}

/*
 * 
 * listener of addHandButtonListener
 * starts the process to suggest a regex
 */
function addHandButtonListener() {
    var handButton = document.getElementById("handButtonRegexAddon");
    handButton.addEventListener('click', takeUrlsAndExecute, true);
}

function takeUrlsAndExecute() {
    if (takeUrls(htmlOriginal)){
        selectMatch();
    }
}


/*
 * 
 * listener of addHideShowResultsButtonListener
 * hide and show the regex results list
 */
function addHideShowResultsButtonListener() {
    var hideShowResults = document.getElementById("resultsLabelRegexAddon");
    hideShowResults.addEventListener('click', hideShowResultsList, true);
}

function hideShowResultsList() {
    var state = document.getElementById('resultsListDivRegexAddon').style.display;
    if (state == "none")
        document.getElementById('resultsListDivRegexAddon').style.display = "block";
    else
        document.getElementById('resultsListDivRegexAddon').style.display = "none";
}

/*
 * 
 * listener of addHideButtonListener
 * hide the addon
 */
function addHideButtonListener() {
    var hideButton = document.getElementById("hideRegexAddon");
    hideButton.addEventListener('click', hideRegexAddon, true);
}

function hideRegexAddon() {
    document.getElementById('regexAddonFull').style.display = "none";
    document.getElementById('regexAddonHidden').style.display = "block";
}

/*
 * 
 * listener of addHideButtonListener
 * show the addon
 */
function addShowButtonListener() {
    var showButton = document.getElementById("regexAddonHidden");
    showButton.addEventListener('click', showAddon, true);
}

function showAddon() {
    var auxSrc = document.getElementById('regexAddonHidden').src;
    document.getElementById('regexAddonHidden').src = "http://img248.imageshack.us/img248/7527/8jj.gif";
    if (!htmlOriginal){
        htmlOriginal = getBodySourceCode(document.URL);
    }
    document.getElementById('regexAddonHidden').style.display = "none";
    document.getElementById('regexAddonHidden').src = auxSrc;
    document.getElementById('regexAddonFull').style.display = "block";
    if (document.getElementsByTagName('body')[0]){
        document.getElementsByTagName('body')[0].innerHTML = htmlOriginal;
    }
    else {
        alert ("The site has no <body>!!");
    }
    handleIframes();
}

/*
 * 
 * listener of addRegexInputListener
 * Execute the regex to highlight html and show results list
 */
function addRegexInputListener() {
    var textBox = document.getElementById("regexInput");
    textBox.addEventListener('keypress', function(e) {
        if (e.keyCode === 13) {
            selectMatch();
        }
    }, false);
}

/*
 * 
 * shows the clipboard popup
 */
function copy_to_clipboard() {
    var text = document.getElementById("regexInput").value;
    window.prompt('Press Ctrl+C, then Enter', text);
    
} 
