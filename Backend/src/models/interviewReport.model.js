const mongoose = require('mongoose');

const skillGapItemSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    priorityLevel: { type: String, enum: ["low", "medium", "high"], required: true }
}, { _id: false });

const skillGapAnalysisSchema = new mongoose.Schema({
    missingSkills: [skillGapItemSchema],
    partialSkills: [skillGapItemSchema],
    strongMatches: [String]
}, { _id: false });

const atsAnalysisSchema = new mongoose.Schema({
    atsScore: { type: Number, min: 0, max: 100, required: true },
    missingKeywords: [String],
    keywordDensity: {
        overused: [String],
        underused: [String]
    },
    formattingIssues: [String],
    rewrittenSummary: String
}, { _id: false });

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    idealAnswerHint: { type: String, required: true },
    redFlags: [String]
}, { _id: false });

const prepPhaseSchema = new mongoose.Schema({
    focusArea: { type: String, required: true },
    resources: {
        free: [String],
        paid: [String]
    },
    dailyTimeCommitment: String,
    milestones: [String]
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day1to30: prepPhaseSchema,
    day31to60: prepPhaseSchema,
    day61to90: prepPhaseSchema
}, { _id: false });

const matchAnalysisSchema = new mongoose.Schema({
    overallMatchScore: { type: Number, min: 0, max: 100, required: true },
    experienceMatch: { type: Number, min: 0, max: 100 },
    skillsMatch: { type: Number, min: 0, max: 100 },
    educationMatch: { type: Number, min: 0, max: 100 },
    cultureFitSignals: [String],
    hiringRecommendation: {
        fit: { type: String, enum: ["strong", "moderate", "weak"] },
        reason: String
    }
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: true },
    resume: { type: String, required: true },
    selfDescription: { type: String, required: true },
    
    // Feature 1: Skill Gap Analysis
    skillGapAnalysis: skillGapAnalysisSchema,

    // Feature 2: ATS Score + Keyword Optimization
    atsAnalysis: atsAnalysisSchema,

    // Feature 3: Interview Question Generator
    technicalQuestions: [questionSchema],
    behavioralQuestions: [questionSchema],
    situationalQuestions: [questionSchema],

    // Feature 4: 30-60-90 Day Preparation Plan
    preparationPlan: preparationPlanSchema,

    // Feature 6: Candidate-JD Match Score
    matchAnalysis: matchAnalysisSchema,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InterviewReport', interviewReportSchema);
