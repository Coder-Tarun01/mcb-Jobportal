"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobs_controller_1 = require("../controllers/jobs.controller");
const router = (0, express_1.Router)();
router.get('/', jobs_controller_1.listJobs);
router.get('/:id', jobs_controller_1.getJob);
router.post('/', jobs_controller_1.createJob);
router.put('/:id', jobs_controller_1.updateJob);
router.delete('/:id', jobs_controller_1.deleteJob);
exports.default = router;
//# sourceMappingURL=jobs.js.map