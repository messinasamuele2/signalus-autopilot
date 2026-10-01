import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowUpRight, Bell, Bot, Check, ChevronDown, Clock3, Globe2,
  Camera, LayoutDashboard, Link2, Play, Radio,
  Settings, Sparkles, TrendingUp, Video, X
} from 'lucide-react';
import './App.css';

const initialStories = [
  { id: 1, source: 'Bloomberg', time: '2 min fa', title: 'Fed signals patience on rate cuts as inflation cools', summary: 'Officials see room to wait for more data before changing policy.', tag: 'FED & RATES', tone: 'violet', score: 98 },
  { id: 2, source: 'CNBC', time: '18 min fa', title: 'US stocks climb as tech earnings beat expectations', summary: 'The S&P 500 opened higher, led by semiconductors and cloud software.', tag: 'MARKETS', tone: 'green', score: 94 },
  { id: 3, source: 'Reuters', time: '34 min fa', title: 'Oil prices edge higher on tighter global supply outlook', summary: 'Brent crude moved above $84 as traders assessed the latest inventory data.', tag: 'COMMODITIES', tone: 'orange', score: 88 },
  { id: 4, source: 'WSJ', time: '1 ora fa', title: 'US consumer confidence rises for second month', summary: 'Households are feeling more optimistic about jobs and the economy.', tag: 'ECONOMY', tone: 'blue', score: 82 },
];

const defaultSettings = {
  instagram: '@produttivita.ai',
  contactEmail: 'produttivita.ai@gmail.com',
  frequency: 'hourly',
  defaultLanguage: 'EN',
  metaConnected: false,
};

function loadSettings() {
  const saved = window.localStorage.getItem('signalus-settings');
  if (!saved) return defaultSettings;
  try {
    const parsed = JSON.parse(saved);
    return {
      ...defaultSettings,
      ...parsed,
      instagram: parsed.instagram || defaultSettings.instagram,
    };
  } catch {
    return defaultSettings;
  }
}

