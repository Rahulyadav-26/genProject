const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

// Setting model selection per user configuration
const MODEL_NAME = "gemini-3-flash-preview";

// Helper for calling Gemini with retries and robust JSON extraction
async function callGemini(prompt, schema, maxRetries = 3, initialDelay = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const config = {
                responseMimeType: "application/json",
            };
            if (schema) {
                const jsonSchema = zodToJsonSchema(schema);
                delete jsonSchema.$schema;
                delete jsonSchema.definitions;
                config.responseSchema = jsonSchema;
            }

            const response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: config
            });

            let cleanText = response.text.trim();
            const firstBrace = cleanText.indexOf('{');
            const lastBrace = cleanText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                cleanText = cleanText.substring(firstBrace, lastBrace + 1);
            }

            return JSON.parse(cleanText);
        } catch (error) {
            lastError = error;
            if (error.status === 503 || error.status === 429 || 
                error.message?.includes("503") || error.message?.includes("429") || 
                error.message?.includes("high demand") || error.message?.includes("quota") ||
                error instanceof SyntaxError) {
                const delay = initialDelay * Math.pow(2, i);
                console.warn(`[AI Service] Transient error (${error.status || error.name}). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("[AI Service] Permanent failure:", error.message);
                throw error;
            }
        }
    }
    throw lastError;
}

// Zod Schemas
const skillGapItemZod = z.object({
    skill: z.string(),
    priorityLevel: z.enum(["low", "medium", "high"])
});
const skillGapSchema = z.object({
    missingSkills: z.array(skillGapItemZod),
    partialSkills: z.array(skillGapItemZod),
    strongMatches: z.array(z.string())
});

const atsScoreSchema = z.object({
    atsScore: z.number().min(0).max(100),
    missingKeywords: z.array(z.string()),
    keywordDensity: z.object({
        overused: z.array(z.string()),
        underused: z.array(z.string())
    }),
    formattingIssues: z.array(z.string()),
    rewrittenSummary: z.string()
});

const questionZod = z.object({
    question: z.string(),
    idealAnswerHint: z.string(),
    redFlags: z.array(z.string())
});
const questionsSchema = z.object({
    technicalQuestions: z.array(questionZod),
    behavioralQuestions: z.array(questionZod),
    situationalQuestions: z.array(questionZod)
});

const prepPhaseZod = z.object({
    focusArea: z.string(),
    resources: z.object({ free: z.array(z.string()), paid: z.array(z.string()) }),
    dailyTimeCommitment: z.string(),
    milestones: z.array(z.string())
});
const prepPlanSchema = z.object({
    day1to30: prepPhaseZod,
    day31to60: prepPhaseZod,
    day61to90: prepPhaseZod
});

const matchScoreSchema = z.object({
    overallMatchScore: z.number().min(0).max(100),
    experienceMatch: z.number().min(0).max(100),
    skillsMatch: z.number().min(0).max(100),
    educationMatch: z.number().min(0).max(100),
    cultureFitSignals: z.array(z.string()),
    hiringRecommendation: z.object({
        fit: z.enum(["strong", "moderate", "weak"]),
        reason: z.string()
    })
});

const resumeRewriteSchema = z.object({
    original: z.string(),
    rewritten: z.string()
});

const mockInterviewEvaluationSchema = z.object({
    score: z.number().min(1).max(10),
    whatWorked: z.string(),
    whatMissed: z.string(),
    idealAnswer: z.string(),
    followUpQuestion: z.string()
});

const coverLetterSchema = z.object({
    coverLetter: z.string()
});

// Feature 1
async function analyzeSkillGaps({ resume, jobDescription }) {
    const prompt = `Given this resume:\n${resume}\n\nAnd this job description:\n${jobDescription}\n\nIdentify specific skill gaps. Use these exact keys: missingSkills (array of {skill, priorityLevel}), partialSkills (array of {skill, priorityLevel}), strongMatches (array of strings). Priority levels MUST be "low", "medium", or "high". Return STRICT JSON.`;
    const res = await callGemini(prompt, skillGapSchema);
    // Normalize enums
    ['missingSkills', 'partialSkills'].forEach(key => {
        if (res[key] && Array.isArray(res[key])) {
            res[key] = res[key].map(item => ({...item, priorityLevel: item.priorityLevel?.toLowerCase() || 'low'}));
        }
    });
    return res;
}

// Feature 2
async function calculateAtsScore({ resume, jobDescription }) {
    const prompt = `Analyze this resume against this job description for ATS compatibility.\nResume:\n${resume}\n\nJD:\n${jobDescription}\n\nReturn STRICT JSON with exact keys: atsScore (number), missingKeywords (array), keywordDensity (object with overused/underused arrays), formattingIssues (array), rewrittenSummary (string).`;
    return callGemini(prompt, atsScoreSchema);
}

// Feature 3
async function generateInterviewQuestions({ resume, jobDescription }) {
    const prompt = `Generate interview questions: Resume:\n${resume}\n\nJD:\n${jobDescription}\n\nReturn STRICT JSON with keys: technicalQuestions (array of {question, idealAnswerHint, redFlags}), behavioralQuestions (array of {question, idealAnswerHint, redFlags}), situationalQuestions (array of {question, idealAnswerHint, redFlags}).`;
    return callGemini(prompt, questionsSchema);
}

// Feature 4
async function createPreparationPlan({ skillGaps }) {
    const prompt = `Create an interview prep plan for these skills: ${JSON.stringify(skillGaps)}.\n\nReturn STRICT JSON with keys: day1to30, day31to60, day61to90. Each should be an object with: focusArea (string), resources (object with free/paid arrays), dailyTimeCommitment (string), milestones (array).`;
    return callGemini(prompt, prepPlanSchema);
}

// Feature 5
async function rewriteResumeSection({ section, jobDescription }) {
    const prompt = `Rewrite this resume section to match this JD.\nSection:\n${section}\nJD:\n${jobDescription}\n\nReturn STRICT JSON with keys: original, rewritten.`;
    return callGemini(prompt, resumeRewriteSchema);
}

// Feature 6
async function calculateMatchScore({ resume, jobDescription }) {
    const prompt = `Score match between resume and job description.\nResume:\n${resume}\nJD:\n${jobDescription}\n\nReturn STRICT JSON with keys: overallMatchScore (number), experienceMatch (number), skillsMatch (number), educationMatch (number), cultureFitSignals (array), hiringRecommendation (object with fit "strong/moderate/weak" and reason string).`;
    const res = await callGemini(prompt, matchScoreSchema);
    if (res.hiringRecommendation?.fit) {
        res.hiringRecommendation.fit = res.hiringRecommendation.fit.toLowerCase();
    }
    return res;
}

// Feature 7
async function simulateMockInterview({ role, company, question, answer }) {
    const prompt = `You are a senior interviewer for ${role} at ${company}. The candidate just answered: "${answer}" to the question "${question}".\n\nEvaluate the answer. Return STRICT JSON.`;
    return callGemini(prompt, mockInterviewEvaluationSchema);
}

// Feature 8
async function generateCoverLetter({ selfDescription, jobDescription, resume }) {
    const prompt = `Write a cover letter for a candidate.\nSelf Description: ${selfDescription}\nResume: ${resume}\nJob Description: ${jobDescription}\n\nTone: confident but not arrogant. Structure: hook -> why this company -> why I'm the fit -> call to action. Avoid clichés like "I am a passionate..." or "I am writing to apply...". Return STRICT JSON with a "coverLetter" string.`;
    return callGemini(prompt, coverLetterSchema);
}

// Legacy Mock
async function generateResumePdf({ resume, jobDescription, selfDescription }) {
    console.warn("[AI Service] generateResumePdf is not yet implemented.");
    return Buffer.from("");
}

module.exports = {
    analyzeSkillGaps,
    calculateAtsScore,
    generateInterviewQuestions,
    createPreparationPlan,
    rewriteResumeSection,
    calculateMatchScore,
    simulateMockInterview,
    generateCoverLetter,
    generateResumePdf
};