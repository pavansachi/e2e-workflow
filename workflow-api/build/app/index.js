"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
const util_1 = require("./service/util");
var x = 10;
function hello(who) {
    (0, util_1.log)('this is a message');
    //`Hello ${who}! `;
}
exports.hello = hello;
hello('pavan');
