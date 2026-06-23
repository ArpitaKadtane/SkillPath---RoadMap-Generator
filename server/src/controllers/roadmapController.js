import prisma from '../config/prisma.js';
import { generateRoadmapFromAI } from '../utils/aiService.js';

function toJsonSafe(value) {
    return JSON.parse(JSON.stringify(value));
}

function buildTaskDescription(item) {
    const listDetails = [
        Array.isArray(item.milestones) && item.milestones.length ? `Milestones: ${item.milestones.join(', ')}` : '',
        Array.isArray(item.objectives) && item.objectives.length ? `Objectives: ${item.objectives.join(', ')}` : '',
        Array.isArray(item.deliverables) && item.deliverables.length ? `Deliverables: ${item.deliverables.join(', ')}` : '',
    ];

    const details = [
        item.description,
        item.goal && `Goal: ${item.goal}`,
        item.outcome && `Outcome: ${item.outcome}`,
        item.deliverable && `Deliverable: ${item.deliverable}`,
        ...listDetails,
    ];

    return details.filter(Boolean).join('\n');
}

function createTasksFromPhase(roadmapId, phase, phaseOrder) {
    const phaseName = phase.phase || `Phase ${phaseOrder + 1}`;

    if (Array.isArray(phase.days) && phase.days.length) {
        return phase.days.map((day) => ({
            roadmapId,
            title: day.title || `Day ${day.day}`,
            description: buildTaskDescription(day),
            phase: phaseName,
            phaseOrder,
            status: 'pending',
        }));
    }

    return [{
        roadmapId,
        title: phase.focus || phase.goal || phaseName,
        description: buildTaskDescription(phase),
        phase: phaseName,
        phaseOrder,
        status: 'pending',
    }];
}

