import "./style.css";
import { cse2023, goalScenario, sampleAttempts, type Attempt, type Grade } from "./engine";

type Screen = "dashboard" | "records" | "documents" | "plan" | "coach" | "admin";
let screen: Screen = "dashboard";
let attempts: Attempt[] = [...sampleAttempts];
let target = 8.5;
let studyHours = 15;

const app = document.querySelector<HTMLDivElement>("#app")!;
const fmt = (value: number) => value.toFixed(2);
const scenario = () => goalScenario(cse2023, attempts, target);
const progress = () => Math.round((scenario().earnedCredits / 162) * 100);

function navItem(id: Screen, icon: string, label: string) {
  return `<button class="nav-item ${screen === id ? "active" : ""}" data-screen="${id}"><span>${icon}</span>${label}</button>`;
}

function metric(label: string, value: string, note: string, accent = "blue") {
  return `<article class="metric ${accent}"><p>${label}</p><strong>${value}</strong><small>${note}</small></article>`;
}

function dashboard() {
  const s = scenario();
  const currentSem = 3;
  return `<section class="page dashboard">
    <div class="welcome"><div><p class="eyebrow">Saturday, September 20</p><h1>Good morning, Dassa <span>✦</span></h1><p class="muted">A clear plan beats a stressful semester.</p></div><button class="outline" data-screen="documents">⇧ Upload a document</button></div>
    <div class="metrics">
      ${metric("Current CGPA", fmt(s.cgpa), "Across 42 confirmed credits")}
      ${metric("Degree progress", `${progress()}%`, "42 of 162 credits complete", "mint")}
      ${metric("Target CGPA", fmt(target), s.feasible ? `Need ${fmt(s.requiredAverage)} avg. from here` : "Target needs review", "amber")}
      ${metric("Weekly focus", `${studyHours}h`, "Your current study budget", "violet")}
    </div>
    <div class="grid two">
      <article class="card journey"><div class="card-head"><div><p class="eyebrow">Degree journey</p><h2>You're building momentum</h2></div><span class="chip verified">● Curriculum verified</span></div>
        <div class="progress-track"><span style="width:${progress()}%"></span></div><div class="progress-labels"><span>Semester 1</span><b>Semester ${currentSem} of 8</b><span>Graduation</span></div>
        <div class="semester-row">${[1,2,3,4,5,6,7,8].map(n => `<div class="sem ${n < currentSem ? "done" : n === currentSem ? "now" : ""}"><i>${n < currentSem ? "✓" : n}</i><span>Sem ${n}</span></div>`).join("")}</div>
      </article>
      <article class="card next"><div class="card-head"><div><p class="eyebrow">This week</p><h2>Your next best move</h2></div><span class="glow">✦</span></div><p>Protect your strongest lever: <b>Data Structures & Algorithms.</b> A 2-hour review block today keeps your target on track.</p><button class="primary" data-screen="plan">Open weekly plan <span>→</span></button></article>
    </div>
    <div class="grid wide">
      <article class="card chart-card"><div class="card-head"><div><p class="eyebrow">GPA trajectory</p><h2>On track for your goal</h2></div><button class="text-btn" data-screen="plan">View scenarios →</button></div><div class="chart"><div class="y-labels"><span>9.0</span><span>8.5</span><span>8.0</span><span>7.5</span></div><svg viewBox="0 0 600 170" preserveAspectRatio="none" aria-label="GPA trajectory chart"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#5573ee" stop-opacity=".25"/><stop offset="1" stop-color="#5573ee" stop-opacity="0"/></linearGradient></defs><path d="M0,125 C60,105 100,95 150,104 S245,73 300,80 S390,54 450,65 S540,26 600,36 L600,170 L0,170Z" fill="url(#fill)"/><path d="M0,125 C60,105 100,95 150,104 S245,73 300,80 S390,54 450,65 S540,26 600,36" fill="none" stroke="#6c82ef" stroke-width="3"/><line x1="0" x2="600" y1="57" y2="57" stroke="#e7eaf5" stroke-dasharray="5 5"/></svg><div class="x-labels"><span>Sem 1</span><span>Sem 2</span><span>Sem 3</span><span>Sem 4</span><span>Sem 5</span><span>Target</span></div></div></article>
      <article class="card course-card"><div class="card-head"><div><p class="eyebrow">Up next</p><h2>Semester 3</h2></div><span class="chip">22 credits</span></div>${cse2023.filter(c => c.semester === 3 && c.credits).slice(0,4).map((c,i) => `<div class="course-line"><span class="course-dot d${i}"></span><div><b>${c.title}</b><small>${c.code} · ${c.credits} credits</small></div><span class="target-grade">Aim ${i === 2 ? "A+" : "A"}</span></div>`).join("")}<button class="text-btn" data-screen="records">View all courses →</button></article>
    </div>
  </section>`;
}

