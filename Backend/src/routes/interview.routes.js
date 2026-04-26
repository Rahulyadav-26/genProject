const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

// 1. Generate Comprehensive Report (Features 1, 2, 3, 4, 6)
interviewRouter.post("/", authMiddleware.authUser, upload.fields([{ name: "resume", maxCount: 1 }]), interviewController.generateInterviewReportController);

// 2. Rewrite Resume Section (Feature 5)
interviewRouter.post("/rewrite-resume", authMiddleware.authUser, interviewController.rewriteResumeSectionController);

// 3. Mock Interview Simulator (Feature 7)
interviewRouter.post("/mock-interview", authMiddleware.authUser, interviewController.simulateMockInterviewController);

// 4. Generate Cover Letter (Feature 8)
interviewRouter.post("/cover-letter", authMiddleware.authUser, upload.fields([{ name: "resume", maxCount: 1 }]), interviewController.generateCoverLetterController);

// 5. Get all reports
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

// 6. Get report by ID
interviewRouter.get("/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

// 7. Download PDF (Placeholder)
interviewRouter.get("/:interviewReportId/pdf", authMiddleware.authUser, interviewController.generateResumePdfController);

module.exports = interviewRouter;