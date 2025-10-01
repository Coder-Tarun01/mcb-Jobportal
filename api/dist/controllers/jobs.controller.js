"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listJobs = listJobs;
exports.getJob = getJob;
exports.createJob = createJob;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;
const models_1 = require("../models");
async function listJobs(_req, res, next) {
    try {
        const jobs = await models_1.Job.findAll();
        res.json(jobs);
    }
    catch (e) {
        next(e);
    }
}
async function getJob(req, res, next) {
    try {
        const job = await models_1.Job.findByPk(req.params.id);
        if (!job)
            return res.status(404).json({ message: 'Not found' });
        res.json(job);
    }
    catch (e) {
        next(e);
    }
}
async function createJob(req, res, next) {
    try {
        const created = await models_1.Job.create(req.body);
        res.status(201).json(created);
    }
    catch (e) {
        next(e);
    }
}
async function updateJob(req, res, next) {
    try {
        const job = await models_1.Job.findByPk(req.params.id);
        if (!job)
            return res.status(404).json({ message: 'Not found' });
        await job.update(req.body);
        res.json(job);
    }
    catch (e) {
        next(e);
    }
}
async function deleteJob(req, res, next) {
    try {
        const deleted = await models_1.Job.destroy({ where: { id: req.params.id } });
        res.json({ deleted });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=jobs.controller.js.map