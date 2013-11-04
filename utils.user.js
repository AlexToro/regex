// ==UserScript==
// @name        utils
// @namespace   utils
// @version     1
// @grant       none
// author: Alex Toro - alex@volcanicinternet.com


/*
 * 
 * Process that execute the regex comming from input
 */
function selectMatch() {
    document.getElementById('resultsLabelRegexAddon').innerHTML = 'Results';
    cleanResultsList();
    document.getElementById('resultsListDivRegexAddon').style.display = "block";
    var regexValue = document.getElementById("regexInput").value;
        var regex = phpToJavascriptRegex(regexValue);
    if (!regex)
        alert("No es una regex válida!");
    if (regex) {
        var html = htmlOriginal;
        document.getElementById("regexInput").value = regexValue;
        var count = 0;
        var positions = new Array();
        var maxResults = 0;
        while (match = regex.exec(html)) {
            var i = 0;
            while (str = match[i]) {
                i++;
            }
            if (maxResults < i) maxResults = i;
        }
        addResultTopInfoToList(maxResults);
        while (match = regex.exec(html)) {
            addResultToList(match, count + 1);
            positions['start' + count] = match.index;
            positions['end' + count] = regex.lastIndex;
            count++;
        }
        document.getElementById('resultsLabelRegexAddon').innerHTML = 'Results ' + count;
        while (count > 0) {
            count--;
            html = setSelectionRange(html, positions['start' + count], positions['end' + count]);
        }
        document.getElementsByTagName('body')[0].innerHTML = html;
        handleIframes();
        document.getElementById("regexInput").value = regexValue;
    }
}

/*
 * 
 * Helps to highlight regex results one by one.
 */
function setSelectionRange(html, start, end) {
    var htmlanterior = html.substring(0, start);
    var htmlposterior = html.substring(end);
    var element = html.substring(start, end);
    var replace = highlightHtml(element);
    return html = htmlanterior + replace + htmlposterior;
}

/*
 * 
 * @param {string} element (piece of html)
 * @returns {string} replace (element highlighted)
 * 
 * Get an html text and try to highlight it by setting a yellow background in it.
 */
function highlightHtml(element) {
    var ommitNextText = false;
    var tags = element.match(/<\/?\w[^>]*>/g);
    var text = element.split(/<\/?\w[^>]*>/g);
    var tagsCount = new Array();
    var replace = '';
    for (var i = text.length - 1; i >= 0; i--) {
        var haveText = text[i].match(/\S/);
        if (haveText) {
            var s = text[i].match(/style\s*=\s*["']([^"']*)["']/i);
            var oldStyle = '';
            if (s) {
                text[i] = text[i].replace(/style\s*=\s*["']([^"']*)["']/i, '');
                oldStyle = s[1];
            }
            if (!ommitNextText) {
                if (i == text.length - 1 && !text[i].match(/>\s*$/)) {
                    if (text[i].match(/(src|href)\s*=\s*['"][^'"]*['"]/i)) {
                        replace = text[i] + " style='" + oldStyle + "background-color:orange; border:2px solid orange;'" + replace;
                    }
                    else if (text[i].match(/^\s*<\w/))
                        replace = text[i] + replace;
                    else
                        replace = "<span style='background-color:yellow;'>" + text[i] + "</span>" + replace;
                }
                else if (i == 0 && text[i].match(/>\s*$/)) {
                    if (text[i].match(/(src|href)\s*=\s*['"][^'"]*['"]/i)) {
                        var aux = text[i].replace(/>\s*$/, " style='" + oldStyle + "background-color:orange; border:2px solid orange;'>");
                        replace = aux + replace;
                    }
                    else
                        replace = text[i] + replace;
                }
                else
                    replace = "<span style='background-color:yellow;'>" + text[i] + "</span>" + replace;
            }
            else {
                replace = text[i] + replace;
                ommitNextText = false;
            }
        }
        if (tags && tags[i - 1]) {
            if (tags[i - 1].match(/<\/script/i))
                ommitNextText = true;
            var openTagType = tags[i - 1].match(/<(\w+)/);
            if (openTagType) {
                openTagType = openTagType[1];
                var s = tags[i - 1].match(/style\s*=\s*["']([^"']*)["']/i);
                var style = 'background-color:yellow;';
                if (s) {
                    tags[i - 1] = tags[i - 1].replace(/style\s*=\s*["']([^"']*)["']/i, '');
                    style = s[1] + ' ' + style;
                }
                if (openTagType.match(/img/i))
                    style = style + ' border:2px solid yellow;';
                if (tagsCount[openTagType] && !openTagType.match(/script/i)) {
                    tagsCount[openTagType]--;
                    if (tagsCount[openTagType] >= 0) {
                        replace = tags[i - 1].replace(/>/g, " style='" + style + "'>") + replace;
                    }
                    else
                        replace = tags[i - 1] + replace;
                }
                else {
                    if (openTagType.match(/img/i)) {
                        replace = tags[i - 1].replace(/>/g, " style='" + style + "'>") + replace;
                    }
                    else if (tags[i - 1].match(/(src|href)\s*=\s*['"][^'"]*['"]/i)) {
                        replace = tags[i - 1].replace(/>/g, " style='" + style.replace(/yellow/i, 'orange') + "'>") + replace;
                    }
                    else
                        replace = tags[i - 1] + replace;
                }
            }
            else {
                var tagType = tags[i - 1].match(/<\/(\w+)/);
                if (tagType && tagType[1]) {
                    var tagType = tagType[1];
                    if (tagsCount[tagType])
                        tagsCount[tagType]++;
                    else
                        tagsCount[tagType] = 1;
                }
                replace = tags[i - 1] + replace;
            }
        }
    }
    return replace;
}


/*
 * 
 * @param {String} str (piece of html)
 * @returns {String} str 
 * 
 * Escape html entities in order to be used as text and not as html
 */
function htmldecode(str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    return str;
}

/*
 * 
 * @param {String} theUrl
 * @returns {String} xmlHttp.responseText
 * 
 * Download the html source code of an url
 */
function httpGet(theUrl) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
} 

/*
 * 
 * Hide iFrames from document
 */
function handleIframes() {
    var iframes = document.getElementsByTagName('iframe');
    var iframe;
    for (var i = 0; i < iframes.length; i++) {
        iframe = iframes[i];
        var src = iframe.src;
        iframe.src = '';
        iframe.style.background = "url(http://img841.imageshack.us/img841/8291/pf28.png) grey";
        iframe.style.opacity = 0.5;
        iframe.contentDocument.write('<a style="color: white; width: 100%; position: absolute; text-align: center;" href="' + src + '" target="_blank">Open iFrame</a>');
    }
}

/*
 * 
 * @param {String} url
 * @returns {String}
 * 
 * returns the source code of the body after downloading the give url
 */
function getBodySourceCode(url){
    var bodyCode = httpGet(url);
    bodyCode = bodyCode.replace(/^[\s\S]*?<body[^>]*>/i, '');
    bodyCode = bodyCode.replace(/<\/body>((?!<\/body>)[\s\S])*$/i, '');
    return bodyCode;
}