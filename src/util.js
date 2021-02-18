// Global Sk object
var Sk = {}; // jshint ignore:line

Sk.build = {
    githash: GITHASH,
    date: BUILDDATE
};

/**
 * Global object no matter where we're running
 */
Sk.global =
    typeof global !== "undefined" ? global : // jshint ignore:line
    typeof self !== "undefined" ? self : // jshint ignore:line
    typeof window !== "undefined" ? window : // jshint ignore:line
    {};

/**
 * Export "object" to global namespace as "name".
 *
 * @param {string} name name to export the object to
 * @param {*} object object to export
 */
Sk.exportSymbol = function (name, object) {

};

Sk.isArrayLike = function (object) {
    if ((object instanceof Array) || (object && object.length && (typeof object.length == "number"))) {
        return true;
    }
    return false;
};

Sk.js_beautify = function (x) {
    return x;
};

Sk.exportSymbol("Sk", Sk);
Sk.exportSymbol("Sk.global", Sk.global);
Sk.exportSymbol("Sk.build", Sk.build);
Sk.exportSymbol("Sk.exportSymbol", Sk.exportSymbol);
Sk.exportSymbol("Sk.isArrayLike", Sk.isArrayLike);
Sk.exportSymbol("Sk.js_beautify", Sk.js_beautify);

module.exports = {
    Sk
};
