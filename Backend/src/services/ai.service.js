const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

async function invokeGeminiAi(maxRetries = 3, initialDelay = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "Hello, how are you? explain what is interview",
            });
            console.log("Gemini Response:", response.text);
            return response.text;
        } catch (error) {
            lastError = error;
            if (error.status === 503 || error.status === 429 || 
                error.message?.includes("503") || error.message?.includes("429") || 
                error.message?.includes("high demand") || error.message?.includes("quota")) {
                const delay = initialDelay * Math.pow(2, i);
                console.warn(`[AI Service] Gemini API transient error (${error.status || 'rate limit'}). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("[AI Service] Permanent failure or unexpected error:", error.message);
                throw error;
            }
        }
    }
    throw lastError;
}

const interviewReportSchema = z.object({
    jobDescription: z.string().min(1, "Job Description is Required"),
    resume: z.string().min(1, "Resume is Required"),
    selfDescription: z.string().min(1, "Self Description is Required"),
    matchScore: z.number().min(0).max(100),
    technicalQuestions: z.array(
        z.object({
            question: z.string().min(1),
            intention: z.string().min(1),
            answer: z.string().min(1)
        })
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string().min(1),
            intention: z.string().min(1),
            answer: z.string().min(1)
        })
    ),
    skillGaps: z.array(
        z.object({
            skill: z.string().min(1),
            severity: z.enum(["low", "medium", "high"]),
        })
    ),
    preparationPlan: z.array(
        z.object({
            day: z.number().min(1),
            focus: z.array(z.string().min(1)),
            tasks: z.array(z.string().min(1))
        })
    )
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }, maxRetries = 3, initialDelay = 2000) {
    const prompt = `
    You are an expert career coach and technical interviewer. Your task is to analyze the candidate's profile against the job description and generate a comprehensive interview preparation report.

    **Input Data:**
    - **Resume:** ${resume}
    - **Self Description:** ${selfDescription}
    - **Job Description:** ${jobDescription}

    **Analysis Requirements:**
    1.  **Match Score:** Calculate a match score between 0 and 100 based on the alignment of skills, experience, and qualifications.
    2.  **Technical Questions:** Generate 5-7 relevant technical questions that cover core concepts, problem-solving, and system design relevant to the job description.
    3.  **Behavioral Questions:** Generate 3-5 behavioral questions that assess soft skills, leadership, teamwork, and cultural fit.
    4.  **Skill Gaps:** Identify key skill gaps (technical or soft) and rate their severity as "low", "medium", or "high".
    5.  **Preparation Plan:** Create a structured 7-day preparation plan with daily focus areas and specific tasks.

    **Output Format:**
    Return the output strictly in JSON format matching the schema provided.
    `;

    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(interviewReportSchema)
                }
            });

            const result = JSON.parse(response.text);
            console.log("Interview Report Generated Successfully");
            console.log(JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            lastError = error;
            if (error.status === 503 || error.status === 429 || 
                error.message?.includes("503") || error.message?.includes("429") || 
                error.message?.includes("high demand") || error.message?.includes("quota")) {
                const delay = initialDelay * Math.pow(2, i);
                console.warn(`[AI Service] Report generation transient error (${error.status || 'rate limit'}). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("[AI Service] Permanent failure during report generation:", error.message);
                throw error;
            }
        }
    }
    throw lastError;
}

module.exports = generateInterviewReport;