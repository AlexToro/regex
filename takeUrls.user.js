// ==UserScript==
// @name        takeUrls
// @namespace   takeUrls
// @version     1
// @grant       none
// author: Alex Toro - alex@volcanicinternet.com

var regexLinksElements = new Array();
var regexLinksElementsSC = new Array();
var regexLinksElementsSCOriginal = new Array();
var regexLinksElementsSCindex = new Array();
var regexLinksElementsSCindexOriginal = new Array();
var index = 0;
var htmlOriginal = '';
var htmlOriginalPos = '';
var antType = 0;
var unduplicatedTimes = 0;

/*
 * 
 * @param {event} e
 * 
 * listener that catch click events in order to handle the element you clicked.
 */
var listener = function(e) {
    var element = findParent('A', e.target);
    if (element && element.nodeName == 'A') {
        regexLinksElements[index] = element;
        regexLinksElementsSC[index] = getNodeSourceCode(element);
        regexLinksElementsSCOriginal[index] = regexLinksElementsSC[index];
        console.log(regexLinksElementsSC[index]);
        element.removeAttribute("onclick");
        element.removeAttribute("onmousedown");
        element.removeAttribute("onmouseup");
        element.outerHTML = highlightHtml(element.outerHTML); //IMPORTANTE NO HACERLO ANTES
        index++;
    }
    cancelEvent(e);
};

/*
 * 
 * @param {event} e
 * 
 * listener that catch click events only to cancel them.
 */
var blacklistener = function(e) {
    cancelEvent(e);
};


/*
 * 
 * @param {event} event
 * 
 * cancel event default behavior
 */
function cancelEvent(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

/*
 * 
 * @param {String} tagname
 * @param {node} el
 * @returns {node} el
 * 
 * find first parent with tagName [tagname]
 */
function findParent(tagname, el) {
    if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
        return el;
    }
    while (el = el.parentNode) {
        if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
            return el;
        }
    }
    return null;
}

/*
 * 
 * reset global elements on user's demand.
 */
function resetTakeUrls() {
    regexLinksElements = new Array();
    regexLinksElementsSC = new Array();
    regexLinksElementsSCOriginal = new Array();
    regexLinksElementsSCindex = new Array();
    regexLinksElementsSCindexOriginal = new Array();
    index = 0;
    antType = '';
    unduplicatedTimes = 0;
}


/*
 * 
 * @param {String} html
 * @returns {Boolean}
 * 
 * main function that starts or stops the regex suggester on user's demand
 */
function takeUrls(html) {
    htmlOriginal = html;
    handlePosHtml();
    if (document.getElementById('handImageRegexAddon').src == "http://img96.imageshack.us/img96/1623/sh9v.png") {
        document.getElementById('handImageRegexAddon').src = "http://img19.imageshack.us/img19/1624/5r7k.png";
        document.getElementById('duplicatesButtonRegexAddon').style.display = "none";
        document.body.addEventListener('mousedown', blacklistener, false);
        document.body.addEventListener('mouseup', blacklistener, false);
        document.body.addEventListener('click', listener, false);
    }
    else {
        if (unduplicatedTimes > 0){
            regexLinksElementsSC = copyArray(regexLinksElementsSCOriginal);
            regexLinksElementsSCindex = copyArray(regexLinksElementsSCindexOriginal);
            var unTimes = unduplicatedTimes;
            unduplicatedTimes = 0; 
            for (var u = 0; u < unTimes; u++){
                if (!unduplicate()) {
                    if (u > 1) alert ("In fact, elements DO HAVE a common pattern but no so many as before");
                    break;
                }
            }
        }
        document.getElementById('handImageRegexAddon').src = "http://img96.imageshack.us/img96/1623/sh9v.png";
        document.getElementById('duplicatesButtonRegexAddon').style.display = "inline-block";
        document.body.removeEventListener('mousedown', blacklistener, false);
        document.body.removeEventListener('mouseup', blacklistener, false);
        document.body.removeEventListener('click', listener, false);
        document.getElementById('regexInput').value = getSuggestedRegex();
        return true;
    }
    return false;
}

