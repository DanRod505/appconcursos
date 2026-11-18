import { lessons, icons } from './content.js';

const screen = document.querySelector('#screen');
const themeToggle = document.querySelector('#theme-toggle');
const root = document.documentElement;
const storageKey = 'rumo-prototype-v1';
const dailyGoal = 3;
const pages = ['trilha', 'revisao', 'progresso'];

function readState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) ?? {};
  } catch {
    return {};
  }
}

const state = {
  theme: 'dark', style: 'glass', completed: [], mistakes: [],
  answered: 0, correct: 0, daily: {}, ...readState()
};
let session;

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Study remains available even when the browser blocks local storage.
  }
}

function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
}

function updateAppearance() {
  root.dataset.style = state.style;
  root.dataset.theme = state.theme;
  document.querySelectorAll('[data-style-choice]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.styleChoice === state.style));
  });
  const light = state.theme === 'dark';
  const label = light ? 'Ativar tema claro' : 'Ativar tema escuro';
  themeToggle.innerHTML = icon(light ? 'sun' : 'moon');
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue('--base').trim();
}

function progressBar(value, max, label) {
  return `<div class="bar" role="progressbar" aria-label="${label}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}"><span style="width:${value / max * 100}%"></span></div>`;
}

function localDay() {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
}

function dailyCard() {
  const count = Math.min(state.daily[localDay()] ?? 0, dailyGoal);
  return `<aside class="daily surface">
    <div class="card-heading"><span class="small-icon">${icon('target')}</span><h2>Meta diária</h2></div>
    <div class="daily-content">
      <div class="ring" role="img" style="--value:${count / dailyGoal * 100}%" aria-label="${count} de ${dailyGoal} questões">
        <strong aria-hidden="true">${count}<small>/${dailyGoal}</small></strong>
      </div>
      <div><strong>${count === dailyGoal ? 'Meta alcançada!' : 'Questões de hoje'}</strong>
      <p>${count === dailyGoal ? 'Você completou sua meta de prática.' : 'Responda 3 questões para cumprir sua meta.'}</p></div>
    </div>
  </aside>`;
}

function stats() {
  const accuracy = state.answered ? `${Math.round(state.correct / state.answered * 100)}%` : '—';
  return `<div class="stats">
    <div><strong>${state.completed.length}<small>/${lessons.length}</small></strong><span>Lições concluídas</span></div>
    <div><strong>${accuracy}</strong><span>Taxa de acertos</span></div>
  </div>`;
}

function track() {
  const nextIndex = lessons.findIndex(({ id }) => !state.completed.includes(id));
  const next = lessons[nextIndex] ?? lessons[0];
  return `
    <div class="dashboard-top">
      <section class="hero surface" aria-labelledby="hero-title">
        <div class="hero-copy">
          <span class="subject">${icon('book')} Português</span>
          <h1 id="hero-title">${nextIndex === -1 ? 'Trilha concluída!' : 'Seu próximo passo'}</h1>
          <p>${nextIndex === -1 ? 'Volte às questões que você errou ou pratique de novo para reforçar as regras.' : 'Estude concordância verbal em lições curtas e pratique com questões no estilo de concurso.'}</p>
          ${nextIndex === -1 ? `<a class="primary" href="#revisao">${icon('refresh')} Ir para revisão ${icon('arrow', 'end-icon')}</a>` : `<button class="primary" data-start="${next.id}">${icon('play')} Iniciar lição ${icon('arrow', 'end-icon')}</button>`}
        </div>
        <div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><img src="assets/mascote.webp" alt=""></div>
      </section>
      ${dailyCard()}
    </div>
    <div class="dashboard-main">
      <section class="track" aria-labelledby="track-title">
        <div class="section-heading">
          <div><h2 id="track-title">Trilha de estudos</h2><p>Português <span class="separator">·</span> Concordância verbal</p></div>
          <span class="completion">${state.completed.length} de ${lessons.length} lições</span>
        </div>
        <ol class="steps">
          ${lessons.map((lesson, index) => {
            const complete = state.completed.includes(lesson.id);
            const current = index === nextIndex;
            const status = complete ? 'complete' : current ? 'current' : 'locked';
            const label = complete ? 'Concluída' : current ? 'Próxima lição' : 'Bloqueada';
            return `<li class="step ${status}">
              <span class="step-node">${icon(complete ? 'check' : current ? lesson.icon : 'lock')}</span>
              <button class="step-card surface" data-start="${lesson.id}" ${status === 'locked' ? 'disabled' : ''}>
                <span class="step-details"><strong>${lesson.title}</strong><small>${lesson.description}</small></span>
                <span class="step-status">${label}</span>
                ${status === 'locked' ? '' : icon('chevron', 'step-arrow')}
              </button>
            </li>`;
          }).join('')}
        </ol>
      </section>
      <aside class="side-stack">
        <section class="overview surface">
          <div class="card-heading"><span class="small-icon">${icon('chart')}</span><h2>Seu progresso</h2></div>
          ${stats()}
          <a class="text-link" href="#progresso">Ver desempenho ${icon('arrow')}</a>
        </section>
        <section class="tip surface">
          <span class="small-icon">${icon('bulb')}</span>
          <div><h2>Dica de estudo</h2><p>Encontre o núcleo do sujeito antes de decidir se o verbo fica no singular ou no plural.</p></div>
        </section>
      </aside>
    </div>`;
}