function records() {
  const confirmed = new Map(attempts.filter(a => a.confirmed).map(a => [a.courseCode, a.grade]));
  return `<section class="page"><div class="page-title"><div><p class="eyebrow">Academic record</p><h1>Every credit, in context.</h1><p class="muted">Only reviewed grades contribute to your GPA.</p></div><button class="primary" data-action="add-grade">+ Add grade</button></div><div class="notice"><span>ⓘ</span><div><b>Provisional grade scale</b><p>Your record is confirmed, but Amrita's official 2023 grade-point policy has not yet been published in Orbit. Results are estimates until an admin verifies it.</p></div></div><div class="card table-card"><div class="table-toolbar"><b>Curriculum · B.Tech CSE 2023</b><span class="chip verified">● Verified curriculum</span></div><div class="table-scroll"><table><thead><tr><th>Course</th><th>Term</th><th>Credits</th><th>Evaluation</th><th>Grade</th><th>Status</th></tr></thead><tbody>${cse2023.map(c => { const grade = confirmed.get(c.code); return `<tr><td><b>${c.title}</b><small>${c.code} · ${c.category}</small></td><td>Sem ${c.semester}</td><td>${c.credits || "—"}</td><td>${c.evaluation}</td><td>${grade ? `<span class="grade">${grade}</span>` : "<span class='muted'>Not yet</span>"}</td><td><span class="status ${grade ? "complete" : "upcoming"}">${grade ? "Confirmed" : "Planned"}</span></td></tr>`; }).join("")}</tbody></table></div></div></section>`;
}

function documents() {
  return `<section class="page"><div class="page-title"><div><p class="eyebrow">Document centre</p><h1>Your documents stay in your control.</h1><p class="muted">We extract candidates. You decide what becomes part of your record.</p></div></div><div class="grid two"><article class="upload-zone" id="dropzone"><span class="upload-icon">⇧</span><h2>Drop an academic document here</h2><p>Grade card, attendance report, assessment sheet, timetable, or curriculum</p><label class="primary">Choose a file<input id="file-input" type="file" accept="application/pdf,image/*" hidden></label><small>PDF, JPG or PNG · private by default</small></article><article class="card privacy"><span class="privacy-icon">⌾</span><p class="eyebrow">Privacy by design</p><h2>Keep the record, not the file.</h2><p>After confirming extracted data, you choose whether to retain the original document. You can delete it at any time.</p><button class="text-btn" data-action="privacy">Review data controls →</button></article></div><div class="section-head"><div><p class="eyebrow">Review queue</p><h2>Nothing becomes official without you</h2></div><span class="chip">1 needs review</span></div><article class="card review-item"><div class="file-icon">PDF</div><div class="file-main"><b>Semester 2 grade card.pdf</b><small>Uploaded today · Extraction ready</small><div class="extractions"><span><i>98%</i> Semester: II</span><span><i>94%</i> 7 course grades found</span><span><i>86%</i> SGPA: 8.71</span></div></div><span class="chip amber-chip">Needs your review</span><button class="primary" data-action="review">Review extraction →</button></article></section>`;
}

