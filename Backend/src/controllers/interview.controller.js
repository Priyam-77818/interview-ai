const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf, scoreInterviewAnswer } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    const parser = new pdfParse.PDFParse({ data: req.file.buffer })
    const resumeContent = await parser.getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

/**
 * @description Controller to delete an interview report by ID.
 */
async function deleteInterviewReportController(req, res) {
    const { interviewId } = req.params
    const report = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user.id })
    if (!report) {
        return res.status(404).json({ message: "Interview report not found." })
    }
    res.status(200).json({ message: "Interview report deleted successfully." })
}

/**
 * @description Controller to score a user's answer to a mock interview question using AI.
 */
async function scoreAnswerController(req, res) {
    const { question, userAnswer, modelAnswer, jobDescription } = req.body
    if (!question || !userAnswer) {
        return res.status(400).json({ message: "question and userAnswer are required." })
    }
    const result = await scoreInterviewAnswer({ question, userAnswer, modelAnswer, jobDescription })
    res.status(200).json({ message: "Answer scored.", result })
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, deleteInterviewReportController, scoreAnswerController }