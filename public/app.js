const ICON_PLAY =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

const pad = (n) => String(n).padStart(3, "0");

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function fmtDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function dayNumber(startIso) {
  const start = new Date(startIso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((today - start) / 86400000) + 1);
}

function renderBoard(data) {
  const board = document.getElementById("board");
  const byDay = new Map(data.projects.map((p) => [p.day, p]));
  const nextDay = Math.max(0, ...data.projects.map((p) => p.day)) + 1;
  const frag = document.createDocumentFragment();

  for (let d = 1; d <= data.total; d++) {
    const li = document.createElement("li");
    li.className = "cell";
    li.style.animationDelay = `${d * 6}ms`;
    const p = byDay.get(d);
    if (p) {
      li.classList.add("done");
      li.style.setProperty("--c", p.accent);
      li.innerHTML = `<a href="#${esc(p.slug)}" aria-label="Day ${d}: ${esc(p.title)}">${d}<span class="tip">Day ${d} · ${esc(p.title)}</span></a>`;
    } else if (d === nextDay) {
      li.classList.add("next");
      li.textContent = d;
      li.title = `Day ${d}: coming up`;
      li.setAttribute("aria-label", `Day ${d}: coming up`);
    } else {
      li.setAttribute("aria-label", `Day ${d}`);
    }
    frag.appendChild(li);
  }
  board.appendChild(frag);
}

function renderProjects(data) {
  const list = document.getElementById("projects");
  const sorted = [...data.projects].sort((a, b) => b.day - a.day);
  list.innerHTML = sorted
    .map(
      (p) => `
      <li class="card" id="${esc(p.slug)}" style="--c:${esc(p.accent)}">
        <a class="thumb" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="Open ${esc(p.title)}">
          <img src="${esc(p.thumb)}" alt="Screenshot of ${esc(p.title)}" loading="lazy" width="960" height="600" />
          <span class="day-chip">DAY ${pad(p.day)}</span>
        </a>
        <div class="body">
          <time class="mono" datetime="${esc(p.date)}">${fmtDate(p.date)}</time>
          <h3>${esc(p.title)}</h3>
          <p class="tagline">${esc(p.tagline)}</p>
          <p class="desc">${esc(p.description)}</p>
          <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          <div class="actions">
            <a class="btn primary" href="${esc(p.url)}" target="_blank" rel="noopener">${ICON_PLAY} Open live</a>
          </div>
        </div>
      </li>`
    )
    .join("");
}

function renderStats(data) {
  const shipped = data.projects.length;
  document.getElementById("stat-shipped").textContent = shipped;
  document.getElementById("stat-day").textContent = Math.min(dayNumber(data.start), data.total);
  document.getElementById("stat-start").textContent = fmtDate(data.start);
  const pct = Math.round((shipped / data.total) * 100);
  const meter = document.querySelector(".meter");
  meter.setAttribute("aria-valuenow", String(pct));
  requestAnimationFrame(() => {
    document.getElementById("meter-fill").style.width = `${Math.max(pct, 1)}%`;
  });
}

fetch("projects.json", { cache: "no-cache" })
  .then((r) => r.json())
  .then((data) => {
    renderStats(data);
    renderBoard(data);
    renderProjects(data);
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  })
  .catch(() => {
    document.getElementById("projects").innerHTML =
      '<li class="mono hint">Could not load projects. Try refreshing.</li>';
  });
