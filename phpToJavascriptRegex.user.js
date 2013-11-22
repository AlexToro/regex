// ==UserScript==
// @name        phpToJavascriptRegex
// @namespace   phpToJavascriptRegex
// @version     1
// @grant       none
// author: Alex Toro - alex@volcanicinternet.com


/*
 * 
 * @param {String} regex
 * @returns {RegExp}
 * 
 * This function try to transform a PHP regex to a JS one.
 */
function phpToJavascriptRegex(regex) {
    var delimiter = regex.match(/^[^\w ]/);
    if (delimiter) {
        var modifiersRegex = '\\' + delimiter + '(.*)\\' + delimiter + '([a-zA-Z]*)$';
        modifiersRegex = new RegExp(modifiersRegex, "i");
        var regexParts = regex.match(modifiersRegex);
        if (!regexParts)
            return;
        if (!regexParts[1])
            return;
        var regexContent = regexParts[1];
        if (!checkEscapedDelimiters(regexContent, delimiter))
            return;
        var modifiers = 'g';  //This set the behavior as preg_match_all as default instead of a preg_match
        regexContent = regexContent.replace(/\\\\/g, '\\');
        if (regexParts[2]) {
            var extraModifiers = regexParts[2];
            for (var m = 0; m < extraModifiers.length; m++) {
                if (extraModifiers[m] == 'U') { //Ungreedy
                    // The way of doing it in JS is to set ? after quantifiers. E.g: .* => .*?
                    regexContent = regexContent.replace(/([^\\])\+([^\?])/g, "$1+?$2");
                    regexContent = regexContent.replace(/([^\\])\+$/g, "$1+?");
                    regexContent = regexContent.replace(/([^\\])\*([^\?])/g, "$1*?$2");
                    regexContent = regexContent.replace(/([^\\])\*$/g, "$1*?");
                    regexContent = regexContent.replace(/([^\\])\}([^\?])/g, "$1}?$2");
                    regexContent = regexContent.replace(/([^\\])\}$/g, "$1}?");
                }
                else if (extraModifiers[m] == 's') { //Input as one single line
                    // The way of doing it is by replacing . for [\s\S]. Spaces also can be a new line.
                    regexContent = regexContent.replace(/^\.([\+\*\?])/g, "[\\s\\S]$2");
                    regexContent = regexContent.replace(/([^\\])\.([\+\*\?])/g, "$1[\\s\\S]$2");
                    regexContent = regexContent.replace(/ /g, "[\\s\\n]");
                }
                else if (extraModifiers[m] == 'i') { //Case Insensitive (like PHP regex)
                    modifiers = modifiers + extraModifiers[m];
                }
            }
        }
        return new RegExp(regexContent, modifiers);
    }
    else
        return;
}

/*
 * 
 * @param {String} regexContent
 * @param {String} delimiter
 * @returns {Boolean}
 * 
 * Check if the regex has any not escaped delimiter inside.
 * E.g: /hi/ how are/ it's not a valid regex, it has to be /hi\/ how are/
 */

function checkEscapedDelimiters(regexContent, delimiter) {
    var escapedRegex = '[^\\\\]\\' + delimiter;
    escapedRegex = new RegExp(escapedRegex, "i");
    var match = regexContent.match(escapedRegex);
    if (match) {
        return false;
    }
    var escapedRegex = '^\\' + delimiter;
    escapedRegex = new RegExp(escapedRegex, "i");
    var match = regexContent.match(escapedRegex);
    if (match) {
        return false;
    }
    return true;
}
