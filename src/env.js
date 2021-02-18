/**
 * Base namespace for Skulpt. This is the only symbol that Skulpt adds to the
 * global namespace. Other user accessible symbols are noted and described
 * below.
 */

const {asserts} = require("assert");

/**
 *
 * Set various customizable parts of Skulpt.
 *
 * output: Replacable output redirection (called from print, etc.).
 * read: Replacable function to load modules with (called via import, etc.)
 * sysargv: Setable to emulate arguments to the script. Should be an array of JS
 * strings.
 * syspath: Setable to emulate PYTHONPATH environment variable (for finding
 * modules). Should be an array of JS strings.
 * nonreadopen: Boolean - set to true to allow non-read file operations
 * fileopen: Optional function to call any time a file is opened
 * filewrite: Optional function to call when writing to a file
 *
 * Any variables that aren't set will be left alone.
 */

const bool_check = function(variable, name) {
    if (variable === undefined || variable === null || typeof variable !== "boolean") {
        throw new Error("must specify " + name + " and it must be a boolean");
    }
};

/**
 * Please use python3 flag to control new behavior that is different
 * between Python 2/3, rather than adding new flags.
 */

const python2 = {
    print_function: false,
    division: false,
    absolute_import: null,
    unicode_literals: false,
    // skulpt specific
    python3: false,
    class_repr: false,
    inherit_from_object: false,
    super_args: false,
    octal_number_literal: false,
    bankers_rounding: false,
    python_version: false,
    dunder_round: false,
    exceptions: false,
    no_long_type: false,
    ceil_floor_int: false,
    silent_octal_literal: true
};

const python3 = {
    print_function: true,
    division: true,
    absolute_import: null,
    unicode_literals: true,
    // skulpt specific
    python3: true,
    class_repr: true,
    inherit_from_object: true,
    super_args: true,
    octal_number_literal: true,
    bankers_rounding: true,
    python_version: true,
    dunder_round: true,
    exceptions: true,
    no_long_type: true,
    ceil_floor_int: true,
    silent_octal_literal: false
};

