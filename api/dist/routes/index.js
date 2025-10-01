"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const jobs_1 = __importDefault(require("./jobs"));
const candidates_1 = __importDefault(require("./candidates"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/users', users_1.default);
router.use('/jobs', jobs_1.default);
router.use('/candidates', candidates_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map