function App() {
  const [active, setActive] = useState('dashboard');
  const [stories, setStories] = useState(initialStories);
  const [language, setLanguage] = useState('EN');
  const [isRunning, setIsRunning] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showMetaSetup, setShowMetaSetup] = useState(false);
  const [toast, setToast] = useState('');
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [settings, setSettings] = useState(loadSettings);
  const publishingReady = Boolean(settings.metaConnected && settings.publishPermission);

  const publishCount = useMemo(() => stories.filter((story) => story.queued).length, [stories]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const refreshStories = () => {
    setStories((current) => [...current].sort(() => Math.random() - 0.5));
    notify('Feed aggiornato: 12 nuove fonti analizzate');
  };

  const queueStory = (storyId) => {
    setStories((current) => current.map((story) => (
      story.id === storyId ? { ...story, queued: true } : story
    )));
    notify(`Video ${language} aggiunto alla coda di pubblicazione`);
  };

  const saveSettings = (nextSettings) => {
    setSettings(nextSettings);
    window.localStorage.setItem('signalus-settings', JSON.stringify(nextSettings));
    setShowSettings(false);
    notify('Impostazioni salvate in questo browser');
  };

  const connectMeta = () => {
    setShowSettings(false);
    setShowMetaSetup(true);
  };

  const runAutopilot = async () => {
    if (isPipelineRunning) return;
    setIsPipelineRunning(true);
    try {
      const response = await fetch('/api/pipeline/run', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Pipeline non disponibile');
      notify(result.published ? 'Video pubblicato su Instagram' : 'Video creato e pronto per la pubblicazione');
    } catch (error) {
      notify(error.message);
    } finally {
      setIsPipelineRunning(false);
    }
  };

  useEffect(() => {
    setLanguage(settings.defaultLanguage);
  }, [settings.defaultLanguage]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Radio size={19} /></div><div><strong>Signal<span>US</span></strong><small>AI NEWS STUDIO</small></div></div>
        <div className="workspace-switcher"><div className="workspace-avatar">S</div><div><strong>Samuele Studio</strong><small>Workspace principale</small></div><ChevronDown size={15} /></div>
        <nav>
          <p className="nav-label">WORKSPACE</p>
          <NavItem icon={<LayoutDashboard size={17} />} label="Overview" active={active === 'dashboard'} onClick={() => setActive('dashboard')} />
          <NavItem icon={<Globe2 size={17} />} label="Live Radar" badge="12" active={active === 'radar'} onClick={() => setActive('radar')} />
          <NavItem icon={<Video size={17} />} label="Video Studio" active={active === 'studio'} onClick={() => setActive('studio')} />
          <NavItem icon={<Clock3 size={17} />} label="Publishing queue" badge={publishCount} active={active === 'queue'} onClick={() => setActive('queue')} />
          <p className="nav-label spaced">MANAGE</p>
          <NavItem icon={<Camera size={17} />} label="Distribution" active={active === 'instagram'} onClick={() => setActive('instagram')} />
          <NavItem icon={<Settings size={17} />} label="Settings" active={active === 'settings'} onClick={() => setShowSettings(true)} />
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card"><div className="plan-icon"><Sparkles size={15} /></div><div><strong>Creator plan</strong><span>2,840 / 5,000 credits</span></div><ArrowUpRight size={15} /></div>
          <div className="profile"><div className="profile-avatar">S</div><div><strong>Samuele</strong><span>Owner</span></div><MoreDots /></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar"><div className="mobile-brand"><Radio size={18} /> Signal<span>US</span></div><div className="topbar-actions"><div className={`live-indicator ${publishingReady ? '' : 'attention'}`}><i /> {publishingReady ? 'Autopilot active' : 'Autopilot setup needed'}</div><button className="icon-btn"><Bell size={18} /><b>3</b></button><button className="avatar-button">S</button></div></header>
        <div className="content">
          <div className="page-heading"><div><div className="eyebrow"><span /> WEDNESDAY, SEPTEMBER 30, 2026</div><h1>Good afternoon, Samuele <span>✦</span></h1><p>Your personal newsroom is running quietly in the background. Nothing to review unless you want to.</p></div><button className="btn secondary" onClick={() => setShowSettings(true)}><Settings size={16} /> Configure studio</button></div>

          <section className="hero-grid">
            <div className="card radar-card"><div className="card-heading"><div><div className="label-with-icon"><div className="mini-icon purple"><Activity size={15} /></div><span>LIVE RADAR</span></div><h2>US market pulse</h2></div><button className="more-button" onClick={refreshStories}>Refresh <Activity size={14} /></button></div><div className="market-grid"><Market name="S&P 500" value="5,842.91" change="+0.84%" positive /><Market name="NASDAQ" value="18,563.42" change="+1.21%" positive /><Market name="DOW JONES" value="42,116.43" change="+0.32%" positive /><Market name="BTC / USD" value="$67,842" change="+2.08%" positive /></div><div className="pulse-chart"><div className="chart-lines"><span /><span /><span /><span /></div><svg viewBox="0 0 600 100" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8874ff" stopOpacity=".38" /><stop offset="100%" stopColor="#8874ff" stopOpacity="0" /></linearGradient></defs><path d="M0 75 C20 68 35 74 55 57 S90 76 110 53 S140 62 160 39 S190 58 210 45 S240 52 260 31 S290 50 310 41 S340 25 360 37 S390 47 410 23 S440 44 460 30 S500 18 520 27 S555 10 600 6 L600 100 L0 100Z" fill="url(#area)" /><path d="M0 75 C20 68 35 74 55 57 S90 76 110 53 S140 62 160 39 S190 58 210 45 S240 52 260 31 S290 50 310 41 S340 25 360 37 S390 47 410 23 S440 44 460 30 S500 18 520 27 S555 10 600 6" fill="none" stroke="#9b89ff" strokeWidth="2.5" /></svg><div className="chart-labels"><span>9:30 AM</span><span>11 AM</span><span>1 PM</span><span>3 PM</span><span>NOW</span></div></div></div>
            <div className="card automation-card"><div className="card-heading"><div><div className="label-with-icon"><div className="mini-icon green"><Bot size={15} /></div><span>AUTOMATION</span></div><h2>Personal autopilot</h2></div><button className={`switch ${isRunning ? 'on' : ''}`} onClick={() => setIsRunning(!isRunning)}><span /></button></div><div className="automation-status"><div className={`status-dot ${isRunning ? 'green-dot' : ''}`}><Bot size={22} /></div><div><strong>{isRunning ? 'Working automatically' : 'Automation paused'}</strong><p>{isRunning ? (publishingReady ? 'Everything is handled automatically' : 'Content is prepared automatically; distribution setup is still needed') : 'Turn it on to resume background work'}</p></div></div><div className="pipeline"><Pipeline label="Monitor US sources" done /><Pipeline label="Select and summarize" done /><Pipeline label="Create 30-sec video" done /><Pipeline label="Distribute automatically" done={publishingReady} active={!publishingReady} /></div><button className="btn primary full" disabled={isPipelineRunning} onClick={runAutopilot}><Play size={15} fill="currentColor" /> {isPipelineRunning ? 'Running autopilot…' : 'Run autopilot now'}</button></div>
          </section>

          <div className="section-heading"><div><h2>Latest intelligence</h2><p>Stories selected by your AI newsroom</p></div><button className="text-button" onClick={() => setActive('radar')}>View all stories <ArrowUpRight size={15} /></button></div>
          <section className="lower-grid">
            <div className="card stories-card">
              <div className="stories-toolbar">
                <div className="filter-pills"><button className="active">All stories <span>48</span></button><button>Markets</button><button>Economy</button></div>
                <div className="language-toggle"><Globe2 size={14} /><button className={language === 'IT' ? 'selected' : ''} onClick={() => setLanguage('IT')}>IT</button><button className={language === 'EN' ? 'selected' : ''} onClick={() => setLanguage('EN')}>EN</button></div>
              </div>
              {stories.map((story) => <Story key={story.id} story={story} language={language} onCreate={() => queueStory(story.id)} />)}
            </div>
            <div className="card preview-card">
              <div className="card-heading"><div><div className="label-with-icon"><div className="mini-icon pink"><Video size={15} /></div><span>IN PRODUCTION</span></div><h2>Next video</h2></div><span className="duration">00:30</span></div>
              <div className="video-preview"><div className="video-bg"><div className="video-grain" /><div className="video-top"><span>◉ SIGNALUS</span><span>JUST IN</span></div><div className="video-copy"><small>THE US MARKET</small><strong>Fed signals<br /><em>patience</em><br />on rate cuts</strong><span className="video-source">Bloomberg · 2 min ago</span></div><div className="video-footer"><span>MARKET PULSE</span><span>30 SEC</span></div><button className="play-circle" onClick={() => notify('Anteprima video avviata')}><Play size={19} fill="white" /></button></div></div>
              <div className="video-meta"><div className="avatar-stack"><div>AI</div><div>EN</div></div><div><strong>Fed signals patience on rate cuts</strong><span>Script ready · Voiceover pending</span></div><button className="dots">•••</button></div>
              <button className="btn secondary full" onClick={() => setActive('studio')}>Open in Video Studio <ArrowUpRight size={15} /></button>
            </div>
          </section>
        </div>
      </main>
      {showSettings && <SettingsModal settings={settings} onClose={() => setShowSettings(false)} onSave={saveSettings} onConnect={connectMeta} />}
      {showMetaSetup && <MetaSetupModal onClose={() => setShowMetaSetup(false)} onOpenMeta={() => window.open('https://developers.facebook.com/apps/', '_blank', 'noopener,noreferrer')} />}
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

function NavItem({ icon, label, badge, active, onClick }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span>{badge && <b>{badge}</b>}</button>; }
function Market({ name, value, change }) { return <div className="market"><span>{name}</span><strong>{value}</strong><em><TrendingUp size={12} /> {change}</em></div>; }
function Pipeline({ label, done, active }) { return <div className="pipeline-row"><span className={`pipeline-check ${done ? 'done' : active ? 'current' : ''}`}>{done ? <Check size={11} /> : <i />}</span><span>{label}</span>{done && <small>Done</small>}{active && <small className="muted">Waiting</small>}</div>; }
function Story({ story, language, onCreate }) { return <article className="story"><div className={`story-marker ${story.tone}`} /><div className="story-main"><div className="story-meta"><span className={`tag ${story.tone}`}>{story.tag}</span><span>{story.source}</span><span>·</span><span>{story.time}</span></div><h3>{language === 'IT' ? translateTitle(story.title) : story.title}</h3><p>{story.summary}</p></div><div className="story-action"><div className="relevance"><span>{story.score}%</span><small>relevance</small></div><button className="create-button" onClick={onCreate}>{story.queued ? <Check size={15} /> : <Video size={15} />} {story.queued ? 'Queued' : 'Create'}</button></div></article>; }
function translateTitle(title) { return ({ 'Fed signals patience on rate cuts as inflation cools': 'La Fed segnala pazienza sui tagli dei tassi mentre l’inflazione rallenta', 'US stocks climb as tech earnings beat expectations': 'Le azioni USA salgono grazie agli utili tech oltre le attese', 'Oil prices edge higher on tighter global supply outlook': 'Il petrolio sale sulle prospettive di un’offerta globale più stretta', 'US consumer confidence rises for second month': 'La fiducia dei consumatori USA cresce per il secondo mese' })[title] || title; }
function MoreDots() { return <span className="more-dots">•••</span>; }
function SettingsModal({ settings, onClose, onSave, onConnect }) {
  const [draft, setDraft] = useState(settings);
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={18} /></button><div className="modal-title"><div className="mini-icon purple"><Settings size={17} /></div><div><h2>Private automation settings</h2><p>Configure the background engine</p></div></div><label>Default language<select value={draft.defaultLanguage} onChange={(event) => setDraft({ ...draft, defaultLanguage: event.target.value })}><option value="EN">English</option><option value="IT">Italian</option></select></label><label>Publishing frequency<select value={draft.frequency} onChange={(event) => setDraft({ ...draft, frequency: event.target.value })}><option value="hourly">Every hour · high relevance only</option><option value="daily">3 videos per day</option><option value="once">Once per day</option></select></label><div className="permission-status"><strong>Private distribution</strong><span className={draft.publishPermission ? 'connected' : 'not-connected'}>{draft.publishPermission ? 'Ready' : 'Setup required'}</span></div><div className="modal-note"><Link2 size={15} /> Distribution credentials are managed privately and never shown in the newsroom.</div><button className="btn secondary full" onClick={onConnect}>Open advanced connection setup <ArrowUpRight size={15} /></button><button className="btn primary full" onClick={() => onSave(draft)}>Save settings</button></div></div>;
}

function MetaSetupModal({ onClose, onOpenMeta }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal meta-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={18} /></button><div className="modal-title"><div className="mini-icon purple"><Link2 size={17} /></div><div><h2>Connect private distribution</h2><p>One-time setup for automatic publishing</p></div></div><div className="setup-intro">This is a private background integration. You will not need to manage the publishing account from the newsroom.</div><div className="setup-step"><span>1</span><div><strong>Professional account</strong><p>The connected account must be Creator or Business.</p></div></div><div className="setup-step"><span>2</span><div><strong>Authorize the account</strong><p>Add the account as an Instagram tester and accept the invitation.</p></div></div><div className="setup-step"><span>3</span><div><strong>Publishing permission</strong><p>Request <code>instagram_business_content_publish</code>. Comments and messages do not enable publishing.</p></div></div><div className="setup-step"><span>4</span><div><strong>Token and backend</strong><p>Generate the token and store it only in the secure backend.</p></div></div><div className="modal-note"><Link2 size={15} /> Credentials are never shown in the personal newsroom.</div><button className="btn primary full" onClick={onOpenMeta}>Open Meta for Developers <ArrowUpRight size={15} /></button><button className="btn secondary full" onClick={() => { onClose(); }}>I have completed setup</button></div></div>;
}

export default App;
