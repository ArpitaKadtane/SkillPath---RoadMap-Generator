function getRoadmapType(durationDays) {
    if (durationDays <= 60) return 'DAILY';
    if (durationDays <= 180) return 'WEEKLY';
    if (durationDays <= 540) return 'MONTHLY';
    return 'QUARTERLY';
}

function normalizeResource(resource) {
    if (typeof resource === 'string') {
        return { title: resource, type: 'Resource', url: '' };
    }

    if (resource && typeof resource === 'object') {
        return {
            title: resource.title || resource.name || resource.url || 'Resource',
            type: resource.type || resource.category || 'Resource',
            url: resource.url || resource.link || '',
        };
    }

    return { title: 'Resource', type: 'Resource', url: '' };
}

function normalizeTextList(value) {
    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === 'string') return item;
                if (item && typeof item === 'object') {
                    return item.title || item.name || item.description || item.goal || item.objective || '';
                }
                return '';
            })
            .filter(Boolean);
    }

    return typeof value === 'string' && value.trim() ? [value] : [];
}

function normalizeProject(project, fallbackTitle = 'Project') {
    if (!project) return undefined;

    if (typeof project === 'string') {
        return { title: fallbackTitle, description: project };
    }

    if (typeof project === 'object') {
        return {
            title: project.title || project.name || fallbackTitle,
            description: project.description || project.summary || project.deliverable || '',
        };
    }

    return undefined;
}

function buildRoadmapInstructions(roadmapType, durationDays, durationWeeks, durationMonths) {
    const sharedInstructions = `
Common quality rules:
- Make the roadmap personalized to the user's goal, current skill level, available time, and target date.
- Avoid generic repeated topics. Every phase must build on the previous phase.
- Keep wording practical, mentor-like, specific, and encouraging.
- Include portfolio-building and real practice, not only theory.
- Prefer official documentation and trusted free resources.
- Return ONLY valid JSON. No markdown, no code fences, no explanation outside JSON.
`;

    if (roadmapType === 'DAILY') {
        return `${sharedInstructions}
Roadmap Type Instructions for DAILY:
- Generate weekly phases.
- Each phase must contain day-wise tasks in a "days" array.
- Generate exactly ${durationDays} total day cards across all phases.
- Day numbers must be sequential from 1 to ${durationDays}.
- Each day needs title, description, estimatedHours, and deliverable.
- Every 7th day should be a revision day or mini project day.
- Each week must include a mini project, checkpoint, and 2-4 resources.
- Do not generate weekly/monthly/quarterly cards instead of daily tasks.

Expected phase shape:
{
  "phase": "Week 1",
  "focus": "",
  "outcome": "",
  "days": [
    {
      "day": 1,
      "title": "",
      "description": "",
      "estimatedHours": 2,
      "deliverable": ""
    }
  ],
  "project": { "title": "", "description": "" },
  "checkpoint": [],
  "resources": [{ "title": "", "type": "Documentation", "url": "" }]
}`;
    }

    if (roadmapType === 'WEEKLY') {
        return `${sharedInstructions}
Roadmap Type Instructions for WEEKLY:
- Generate ${durationWeeks} week-wise milestone cards.
- Each phase should represent one week: Week 1, Week 2, Week 3...
- Do NOT include a "days" array.
- Each week must include focus, goal, milestones, project, deliverables, checkpoint, and resources.
- Weekly milestones should be concrete outcomes, not vague topics.
- The final week should include a portfolio-worthy project or capstone integration.

Expected phase shape:
{
  "phase": "Week 1",
  "focus": "",
  "goal": "",
  "milestones": [],
  "project": { "title": "", "description": "" },
  "deliverables": [],
  "checkpoint": [],
  "resources": [{ "title": "", "type": "Documentation", "url": "" }]
}`;
    }

    if (roadmapType === 'MONTHLY') {
        return `${sharedInstructions}
Roadmap Type Instructions for MONTHLY:
- Generate ${durationMonths} month-wise learning phase cards.
- Each phase should represent one month: Month 1, Month 2, Month 3...
- Do NOT include "days" or week-by-week task arrays.
- Each month must include focus, objectives, project, deliverables, checkpoint, and resources.
- Monthly objectives should describe capability growth and portfolio progress.
- The final month should focus on capstone completion, polish, deployment, and interview readiness.

Expected phase shape:
{
  "phase": "Month 1",
  "focus": "",
  "objectives": [],
  "project": { "title": "", "description": "" },
  "deliverables": [],
  "checkpoint": [],
  "resources": [{ "title": "", "type": "Documentation", "url": "" }]
}`;
    }

    return `${sharedInstructions}
Roadmap Type Instructions for QUARTERLY:
- Generate quarter-wise career progression phase cards.
- Use Quarter 1, Quarter 2, Quarter 3, Quarter 4, and continue if the duration needs more quarters.
- Do NOT include daily, weekly, or month-by-month task arrays.
- Focus on major milestones, career progression, portfolio projects, and industry readiness.
- Each quarter must include focus, milestones, portfolioProjects, deliverables, checkpoint, and resources.
- The final quarter should focus on job readiness, production-quality portfolio polish, applications, interviews, and professional positioning.

Expected phase shape:
{
  "phase": "Quarter 1",
  "focus": "",
  "milestones": [],
  "portfolioProjects": [],
  "deliverables": [],
  "checkpoint": [],
  "resources": [{ "title": "", "type": "Documentation", "url": "" }]
}`;
}

