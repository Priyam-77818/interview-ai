import React, { useState, useRef } from 'react'
import '../style/home.scss'
import '../components/sections.scss'
import DashboardPreview from '../components/DashboardPreview'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth'
import { useNavigate } from 'react-router'

const REVIEWS = [
  { name:'Priya Sharma', role:'SDE @ Amazon', avatar:'P', color:'#7c3aed',
    text:"Got an offer at Amazon after using InterviewAI for 2 weeks. The skill gap analysis was spot-on — it told me exactly what to study.", stars:5 },
  { name:'James Liu', role:'Frontend Eng @ Stripe', avatar:'J', color:'#ec4899',
    text:"The mock interview feature is incredible. Scored my answers instantly and gave better alternatives. Felt so prepared walking in.", stars:5 },
  { name:'Rahul Verma', role:'Backend Dev @ Flipkart', avatar:'R', color:'#22d3ee',
    text:"Uploaded my resume and pasted the JD — within 30 seconds I had a full 14-day prep plan. This is the future of interview prep.", stars:5 },
  { name:'Sofia Mendez', role:'ML Engineer @ Google', avatar:'S', color:'#4ade80',
    text:"The tailored resume PDF generator is amazing. Restructured my experience perfectly for the role. Recruiters noticed the difference.", stars:5 },
  { name:'Alex Chen', role:'Full Stack @ Notion', avatar:'A', color:'#fb923c',
    text:"I've tried many platforms but nothing comes close to the personalization here. The behavioral question insights alone are worth it.", stars:5 },
  { name:'Nina Patel', role:'Data Scientist @ Netflix', avatar:'N', color:'#a855f7',
    text:"Match score helped me quickly see I was targeting the right role. Prep plan kept me on track. Landed the job in 3 weeks!", stars:5 },
]

const FEATURES = [
  { icon:'💡', color:'rgba(124,58,237,.15)', border:'rgba(124,58,237,.25)',
    title:'AI Match Score', desc:'Instantly see how well your profile matches the job description with a 0–100 compatibility score.' },
  { icon:'🎯', color:'rgba(34,211,238,.1)', border:'rgba(34,211,238,.2)',
    title:'Targeted Questions', desc:'Get technical and behavioral questions tailored specifically to the job — not generic lists.' },
  { icon:'📅', color:'rgba(74,222,128,.1)', border:'rgba(74,222,128,.2)',
    title:'Day-by-Day Roadmap', desc:'A personalized prep plan tells you exactly what to study each day leading up to your interview.' },
  { icon:'⚡', color:'rgba(251,146,60,.1)', border:'rgba(251,146,60,.2)',
    title:'Mock Interview Mode', desc:'Practice answering questions one by one and get AI scoring, strong points, and a better answer instantly.' },
  { icon:'📄', color:'rgba(236,72,153,.1)', border:'rgba(236,72,153,.2)',
    title:'Resume PDF Generator', desc:'AI rewrites your resume tailored to the job description and exports a polished ATS-friendly PDF.' },
  { icon:'🔍', color:'rgba(168,85,247,.12)', border:'rgba(168,85,247,.25)',
    title:'Skill Gap Analysis', desc:'Identifies exactly which skills you are missing and rates their severity so you know where to focus.' },
]

const STEPS = [
  { num:'01', icon:'📋', color:'rgba(34,211,238,.12)', border:'rgba(34,211,238,.2)', iconColor:'#22d3ee',
    title:'Paste Job Description', desc:'Copy the full job posting from any job board and paste it in. Our AI reads the requirements.' },
  { num:'02', icon:'📂', color:'rgba(124,58,237,.12)', border:'rgba(124,58,237,.25)', iconColor:'#a78bfa',
    title:'Upload Your Resume', desc:'Upload your resume PDF or type a quick self-description if you do not have one handy.' },
  { num:'03', icon:'✨', color:'rgba(236,72,153,.1)', border:'rgba(236,72,153,.2)', iconColor:'#f472b6',
    title:'Get Your Plan', desc:'In 30 seconds, receive questions, skill gaps, a prep roadmap, and a tailored resume PDF.' },
]

