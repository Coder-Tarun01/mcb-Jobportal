"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSavedJobs = getSavedJobs;
exports.saveJob = saveJob;
exports.unsaveJob = unsaveJob;
const models_1 = require("../models");
async function getSavedJobs(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const savedJobs = await models_1.SavedJob.findAll({
            where: { userId },
            include: [{ model: models_1.Job, as: 'job' }],
        });
        res.json(savedJobs);
    }
    catch (e) {
        next(e);
    }
}
async function saveJob(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { jobId } = req.body;
        if (!jobId)
            return res.status(400).json({ message: 'Job ID is required' });
        const existing = await models_1.SavedJob.findOne({
            where: { userId, jobId }
        });
        if (existing) {
            return res.status(409).json({ message: 'Job already saved' });
        }
        const savedJob = await models_1.SavedJob.create({ userId, jobId });
        res.status(201).json(savedJob);
    }
    catch (e) {
        next(e);
    }
}
async function unsaveJob(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const deleted = await models_1.SavedJob.destroy({
            where: { userId, jobId: req.params.jobId }
        });
        res.json({ deleted: deleted > 0 });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=savedJobs.controller.js.map