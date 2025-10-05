"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const savedJobs_controller_1 = require("../controllers/savedJobs.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', savedJobs_controller_1.getSavedJobs);
router.post('/', savedJobs_controller_1.saveJob);
router.delete('/:jobId', savedJobs_controller_1.unsaveJob);
exports.default = router;
//# sourceMappingURL=savedJobs.js.map