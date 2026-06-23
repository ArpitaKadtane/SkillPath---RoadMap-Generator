import prisma from '../config/prisma.js';

async function createOrUpdateProfile(req, res) {
    const userId = req.user.id;
    const {
        skillLevel, careerGoal, studyHoursPerWeek, targetCompletionDate,
        learningGoal, learningStyle, experienceLevel, occupation,
        skills, motivation,
    } = req.body;

    if (!skillLevel) {
        return res.status(400).json({
            message: 'Please provide skillLevel',
        });
    }

    if (studyHoursPerWeek !== undefined && (Number(studyHoursPerWeek) < 1 || Number(studyHoursPerWeek) > 80)) {
        return res.status(400).json({
            message: 'Study hours must be between 1 and 80',
        });
    }

    try {
        let targetDate = undefined;
        if (targetCompletionDate) {
            targetDate = new Date(targetCompletionDate);
            if (isNaN(targetDate.getTime())) {
                return res.status(400).json({
                    message: 'Invalid target completion date',
                });
            }
        }

        const existingProfile = await prisma.profile.findUnique({
            where: { userId },
        });

        const data = {
            skillLevel,
            ...(careerGoal !== undefined && { careerGoal }),
            ...(studyHoursPerWeek !== undefined && { studyHoursPerWeek: Number(studyHoursPerWeek) }),
            ...(targetDate !== undefined && { targetCompletionDate: targetDate }),
            ...(learningGoal !== undefined && { learningGoal }),
            ...(learningStyle !== undefined && { learningStyle }),
            ...(experienceLevel !== undefined && { experienceLevel }),
            ...(occupation !== undefined && { occupation }),
            ...(skills !== undefined && { skills }),
            ...(motivation !== undefined && { motivation }),
        };

        let profile;
        if (existingProfile) {
            profile = await prisma.profile.update({
                where: { userId },
                data,
            });
        } else {
            profile = await prisma.profile.create({
                data: {
                    userId,
                    ...data,
                },
            });
        }

        return res.status(existingProfile ? 200 : 201).json({
            message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
            profile: serializeProfile(profile),
        });
    } catch (error) {
        console.error('Profile creation/update error:', error);
        return res.status(500).json({
            message: 'Failed to save profile',
        });
    }
}

async function getProfile(req, res) {
    const userId = req.user.id;

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return res.status(404).json({
                message: 'Profile not found',
                profile: null,
            });
        }

        return res.json({ profile: serializeProfile(profile) });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({
            message: 'Failed to fetch profile',
        });
    }
}

async function updateProfile(req, res) {
    const userId = req.user.id;
    const {
        skillLevel, careerGoal, studyHoursPerWeek, targetCompletionDate,
        learningGoal, learningStyle, experienceLevel, occupation,
        skills, motivation,
    } = req.body;

    if (!skillLevel && !careerGoal && !studyHoursPerWeek && !targetCompletionDate &&
        !learningGoal && !learningStyle && !experienceLevel && !occupation &&
        !skills && !motivation) {
        return res.status(400).json({
            message: 'Please provide at least one field to update',
        });
    }

    if (studyHoursPerWeek && (Number(studyHoursPerWeek) < 1 || Number(studyHoursPerWeek) > 80)) {
        return res.status(400).json({
            message: 'Study hours must be between 1 and 80',
        });
    }

    try {
        const existingProfile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!existingProfile) {
            return res.status(404).json({
                message: 'Profile not found',
            });
        }

        const updateData = {};
        if (skillLevel !== undefined) updateData.skillLevel = skillLevel;
        if (careerGoal !== undefined) updateData.careerGoal = careerGoal;
        if (studyHoursPerWeek !== undefined) updateData.studyHoursPerWeek = Number(studyHoursPerWeek);
        if (targetCompletionDate !== undefined) updateData.targetCompletionDate = new Date(targetCompletionDate);
        if (learningGoal !== undefined) updateData.learningGoal = learningGoal;
        if (learningStyle !== undefined) updateData.learningStyle = learningStyle;
        if (experienceLevel !== undefined) updateData.experienceLevel = experienceLevel;
        if (occupation !== undefined) updateData.occupation = occupation;
        if (skills !== undefined) updateData.skills = skills;
        if (motivation !== undefined) updateData.motivation = motivation;

        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: updateData,
        });

        return res.json({
            message: 'Profile updated successfully',
            profile: serializeProfile(updatedProfile),
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({
            message: 'Failed to update profile',
        });
    }
}

function serializeProfile(profile) {
    return {
        id: profile.id,
        skillLevel: profile.skillLevel,
        careerGoal: profile.careerGoal,
        studyHoursPerWeek: profile.studyHoursPerWeek,
        targetCompletionDate: profile.targetCompletionDate,
        learningGoal: profile.learningGoal,
        learningStyle: profile.learningStyle,
        experienceLevel: profile.experienceLevel,
        occupation: profile.occupation,
        skills: profile.skills,
        motivation: profile.motivation,
    };
}

export { createOrUpdateProfile, getProfile, updateProfile };
