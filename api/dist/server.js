"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const models_1 = require("./models");
const seed_1 = require("./utils/seed");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
async function start() {
    try {
        await models_1.sequelize.authenticate();
        await models_1.sequelize.sync();
        if (process.env.NODE_ENV !== 'production') {
            await (0, seed_1.runSeed)();
        }
        app_1.default.listen(PORT, () => {
            console.log(`API listening on :${PORT}`);
        });
    }
    catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map