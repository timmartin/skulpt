import { astFromParse } from "./src/ast";
import { configure } from "./src/env";
import { ParseNode, Parser, parse, parseTreeDump } from "./src/parser";
import { Ffi } from "./src/ffi";
import { _tokenize } from "./src/tokenize";
import * as Errors from "./src/errors";

interface ParseOutput {
    cst: ParseNode;
    flags: number;
}

interface Builtins {
    BaseException: typeof Errors.BaseException;
    Exception: typeof Errors.Exception;
}

interface Skulpt {
    ParseTables: {
        sym: Record<string, number>;
        number2symbol: Record<number, string>;
        dfas: Record<number, any>;
        states: any[];
        labels: any[];
        keywords: Record<string, number>;
        tokens: Record<number, number>;
        start: number;
    };
    ffi: Ffi;

    configure: typeof configure;

    astFromParse: typeof astFromParse;
    _tokenize: typeof _tokenize;
    parse: typeof parse;

    builtin: Builtins;
}

declare const Sk: Skulpt;

export default Sk;