const Home = () => {
    const { loading, generateReport, reports, deleteReport } = useInterview()
    const { handleLogout, user } = useAuth()
    const [jobDescription, setJobDescription] = useState('')
    const [selfDescription, setSelfDescription] = useState('')
    const [jdLen, setJdLen] = useState(0)
    const [fileName, setFileName] = useState(null)
    const [search, setSearch] = useState('')
    const [filterScore, setFilterScore] = useState('all')
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFileName(file ? file.name : null)
    }

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data) navigate(`/interview/${data._id}`)
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (deleteConfirm === id) { await deleteReport(id); setDeleteConfirm(null) }
        else { setDeleteConfirm(id); setTimeout(() => setDeleteConfirm(null), 3000) }
    }

    const filteredReports = reports.filter(r => {
        const matchSearch = (r.title || '').toLowerCase().includes(search.toLowerCase())
        const matchScore = filterScore === 'all' ? true
            : filterScore === 'high' ? r.matchScore >= 80
            : filterScore === 'mid'  ? r.matchScore >= 60 && r.matchScore < 80
            : r.matchScore < 60
        return matchSearch && matchScore
    })

    if (loading) return (
        <div className="loading-screen">
            <div className="spinner" />
            <p>Generating your interview plan...</p>
        </div>
    )

    return (
        <div className="hp">
            {/* ── Navbar ── */}
            <nav className="hp__nav">
                <div className="hp__nav-logo">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="9" fill="url(#nlg)" />
                        <path d="M16 6l2.8 8.6H27l-7.2 5.2 2.8 8.6L16 23l-6.6 5.4 2.8-8.6L5 13.6h8.2L16 6z" fill="white" />
                        <defs><linearGradient id="nlg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#a855f7" /></linearGradient></defs>
                    </svg>
                    <span>InterviewAI</span>
                </div>
                <div className="hp__nav-right">
                    <div className="hp__avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
                    <span className="hp__username">{user?.username}</span>
                    <button className="hp__logout" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Logout
                    </button>
                </div>
            </nav>

            {/* ── Hero (two-column) ── */}
            <div className="hp__hero">
                <div className="hp__hero-glow" />

                {/* Left: text */}
                <div className="hp__hero-left">
                    <div className="hp__hero-pill"><span className="hp__hero-dot" />Powered by Gemini AI</div>
                    <h1 className="hp__hero-title">Your personalized<br /><span className="hp__hero-gradient">interview strategy</span></h1>
                    <p className="hp__hero-sub">Upload your resume, paste a job description, and get tailored questions, skill gap analysis and a day-by-day prep roadmap — in 30 seconds.</p>
                    <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
                        <a href="#create" style={{padding:'.72rem 1.75rem',background:'linear-gradient(135deg,#7c3aed,#a855f7)',color:'#fff',borderRadius:'10px',fontWeight:700,fontSize:'.9rem',textDecoration:'none',boxShadow:'0 0 28px rgba(124,58,237,.45)',display:'flex',alignItems:'center',gap:'.5rem'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                            Get Started Free
                        </a>
                        <a href="#how" style={{padding:'.72rem 1.5rem',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'#fff',borderRadius:'10px',fontWeight:600,fontSize:'.9rem',textDecoration:'none'}}>See How It Works</a>
                    </div>
                    {/* Trust badges */}
                    <div style={{display:'flex',alignItems:'center',gap:'1.25rem',flexWrap:'wrap',paddingTop:'.25rem'}}>
                        {[['✓','Free forever'],['✓','No credit card'],['✓','Results in 30s']].map(([ic,txt]) => (
                            <span key={txt} style={{fontSize:'.78rem',color:'rgba(196,181,253,.7)',display:'flex',alignItems:'center',gap:'.3rem'}}>
                                <span style={{color:'#4ade80',fontWeight:700}}>{ic}</span>{txt}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: dashboard preview */}
                <div className="hp__hero-right">
                    <DashboardPreview />
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div className="hp__stats-bar">
                {[{num:'50k+',label:'Reports Generated'},{num:'94%',label:'Interview Success Rate'},{num:'30s',label:'Avg Generation Time'},{num:'6',label:'AI-Powered Features'}].map(s => (
                    <div key={s.label} className="hp__stat-item">
                        <span className="hp__stat-num">{s.num}</span>
                        <span className="hp__stat-label">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* ── How It Works ── */}
            <div className="hp__how" id="how">
                <div className="hp__section-pill">How It Works</div>
                <h2 className="hp__section-title">From job posting to <em>interview-ready</em></h2>
                <p className="hp__section-sub">Three simple steps and you have everything you need to walk into any interview with confidence.</p>
                <div className="hp__steps">
                    {STEPS.map(s => (
                        <div key={s.num} className="hp__step">
                            <div className="hp__step-num">{s.num}</div>
                            <div className="hp__step-icon" style={{background:s.color,border:`1px solid ${s.border}`}}>
                                <span style={{fontSize:'1.2rem'}}>{s.icon}</span>
                            </div>
                            <h4>{s.title}</h4>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Features Grid ── */}
            <div className="hp__features">
                <div className="hp__features-header">
                    <div className="hp__section-pill">Features</div>
                    <h2 className="hp__section-title">Everything you need to <em>land the job</em></h2>
                    <p className="hp__section-sub" style={{margin:'0 auto'}}>Six powerful AI features in one platform — no subscriptions, no limits.</p>
                </div>
                <div className="hp__features-grid">
                    {FEATURES.map(f => (
                        <div key={f.title} className="hp__feat-card">
                            <div className="hp__feat-icon" style={{background:f.color,border:`1px solid ${f.border}`}}>
                                <span style={{fontSize:'1.3rem'}}>{f.icon}</span>
                            </div>
                            <h4>{f.title}</h4>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Main Form ── */}
            <div className="hp__form-wrap" id="create">
                <div style={{textAlign:'center',marginBottom:'2rem'}}>
                    <div className="hp__section-pill">Create Your Plan</div>
                    <h2 className="hp__section-title">Ready to start preparing?</h2>
                </div>
                <div className="hp__grid">
                    <div className="hp__panel">
                        <div className="hp__panel-head">
                            <div className="hp__panel-icon hp__panel-icon--blue"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg></div>
                            <div><h3>Job Description</h3><p>Paste the full job posting</p></div>
                            <span className="hp__required">Required</span>
                        </div>
                        <textarea className="hp__textarea" placeholder="e.g. Senior Frontend Engineer at Google. Requires proficiency in React, TypeScript, system design..." maxLength={5000} onChange={e => { setJobDescription(e.target.value); setJdLen(e.target.value.length) }} />
                        <div className="hp__char-count">{jdLen} / 5000</div>
                    </div>
                    <div className="hp__panel">
                        <div className="hp__panel-head">
                            <div className="hp__panel-icon hp__panel-icon--purple"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div>
                            <div><h3>Your Profile</h3><p>Resume or self-description</p></div>
                        </div>
                        <label className={`hp__dropzone ${fileName ? 'hp__dropzone--filled' : ''}`} htmlFor="resume-input">
                            {fileName ? (<><div className="hp__dropzone-file-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div><span className="hp__dropzone-filename">{fileName}</span><span className="hp__dropzone-change">Click to change</span></>) : (<><div className="hp__dropzone-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg></div><span className="hp__dropzone-title">Drop your resume here</span><span className="hp__dropzone-sub">PDF or DOCX · Max 5MB</span></>)}
                            <input ref={resumeInputRef} id="resume-input" type="file" accept=".pdf,.docx" hidden onChange={handleFileChange} />
                        </label>
                        <div className="hp__or"><span /><p>or describe yourself</p><span /></div>
                        <textarea className="hp__textarea hp__textarea--short" placeholder="5 years of React, built 3 production apps, proficient in Node.js and system design..." onChange={e => setSelfDescription(e.target.value)} />
                    </div>
                </div>
                <div className="hp__cta-row">
                    <p className="hp__cta-hint"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>Takes about 30 seconds</p>
                    <button className="hp__cta" onClick={handleGenerateReport}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>Generate Interview Strategy</button>
                </div>
            </div>

            {/* ── Recent Reports ── */}
            {reports.length > 0 && (
                <div className="hp__reports">
                    <div className="hp__reports-header">
                        <div><h2>Recent Plans</h2><span>{filteredReports.length} of {reports.length}</span></div>
                        <div className="hp__reports-controls">
                            <div className="hp__search">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                <input type="text" placeholder="Search by title..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <div className="hp__filter">
                                {['all','high','mid','low'].map(f => (
                                    <button key={f} className={`hp__filter-btn ${filterScore===f?'hp__filter-btn--active':''}`} onClick={() => setFilterScore(f)}>
                                        {f==='all'?'All':f==='high'?'≥80%':f==='mid'?'60–79%':'<60%'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {filteredReports.length === 0 ? (
                        <div className="hp__empty">No plans match your filters.</div>
                    ) : (
                        <div className="hp__reports-grid">
                            {filteredReports.map(r => (
                                <div key={r._id} className="hp__report-card" onClick={() => navigate(`/interview/${r._id}`)}>
                                    <div className="hp__report-card-top">
                                        <h4>{r.title || 'Untitled Position'}</h4>
                                        <div className={`hp__score hp__score--${r.matchScore>=80?'high':r.matchScore>=60?'mid':'low'}`}>{r.matchScore}%</div>
                                    </div>
                                    <p>{new Date(r.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</p>
                                    <div className="hp__report-card-footer">
                                        <button className={`hp__delete-btn ${deleteConfirm===r._id?'hp__delete-btn--confirm':''}`} onClick={(e) => handleDelete(e,r._id)} title={deleteConfirm===r._id?'Click again to confirm':'Delete report'}>
                                            {deleteConfirm===r._id?(<><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Confirm</>):(<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>)}
                                        </button>
                                        <div className="hp__report-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Reviews ── */}
            <div className="hp__reviews">
                <div className="hp__reviews-header">
                    <div className="hp__section-pill">Testimonials</div>
                    <h2 className="hp__section-title">Loved by <em>job seekers worldwide</em></h2>
                    <p className="hp__section-sub" style={{margin:'0 auto'}}>Real people, real offers. See what candidates say after using InterviewAI.</p>
                </div>
                <div className="hp__reviews-grid">
                    {REVIEWS.map(r => (
                        <div key={r.name} className="hp__review-card">
                            <div className="hp__review-stars">{Array(r.stars).fill(0).map((_,i) => <span key={i} className="hp__star">★</span>)}</div>
                            <p className="hp__review-text">{r.text}</p>
                            <div className="hp__review-author">
                                <div className="hp__review-avatar" style={{background:r.color}}>{r.avatar}</div>
                                <div><div className="hp__review-name">{r.name}</div><div className="hp__review-role">{r.role}</div></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="hp__footer">
                <div className="hp__footer-inner">
                    <div className="hp__footer-brand">
                        <div className="hp__footer-logo">
                            <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="9" fill="url(#flg)" /><path d="M16 6l2.8 8.6H27l-7.2 5.2 2.8 8.6L16 23l-6.6 5.4 2.8-8.6L5 13.6h8.2L16 6z" fill="white" /><defs><linearGradient id="flg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#a855f7" /></linearGradient></defs></svg>
                            <span>InterviewAI</span>
                        </div>
                        <p className="hp__footer-desc">AI-powered interview preparation that helps you land the job you deserve. Built with Gemini AI.</p>
                        <div className="hp__footer-socials">
                            {['𝕏','in','gh'].map(s => <button key={s} className="hp__social-btn">{s}</button>)}
                        </div>
                    </div>
                    <div className="hp__footer-col"><h5>Product</h5><ul>{['Features','How It Works','Pricing','Changelog'].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
                    <div className="hp__footer-col"><h5>Resources</h5><ul>{['Blog','Interview Tips','Resume Guide','Salary Data'].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
                    <div className="hp__footer-col"><h5>Company</h5><ul>{['About','Careers','Privacy','Terms'].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
                </div>
                <div className="hp__footer-bottom">
                    <span>© 2025 InterviewAI. All rights reserved.</span>
                    <div className="hp__footer-bottom-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
                </div>
            </footer>
        </div>
    )
}

export default Home
