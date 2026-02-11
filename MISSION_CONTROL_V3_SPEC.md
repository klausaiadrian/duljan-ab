# Mission Control v3 — Full Rebuild Spec

## KONTEXT
Du bygger om Mission Control dashboarden för Duljan AB. Det är en Next.js app (v15) i denna mapp. 
Nuvarande dashboard finns i `app/mission-control/page.js` (1267 rader) — ERSÄTT DEN HELT.
API:er finns i `app/api/` — SKRIV OM ALLA.

## DATAKÄLLOR (VIKTIGT!)
All data läses från filer i `/Users/duljan/.openclaw/workspace/data/`:

- **`status.json`** — Klaus nuvarande status (state, task, since, subAgents)
- **`activity.json`** — Array av aktiviteter [{ts, actor, action, type}]
- **`notes.json`** — Array av noter [{ts, from, text, seen}]

Och från workspace:
- **`/Users/duljan/.openclaw/workspace/TASK_QUEUE.md`** — Tasks (parse markdown)
- **`/Users/duljan/.openclaw/workspace/data/x_feed.json`** — X/Twitter data (du skapar denna)

## KRAV

### 1. Status Panel (TOPPEN AV SIDAN)
- Visa Klaus status: 🟢 Working / 🟡 Idle / 🔴 Offline
- Vad Klaus jobbar med just nu (från status.json)
- Hur länge (beräkna från "since")
- Lista aktiva sub-agents (Bosse etc)
- Pulsande dot-animation för "working"

### 2. Activity Log (VÄNSTER KOLUMN)
- Läs från `data/activity.json`
- Tidsstämplad lista, senaste först
- Ikoner per typ: task=📋, delegation=🤝, agent=🤖, completed=✅, error=❌, note=📝
- Auto-uppdatera var 5:e sekund
- Visa max 50 senaste entries

### 3. Task Board (MITTEN)
- Parse TASK_QUEUE.md
- Tre kolumner: 🟡 Next Up | 🔴 Active | ✅ Done (visa senaste 5)
- Varje task: namn, typ, prio-badge
- "Add Task" knapp — POST till /api/tasks med name + description
- API:n ska SKRIVA till TASK_QUEUE.md direkt

### 4. Notes Panel (HÖGER KOLUMN)
- Läs/skriv till `data/notes.json`
- Input-fält: Adrian kan skriva noter
- POST /api/notes — append till notes.json
- Visa alla noter med "seen" status (grå om seen=true)
- Klaus markerar notes som seen via PATCH /api/notes

### 5. X/Twitter Feed (EGEN FLIK ELLER SEKTION)
- Läs från `data/x_feed.json`
- Visa senaste tweets/posts
- Skapa ett script `scripts/fetch_x_feed.sh` som:
  - Använder curl att hämta RSS från nitter.poast.org eller liknande
  - Sparar parsad data till x_feed.json
  - Körs via cron/manuellt

### 6. Helper Scripts
Skapa i `scripts/`:
- **`log-action.sh`** — Append till activity.json: `./log-action.sh "Klaus" "Did something" "task"`
- **`update-status.sh`** — Uppdatera status.json: `./update-status.sh "working" "Building feature X"`
- **`add-note.sh`** — Append note: `./add-note.sh "Adrian" "Kolla på detta"`

## DESIGN
- Mörkt tema (#0a0a0a bakgrund)
- Gradient accent: #667eea → #764ba2
- Monospace för timestamps
- Responsiv men optimerad för desktop
- INGA externa dependencies (inget tailwind, inga extra npm packages)
- Inline styles ELLER en CSS module

## TEKNISKA KRAV
- Next.js App Router (app/ directory)
- Alla API routes returnerar JSON
- Frontend pollar var 5:e sekund (inte 10)
- Error handling — visa "No data" istället för att krascha
- Filläsning med try/catch överallt

## API ENDPOINTS
- GET /api/status — läs status.json
- GET /api/activity — läs activity.json
- GET /api/tasks — parse TASK_QUEUE.md
- POST /api/tasks — lägg till task i TASK_QUEUE.md
- GET /api/notes — läs notes.json
- POST /api/notes — lägg till note
- PATCH /api/notes — markera note som seen
- GET /api/feed — läs x_feed.json

## FILER ATT SKAPA/ÄNDRA
1. `app/mission-control/page.js` — NY dashboard (ersätt helt)
2. `app/api/status/route.js` — NY
3. `app/api/activity/route.js` — SKRIV OM
4. `app/api/tasks/route.js` — SKRIV OM
5. `app/api/notes/route.js` — NY
6. `app/api/feed/route.js` — NY
7. `scripts/log-action.sh` — NY
8. `scripts/update-status.sh` — NY
9. `scripts/add-note.sh` — NY
10. `scripts/fetch_x_feed.sh` — NY
11. Ta bort `app/api/twitter/` (ersätts av feed)
12. Ta bort `app/api/cron/` (inte relevant längre)
13. Ta bort `app/api/blocket/` (inte relevant för nu)

## TESTA
- Kör `npm run dev -- -p 3001` och verifiera att dashboarden laddar
- Verifiera att alla API endpoints returnerar data
- Verifiera att helper scripts fungerar

## NÄR DU ÄR KLAR
Kör: `openclaw gateway wake --text "Done: Mission Control v3 rebuilt" --mode now`
