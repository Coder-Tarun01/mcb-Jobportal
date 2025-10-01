"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeed = runSeed;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
function readJson(relativePath) {
    const full = path_1.default.resolve(process.cwd(), relativePath);
    const raw = fs_1.default.readFileSync(full, 'utf-8');
    return JSON.parse(raw);
}
async function runSeed() {
    try {
        const base = process.env.SEED_DIR || 'seed';
        const users = readJson(`${base}/users.json`);
        const jobs = readJson(`${base}/jobs.json`);
        const candidates = readJson(`${base}/candidates.json`);
        const defaultPassword = await bcryptjs_1.default.hash('password123', 10);
        await Promise.all([
            ...users.map(u => models_1.User.upsert({
                id: String(u.id),
                email: u.email,
                name: u.name,
                password: defaultPassword,
                phone: u.phone ?? null,
                role: (u.role === 'employer' ? 'employer' : 'employee')
            })),
            ...jobs.map(j => models_1.Job.upsert({ id: String(j.id), title: j.title, company: j.company, location: j.location ?? null, type: j.type ?? null, category: j.category ?? null, isRemote: Boolean(j.isRemote), description: j.description ?? null })),
            ...candidates.map(c => models_1.Candidate.upsert({ id: Number(c.id), name: c.name, jobTitle: c.jobTitle ?? null, location: c.location ?? null })),
        ]);
        console.log('Seed data loaded (default password: password123)');
    }
    catch (e) {
        console.warn('Seed failed (this is non-fatal):', e);
    }
}
//# sourceMappingURL=seed.js.map