function copyArray(array){
    var result = new Array();
    for (var i = 0; i < array.length; i++){
        result[i] = array[i];
    }
    return result;
}

function unduplicate() {
    antType = '';
    if (regexLinksElementsSC[0]) {
        var auxArray = copyArray(regexLinksElementsSC);
        for (var i = 0; i < regexLinksElementsSC.length; i++){
            var element = regexLinksElementsSC[i];
            var e = addPreviousElement(element, i);
            if (e){
                element = e;
                regexLinksElementsSC[i] = element;
            }
            else {
                regexLinksElementsSC = copyArray(auxArray);
                alert ("Elements do not have a common pattern");
                return false;
            }
        }
        unduplicatedTimes++;
        document.getElementById('regexInput').value = getSuggestedRegex();
        return true;
    }
    else{
        alert ("No elements on selection for doing this");
    }
    return false;
}

function addPreviousElement(element, pos) {
    
    if (regexLinksElementsSCindex[pos]){
        var htmlAux = htmlOriginalPos;
        htmlAux = htmlAux.substring(0,regexLinksElementsSCindex[pos]);
        var piece = htmlAux.replace(/^[\s\S]*(<(\/?[\w\\-]+)[^>]*>[^><]*)$/i,"$1");
        var type = htmlAux.replace(/^[\s\S]*(<(\/?[\w\\-]+)[^>]*>[^><]*)$/i,"$2");
       // alert (antType + "  " + type);
        if (antType != type && antType != '') return false;
        antType = type;
        element = piece + element;
        regexLinksElementsSCindex[pos] = regexLinksElementsSCindex[pos] - piece.length;
    }
    return element;
}


/*
 * 
 * @returns {String} (regex)
 * 
 * handle element by element of user's selection in order to make a regex
 */
function getSuggestedRegex() {
    if (regexLinksElementsSC[0]) {
        var regex = regexLinksElementsSC[0];
        for (var i = 1; i < regexLinksElementsSC.length; i++) {
            var element = regexLinksElementsSC[i];
            regex = addElementToRegex(regex, element);
        }
        regex = finishSuggestedRegex(regex);
        return "@" + regex + "@isU";
    }
}

/*
 * 
 * @returns {String} result (regex)
 * 
 * auxiliar function to end properly the regex. It replaces some special text coming from main constructor.
 */
function finishSuggestedRegex(regex) {
    regex = escapeRegex(regex);
    var result = '';
    var tags = regex.match(/<\/?\w[^>]*>/g);
    var text = regex.split(/<\/?\w[^>]*>/g);
    for (var i = 0; i < tags.length; i++) {
        result += finishSuggestedRegexTag(tags[i]);
        if (text[i + 1]){
            text[i + 1] = text[i + 1].replace(/^[\s\t]+/, "███SPACES███");
            text[i + 1] = text[i + 1].replace(/[\s\t]+$/, "███SPACES███");
            result += finishSuggestedRegexText(text[i + 1]);
        }
    }
    return result;
}

/*
 * 
 * @returns {String} regex
 * 
 * escape especial characters of the regex
 */