const configure = function (Sk, options) {
    "use strict";
    Sk.output = options["output"] || Sk.output;
    asserts.assert(typeof Sk.output === "function");

    Sk.debugout = options["debugout"] || Sk.debugout;
    asserts.assert(typeof Sk.debugout === "function");

    Sk.uncaughtException = options["uncaughtException"] || Sk.uncaughtException;
    asserts.assert(typeof Sk.uncaughtException === "function");

    Sk.read = options["read"] || Sk.read;
    asserts.assert(typeof Sk.read === "function");

    Sk.nonreadopen = options["nonreadopen"] || false;
    asserts.assert(typeof Sk.nonreadopen === "boolean");

    Sk.fileopen = options["fileopen"] || undefined;
    asserts.assert(typeof Sk.fileopen === "function" || typeof Sk.fileopen === "undefined");

    Sk.filewrite = options["filewrite"] || undefined;
    asserts.assert(typeof Sk.filewrite === "function" || typeof Sk.filewrite === "undefined");

    Sk.timeoutMsg = options["timeoutMsg"] || Sk.timeoutMsg;
    asserts.assert(typeof Sk.timeoutMsg === "function");

    Sk.sysargv = options["sysargv"] || Sk.sysargv;
    asserts.assert(Sk.isArrayLike(Sk.sysargv));

    Sk.__future__ = options["__future__"] || Sk.python2;

    bool_check(Sk.__future__.print_function, "Sk.__future__.print_function");
    bool_check(Sk.__future__.division, "Sk.__future__.division");
    bool_check(Sk.__future__.unicode_literals, "Sk.__future__.unicode_literals");
    bool_check(Sk.__future__.class_repr, "Sk.__future__.class_repr");
    bool_check(Sk.__future__.inherit_from_object, "Sk.__future__.inherit_from_object");
    bool_check(Sk.__future__.super_args, "Sk.__future__.super_args");
    bool_check(Sk.__future__.octal_number_literal, "Sk.__future__.octal_number_literal");
    bool_check(Sk.__future__.bankers_rounding, "Sk.__future__.bankers_rounding");
    bool_check(Sk.__future__.python_version, "Sk.__future__.python_version");
    bool_check(Sk.__future__.dunder_round, "Sk.__future__.dunder_round");
    bool_check(Sk.__future__.exceptions, "Sk.__future__.exceptions");
    bool_check(Sk.__future__.no_long_type, "Sk.__future__.no_long_type");
    bool_check(Sk.__future__.ceil_floor_int, "Sk.__future__.ceil_floor_int");
    bool_check(Sk.__future__.silent_octal_literal, "Sk.__future__.silent_octal_literal");

    // in __future__ add checks for absolute_import

    Sk.imageProxy = options["imageProxy"] || "http://localhost:8080/320x";
    asserts.assert(typeof Sk.imageProxy === "string" || typeof Sk.imageProxy === "function");

    Sk.inputfun = options["inputfun"] || Sk.inputfun;
    asserts.assert(typeof Sk.inputfun === "function");

    Sk.inputfunTakesPrompt = options["inputfunTakesPrompt"] || false;
    asserts.assert(typeof Sk.inputfunTakesPrompt === "boolean");

    Sk.retainGlobals = options["retainglobals"] || options["retainGlobals"] || false;
    asserts.assert(typeof Sk.retainGlobals === "boolean");

    Sk.debugging = options["debugging"] || false;
    asserts.assert(typeof Sk.debugging === "boolean");

    Sk.killableWhile = options["killableWhile"] || false;
    asserts.assert(typeof Sk.killableWhile === "boolean");

    Sk.killableFor = options["killableFor"] || false;
    asserts.assert(typeof Sk.killableFor === "boolean");

    Sk.signals = typeof options["signals"] !== undefined ? options["signals"] : null;
    if (Sk.signals === true) {
        Sk.signals = {
            listeners: [],
            addEventListener: function (handler) {
                Sk.signals.listeners.push(handler);
            },
            removeEventListener: function (handler) {
                var index = Sk.signals.listeners.indexOf(handler);
                if (index >= 0) {
                    Sk.signals.listeners.splice(index, 1); // Remove items
                }
            },
            signal: function (signal, data) {
                for (var i = 0; i < Sk.signals.listeners.length; i++) {
                    Sk.signals.listeners[i].call(null, signal, data);
                }
            }
        };
    } else {
        Sk.signals = null;
    }
    asserts.assert(typeof Sk.signals === "object");

    Sk.breakpoints = options["breakpoints"] || function() { return true; };
    asserts.assert(typeof Sk.breakpoints === "function");

    Sk.setTimeout = options["setTimeout"];
    if (Sk.setTimeout === undefined) {
        if (typeof setTimeout === "function") {
            Sk.setTimeout = function(func, delay) { setTimeout(func, delay); };
        } else {
            Sk.setTimeout = function(func, delay) { func(); };
        }
    }
    asserts.assert(typeof Sk.setTimeout === "function");

    if ("execLimit" in options) {
        Sk.execLimit = options["execLimit"];
    }

    if ("yieldLimit" in options) {
        Sk.yieldLimit = options["yieldLimit"];
    }

    if (options["syspath"]) {
        Sk.syspath = options["syspath"];
        asserts.assert(Sk.isArrayLike(Sk.syspath));
        // assume that if we're changing syspath we want to force reimports.
        // not sure how valid this is, perhaps a separate api for that.
        Sk.realsyspath = undefined;
        Sk.sysmodules = new Sk.builtin.dict([]);
    }

    Sk.misceval.softspace_ = false;

    switch_version("round$", Sk.__future__.dunder_round);
    switch_version("next$", Sk.__future__.python3);
    switch_version("haskey$", Sk.__future__.python3);
    switch_version("clear$", Sk.__future__.python3);
    switch_version("copy$", Sk.__future__.python3);

    Sk.builtin.lng.prototype.tp$name = Sk.__future__.no_long_type ? "int" : "long";
    Sk.builtin.lng.prototype.ob$type = Sk.__future__.no_long_type ? Sk.builtin.int_ : Sk.builtin.lng;

    Sk.builtin.str.$next = Sk.__future__.python3 ? new Sk.builtin.str("__next__") : new Sk.builtin.str("next");

    Sk.setupOperators(Sk.__future__.python3);
    Sk.setupDunderMethods(Sk.__future__.python3);
    setupDictIterators(Sk, Sk.__future__.python3);
    Sk.setupObjects(Sk.__future__.python3);
    Sk.token.setupTokens(Sk.__future__.python3);
};

/*
 * Replaceable handler for uncaught exceptions
 */
const uncaughtException = function(err) {
    throw err;
};

/*
 *      Replaceable message for message timeouts
 */
const timeoutMsg = function () {
    return "Program exceeded run time limit.";
};

/*
 *  Hard execution timeout, throws an error. Set to null to disable
 */
const execLimit = Number.POSITIVE_INFINITY;

/*
 *  Soft execution timeout, returns a Suspension. Set to null to disable
 */
const yieldLimit = Number.POSITIVE_INFINITY;

/*
 * Replacable output redirection (called from print, etc).
 */
var output = function (x) {
};

/*
 * Replaceable function to load modules with (called via import, etc.)
 * todo; this should be an async api
 */
