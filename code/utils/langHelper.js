/*jslint node:true*/
var Lang = function () {
    "use strict";
    var loadLangFile;
    // Function to load the Language based on User preferred language
    loadLangFile = function getPort(whichLang) {
        var fileName, langData;
        whichLang = (whichLang.toLowerCase() || "en-us") + ".json";
        fileName = "lang_" + whichLang.toLowerCase();
        langData = require("./" + fileName) || {};
        return langData;
    };
    return {
        load: loadLangFile
    };
};
module.exports = new Lang();