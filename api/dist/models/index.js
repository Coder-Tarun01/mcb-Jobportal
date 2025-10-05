"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const database_1 = require("../config/database");
exports.sequelize = database_1.sequelize;
__exportStar(require("./User"), exports);
__exportStar(require("./Job"), exports);
__exportStar(require("./Candidate"), exports);
__exportStar(require("./Application"), exports);
__exportStar(require("./SavedJob"), exports);
__exportStar(require("./Notification"), exports);
__exportStar(require("./Company"), exports);
//# sourceMappingURL=index.js.map