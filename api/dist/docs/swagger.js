"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
exports.swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'MCB REST API',
            version: '1.0.0',
            description: 'Jobs, Users, Candidates API',
        },
        servers: [
            { url: 'http://localhost:4000' },
        ],
    },
    // Parse JSDoc in route files for endpoint schemas
    apis: ['src/routes/*.ts', 'src/docs/**/*.ts'],
});
//# sourceMappingURL=swagger.js.map