import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, Timer, CalendarDays, Target, CheckCircle2, Bell, Settings,
  LogOut, Search, ChevronDown, Menu, X, Flame, Clock3, TrendingUp, Plus,
  Play, Pause, Square, ChevronLeft, ChevronRight, CalendarPlus, BookOpen,
  MoreHorizontal, CircleHelp, Check, ArrowUpRight
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'studies', label: 'Estudos', icon: Timer },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'goals', label: 'Metas', icon: Target },
  { id: 'habits', label: 'Hábitos', icon: CheckCircle2 },
];
const eventsSeed = [
  { id: 1, title: 'Praticar Java', type: 'Estudo', date: '2026-10-13', time: '19:00', color: 'purple' },
  { id: 2, title: 'Revisar SQL', type: 'Estudo', date: '2026-10-14', time: '20:00', color: 'blue' },
  { id: 3, title: 'Entrega do projeto', type: 'Prazo', date: '2026-10-16', time: '18:00', color: 'orange' },
  { id: 4, title: 'Estudar JavaScript', type: 'Estudo', date: '2026-10-18', time: '10:00', color: 'green' },
];
const sessionsSeed = [
  { subject: 'Java', detail: 'Spring Boot · API REST', duration: '1h 20min', date: 'Hoje, 18:10', color: 'purple' },
  { subject: 'SQL', detail: 'Consultas e agregações', duration: '45min', date: 'Ontem, 20:00', color: 'blue' },
  { subject: 'JavaScript', detail: 'DOM e eventos', duration: '35min', date: 'Ontem, 18:40', color: 'orange' },
];

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}
function App() {
  const [page, setPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [events, setEvents] = useState(eventsSeed);
  const [sessions, setSessions] = useState(sessionsSeed);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [subject, setSubject] = useState('Java');
  const [studyNote, setStudyNote] = useState('');
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const [selectedDate, setSelectedDate] = useState('2026-10-13');
  const [modal, setModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('19:00');
  const [eventType, setEventType] = useState('Estudo');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const choosePage = id => { setPage(id); setMobileOpen(false); };
  const timeString = s => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const finishStudy = () => {
    if (seconds > 0) {
      const mins = Math.max(1, Math.round(seconds / 60));
      setSessions([{ subject, detail: studyNote || 'Sessão de foco', duration: `${mins}min`, date: 'Agora', color: subject === 'Java' ? 'purple' : subject === 'SQL' ? 'blue' : 'orange' }, ...sessions]);
    }
    setRunning(false); setSeconds(0); setStudyNote('');
  };
  const addEvent = e => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    const newEvent = { id: Date.now(), title: eventTitle.trim(), type: eventType, date: selectedDate, time: eventTime, color: eventType === 'Prazo' ? 'orange' : eventType === 'Pessoal' ? 'green' : 'purple' };
    setEvents([...events, newEvent]);
    setEventTitle(''); setModal(false);
  };
  const title = navItems.find(n => n.id === page)?.label || 'Dashboard';

  return <div className="app-shell">
    {mobileOpen && <button className="mobile-scrim" aria-label="Fechar menu" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><BookOpen size={19}/></div><span>Study<span className="brand-accent">Tracker</span></span><button className="close-menu" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X size={18}/></button></div>
      <div className="workspace-label">ESPAÇO PESSOAL</div>
      <nav className="nav-list">
        {navItems.map(item => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => choosePage(item.id)}><Icon size={18}/><span>{item.label}</span>{item.id === 'agenda' && <span className="nav-dot"/>}</button>; })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip"><div className="tip-icon"><Flame size={17}/></div><strong>Um passo por vez.</strong><p>Pequenos hábitos criam grandes resultados.</p></div>
        <button className="nav-item muted"><Settings size={18}/><span>Configurações</span></button>
        <div className="profile"><div className="avatar">M</div><div className="profile-text"><strong>Meu espaço</strong><span>Plano pessoal</span></div><MoreHorizontal size={18}/></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left"><button className="menu-toggle icon-button" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={21}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{title}</strong></div></div>
        <div className="topbar-actions"><label className="search-box"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." /></label><button className="icon-button notification-button" aria-label="Notificações"><Bell size={19}/><i/></button><div className="top-profile"><div className="avatar small">M</div><span>Matheus</span><ChevronDown size={15}/></div></div>
      </header>

      <div className="page-content">
        {page === 'dashboard' && <Dashboard events={events} sessions={sessions} setPage={setPage} setModal={setModal} />}
        {page === 'studies' && <Studies running={running} setRunning={setRunning} seconds={seconds} timeString={timeString} subject={subject} setSubject={setSubject} studyNote={studyNote} setStudyNote={setStudyNote} finishStudy={finishStudy} sessions={sessions} />}
        {page === 'agenda' && <Agenda month={month} setMonth={setMonth} events={events} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setModal={setModal} />}
        {['goals','habits'].includes(page) && <ComingSoon title={title} />}
      </div>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setModal(false)}><form className="event-modal" onSubmit={addEvent}><div className="modal-heading"><div><span className="eyebrow">AGENDA</span><h2>Novo compromisso</h2></div><button type="button" className="icon-button" onClick={() => setModal(false)} aria-label="Fechar"><X size={19}/></button></div><label>Título<input autoFocus value={eventTitle} onChange={e => setEventTitle(e.target.value)} placeholder="Ex.: Revisar conteúdo de Java" required /></label><div className="form-row"><label>Data<input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} required /></label><label>Horário<input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} required /></label></div><label>Tipo<select value={eventType} onChange={e => setEventType(e.target.value)}><option>Estudo</option><option>Prazo</option><option>Pessoal</option></select></label><div className="modal-actions"><button type="button" className="button secondary" onClick={() => setModal(false)}>Cancelar</button><button className="button primary" type="submit"><Plus size={17}/> Criar compromisso</button></div></form></div>}
  </div>;
}

