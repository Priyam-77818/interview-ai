import React from 'react'

const DashboardPreview = () => (
  <div className="dash-preview">
    <div className="dash-preview__inner">
      {/* top bar */}
      <div className="dash-preview__topbar">
        <div className="dash-preview__tb-left">
          <div className="dash-preview__tb-dot" style={{background:'#7c3aed'}} />
          <div className="dash-preview__tb-dot" style={{background:'#a855f7'}} />
          <div className="dash-preview__tb-dot" style={{background:'#ec4899'}} />
        </div>
        <div className="dash-preview__tb-title">InterviewAI — Dashboard</div>
        <div className="dash-preview__tb-right" />
      </div>

      <div className="dash-preview__body">
        {/* sidebar */}
        <div className="dash-preview__sidebar">
          <div className="dash-preview__logo-row">
            <div className="dash-preview__logo-box" />
            <div className="dash-preview__logo-text" />
          </div>
          {['Dashboard','Reports','Practice','Settings'].map((l,i) => (
            <div key={l} className={`dash-preview__nav-item ${i===0?'dash-preview__nav-item--active':''}`}>
              <div className="dash-preview__nav-icon" />
              <div className="dash-preview__nav-label">{l}</div>
            </div>
          ))}
        </div>

        {/* main */}
        <div className="dash-preview__main">
          {/* stat cards */}
          <div className="dash-preview__stats">
            {[
              {label:'Match Score',val:'87%',color:'#4ade80'},
              {label:'Questions',val:'24',color:'#a78bfa'},
              {label:'Plan Days',val:'14',color:'#22d3ee'},
              {label:'Skill Gaps',val:'3',color:'#fb923c'},
            ].map(s => (
              <div key={s.label} className="dash-preview__stat-card">
                <div className="dash-preview__stat-val" style={{color:s.color}}>{s.val}</div>
                <div className="dash-preview__stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* chart area */}
          <div className="dash-preview__charts">
            <div className="dash-preview__chart-card">
              <div className="dash-preview__chart-title">Score Progress</div>
              <svg viewBox="0 0 200 80" className="dash-preview__svg-chart">
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity=".4"/>
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 70 C20 60,40 30,60 35 S100 20,120 25 S160 10,200 15 L200 80 L0 80Z" fill="url(#cg)"/>
                <path d="M0 70 C20 60,40 30,60 35 S100 20,120 25 S160 10,200 15" fill="none" stroke="#a855f7" strokeWidth="2"/>
                {[0,40,80,120,160,200].map((x,i) => (
                  <circle key={i} cx={x===0?2:x===200?198:x} cy={[70,45,32,25,12,15][i]} r="2.5" fill="#a855f7"/>
                ))}
              </svg>
            </div>
            <div className="dash-preview__chart-card dash-preview__chart-card--list">
              <div className="dash-preview__chart-title">Skill Gaps</div>
              {[
                {skill:'System Design',sev:'high',w:75},
                {skill:'TypeScript',sev:'medium',w:50},
                {skill:'Docker',sev:'low',w:30},
              ].map(g => (
                <div key={g.skill} className="dash-preview__gap-row">
                  <span>{g.skill}</span>
                  <div className="dash-preview__gap-bar">
                    <div className="dash-preview__gap-fill" style={{
                      width:`${g.w}%`,
                      background: g.sev==='high'?'#f87171':g.sev==='medium'?'#fb923c':'#4ade80'
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* question rows */}
          <div className="dash-preview__q-card">
            <div className="dash-preview__chart-title">Recent Questions</div>
            {['Explain React reconciliation','Describe your biggest challenge','System design: URL shortener'].map((q,i) => (
              <div key={i} className="dash-preview__q-row">
                <div className="dash-preview__q-num">Q{i+1}</div>
                <div className="dash-preview__q-text">{q}</div>
                <div className={`dash-preview__q-badge dash-preview__q-badge--${i===0?'tech':i===1?'beh':'tech'}`}>
                  {i===1?'Behavioral':'Technical'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default DashboardPreview
