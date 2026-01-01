import React, { useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useToast } from '../../../components/Toast'
import { useNavigate, useParams } from 'react-router'

const TABS = [
    { id: 'technical', label: 'Technical', icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> },
    { id: 'behavioral', label: 'Behavioral', icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
    { id: 'roadmap', label: 'Roadmap', icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg> },
    { id: 'mock', label: 'Mock Interview', icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> },
]

/* ── Copy button ── */
const CopyBtn = ({ text }) => {
    const [copied, setCopied] = useState(false)
    const handleCopy = (e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }
    return (
        <button className="ip__copy-btn" onClick={handleCopy} title="Copy question">
            {copied
                ? <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
            }
        </button>
    )
}

/* ── Question card ── */
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className={`ip__qcard ${open ? 'ip__qcard--open' : ''}`}>
            <button className="ip__qcard-header" onClick={() => setOpen(o => !o)}>
                <span className="ip__qcard-num">Q{index + 1}</span>
                <p className="ip__qcard-q">{item.question}</p>
                <CopyBtn text={item.question} />
                <span className={`ip__qcard-chevron ${open ? 'ip__qcard-chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </button>
            {open && (
                <div className="ip__qcard-body">
                    <div className="ip__qcard-section ip__qcard-section--intent">
                        <span className="ip__tag ip__tag--intent">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            Why they ask this
                        </span>
                        <p>{item.intention}</p>
                    </div>
                    <div className="ip__qcard-section ip__qcard-section--answer">
                        <span className="ip__tag ip__tag--answer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                            How to answer
                        </span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ── Roadmap day ── */
const RoadmapDay = ({ day, total }) => (
    <div className="ip__day">
        <div className="ip__day-left">
            <div className="ip__day-bubble">{day.day}</div>
            {day.day < total && <div className="ip__day-line" />}
        </div>
        <div className="ip__day-content">
            <div className="ip__day-header">
                <h4 className="ip__day-focus">{day.focus}</h4>
                <span className="ip__day-badge">Day {day.day}</span>
            </div>
            <ul className="ip__day-tasks">
                {day.tasks.map((task, i) => (
                    <li key={i}><span className="ip__day-dot" />{task}</li>
                ))}
            </ul>
        </div>
    </div>
)

/* ── Mock Interview Mode ── */
const MockInterview = ({ questions, jobDescription, scoreInterviewAnswer }) => {
    const [qIndex, setQIndex] = useState(0)
    const [answer, setAnswer] = useState('')
    const [result, setResult] = useState(null)
    const [scoring, setScoring] = useState(false)
    const [done, setDone] = useState(false)
    const { toast } = useToast()

    const current = questions[qIndex]

    const handleSubmit = async () => {
        if (!answer.trim()) { toast('Please write an answer first', 'info'); return }
        setScoring(true)
        const res = await scoreInterviewAnswer({
            question: current.question,
            userAnswer: answer,
            modelAnswer: current.answer,
            jobDescription
        })
        setResult(res)
        setScoring(false)
    }

    const handleNext = () => {
        if (qIndex + 1 >= questions.length) { setDone(true); return }
        setQIndex(i => i + 1)
        setAnswer('')
        setResult(null)
    }

    if (done) return (
        <div className="mock__done">
            <div className="mock__done-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3>Mock interview complete!</h3>
            <p>You've gone through all {questions.length} questions. Review your answers above and keep practising.</p>
            <button className="mock__restart" onClick={() => { setQIndex(0); setAnswer(''); setResult(null); setDone(false) }}>
                Restart
            </button>
        </div>
    )

    return (
        <div className="mock">
            {/* Progress */}
            <div className="mock__progress-bar">
                <div className="mock__progress-fill" style={{ width: `${((qIndex) / questions.length) * 100}%` }} />
            </div>
            <div className="mock__meta">
                <span className="mock__counter">Question {qIndex + 1} / {questions.length}</span>
                <span className="mock__type">Practice Mode</span>
            </div>

            {/* Question */}
            <div className="mock__question">
                <span className="mock__q-num">Q{qIndex + 1}</span>
                <p>{current.question}</p>
            </div>

            {/* Answer box */}
            {!result && (
                <div className="mock__answer-wrap">
                    <label className="mock__label">Your Answer</label>
                    <textarea
                        className="mock__textarea"
                        placeholder="Type your answer here... Speak naturally, as if you're in a real interview."
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                    />
                    <div className="mock__actions">
                        <span className="mock__chars">{answer.length} chars</span>
                        <button className="mock__submit" onClick={handleSubmit} disabled={scoring}>
                            {scoring ? (
                                <><span className="mock__spin" /> Scoring...</>
                            ) : (
                                <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg> Score my answer</>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Score result */}
            {result && (
                <div className="mock__result">
                    <div className="mock__score-row">
                        <div className={`mock__score mock__score--${result.score >= 8 ? 'high' : result.score >= 5 ? 'mid' : 'low'}`}>
                            <span className="mock__score-num">{result.score}</span>
                            <span className="mock__score-max">/10</span>
                        </div>
                        <div className="mock__feedback-text">
                            <p>{result.feedback}</p>
                        </div>
                    </div>

                    <div className="mock__details">
                        {result.strongPoints?.length > 0 && (
                            <div className="mock__detail-block mock__detail-block--good">
                                <p className="mock__detail-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                    Strong points
                                </p>
                                <ul>{result.strongPoints.map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                        )}
                        {result.improvements?.length > 0 && (
                            <div className="mock__detail-block mock__detail-block--improve">
                                <p className="mock__detail-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    Improvements
                                </p>
                                <ul>{result.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                        )}
                        {result.betterAnswer && (
                            <div className="mock__detail-block mock__detail-block--better">
                                <p className="mock__detail-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                    Better answer
                                </p>
                                <p className="mock__better-text">{result.betterAnswer}</p>
                            </div>
                        )}
                    </div>

                    <button className="mock__next" onClick={handleNext}>
                        {qIndex + 1 >= questions.length ? 'Finish' : 'Next Question'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </button>
                </div>
            )}
        </div>
    )
}

/* ── Main component ── */
const Interview = () => {
    const [activeTab, setActiveTab] = useState('technical')
    const { report, loading, getResumePdf, scoreInterviewAnswer } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    if (loading || !report) return (
        <div className="loading-screen">
            <div className="spinner" />
            <p>Loading your interview plan...</p>
        </div>
    )

    const scoreClass = report.matchScore >= 80 ? 'high' : report.matchScore >= 60 ? 'mid' : 'low'
    const scoreColor = scoreClass === 'high' ? '#4ade80' : scoreClass === 'mid' ? '#fb923c' : '#f87171'
    const allQuestions = [...report.technicalQuestions, ...report.behavioralQuestions]

    return (
        <div className="ip">
            {/* ── Top bar ── */}
            <header className="ip__topbar">
                <button className="ip__back" onClick={() => navigate('/')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                    Back
                </button>
                <div className="ip__topbar-title">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="8" fill="url(#tlg)" />
                        <path d="M16 6l2.8 8.6H27l-7.2 5.2 2.8 8.6L16 23l-6.6 5.4 2.8-8.6L5 13.6h8.2L16 6z" fill="white" />
                        <defs><linearGradient id="tlg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#a855f7" /></linearGradient></defs>
                    </svg>
                    <span>{report.title || 'Interview Plan'}</span>
                </div>
                <button className="ip__download" onClick={() => getResumePdf(interviewId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Download Resume
                </button>
            </header>

            <div className="ip__body">
                {/* ── Sidebar ── */}
                <aside className="ip__sidebar">
                    <div className="ip__score-card">
                        <p className="ip__label">Match Score</p>
                        <div className="ip__score-ring">
                            <svg viewBox="0 0 100 100" className="ip__score-svg">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 40 * report.matchScore / 100} ${2 * Math.PI * 40}`}
                                    strokeDashoffset={2 * Math.PI * 40 * 0.25}
                                    style={{ filter: `drop-shadow(0 0 8px ${scoreColor})` }}
                                />
                            </svg>
                            <div className="ip__score-inner">
                                <span className="ip__score-num">{report.matchScore}</span>
                                <span className="ip__score-pct">%</span>
                            </div>
                        </div>
                        <p className={`ip__score-label ip__score-label--${scoreClass}`}>
                            {scoreClass === 'high' ? 'Strong match' : scoreClass === 'mid' ? 'Moderate match' : 'Needs work'}
                        </p>
                    </div>

                    <div className="ip__stats">
                        <div className="ip__stat"><span className="ip__stat-num">{report.technicalQuestions.length}</span><span className="ip__stat-label">Technical</span></div>
                        <div className="ip__stat-div" />
                        <div className="ip__stat"><span className="ip__stat-num">{report.behavioralQuestions.length}</span><span className="ip__stat-label">Behavioral</span></div>
                        <div className="ip__stat-div" />
                        <div className="ip__stat"><span className="ip__stat-num">{report.preparationPlan.length}</span><span className="ip__stat-label">Day Plan</span></div>
                    </div>

                    <div className="ip__gaps">
                        <p className="ip__label">Skill Gaps</p>
                        <div className="ip__gaps-list">
                            {report.skillGaps.map((g, i) => (
                                <span key={i} className={`ip__gap ip__gap--${g.severity}`}>{g.skill}</span>
                            ))}
                        </div>
                    </div>

                    {/* Mock interview CTA in sidebar */}
                    <button className="ip__mock-cta" onClick={() => setActiveTab('mock')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        Practice Mock Interview
                    </button>
                </aside>

                {/* ── Main content ── */}
                <main className="ip__main">
                    <div className="ip__tabs">
                        {TABS.map(t => (
                            <button key={t.id} className={`ip__tab ${activeTab === t.id ? 'ip__tab--active' : ''}`} onClick={() => setActiveTab(t.id)}>
                                {t.icon}{t.label}
                                {t.id === 'technical' && <span className="ip__tab-badge">{report.technicalQuestions.length}</span>}
                                {t.id === 'behavioral' && <span className="ip__tab-badge">{report.behavioralQuestions.length}</span>}
                                {t.id === 'mock' && <span className="ip__tab-badge ip__tab-badge--new">NEW</span>}
                            </button>
                        ))}
                    </div>

                    <div className="ip__content">
                        {activeTab === 'technical' && (
                            <div className="ip__qlist">
                                {report.technicalQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
                            </div>
                        )}
                        {activeTab === 'behavioral' && (
                            <div className="ip__qlist">
                                {report.behavioralQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
                            </div>
                        )}
                        {activeTab === 'roadmap' && (
                            <div className="ip__roadmap">
                                {report.preparationPlan.map(day => <RoadmapDay key={day.day} day={day} total={report.preparationPlan.length} />)}
                            </div>
                        )}
                        {activeTab === 'mock' && (
                            <MockInterview
                                questions={allQuestions}
                                jobDescription={report.jobDescription}
                                scoreInterviewAnswer={scoreInterviewAnswer}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Interview
