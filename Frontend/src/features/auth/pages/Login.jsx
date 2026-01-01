import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import './auth.scss'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/')
    }

    if (loading) return (
        <div className="loading-screen">
            <div className="spinner" />
            <p>Signing you in...</p>
        </div>
    )

    return (
        <div className="auth-root">
            {/* left decorative panel */}
            <div className="auth-deco">
                <div className="auth-deco__orb auth-deco__orb--1" />
                <div className="auth-deco__orb auth-deco__orb--2" />
                <div className="auth-deco__orb auth-deco__orb--3" />
                <div className="auth-deco__content">
                    <div className="auth-deco__logo">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="10" fill="url(#lg1)" />
                            <path d="M16 6l2.8 8.6H27l-7.2 5.2 2.8 8.6L16 23l-6.6 5.4 2.8-8.6L5 13.6h8.2L16 6z" fill="white" />
                            <defs>
                                <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32">
                                    <stop stopColor="#7c3aed" /><stop offset="1" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span>InterviewAI</span>
                    </div>
                    <h2 className="auth-deco__headline">
                        Ace your next<br />interview with <em>AI</em>
                    </h2>
                    <p className="auth-deco__sub">
                        Get personalized questions, skill gap analysis, and a tailored prep roadmap — in seconds.
                    </p>
                    <div className="auth-deco__stats">
                        <div className="stat"><span className="stat__num">10k+</span><span className="stat__label">Reports Generated</span></div>
                        <div className="stat"><span className="stat__num">94%</span><span className="stat__label">Success Rate</span></div>
                    </div>
                </div>
            </div>

            {/* right form panel */}
            <div className="auth-form-panel">
                <div className="auth-form-box">
                    <div className="auth-form-box__header">
                        <h1>Welcome back</h1>
                        <p>Sign in to continue your prep journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <div className="field__input-wrap">
                                <svg className="field__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                <input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <div className="field__input-wrap">
                                <svg className="field__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                <input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn">
                            Sign in
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </button>
                    </form>

                    <p className="auth-switch">Don't have an account? <Link to="/register">Create one free</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login
