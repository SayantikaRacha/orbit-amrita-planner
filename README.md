# Orbit

### Academic progress, made actionable.

Orbit is a privacy-first academic planner for university students. It turns a curriculum and confirmed academic record into a clear view of degree progress, CGPA goals, and a practical weekly study plan.

The first curriculum template models **Amrita University B.Tech Computer Science and Engineering (2023 onwards)**. Orbit is designed so verified templates for other Amrita programs can be added without changing the core product.

> GPA results are provisional until the relevant official university grade-to-point regulation has been verified and published by an administrator.

## Why Orbit?

Students often have their curriculum, grade cards, attendance data, and goals scattered across multiple places. Orbit puts the important parts in one intentional workflow:

- See confirmed CGPA, completed credits, and progress toward graduation.
- Upload academic documents, review extracted fields, and decide what becomes part of the record.
- Set a graduation-CGPA goal and see the deterministic average required across outstanding credits.
- Convert a goal into course priorities and an editable weekly study budget.
- Ask a focused AI study coach for practical guidance grounded in confirmed plan data.
- Keep control of original documents; retain or delete them independently of confirmed structured records.

## Product highlights

| Area | What Orbit provides |
| --- | --- |
| **Academic record** | Course-level grades, credits, semester status, and confirmation states. |
| **GPA engine** | Credit-weighted CGPA calculations that exclude pass/fail and unconfirmed records. |
| **Goal planner** | Graduation target feasibility, required remaining average, grade scenarios, and risk flags. |
| **Document review** | Private upload/review flow for PDFs and images; no extracted value affects GPA before confirmation. |
| **Study planning** | Weekly available-hours input and course-priority allocation. |
| **Orbit Coach** | Guardrailed study support that never changes the deterministic calculation or claims official policy. |
| **Admin desk** | Staged curriculum publication and verification workflows for program templates. |

## Tech stack

- **Frontend:** TypeScript, Vite, responsive vanilla UI
- **Core calculations:** deterministic, tested TypeScript GPA engine
- **Production data model:** PostgreSQL/Supabase with row-level security
- **Authentication:** Supabase Auth (Google and email magic links)
- **Private files:** Supabase Storage
- **AI coach:** Server-side OpenAI Responses API adapter using `store: false`

## How it was built

Orbit was built as a lightweight TypeScript MVP before connecting external services. This keeps the most important academic logic testable and independent from the user interface or AI.

1. **Model the degree first** - The CSE 2023 curriculum is represented as structured course data: code, title, semester, credits, category, assessment pattern, and pass/fail status.
2. **Keep GPA calculations deterministic** - The calculation engine applies a credit-weighted grade-point formula. It ignores pass/fail courses and any record that has not been confirmed by the student.
3. **Build the student workflow around trust** - Document uploads move through a review queue. Extraction results are candidates, never automatic changes to a student's record.
4. **Turn the goal into a plan** - The planner compares confirmed grade points, completed credits, remaining credits, and the desired graduation CGPA to calculate the required remaining average. It then suggests course priorities and weekly study-hour allocations.
5. **Add AI as a constrained layer** - The coach receives only the confirmed planning summary. It can explain and support the study plan, but it cannot alter calculations, read raw documents, or make official policy claims.
6. **Design for production from the start** - The repository includes a PostgreSQL/Supabase schema, row-level security policies, private-file lifecycle fields, and a server-only AI adapter so the prototype has a clear path to a real application.

### Important design decisions

- **Student confirmation before calculation:** prevents OCR or document-extraction mistakes from silently changing results.
- **Versioned curriculum templates:** supports future Amrita programs and regulation changes without rewriting GPA logic.
- **Original file retention is optional:** a student can delete an uploaded document while retaining the academic data they confirmed.
- **AI is never the calculator:** GPA and target feasibility always come from transparent TypeScript logic that can be tested and audited.

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 9+

### Install and run

```bash
git clone https://github.com/<your-username>/orbit-amrita-planner.git
cd orbit-amrita-planner
pnpm install
pnpm dev
```

Vite will print a local URL, usually `http://localhost:5173`.

### Verify

```bash
pnpm test
pnpm build
```

## Data and privacy model

Orbit separates raw documents from confirmed academic data:

1. A student uploads a document to private storage.
2. An extraction worker creates candidate fields with confidence and page metadata.
3. The student reviews and confirms or corrects those fields.
4. Only confirmed records are eligible for GPA and plan calculations.
5. The student may delete the original file while retaining confirmed structured data.

The supplied [Supabase schema](./supabase/schema.sql) applies row-level security to student-owned profiles, enrollments, attempts, documents, review candidates, plans, and coach messages.

## AI coach safety

The server-only coach adapter in [`server/coach.ts`](./server/coach.ts) sends a minimized, confirmed planning summary—not original uploads—to the model. Its instructions restrict it to study advice and explanations. It must not:

- calculate or overwrite GPA results;
- make official university-policy claims;
- promise a grade or outcome; or
- request personal details or source documents.

Configure `OPENAI_API_KEY` and optionally `OPENAI_COACH_MODEL` only in the server environment. Never expose them in the browser or commit them to Git.

## Project structure

```text
src/
  engine.ts          # Curriculum model and deterministic GPA/goal calculations
  main.ts            # Interactive application UI
  style.css          # Responsive visual system
server/
  coach.ts           # Server-only OpenAI coach adapter
supabase/
  schema.sql         # PostgreSQL tables and RLS policies
tests/
  engine.test.ts     # GPA and goal-planning tests
```

## Roadmap

- [x] Responsive MVP and CSE 2023 curriculum template
- [x] Deterministic CGPA and graduation-goal calculations
- [x] Document-review and privacy-control UX
- [x] Guardrailed AI coach interface and server adapter
- [ ] Supabase Auth, database, and private storage connection
- [ ] Document extraction worker and field-mapping configuration
- [ ] Official Amrita grade-scale verification
- [ ] Additional verified Amrita program templates

## Contributing

Contributions are welcome. Please open an issue before proposing a large curriculum, grading-policy, or data-model change. Curriculum templates and grade rules must cite official university sources before they can be marked verified.

## License

This project is currently unlicensed. Add a license before accepting external contributions or releasing it publicly.

