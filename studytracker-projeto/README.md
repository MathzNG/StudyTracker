# StudyTracker — protótipo inicial

Interface responsiva em React + Vite, com uma API inicial em Node.js + Express.
As telas Dashboard, Estudos e Agenda já possuem navegação e dados de demonstração.

## Requisitos
- Node.js 20+ recomendado
- npm

## Executar o frontend
```bash
cd client
npm install
npm run dev
```
Abra o endereço indicado pelo Vite.

## Executar a API
Em outro terminal:
```bash
cd server
npm install
npm run dev
```
A API inicia em `http://localhost:3001`.

## Conectar o frontend à API
Por enquanto, as telas usam dados locais para facilitar o desenvolvimento visual sem depender do servidor.
A API inclui endpoints de exemplo:
- `GET /api/health`
- `GET /api/sessions`
- `GET /api/events`
- `POST /api/events`

Depois podemos ligar cada tela à API e substituir os dados de demonstração por dados persistidos em banco.