function review() {
  const count = state.mistakes.length;
  return `<section class="focused surface"><span class="small-icon">${icon('refresh')}</span>
    <h1>Revisão</h1>
    <p>${count ? `Reveja as questões que você errou. Cada acerto retira uma questão da fila.` : 'As questões que você errar nas lições aparecerão aqui para praticar de novo.'}</p>
    ${count ? `<button class="primary" data-review>Revisar ${count} ${count === 1 ? 'questão' : 'questões'} ${icon('arrow')}</button>` : `<a class="primary" href="#trilha">Voltar à trilha ${icon('arrow')}</a>`}
  </section>`;
}

function performance() {
  return `<div class="dashboard-top secondary">
    <section class="focused surface"><span class="small-icon">${icon('chart')}</span>
      <h1>Seu progresso</h1><p>Desempenho nas lições e revisões de Português neste navegador.</p>
      ${stats()}
      <p>${state.answered} ${state.answered === 1 ? 'questão respondida' : 'questões respondidas'} · ${state.mistakes.length} para revisar</p>
      <a class="text-link" href="#trilha">Voltar à trilha ${icon('arrow')}</a>
    </section>${dailyCard()}</div>`;
}

function page() {
  const hash = location.hash.slice(1);
  return pages.includes(hash) ? hash : 'trilha';
}

function renderPage(focus = false) {
  session = undefined;
  const current = page();
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  screen.innerHTML = { trilha: track, revisao: review, progresso: performance }[current]();
  if (focus) focusHeading();
}