function plan() {
  const s = scenario();
  const courseCandidates = cse2023.filter(c => c.semester === 3 && c.credits).slice(0,4);
  return `<section class="page"><div class="page-title"><div><p class="eyebrow">Goal planner</p><h1>A finish line you can see.</h1><p class="muted">The maths is deterministic; the plan is yours to edit.</p></div></div><div class="goal-hero"><div><p>Graduation CGPA goal</p><div class="goal-number"><input id="target" type="number" min="4" max="10" step="0.1" value="${target}"><b>/ 10</b></div><small>Across 162 curriculum credits</small></div><div class="goal-result"><span>Required average from here</span><strong class="${s.feasible ? "" : "danger"}">${s.feasible ? fmt(s.requiredAverage) : "> 10.00"}</strong><p>${s.feasible ? `${s.remainingCredits} remaining graded credits` : "Not possible with remaining credits"}</p></div><div class="formula"><span>How this is calculated</span><b>(Target × total credits − earned points) ÷ remaining credits</b><p>(${target} × 162 − ${fmt(s.qualityPoints)}) ÷ ${s.remainingCredits} = ${fmt(s.requiredAverage)}</p></div></div><div class="grid two plan-grid"><article class="card"><div class="card-head"><div><p class="eyebrow">Semester 3 strategy</p><h2>Focus where it matters</h2></div><span class="chip verified">Feasible</span></div>${courseCandidates.map((course,index) => `<div class="priority"><span class="rank">0${index+1}</span><div><b>${course.title}</b><small>${course.credits} credits · ${course.evaluation} assessment</small></div><div><span class="target-grade">Aim ${index === 2 ? "A+" : "A"}</span><small>${index === 0 ? "High credit, foundational" : index === 2 ? "Strongest leverage" : "Maintain consistency"}</small></div></div>`).join("")}<button class="outline full" data-action="scenario">Compare grade scenarios</button></article><article class="card weekly"><div class="card-head"><div><p class="eyebrow">Weekly study budget</p><h2>Make the time visible</h2></div></div><div class="hours"><input id="hours" type="range" min="5" max="35" value="${studyHours}"><b>${studyHours} hours</b><span>available each week</span></div><div class="allocation"><div><span>Data Structures & Algorithms</span><b>${Math.round(studyHours*.32)}h</b><i style="width:32%"></i></div><div><span>Optimization Techniques</span><b>${Math.round(studyHours*.24)}h</b><i style="width:24%"></i></div><div><span>Database Management Systems</span><b>${Math.round(studyHours*.23)}h</b><i style="width:23%"></i></div><div><span>Other courses</span><b>${Math.round(studyHours*.21)}h</b><i style="width:21%"></i></div></div><button class="primary full" data-action="save-plan">Save weekly plan</button></article></div></section>`;
}

function coach() {
  return `<section class="page coach-page"><div class="coach-intro"><span class="coach-mark">✦</span><p class="eyebrow">Orbit coach</p><h1>Let’s make your next step lighter.</h1><p>I use your confirmed record and plan as context. I can help you study, but I won’t make official policy claims or change your GPA.</p><div class="context-pills"><span>◉ CGPA ${fmt(scenario().cgpa)}</span><span>◉ Target ${fmt(target)}</span><span>◉ Sem 3 upcoming</span></div></div><div class="chat card"><div class="message bot"><span>✦</span><div>Hi Dassa — with your <b>${studyHours}-hour weekly budget</b>, I’d start with a 90-minute DSA review block. Want a plan for today or help with a specific course?</div></div><div id="chat-log"></div><div class="prompt-row"><button class="suggestion" data-prompt="Make a study plan for this week">Plan my week</button><button class="suggestion" data-prompt="How can I improve in Data Structures?">Improve in DSA</button><button class="suggestion" data-prompt="Explain my CGPA target">Explain my target</button></div><form id="chat-form"><input id="chat-input" placeholder="Ask about your study plan…" autocomplete="off"><button class="send" aria-label="Send">↑</button></form><small class="coach-disclaimer">Study guidance only. Orbit's deterministic planner is the source of truth for calculations.</small></div></section>`;
}

function admin() {
  return `<section class="page"><div class="page-title"><div><p class="eyebrow">Internal admin</p><h1>Curriculum publishing desk</h1><p class="muted">Manage verifiable sources and staged program releases.</p></div><button class="primary" data-action="import">+ Import source</button></div><div class="metrics">${metric("Published programs","1","CSE 2023", "mint")}${metric("Pending review","3","New source packs", "amber")}${metric("Grade scales","0","Official policy needed", "violet")}${metric("Extraction mappings","5","Document types", "blue")}</div><article class="card table-card"><div class="table-toolbar"><b>Program templates</b><span class="chip">All Amrita programs</span></div><table><thead><tr><th>Program</th><th>Regulation</th><th>Source status</th><th>Publish status</th><th></th></tr></thead><tbody><tr><td><b>B.Tech Computer Science & Engineering</b><small>School of Computing</small></td><td>2023 onwards</td><td><span class="status complete">Source reviewed</span></td><td><span class="status complete">Published</span></td><td><button class="text-btn">Manage →</button></td></tr><tr><td><b>B.Tech Electrical & Electronics</b><small>Awaiting source pack</small></td><td>—</td><td><span class="status upcoming">Not submitted</span></td><td><span class="status upcoming">Staged</span></td><td><button class="text-btn">Add source →</button></td></tr></tbody></table></article></section>`;
}