const read = function (x) {
    if (Sk.builtinFiles === undefined) {
        throw "skulpt-stdlib.js has not been loaded";
    } else if (Sk.builtinFiles.files[x] === undefined) {
        throw "File not found: '" + x + "'";
    }
    return Sk.builtinFiles.files[x];
};

/*
 * Setable to emulate arguments to the script. Should be array of JS strings.
 */
const sysargv = [];

// lame function for sys module
const getSysArgv = function () {
    return Sk.sysargv;
};

/**
 * Setable to emulate PYTHONPATH environment variable (for finding modules).
 * Should be an array of JS strings.
 */
const syspath = [];

const inBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

/**
 * Internal function used for debug output.
 * @param {...} args
 */
var debugout = function (args) {
};

// set up some sane defaults based on availability
if (globalThis["write"] !== undefined) {
    output = globalThis["write"];
} else if (globalThis["console"] !== undefined && globalThis["console"]["log"] !== undefined) {
    output = function (x) {
        globalThis["console"]["log"](x);
    };
} else if (globalThis["print"] !== undefined) {
    output = globalThis["print"];
}

if (globalThis["console"] !== undefined && globalThis["console"]["log"] !== undefined) {
    debugout = function (x) {
        globalThis["console"]["log"](x);
    };
} else if (globalThis["print"] !== undefined) {
    debugout = globalThis["print"];
}

const inputfun = function (args) {
    return window.prompt(args);
};

// Information about method names and their internal functions for
// methods that differ (in visibility or name) between Python 2 and 3.
//
// Format:
//   internal function: {
//     "classes" : <array of affected classes>,
//     2 : <visible Python 2 method name> or null if none
//     3 : <visible Python 3 method name> or null if none
//   },
//   ...

const setup_method_mappings = function () {
    return {
        "round$": {
            "classes": [Sk.builtin.float_,
                        Sk.builtin.int_,
                        Sk.builtin.nmber],
            2: null,
            3: "__round__"
        },
        "clear$": {
            "classes": [Sk.builtin.list],
            2: null,
            3: "clear"
        },
        "copy$": {
            "classes": [Sk.builtin.list],
            2: null,
            3: "copy"
        },
        "next$": {
            "classes": [Sk.builtin.dict_iter_,
                        Sk.builtin.list_iter_,
                        Sk.builtin.set_iter_,
                        Sk.builtin.str_iter_,
                        Sk.builtin.tuple_iter_,
                        Sk.builtin.generator,
                        Sk.builtin.enumerate,
                        Sk.builtin.filter_,
                        Sk.builtin.zip_,
                        Sk.builtin.map_,
                        Sk.builtin.iterator],
            2: "next",
            3: "__next__"
        },
        "haskey$": {
            "classes": [Sk.builtin.dict],
            2: "has_key",
            3: null
        },
    };
};

const switch_version = function (method_to_map, python3) {
    var mapping, klass, classes, idx, len, newmeth, oldmeth, mappings;

    mappings = Sk.setup_method_mappings();

    mapping = mappings[method_to_map];

    if (python3) {
        newmeth = mapping[3];
        oldmeth = mapping[2];
    } else {
        newmeth = mapping[2];
        oldmeth = mapping[3];
    }

    classes = mapping["classes"];
    len = classes.length;
    for (idx = 0; idx < len; idx++) {
        klass = classes[idx];
        if (oldmeth && klass.prototype.hasOwnProperty(oldmeth)) {
            delete klass.prototype[oldmeth];
        }
        if (newmeth) {
            klass.prototype[newmeth] = new Sk.builtin.func(klass.prototype[method_to_map]);
        }
    }
};


function setupDictIterators (Sk, python3) {
    if (python3) {
        Sk.builtin.dict.prototype["keys"] = new Sk.builtin.func(Sk.builtin.dict.prototype.py3$keys);
        Sk.builtin.dict.prototype["values"] = new Sk.builtin.func(Sk.builtin.dict.prototype.py3$values);
        Sk.builtin.dict.prototype["items"] = new Sk.builtin.func(Sk.builtin.dict.prototype.py3$items);
    } else {
        Sk.builtin.dict.prototype["keys"] = new Sk.builtin.func(Sk.builtin.dict.prototype.py2$keys);
        Sk.builtin.dict.prototype["values"] = new Sk.builtin.func(Sk.builtin.dict.prototype.py2$values);
        Sk.builtin.dict.prototype["items"] = new Sk.builtin.func(Sk.builtin.dict.prototype.py2$items);
    }
};

module.exports = {
    bool_check,
    python2,
    python3,
    configure,
    uncaughtException,
    timeoutMsg,
    execLimit,
    yieldLimit,
    output,
    read,
    sysargv,
    getSysArgv,
    syspath,
    inBrowser,
    debugout,
    inputfun,
    setup_method_mappings,
    switch_version
};