function escapeRegex(regex) {
    regex = regex.replace(/(\$|\(|\)|\*|\+|\.|\[|\]|\?|\\|\^|\{|\||@)/g, "\\" + "$1");
    return regex;
}

/*
 * 
 * @returns {String} tag
 * 
 * do the finishSuggestedRegex function for the tags of the regex. <a href="...">
 */
function finishSuggestedRegexTag(tag) {
    var attributes = tag.match(/ [\w\\-]+\s*=\s*["']/g);
    if (attributes) {
        for (var i = 0; i < attributes.length; i++) {
            var attrIni = (attributes[i]);
            var comaType = attrIni[attrIni.length - 1 ];
            var attrRegex = attrIni + '[^' + comaType + ']*' + comaType;
            attrRegex = new RegExp(attrRegex, "i");

            var thisAttr = tag.match(attrRegex);
            if (thisAttr[0]) {
                var thisReplace = thisAttr[0].replace(/███ATTR███/g, "[^" + comaType + "]*");
                thisReplace = thisReplace.replace(/^ /, ' [^>]*');
                tag = tag.replace(thisAttr[0], thisReplace);
            }
        }
    }
    tag = tag.replace(/███ATTR███/g, "[^\\s>]*");
    if (tag.match(/^<\w/)) {
        tag = tag.replace(/[\s\n]*>$/, "[^>]*>");
    }
    return tag;
}

/*
 * 
 * @returns {String} text
 * 
 * do the finishSuggestedRegex function for the texts of the regex.  ..>Submit here<..
 */
function finishSuggestedRegexText(text) {
    text = text.replace(/███TEXT███/g, "[^<]*");
    text = text.replace(/███NOT_MATCHING███/g, ".*");
    text = text.replace(/███SPACES███/g, "\\s*");
    return text;
}

/*
 * 
 * @param {String} regex
 * @param {String} element
 * @returns {String} result
 * 
 * function that compares previous "regex" with next element in order to incorporate it to the regex.
 * first time you call the function, regex is not a regex, but another element.
 * the result is not a well formet regex... it's an internal format that is handled after all the process ends.
 */
function addElementToRegex(regex, element) {
    var result = '';
    var tagsRegex = regex.match(/<\/?\w[^>]*>/g);
    var textRegex = regex.split(/<\/?\w[^>]*>/g);
    var tagsElement = element.match(/<\/?\w[^>]*>/g);
    var textElement = element.split(/<\/?\w[^>]*>/g);
    var limit = Math.min(tagsRegex.length, tagsElement.length);
    var i = 0;
    var breaker = false;
    for (i = 0; i < limit; i++) {
        //HANDLE TAGS
        var currentRegexTag = tagsRegex[i];
        var currentElementTag = tagsElement[i];
        if (currentRegexTag.match(/<\//)) { //TAG TANCAR
            if (takeTagType(currentRegexTag) == takeTagType(currentElementTag)) {
                result += currentRegexTag;
            }
            else {
                breaker = true;
            }
        }
        else { //TAG OBRIR
            if (takeTagType(currentRegexTag) == takeTagType(currentElementTag)) {
                var attrs = takeAttributes(currentRegexTag);
                for (var a = 0; a < attrs.length; a++) {
                    var currentAttr = attrs[a];
                    if (currentElemAttr = takeAttribute(currentElementTag, currentAttr)) {
                        currentRegexTag = currentRegexTag.replace(currentAttr, addTextRegex(currentAttr, currentElemAttr, "ATTR"));
                    }
                    else {
                        currentRegexTag = currentRegexTag.replace(currentAttr, '');
                    }
                }
                result += currentRegexTag;
            }
            else {
                breaker = true;
            }
        }
        var textIndex = i + 1;
        if (!breaker && (textIndex < textRegex.length - 1)) {
            //HANDLE TEXT

            var currentRegexText = textRegex[textIndex];
            if (textElement[textIndex]) {
                var currentElementText = textElement[textIndex];
            }
            else
                currentElementText = '';
            result += addTextRegex(currentRegexText, currentElementText, "TEXT");
        }
        if (breaker)
            break;
    }
    if (breaker) {
        breaker = false;
        var resultCua = '';
        result = result.replace(/[\s\t]+$/, "");
        result = result.replace(/(███SPACES███|███TEXT███)+$/, "");
        var lastRegex = tagsRegex.length - 1;
        var lastElement = tagsElement.length - 1;
        while (i <= lastRegex && i <= lastElement) {

            //HANDLE TAGS
            var currentRegexTag = tagsRegex[lastRegex];
            var currentElementTag = tagsElement[lastElement];
            if (currentRegexTag.match(/<\//)) { //TAG TANCAR
                if (takeTagType(currentRegexTag) == takeTagType(currentElementTag)) {
                    resultCua = currentRegexTag + resultCua;
                }
                else {
                    breaker = true;
                }
            }
            else { //TAG OBRIR
                if (takeTagType(currentRegexTag) == takeTagType(currentElementTag)) {
                    var attrs = takeAttributes(currentRegexTag);
                    for (var a = 0; a < attrs.length; a++) {
                        var currentAttr = attrs[a];
                        if (currentElemAttr = takeAttribute(currentElementTag, currentAttr)) {
                            currentRegexTag = currentRegexTag.replace(currentAttr, addTextRegex(currentAttr, currentElemAttr, "ATTR"));
                        }
                        else {
                            currentRegexTag = currentRegexTag.replace(currentAttr, '');
                        }
                    }
                    resultCua = currentRegexTag + resultCua;
                }
                else {
                    breaker = true;
                }
            }

            var textIndex = lastRegex;
            var textIndexElement = lastElement;
            if (!breaker && (textIndex > 0)) {
                //HANDLE TEXT
                var currentRegexText = textRegex[textIndex];
                if (textElement[textIndexElement]) {
                    var currentElementText = textElement[textIndexElement];
                }
                else
                    var currentElementText = "";
                resultCua = addTextRegex(currentRegexText, currentElementText, "TEXT") + resultCua;


            }

            if (breaker)
                break;
            lastRegex--;
            lastElement--;
        }
        resultCua = resultCua.replace(/^[\s\t]+/, "");
        resultCua = resultCua.replace(/^(███SPACES███|███TEXT███)+/, "");
        result += '███NOT_MATCHING███' + resultCua;

    }
    result = result.replace(/(███NOT_MATCHING███)+/g, '███NOT_MATCHING███');
    result = result.replace(/(███TEXT███)+/g, '███TEXT███');
    result = result.replace(/(███SPACES███)+/g, '███SPACES███');
    return result;

}

/*
 * 
 * @param {String} stringTag
 * @param {String} currentAttr
 * @returns {Boolean}
 * 
 * search for an attribute type (currentAttr) on the stringTag that is a string like: <a href="#" title="TT">
 * if you search for title it will return title="TT"
 */
function takeAttribute(stringTag, currentAttr) {
    var attribute = currentAttr.match(/ [\w\\-]+\s*=\s*["']/);
    if (attribute) {
        var attrIni = attribute[0];
        var comaType = attrIni[attrIni.length - 1];
        var attrRegex = attrIni + '[^' + comaType + ']*' + comaType;
        attrRegex = new RegExp(attrRegex, "i");
        var thisAttr = stringTag.match(attrRegex);
        if (thisAttr) {
            return thisAttr[0];
        }
    }
    else {
        attribute = currentAttr.match(/ [\w\\-]+\s*=/);
        if (attribute) {
            var attrIni = attribute[0];
            var comaType = attrIni[attrIni.length - 1];
            var attrRegex = attrIni + '\s*[^"\'\s>]+';
            attrRegex = new RegExp(attrRegex, "i");
            var thisAttr = stringTag.match(attrRegex);
            if (thisAttr) {
                return thisAttr[0];
            }
        }
    }
    return false;
}

/*
 * 
 * @param {String} stringTag
 * @returns {Array} attrs
 * 
 * returns an array with every attribute for a tag like: <a href="#" title="TT">
 * E.g: href="#", title="TT"
 */
function takeAttributes(stringTag) {
    var attrs = new Array();
    var attributes = stringTag.match(/ [\w\\-]+\s*=\s*["']/g);
    if (attributes) {
        for (var i = 0; i < attributes.length; i++) {
            var attrIni = (attributes[i]);
            var comaType = attrIni[attrIni.length - 1 ];
            var attrRegex = attrIni + '[^' + comaType + ']*' + comaType;
            attrRegex = new RegExp(attrRegex, "i");

            var thisAttr = stringTag.match(attrRegex);
            attrs.push(thisAttr[0]);
        }
    }
    var attributes = stringTag.match(/ [\w\\-]+\s*=\s*[^"'\s>]+/g);
    if (attributes) {
        for (var i = 0; i < attributes.length; i++) {
            var thisAttr = (attributes[i]);
            attrs.push(thisAttr);
        }
    }
    return attrs;
}

/*
 * 
 * @param {String} stringTag
 * @returns {String}
 * 
 * returns a tag type for a tag like: <img src="#" title="TT">
 * E.g: it will return img
 */
function takeTagType(stringTag) {
    var tagRegex = '</?(\\S+)(>| [^>]*>)';
    tagRegex = new RegExp(tagRegex, "i");
    var tag = stringTag.match(tagRegex);
    return tag[1].toLowerCase();
}

/*
 * 
 * @param {String} regex
 * @param {String} html
 * @param {String} type
 * @returns {String} result
 * 
 * The same function as addElementToRegex but in this case you have only a piece of text without tags.
 * This function does not only handle text like >Click here< but also text from attributes values.
 */
function addTextRegex(regex, text, type) {
    if (regex == '███NOT_MATCHING███')
        return regex;
    var innerRegex = "";
    var innerTEXT = "";
    var originalRegex = "";
    if (!regex && !text)
        return "";
    originalRegex = innerRegex = regex;
    innerTEXT = text;

    var startRegex = '';
    var endRegex = '';
    while (innerRegex[0] && innerTEXT[0] && innerRegex[0].toLowerCase() == innerTEXT[0].toLowerCase()) {
        startRegex += innerRegex[0];
        innerRegex = innerRegex.substring(1);
        innerTEXT = innerTEXT.substring(1);
    }
    var regexlastIndex = innerRegex.length - 1;
    var textlastIndex = innerTEXT.length - 1;
    while (innerRegex[regexlastIndex] && innerTEXT[textlastIndex] && innerRegex[regexlastIndex].toLowerCase() == innerTEXT[textlastIndex].toLowerCase()) {
        endRegex = innerRegex[regexlastIndex] + endRegex;
        innerRegex = innerRegex.substring(0, regexlastIndex);
        innerTEXT = innerTEXT.substring(0, textlastIndex);
        regexlastIndex = innerRegex.length - 1;
        textlastIndex = innerTEXT.length - 1;
    }
    var result = '';
    if (text != originalRegex) {
        result = startRegex + "███" + type + "███" + endRegex;
    }
    else
        result = startRegex + endRegex;

    
    return result;
}






/*
 * 
 * @param {node} node
 * @param {String} parentId
 * @returns {Number}
 * 
 * return the "position" of a node taking as a parent determined by id as referer
 * the position is not the tag position... is the position according with the rest of elements with the same type.
 * E.g: <div><a><b><span><a thatisourelement>
 * In this case it is in second position... because only have another a before it.
 */
function getNodePos(node, parentId) {
    var cointainer = '';
    if (parentId){
        cointainer = document.getElementById(parentId);
    }
    else {
        cointainer = document.getElementsByTagName('body')[0];
    }
    var tags = cointainer.getElementsByTagName(node.tagName);
    for (var i = 0; i < tags.length; i++) {
        if (tags[i] == node) {
            return i;
        }
    }
    return 0;
}

/*
 * 
 * makes an auxiliar html without some tags in order to determine better the position of an element in the real source code.
 */
function handlePosHtml(){
    htmlOriginalPos = htmlOriginal;
    htmlOriginalPos = htmlOriginalPos.replace(/(<script[^>]*>)[\s\S]*?(<\/script>)/ig, "$1███NOT_MATCHING███$2");
    htmlOriginalPos = htmlOriginalPos.replace(/(<noscript[^>]*>)[\s\S]*?(<\/noscript>)/ig, "$1███NOT_MATCHING███$2");
    htmlOriginalPos = htmlOriginalPos.replace(/(<\!--)[\s\S]*?(-->)/ig, "$1███NOT_MATCHING███$2");
    htmlOriginalPos = htmlOriginalPos.replace(/(<xmp[^>]*>)[\s\S]*?(<\/xmp>)/ig, "$1███NOT_MATCHING███$2");
}

/*
 * 
 * @param {node} node
 * @returns {String} (node id)
 * 
 * return the id of the first parent element with id
 */
function getParentElementId(node){
    while (node && !node.id) {
        node = node.parentNode;
    }
    if (node && node.id){
        return node.id;
    }
}

/*
 * 
 * @param {node} node
 * @returns {String} htmlAux
 * 
 * tries to return the real source code of a given node
 */
function getNodeSourceCode(node) {
    var htmlAux = htmlOriginalPos;
    var htmlIndexAux = htmlAux;
    regexLinksElementsSCindex[index] = 0;
    
    var parentId = getParentElementId(node);
    if (parentId){
        var attrRegex = ' id\\s*=\\s*([\'"]?)' + parentId;
        attrRegex = new RegExp(attrRegex, "i");
        var attrRegexIndex = '';
        var comaType = htmlAux.match(attrRegex);
        if (comaType && comaType[1]){
            comaType = comaType[1];
            attrRegex = '^[\\s\\S]*?(<[^>]* id\\s*=\\s*'+ comaType + parentId + comaType + '[^>]*>)';
            attrRegexIndex = '^([\\s\\S]*?)(<[^>]* id\\s*=\\s*'+ comaType + parentId + comaType + '[^>]*>)[\\s\\S]*$';
        }
        else{
            attrRegex = '^[\\s\\S]*?(<[^>]* id\\s*=\\s*'+ parentId + '(>| [^>]*>))';
            attrRegexIndex = '^([\\s\\S]*?)(<[^>]* id\\s*=\\s*'+ parentId + '(>| [^>]*>))[\\s\\S]*$';
        }
        attrRegex = new RegExp(attrRegex, "i");
        attrRegexIndex = new RegExp(attrRegexIndex, "i");
        htmlAux = htmlAux.replace(attrRegex, "$1");
        htmlIndexAux = htmlIndexAux.replace(attrRegexIndex, "$1");
        regexLinksElementsSCindex[index] = regexLinksElementsSCindex[index] + htmlIndexAux.length;
    }
    var position = getNodePos(node, parentId);
    //console.log("Position: " + position);
    for (var j = 0; j <= position; j++) {
        htmlIndexAux = htmlAux;
        
        var attrRegex = '^[\\s\\S]*?(<' + node.tagName + '[\\s\\n][^>]*>)';
        var attrRegexIndex = '^([\\s\\S]*?)(<' + node.tagName + '[\\s\\n][^>]*>)[\\s\\S]*$';
        attrRegex = new RegExp(attrRegex, "i");
        attrRegexIndex = new RegExp(attrRegexIndex, "i");
        if (j == position){
            htmlAux = htmlAux.replace(attrRegex, "$1");
            htmlIndexAux = htmlIndexAux.replace(attrRegexIndex, "$1");
        }
        else{
            htmlAux = htmlAux.replace(attrRegex, '');
            htmlIndexAux = htmlIndexAux.replace(attrRegexIndex, "$1$2");
            
        }
        regexLinksElementsSCindex[index] = regexLinksElementsSCindex[index] + htmlIndexAux.length;
    }
    
    if (regexLinksElementsSCindex[index]) regexLinksElementsSCindexOriginal[index] = regexLinksElementsSCindex[index];
    
    htmlAux = getWholeElement(htmlAux, node.tagName);

    return htmlAux;
}

/*
 * 
 * @param {String} html
 * @param {String} tagName
 * @returns {String}
 * 
 * returns a tag element extracted from a string according to it's type_
 * 
 * E.g: <a ...><label>Something<a>lalala</a></label></a><div></body>
 * retuns <a ...><label>Something<a>lalala</a></label></a>
 */
function getWholeElement(html, tagName) {
    var attrRegex = '';
    var obert = 0;
    var entra = true;
    var attrRegex = '</?' + tagName + '(>| [^>]*>)';
    attrRegex = new RegExp(attrRegex, "ig");
    while ((obert > 0 || entra) && (match = attrRegex.exec(html))) {
        entra = false;
        if (match[0].match(/<\//))
            obert--;
        else
            obert++;
    }
    return html.substring(0, attrRegex.lastIndex);
}