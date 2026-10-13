import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

let sessions = [
  { id: 1, subject: 'Java', detail: 'Spring Boot · API REST', durationMinutes: 80, startedAt: '2026-10-13T18:10:00' },
  { id: 2, subject: 'SQL', detail: 'Consultas e agregações', durationMinutes: 45, startedAt: '2026-10-12T20:00:00' }
];
let events = [
  { id: 1, title: 'Praticar Java', type: 'Estudo', date: '2026-10-13', time: '19:00' },
  { id: 2, title: 'Revisar SQL', type: 'Estudo', date: '2026-10-14', time: '20:00' }
];

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'StudyTracker API' }));
app.get('/api/sessions', (_req, res) => res.json(sessions));
app.post('/api/sessions', (req, res) => {
  const { subject, detail = '', durationMinutes, startedAt = new Date().toISOString() } = req.body;
  if (!subject || !Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return res.status(400).json({ error: 'Informe uma matéria e uma duração positiva.' });
  }
  const session = { id: Date.now(), subject, detail, durationMinutes, startedAt };
  sessions = [session, ...sessions];
  res.status(201).json(session);
});
app.get('/api/events', (_req, res) => res.json(events));
app.post('/api/events', (req, res) => {
  const { title, type = 'Estudo', date, time } = req.body;
  if (!title?.trim() || !date || !time) {
    return res.status(400).json({ error: 'Título, data e horário são obrigatórios.' });
  }
  const event = { id: Date.now(), title: title.trim(), type, date, time };
  events = [...events, event];
  res.status(201).json(event);
});

app.listen(PORT, () => console.log(`StudyTracker API rodando em http://localhost:${PORT}`));