function PageHeading({ eyebrow, title, subtitle, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}
function Dashboard({ events, sessions, setPage, setModal }) {
  const bars = [35, 58, 26, 82, 48, 68, 42];
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  return <>
    <PageHeading eyebrow="TERÇA-FEIRA, 13 DE OUTUBRO" title="Bom estudo, Matheus 👋" subtitle="Um pouco de progresso todos os dias faz diferença." action={<button className="button primary" onClick={() => setPage('studies')}><Play size={16} fill="currentColor"/> Iniciar estudo</button>} />
    <div className="stats-grid">
      <StatCard label="Tempo estudado hoje" value="2h 15m" note="+35 min vs. ontem" icon={Clock3} tone="purple" progress={72} />
      <StatCard label="Sequência atual" value="5 dias" note="Seu melhor: 12 dias" icon={Flame} tone="orange" />
      <StatCard label="Meta semanal" value="7h 30m" note="de 10 horas" icon={Target} tone="blue" progress={75} />
      <StatCard label="Sessões concluídas" value="18" note="nesta semana" icon={TrendingUp} tone="green" />
    </div>
    <div className="dashboard-grid">
      <section className="panel study-chart-panel"><div className="panel-heading"><div><h2>Seu ritmo de estudos</h2><p>Tempo dedicado nos últimos 7 dias</p></div><button className="select-chip">Esta semana <ChevronDown size={14}/></button></div><div className="chart-summary"><strong>7h 30m</strong><span className="positive"><ArrowUpRight size={14}/> 12% <span>vs. semana passada</span></span></div><div className="bar-chart">{bars.map((height, i) => <div className="bar-column" key={labels[i]}><span className="bar-value">{i === 3 ? '2h' : i === 1 ? '1h' : ''}</span><div className="bar-track"><div className={`bar-fill ${i === 3 ? 'highlight' : ''}`} style={{height: `${height}%`}}/></div><span className="bar-label">{labels[i]}</span></div>)}</div></section>
      <section className="panel"><div className="panel-heading"><div><h2>Próximos compromissos</h2><p>O que vem por aí</p></div><button className="text-button" onClick={() => setPage('agenda')}>Ver agenda <ArrowUpRight size={14}/></button></div><div className="event-list">{events.slice().sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time)).slice(0,3).map(ev => <div className="event-row" key={ev.id}><div className={`event-date ${ev.color}`}><span>{new Date(ev.date+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit'})}</span><small>{new Date(ev.date+'T12:00:00').toLocaleDateString('pt-BR',{month:'short'}).replace('.','')}</small></div><div className="event-info"><strong>{ev.title}</strong><span>{ev.time} · {ev.type}</span></div><span className={`event-dot ${ev.color}`}/></div>)}</div><button className="button full-width secondary" onClick={() => setModal(true)}><Plus size={16}/> Adicionar compromisso</button></section>
      <section className="panel subjects-panel"><div className="panel-heading"><div><h2>Matérias em foco</h2><p>Distribuição do seu tempo</p></div><button className="icon-button subtle"><MoreHorizontal size={19}/></button></div><div className="subject-list"><Subject name="Java" detail="Desenvolvimento back-end" hours="3h 20m" percent={68} color="purple"/><Subject name="JavaScript" detail="Front-end" hours="1h 45m" percent={42} color="blue"/><Subject name="SQL" detail="Banco de dados" hours="1h 10m" percent={28} color="orange"/></div></section>
      <section className="panel focus-panel"><div className="focus-top"><div className="focus-icon"><Timer size={20}/></div><span className="status-pill"><i/> Pronto para focar</span></div><h2>Seu próximo passo</h2><p>Reserve 25 minutos para avançar no projeto StudyTracker.</p><button className="button primary full-width" onClick={() => setPage('studies')}><Play size={16} fill="currentColor"/> Começar sessão de foco</button><div className="focus-foot"><span><Clock3 size={14}/> Sugestão: 25 min</span><span><CircleHelp size={14}/> Pomodoro</span></div></section>
    </div>
    <section className="panel recent-panel"><div className="panel-heading"><div><h2>Sessões recentes</h2><p>Seu histórico de concentração</p></div><button className="text-button" onClick={() => setPage('studies')}>Ver todas <ArrowUpRight size={14}/></button></div><div className="session-table"><div className="session-table-head"><span>MATÉRIA</span><span>DESCRIÇÃO</span><span>DATA</span><span>DURAÇÃO</span></div>{sessions.slice(0,3).map((s,i)=><div className="session-table-row" key={i}><div className="session-subject"><span className={`subject-dot ${s.color}`}/><strong>{s.subject}</strong></div><span className="session-detail">{s.detail}</span><span className="session-date">{s.date}</span><strong className="session-duration">{s.duration}</strong></div>)}</div></section>
  </>;
}
function StatCard({ label, value, note, icon: Icon, tone, progress }) {
  return <section className="stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon ${tone}`}><Icon size={18}/></div></div><div className="stat-value">{value}</div><div className="stat-bottom"><span>{note}</span>{progress !== undefined && <div className="mini-progress"><span style={{width: `${progress}%`}}/></div>}</div></section>;
}
function Subject({name,detail,hours,percent,color}) {
  return <div className="subject-row"><span className={`subject-symbol ${color}`}><BookOpen size={16}/></span><div className="subject-main"><div className="subject-title"><strong>{name}</strong><span>{hours}</span></div><span className="subject-detail">{detail}</span><div className="subject-progress"><span className={color} style={{width:`${percent}%`}}/></div></div></div>;
}
function Studies({running,setRunning,seconds,timeString,subject,setSubject,studyNote,setStudyNote,finishStudy,sessions}) {
  const [mode, setMode] = useState('stopwatch');
  return <>
    <PageHeading eyebrow="SEU ESPAÇO DE CONCENTRAÇÃO" title="Hora de focar" subtitle="Desconecte das distrações e avance um passo de cada vez." />
    <div className="study-layout">
      <section className="panel timer-panel"><div className="timer-panel-head"><div><span className="eyebrow">SESSÃO ATUAL</span><h2>Seu tempo, seu ritmo.</h2></div><span className={`status-pill ${running ? 'running' : ''}`}><i/> {running ? 'Em andamento' : 'Pronto para começar'}</span></div><div className="timer-tabs"><button className={mode==='stopwatch'?'selected':''} onClick={()=>setMode('stopwatch')}>Cronômetro</button><button className={mode==='pomodoro'?'selected':''} onClick={()=>setMode('pomodoro')}>Pomodoro <span>25 min</span></button></div><div className={`timer-ring ${running?'timer-active':''}`}><div className="timer-inner"><span className="timer-time">{timeString(seconds)}</span><span className="timer-caption">{running ? 'Você está focando' : 'Pronto quando você estiver'}</span></div></div><div className="timer-controls">{!running ? <button className="button primary start-button" onClick={()=>setRunning(true)}><Play size={17} fill="currentColor"/> Iniciar sessão</button> : <button className="button secondary start-button" onClick={()=>setRunning(false)}><Pause size={17} fill="currentColor"/> Pausar</button>}<button className="button secondary" onClick={finishStudy} disabled={seconds===0}><Square size={15} fill="currentColor"/> Finalizar</button></div><div className="timer-divider"/><div className="study-form"><label>O que você vai estudar?<select value={subject} onChange={e=>setSubject(e.target.value)}><option>Java</option><option>JavaScript</option><option>SQL</option><option>HTML e CSS</option><option>Inglês</option><option>Outra matéria</option></select></label><label>Objetivo desta sessão <input value={studyNote} onChange={e=>setStudyNote(e.target.value)} placeholder="Ex.: Criar endpoint de autenticação"/></label></div><p className="timer-hint"><CircleHelp size={15}/> Seu tempo será registrado quando você finalizar a sessão.</p></section>
      <div className="study-side"><section className="panel daily-focus"><div className="panel-heading"><div><h2>Resumo de hoje</h2><p>Você está construindo consistência</p></div><div className="stat-icon purple"><TrendingUp size={18}/></div></div><div className="today-total">2h 15m <span>estudadas hoje</span></div><div className="goal-track"><span style={{width:'75%'}}/></div><div className="goal-caption"><span>75% da meta diária</span><strong>3h</strong></div><div className="daily-check"><div className="check-circle"><Check size={15}/></div><div><strong>Você já começou!</strong><span>Mais 45 min para alcançar sua meta.</span></div></div></section><section className="panel"><div className="panel-heading"><div><h2>Histórico recente</h2><p>Suas últimas sessões</p></div><button className="icon-button subtle"><MoreHorizontal size={19}/></button></div><div className="history-list">{sessions.slice(0,4).map((s,i)=><div className="history-row" key={i}><div className={`history-icon ${s.color}`}><BookOpen size={17}/></div><div className="history-info"><strong>{s.subject}</strong><span>{s.detail}</span><small>{s.date}</small></div><strong className="history-duration">{s.duration}</strong></div>)}</div></section><div className="quote-card"><div className="quote-mark">“</div><p>Você não precisa estar motivado todos os dias. Só precisa dar o próximo passo.</p><span>LEMBRETE DO DIA</span></div></div>
    </div>
  </>;
}
function Agenda({month,setMonth,events,selectedDate,setSelectedDate,setModal}) {
  const year=month.getFullYear(), m=month.getMonth();
  const first=new Date(year,m,1).getDay();
  const daysInMonth=new Date(year,m+1,0).getDate();
  const cells=[...Array(first===0?6:first-1).fill(null),...Array.from({length:daysInMonth},(_,i)=>i+1)];
  while(cells.length%7) cells.push(null);
  const dateKey=day=>`${year}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const selectedEvents=events.filter(e=>e.date===selectedDate).sort((a,b)=>a.time.localeCompare(b.time));
  const monthName=month.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  const shiftMonth=delta=>setMonth(new Date(year,m+delta,1));
  return <>
    <PageHeading eyebrow="ORGANIZE SEU TEMPO" title="Sua agenda" subtitle="Visualize compromissos, prazos e sessões de estudo." action={<button className="button primary" onClick={()=>setModal(true)}><Plus size={16}/> Novo compromisso</button>} />
    <div className="agenda-toolbar"><div className="month-nav"><button className="icon-button" onClick={()=>shiftMonth(-1)} aria-label="Mês anterior"><ChevronLeft size={19}/></button><button className="icon-button" onClick={()=>shiftMonth(1)} aria-label="Próximo mês"><ChevronRight size={19}/></button><h2>{monthName}</h2><button className="button secondary today-button" onClick={()=>{const now=new Date();setMonth(new Date(now.getFullYear(),now.getMonth(),1));setSelectedDate(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`)}}>Hoje</button></div><div className="agenda-legend"><span><i className="purple-bg"/> Estudos</span><span><i className="orange-bg"/> Prazos</span><span><i className="green-bg"/> Pessoal</span></div></div>
    <div className="agenda-layout"><section className="panel calendar-panel"><div className="calendar-weekdays">{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(d=><span key={d}>{d}</span>)}</div><div className="calendar-grid">{cells.map((day,i)=>{if(!day)return <div className="calendar-cell empty" key={`e${i}`}/>;const key=dateKey(day);const dayEvents=events.filter(e=>e.date===key);return <button key={key} className={`calendar-cell ${selectedDate===key?'chosen':''} ${key==='2026-10-13'?'demo-today':''}`} onClick={()=>setSelectedDate(key)}><span className="calendar-day">{day}</span><div className="calendar-event-stack">{dayEvents.slice(0,2).map(e=><span key={e.id} className={`calendar-event ${e.color}`}>{e.title}</span>)}{dayEvents.length>2&&<small>+{dayEvents.length-2} mais</small>}</div><div className="mobile-event-dots">{dayEvents.slice(0,3).map(e=><i key={e.id} className={`${e.color}-bg`}/>)}</div></button>})}</div></section>
      <aside className="panel selected-day-panel"><div className="selected-day-header"><div><span className="eyebrow">COMPROMISSOS DO DIA</span><h2>{formatDate(new Date(selectedDate+'T12:00:00'))}</h2></div><button className="icon-button subtle" onClick={()=>setModal(true)} aria-label="Adicionar evento"><Plus size={18}/></button></div><div className="selected-date-badge"><CalendarDays size={16}/><span>{selectedEvents.length} {selectedEvents.length===1?'compromisso':'compromissos'}</span></div>{selectedEvents.length ? <div className="day-event-list">{selectedEvents.map(e=><div className="day-event" key={e.id}><div className={`day-event-line ${e.color}`}/><div className="day-event-content"><span className="day-event-time">{e.time} · {e.type}</span><strong>{e.title}</strong><span className="day-event-note">{e.type==='Estudo'?'Reserve um tempo sem distrações.':e.type==='Prazo'?'Não deixe para a última hora.':'Um compromisso importante para você.'}</span></div></div>)}</div>:<div className="empty-day"><div className="empty-day-icon"><CalendarPlus size={22}/></div><strong>Dia livre por enquanto</strong><p>Que tal planejar uma sessão de estudos?</p></div>}<button className="button primary full-width" onClick={()=>setModal(true)}><Plus size={16}/> Adicionar compromisso</button></aside></div>
  </>;
}
function ComingSoon({title}) {
  return <div className="coming-soon panel"><div className="coming-icon"><Target size={25}/></div><span className="eyebrow">EM CONSTRUÇÃO</span><h1>{title}</h1><p>Esta tela será desenvolvida na próxima etapa. Por enquanto, você já pode explorar o Dashboard, Estudos e Agenda.</p></div>;
}
export default App;