function shell(content: string) {
  return `<div class="app-shell"><aside><div class="brand"><span>◒</span><b>orbit</b></div><div class="program"><span class="avatar">D</span><div><b>Dassa</b><small>B.Tech CSE · 2023</small></div><span>⌄</span></div><nav>${navItem("dashboard","▦","Overview")}${navItem("records","☷","Academic record")}${navItem("documents","⇧","Documents")}${navItem("plan","◎","Goal planner")}${navItem("coach","✦","Orbit coach")}<div class="nav-label">WORKSPACE</div>${navItem("admin","⌘","Admin")}</nav><div class="sidebar-foot"><button>⚙ Settings</button><small>v0.1 · Your data is private</small></div></aside><main><header><button class="mobile-menu">☰</button><div class="crumb">AMRITA UNIVERSITY <span>/</span> ${screen}</div><div class="top-actions"><button aria-label="Notifications">♢</button><button class="help">?</button><span class="avatar">D</span></div></header>${content}</main></div>`;
}

function render() { const pages: Record<Screen, () => string> = { dashboard, records, documents, plan, coach, admin }; app.innerHTML = shell(pages[screen]()); bind(); }

function bind() {
  document.querySelectorAll<HTMLElement>("[data-screen]").forEach(el => el.addEventListener("click", () => { screen = el.dataset.screen as Screen; render(); }));
  document.querySelector("#target")?.addEventListener("input", e => { target = Number((e.target as HTMLInputElement).value); render(); });
  document.querySelector("#hours")?.addEventListener("input", e => { studyHours = Number((e.target as HTMLInputElement).value); render(); });
  document.querySelector("[data-action='add-grade']")?.addEventListener("click", () => { attempts = [...attempts, { courseCode: "23MAT206", grade: "A" as Grade, confirmed: true }]; render(); });
  document.querySelector("[data-action='review']")?.addEventListener("click", () => alert("Review is ready: compare each extracted course and grade with the source before confirming."));
  document.querySelector("[data-action='privacy']")?.addEventListener("click", () => alert("Privacy controls: originals can be retained or deleted independently from confirmed structured data."));
  document.querySelector("[data-action='save-plan']")?.addEventListener("click", () => alert("Weekly plan saved locally for this demo."));
  document.querySelector("[data-action='scenario']")?.addEventListener("click", () => alert("Scenario view: changing targets updates the required average deterministically."));
  document.querySelector("[data-action='import']")?.addEventListener("click", () => alert("Source import is available to authorized admins only."));
  document.querySelector("#file-input")?.addEventListener("change", e => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) alert(`${file.name} added to the private review queue. No extracted value will affect your record until you confirm it.`); });
  document.querySelectorAll<HTMLElement>("[data-prompt]").forEach(btn => btn.addEventListener("click", () => sendMessage(btn.dataset.prompt || "")));
  document.querySelector<HTMLFormElement>("#chat-form")?.addEventListener("submit", e => { e.preventDefault(); const input = document.querySelector<HTMLInputElement>("#chat-input")!; sendMessage(input.value); input.value = ""; });
}

function sendMessage(text: string) {
  if (!text.trim()) return;
  const log = document.querySelector("#chat-log");
  if (!log) return;
  const reply = text.toLowerCase().includes("target") ? `Your ${fmt(target)} target needs an average of ${fmt(scenario().requiredAverage)} across remaining graded credits. That comes from the planner, not from me.` : text.toLowerCase().includes("dsa") ? "For DSA, use three short loops: recall one concept, solve one timed problem, then explain the approach aloud. Reserve the first 5 hours of your weekly budget for this course." : `Start with two ${Math.round(studyHours / 3)}-hour focus blocks this week. Put DSA first, then Optimization Techniques. Keep one hour on Sunday to review what actually worked.`;
  log.insertAdjacentHTML("beforeend", `<div class="message user"><div>${text}</div></div><div class="message bot"><span>✦</span><div>${reply}</div></div>`);
  log.parentElement?.scrollTo({ top: log.parentElement.scrollHeight, behavior: "smooth" });
}

render();

