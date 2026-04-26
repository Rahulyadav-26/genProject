const pdfParse = require("pdf-parse")
const { 
    analyzeSkillGaps,
    calculateAtsScore,
    generateInterviewQuestions,
    createPreparationPlan,
    rewriteResumeSection,
    calculateMatchScore,
    simulateMockInterview,
    generateCoverLetter,
    generateResumePdf 
} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate comprehensive interview report.
 */
async function generateInterviewReportController(req, res) {
    try {
        const resumeFile = req.files?.resume?.[0];
        if (!resumeFile) {
            return res.status(400).json({ message: "Resume file is required." });
        }

        const parser = new pdfParse.PDFParse({ data: resumeFile.buffer });
        const resumeContent = await parser.getText();
        const { selfDescription, jobDescription } = req.body;
        const resume = resumeContent.text;

        // Run independent AI analyses in parallel to save time
        const [skillGapAnalysis, atsAnalysis, questions, matchAnalysis] = await Promise.all([
            analyzeSkillGaps({ resume, jobDescription }),
            calculateAtsScore({ resume, jobDescription }),
            generateInterviewQuestions({ resume, jobDescription }),
            calculateMatchScore({ resume, jobDescription })
        ]);

        // Prep plan depends on the generated skill gaps
        const preparationPlan = await createPreparationPlan({ skillGaps: skillGapAnalysis });

        console.log("AI Analysis Done. Results collected.");
        
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume,
            selfDescription,
            jobDescription,
            skillGapAnalysis,
            atsAnalysis,
            technicalQuestions: questions.technicalQuestions,
            behavioralQuestions: questions.behavioralQuestions,
            situationalQuestions: questions.situationalQuestions,
            preparationPlan,
            matchAnalysis
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Error generating report.", error: String(error) });
    }
}

async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." });
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    });
}

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -situationalQuestions -skillGapAnalysis -preparationPlan -atsAnalysis");

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    });
}

// Standalone Tools

async function rewriteResumeSectionController(req, res) {
    try {
        const { section, jobDescription } = req.body;
        if (!section || !jobDescription) return res.status(400).json({ message: "section and jobDescription are required." });

        const result = await rewriteResumeSection({ section, jobDescription });
        res.status(200).json({ message: "Section rewritten", result });
    } catch (error) {
        res.status(500).json({ message: "Error rewriting resume", error: String(error) });
    }
}

async function simulateMockInterviewController(req, res) {
    try {
        const { role, company, question, answer } = req.body;
        if (!role || !company || !question || !answer) return res.status(400).json({ message: "role, company, question, and answer are required." });

        const result = await simulateMockInterview({ role, company, question, answer });
        res.status(200).json({ message: "Mock interview evaluated", result });
    } catch (error) {
        res.status(500).json({ message: "Error evaluating interview", error: String(error) });
    }
}

async function generateCoverLetterController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;
        const resumeFile = req.files?.resume?.[0];
        
        let resume = "";
        
        // We can either require a resume file or just resume text. 
        // For consistency, let's parse a file if provided, otherwise check for text in body.
        if (resumeFile) {
            const parser = new pdfParse.PDFParse({ data: resumeFile.buffer });
            const resumeContent = await parser.getText();
            resume = resumeContent.text;
        } else if (req.body.resume) {
            resume = req.body.resume;
        } else {
            return res.status(400).json({ message: "resume (file or text) and jobDescription are required." });
        }

        if (!jobDescription) return res.status(400).json({ message: "jobDescription is required." });

        const result = await generateCoverLetter({ selfDescription: selfDescription || "", jobDescription, resume });
        res.status(200).json({ message: "Cover letter generated", result });
    } catch (error) {
        res.status(500).json({ message: "Error generating cover letter", error: String(error) });
    }
}

// Legacy Mock
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;
    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) return res.status(404).json({ message: "Interview report not found." });

    const { resume, jobDescription, selfDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    });
    res.send(pdfBuffer);
}

module.exports = { 
    generateInterviewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    rewriteResumeSectionController,
    simulateMockInterviewController,
    generateCoverLetterController,
    generateResumePdfController
};