async function generateRoadmap(req, res) {
    const { careerGoal, currentSkillLevel, studyHoursPerDay, targetCompletionDate, learningPurpose, preferredTech, currentSkills, desiredOutcome, roadmapStyle } = req.body;

    if (!careerGoal?.trim() || !currentSkillLevel || !studyHoursPerDay || !targetCompletionDate) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const studyHours = Number(studyHoursPerDay);
    const targetDate = new Date(targetCompletionDate);

    if (!Number.isFinite(studyHours) || studyHours < 1) {
        return res.status(400).json({ success: false, message: 'Study hours must be at least 1 hour per day' });
    }

    if (Number.isNaN(targetDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Target completion date is invalid' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < today) {
        return res.status(400).json({ success: false, message: 'Target completion date cannot be in the past' });
    }

    try {
        const aiResult = await generateRoadmapFromAI({
            careerGoal: careerGoal.trim(),
            currentSkillLevel,
            studyHoursPerDay: studyHours,
            targetCompletionDate,
        });

        if (!aiResult || !aiResult.title || !Array.isArray(aiResult.phases)) {
            return res.status(500).json({ success: false, message: 'AI returned unexpected format' });
        }

        return res.json({
            roadmap: {
                ...aiResult,
                learningPurpose: learningPurpose || null,
                preferredTech: preferredTech || [],
                currentSkills: currentSkills || [],
                desiredOutcome: desiredOutcome || null,
                roadmapStyle: roadmapStyle || 'Balanced',
            },
        });
    } catch (error) {
        console.error("AI generation failed");
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function createRoadmap(req, res) {
    const userId = req.user.id;
    const { title, goal, skillLevel, studyHoursPerDay, targetCompletionDate, summary, roadmapType, estimatedDuration, phases, learningPurpose, preferredTech, currentSkills, desiredOutcome, roadmapStyle } = req.body;

    if (!title?.trim() || !goal?.trim() || !skillLevel || !studyHoursPerDay || !targetCompletionDate || !Array.isArray(phases)) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const studyHours = Number(studyHoursPerDay);
    const targetDate = new Date(targetCompletionDate);

    if (!Number.isFinite(studyHours) || studyHours < 1) {
        return res.status(400).json({ message: 'Study hours must be at least 1 hour per day' });
    }

    if (Number.isNaN(targetDate.getTime())) {
        return res.status(400).json({ message: 'Target completion date is invalid' });
    }

    try {
        const safePhases = toJsonSafe(phases);

        const saved = await prisma.$transaction(async (tx) => {
            const roadmap = await tx.roadmap.create({
                data: {
                    userId,
                    title: title.trim(),
                    goal: goal.trim(),
                    skillLevel,
                    studyHoursPerDay: studyHours,
                    targetCompletionDate: targetDate,
                    summary: summary || '',
                    estimatedDuration: estimatedDuration || '',
                    phasesData: safePhases,
                    status: 'active',
                    learningPurpose: learningPurpose || null,
                    preferredTech: preferredTech || [],
                    currentSkills: currentSkills || [],
                    desiredOutcome: desiredOutcome || null,
                    roadmapStyle: roadmapStyle || 'Balanced',
                },
            });

            const tasksToCreate = [];
            safePhases.forEach((phase, pIndex) => {
                tasksToCreate.push(...createTasksFromPhase(roadmap.id, phase, pIndex));
            });

            if (tasksToCreate.length) {
                await tx.roadmapTask.createMany({ data: tasksToCreate });
            }

            return tx.roadmap.findUnique({
                where: { id: roadmap.id },
                include: { tasks: true },
            });
        });

        return res.status(201).json({ roadmap: { ...saved, roadmapType: roadmapType || '' } });
    } catch (error) {
        console.error('Create roadmap error:', error);
        return res.status(500).json({
            message: process.env.NODE_ENV === 'production'
                ? 'Failed to save roadmap'
                : `Failed to save roadmap: ${error.message}`,
        });
    }
}

async function getMyRoadmaps(req, res) {
    const userId = req.user.id;
    try {
        const roadmaps = await prisma.roadmap.findMany({
            where: { userId },
            include: { tasks: true },
            orderBy: { createdAt: 'desc' },
        });

        return res.json({ roadmaps });
    } catch (error) {
        console.error('Fetch roadmaps error:', error);
        return res.status(500).json({ message: 'Failed to fetch roadmaps' });
    }
}

async function getMyRoadmapById(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const roadmap = await prisma.roadmap.findUnique({
            where: { id },
            include: { tasks: true },
        });

        if (!roadmap || roadmap.userId !== userId) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        return res.json({ roadmap });
    } catch (error) {
        console.error('Fetch roadmap by id error:', error);
        return res.status(500).json({ message: 'Failed to fetch roadmap' });
    }
}

async function deleteRoadmap(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const roadmap = await prisma.roadmap.findUnique({
            where: { id },
        });

        if (!roadmap || roadmap.userId !== userId) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        await prisma.roadmap.delete({ where: { id } });

        return res.json({ message: 'Roadmap deleted successfully' });
    } catch (error) {
        console.error('Delete roadmap error:', error);
        return res.status(500).json({ message: 'Failed to delete roadmap' });
    }
}

async function updateTaskStatus(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const task = await prisma.roadmapTask.findUnique({
            where: { id },
            include: { roadmap: true },
        });

        if (!task || task.roadmap.userId !== userId) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updated = await prisma.roadmapTask.update({
            where: { id },
            data: { status },
        });

        const allTasks = await prisma.roadmapTask.findMany({
            where: { roadmapId: task.roadmapId },
        });

        const allDone = allTasks.length > 0 && allTasks.every((t) => t.status === 'completed');

        if (allDone) {
            await prisma.roadmap.update({
                where: { id: task.roadmapId },
                data: { status: 'completed' },
            });
        } else if (task.roadmap.status === 'completed') {
            await prisma.roadmap.update({
                where: { id: task.roadmapId },
                data: { status: 'active' },
            });
        }

        return res.json({ task: updated, roadmapStatus: allDone ? 'completed' : 'active' });
    } catch (error) {
        console.error('Update task status error:', error);
        return res.status(500).json({ message: 'Failed to update task status' });
    }
}

export { generateRoadmap, createRoadmap, getMyRoadmaps, getMyRoadmapById, deleteRoadmap, updateTaskStatus };