function focusHeading() {
  const title = screen.querySelector('h1');
  title.tabIndex = -1;
  title.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function questionsFor(lesson) {
  return lesson.questions.map((question, index) => ({ ...question, id: `${lesson.id}-${index}` }));
}

function start(lesson) {
  const questions = lesson
    ? questionsFor(lesson)
    : lessons.flatMap(questionsFor).filter(question => state.mistakes.includes(question.id));
  if (!questions.length) return;
  session = { lesson, questions, index: 0, selected: null, checked: false, score: 0 };
  renderQuestion(true);
}

function renderQuestion(focus = false) {
  const { lesson, questions, index, selected, checked } = session;
  const question = questions[index];
  const correct = selected === question.answer;
  screen.innerHTML = `<div class="lesson-flow">
    <button class="text-link back-link" data-exit>${icon('back')} ${lesson ? 'Voltar à trilha' : 'Voltar à revisão'}</button>
    <div class="question-progress"><span>${lesson ? lesson.title : 'Revisão'}</span><strong>${index + 1} / ${questions.length}</strong></div>
    ${progressBar(index + Number(checked), questions.length, 'Questões verificadas')}
    <section class="question-card surface">
      <span class="subject">${icon('book')} Português</span>
      <h1 id="question-title">${question.prompt}</h1>
      <div class="options" role="group" aria-labelledby="question-title">
        ${question.options.map((option, position) => {
          const status = checked && position === question.answer ? ' is-correct' : checked && selected === position ? ' is-incorrect' : '';
          return `<button type="button" class="option${status}" data-option="${position}" aria-pressed="${selected === position}" ${checked ? 'disabled' : ''}>
            <span>${'ABCD'[position]}</span>${option}${status === ' is-correct' ? icon('check', 'end-icon') + '<span class="sr-only">Resposta correta</span>' : ''}
          </button>`;
        }).join('')}
      </div>
      ${checked ? `<div class="feedback ${correct ? 'right' : 'wrong'}" id="feedback" tabindex="-1"><strong>${correct ? 'Resposta correta!' : 'Resposta incorreta'}</strong><p>${question.explanation}</p></div>` : ''}
      <div class="question-actions">${checked
        ? `<button class="primary" data-next>${index + 1 === questions.length ? 'Ver resultado' : 'Continuar'} ${icon('arrow')}</button>`
        : `<button class="primary" data-check ${selected === null ? 'disabled' : ''}>Verificar resposta ${icon('check')}</button>`}</div>
    </section>
  </div>`;
  if (focus) focusHeading();
}

function checkAnswer() {
  if (session.checked || session.selected === null) return;
  const question = session.questions[session.index];
  session.checked = true;
  state.answered++;
  const day = localDay();
  state.daily[day] = (state.daily[day] ?? 0) + 1;
  if (session.selected === question.answer) {
    session.score++;
    state.correct++;
    state.mistakes = state.mistakes.filter(id => id !== question.id);
  } else if (!state.mistakes.includes(question.id)) {
    state.mistakes.push(question.id);
  }
  save();
  renderQuestion();
  screen.querySelector('#feedback').focus();
}

function nextQuestion() {
  if (++session.index < session.questions.length) {
    session.selected = null;
    session.checked = false;
    renderQuestion(true);
    return;
  }
  const { lesson, score, questions } = session;
  if (lesson && !state.completed.includes(lesson.id)) state.completed.push(lesson.id);
  save();
  screen.innerHTML = `<section class="focused result surface">
    <span class="small-icon">${icon('flag')}</span>
    <h1>${lesson ? 'Lição concluída!' : 'Revisão concluída!'}</h1>
    <p>Você acertou <strong>${score} de ${questions.length}</strong> questões.</p>
    ${score < questions.length ? '<p>As questões que você errou estão na fila de revisão.</p>' : ''}
    <button class="primary" data-exit>${lesson ? 'Voltar à trilha' : 'Voltar à revisão'} ${icon('arrow')}</button>
  </section>`;
  focusHeading();
}

document.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = icon(element.dataset.icon); });
document.querySelectorAll('[data-style-choice]').forEach(button => {
  button.addEventListener('click', () => {
    state.style = button.dataset.styleChoice;
    updateAppearance();
    save();
  });
});
themeToggle.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  updateAppearance();
  save();
});
window.addEventListener('hashchange', () => renderPage(true));
document.querySelectorAll('.nav a, .brand').forEach(link => {
  link.addEventListener('click', () => {
    if (session && link.hash.slice(1) === page()) renderPage(true);
  });
});
screen.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-start')) start(lessons.find(lesson => lesson.id === button.dataset.start));
  if (button.hasAttribute('data-review')) start();
  if (button.hasAttribute('data-option') && !session.checked) {
    session.selected = Number(button.dataset.option);
    screen.querySelectorAll('[data-option]').forEach(option => {
      option.setAttribute('aria-pressed', String(option === button));
    });
    screen.querySelector('[data-check]').disabled = false;
  }
  if (button.hasAttribute('data-check')) checkAnswer();
  if (button.hasAttribute('data-next')) nextQuestion();
  if (button.hasAttribute('data-exit')) renderPage(true);
});

updateAppearance();
renderPage();
