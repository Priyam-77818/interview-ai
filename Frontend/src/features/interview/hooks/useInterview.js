import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, deleteInterviewReport, scoreAnswer } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"
import { useToast } from "../../../components/Toast"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    const { toast } = useToast()

    if (!context) throw new Error("useInterview must be used within an InterviewProvider")

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            toast('Interview plan generated!', 'success')
            return response.interviewReport
        } catch (error) {
            toast(error?.response?.data?.message || 'Failed to generate report', 'error')
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (id) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(id)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            toast('Could not load report', 'error')
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (error) {
            toast('Could not load reports', 'error')
            return []
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            toast('Resume downloaded!', 'success')
        } catch (error) {
            toast('Failed to generate resume PDF', 'error')
        } finally {
            setLoading(false)
        }
    }

    const deleteReport = async (id) => {
        try {
            await deleteInterviewReport(id)
            setReports(prev => prev.filter(r => r._id !== id))
            toast('Report deleted', 'success')
        } catch (error) {
            toast('Failed to delete report', 'error')
        }
    }

    const scoreInterviewAnswer = async (payload) => {
        try {
            const response = await scoreAnswer(payload)
            return response.result
        } catch (error) {
            toast('Failed to score answer', 'error')
            return null
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf, deleteReport, scoreInterviewAnswer }
}