async function generateRoadmapFromAI({ careerGoal, currentSkillLevel, studyHoursPerDay, targetCompletionDate }) {
    console.log("Using Groq AI");

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const targetDate = new Date(targetCompletionDate);
    const now = new Date();
    const durationDays = Math.max(1, Math.round((targetDate - now) / (1000 * 60 * 60 * 24)));
    const durationWeeks = Math.max(1, Math.ceil(durationDays / 7));
    const durationMonths = Math.max(1, Math.ceil(durationDays / 30));
    const roadmapType = getRoadmapType(durationDays);

    console.log(`Provider: Groq`);
    console.log(`Model: ${model}`);
    console.log(`Roadmap type: ${roadmapType}`);
    console.log(`API key exists: ${!!apiKey}`);

    if (!apiKey) {
        console.error("Groq failed: API key is missing");
        throw new Error("Groq API key is missing");
    }

    const prompt = `You are a senior software engineer, career mentor, technical trainer, and professional learning roadmap designer.

Your task is to generate a highly personalized roadmap that feels like it was created by an experienced mentor, not a generic AI.

User Information:
Career Goal: ${careerGoal}
Current Skill Level: ${currentSkillLevel}
Study Hours Per Day: ${studyHoursPerDay}
Target Completion Date: ${targetCompletionDate}
Computed Duration Days: ${durationDays}
Computed Duration Weeks: ${durationWeeks}
Computed Duration Months: ${durationMonths}
Roadmap Type: ${roadmapType}

Skill-level personalization:
- BEGINNER: start with fundamentals, setup, guided practice, and extra explanation.
- INTERMEDIATE: skip absolute basics, emphasize practical implementation and best practices.
- ADVANCED: focus on architecture, scalability, performance, security, deployment, and industry patterns.

${buildRoadmapInstructions(roadmapType, durationDays, durationWeeks, durationMonths)}

Return this top-level JSON shape:
{
  "title": "",
  "summary": "",
  "roadmapType": "${roadmapType}",
  "estimatedDuration": "",
  "phases": []
}

Important:
- "roadmapType" must be exactly "${roadmapType}".
- "estimatedDuration" should be human-readable, like "45 days", "12 weeks", "8 months", or "6 quarters".
- The "phases" array must match the selected roadmap type.
- No markdown, no explanations, no code blocks, JSON only.
`;

    function normalizeRoadmapResult(rawResult) {
        const result = rawResult && typeof rawResult === 'object' ? rawResult : {};
        const normalizedType = result.roadmapType || roadmapType;
        const phases = Array.isArray(result.phases)
            ? result.phases.map((phase, index) => {
                const days = normalizedType === 'DAILY' && Array.isArray(phase.days)
                    ? phase.days.map((day) => {
                        if (typeof day === 'number') {
                            return { day, title: '', description: '', estimatedHours: Number(studyHoursPerDay), deliverable: '' };
                        }

                        return {
                            day: Number(day.day) || 0,
                            title: day.title || '',
                            description: day.description || '',
                            estimatedHours: Number(day.estimatedHours) || Number(studyHoursPerDay),
                            deliverable: day.deliverable || day.output || '',
                        };
                    })
                    : [];

                const resources = Array.isArray(phase.resources)
                    ? phase.resources.map(normalizeResource)
                    : (typeof phase.resources === 'string' ? [normalizeResource(phase.resources)] : []);

                const project = normalizeProject(
                    phase.project || phase.weeklyProject || phase.monthlyProject || phase.capstoneProject,
                    normalizedType === 'DAILY' ? 'Mini Project' : 'Project'
                );

                const portfolioProjects = Array.isArray(phase.portfolioProjects)
                    ? phase.portfolioProjects.map((item) => normalizeProject(item, 'Portfolio Project')).filter(Boolean)
                    : [];

                return {
                    phase: phase.phase || phase.title || phase.week || phase.month || phase.quarter || `${normalizedType} Phase ${index + 1}`,
                    focus: phase.focus || phase.description || '',
                    goal: phase.goal || '',
                    outcome: phase.outcome || phase.goal || '',
                    days,
                    milestones: normalizeTextList(phase.milestones || phase.weeklyMilestones || phase.majorMilestones),
                    objectives: normalizeTextList(phase.objectives || phase.monthlyObjectives),
                    deliverables: normalizeTextList(phase.deliverables || phase.outputs),
                    portfolioProjects,
                    project,
                    checkpoint: Array.isArray(phase.checkpoint)
                        ? phase.checkpoint
                        : (Array.isArray(phase.checkpoints) ? phase.checkpoints : []),
                    resources,
                };
            })
            : [];

        return {
            title: result.title || `${careerGoal} Roadmap`,
            summary: result.summary || '',
            roadmapType: normalizedType,
            estimatedDuration: result.estimatedDuration || `${durationDays} days`,
            phases,
        };
    }

    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const requestPayload = {
        model: model,
        messages: [
            { role: 'system', content: 'You generate professional learning roadmaps. Always respond with valid JSON only.' },
            { role: 'user', content: prompt },
        ],
        temperature: 0.25,
        max_tokens: 4000,
    };

    console.log("Request payload:", JSON.stringify(requestPayload, null, 2));

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestPayload),
        });

        console.log("Groq response status:", res.status);

        if (!res.ok) {
            const text = await res.text();
            console.error("Groq failed:", { status: res.status, body: text });
            throw new Error("Groq roadmap generation failed");
        }

        const data = await res.json();
        console.log("Groq response:", JSON.stringify(data, null, 2));

        const outputText = data?.choices?.[0]?.message?.content || '';

        if (!outputText) {
            console.error("Groq failed: empty response");
            throw new Error("Invalid Groq response");
        }

        const firstJsonMatch = outputText.match(/\{[\s\S]*\}/);
        if (!firstJsonMatch) {
            console.error("Groq failed: no JSON in response");
            throw new Error("Invalid Groq response");
        }

        let parsed;
        try {
            parsed = JSON.parse(firstJsonMatch[0]);
        } catch (parseErr) {
            console.error("Groq failed: JSON parse error:", parseErr.message);
            throw new Error("Invalid Groq response");
        }

        return normalizeRoadmapResult(parsed);
    } catch (err) {
        if (err.message === "Groq API key is missing" ||
            err.message === "Groq roadmap generation failed" ||
            err.message === "Invalid Groq response") {
            throw err;
        }
        console.error("Groq failed:", err);
        throw new Error("Groq roadmap generation failed");
    }
}

export { generateRoadmapFromAI, getRoadmapType };
