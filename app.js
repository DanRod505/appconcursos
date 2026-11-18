import { subjects, icons } from './content.js?v=trilha-2';
import { muteCues, playCue } from './audio.js';

const lessons = subjects.flatMap(subject => subject.lessons.map(lesson => ({ ...lesson, subject })));

const screen = document.querySelector('#screen');
const themeToggle = document.querySelector('#theme-toggle');
const soundToggle = document.querySelector('#sound-toggle');
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
  theme: 'dark', style: 'glass', sound: true, completed: [], mistakes: [],
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

function updateSound() {
  soundToggle.innerHTML = icon(state.sound ? 'volume' : 'muted');
  soundToggle.setAttribute('aria-pressed', String(state.sound));
  soundToggle.title = state.sound ? 'Silenciar efeitos sonoros' : 'Ativar efeitos sonoros';
}

function sound(cue) {
  if (state.sound) playCue(cue);
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
      <strong>${count === dailyGoal ? 'Meta alcançada!' : `${count} de ${dailyGoal} questões`}</strong>
      ${progressBar(count, dailyGoal, 'Questões respondidas hoje')}
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

function completedCount(subject) {
  return subject.lessons.filter(({ id }) => state.completed.includes(id)).length;
}

function subjectCard(subject) {
  const count = completedCount(subject);
  const total = subject.lessons.length;
  return `<a class="subject-card surface" href="#trilha/${subject.id}">
    <div class="subject-card-heading"><span class="small-icon">${icon(subject.icon)}</span>${icon('chevron', 'subject-arrow')}</div>
    <h3>${subject.name}</h3>
    <p>${subject.topic}</p>
    ${progressBar(count, total, 'Lições concluídas')}
    <span class="subject-progress">${count} de ${total} ${total === 1 ? 'lição' : 'lições'}</span>
  </a>`;
}

function track() {
  return `<section class="hero surface enter" aria-labelledby="hero-title">
    <div class="hero-copy">
      <h1 id="hero-title">Sua rotina de estudo</h1>
      <p>Escolha uma matéria e avance com lições curtas no estilo de concurso.</p>
    </div>
    <div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><img src="assets/cerebro.webp" alt=""></div>
  </section>
  <div class="dashboard-main enter">
    <section aria-labelledby="subjects-title">
      <div class="section-heading"><h2 id="subjects-title">Matérias</h2></div>
      <div class="subject-grid">${subjects.map(subjectCard).join('')}</div>
    </section>
    ${dailyCard()}
  </div>`;
}

const trailConnector = `<svg class="trail-connector" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 0 C0 50 100 50 100 100" vector-effect="non-scaling-stroke"/>
</svg>`;

function subjectTrack(subject) {
  const count = completedCount(subject);
  const total = subject.lessons.length;
  const next = subject.lessons.find(({ id }) => !state.completed.includes(id));
  return `<div class="track-page enter">
    <a class="text-link back-link" href="#trilha">${icon('back')} Todas as matérias</a>
    <div class="track-heading surface">
      <span class="small-icon">${icon(subject.icon)}</span>
      <div>
        <h1>${subject.name}</h1>
        <p>${subject.topic}</p>
      </div>
      <div class="track-progress">
        <span>${count} de ${total} ${total === 1 ? 'lição' : 'lições'}</span>
        ${progressBar(count, total, 'Lições concluídas nesta matéria')}
      </div>
    </div>
    <div class="track-layout">
      <ol class="steps surface" role="list" aria-label="Caminho de lições">
        ${subject.lessons.map(lesson => {
          const complete = state.completed.includes(lesson.id);
          const current = lesson === next;
          const status = complete ? 'complete' : current ? 'current' : 'locked';
          const label = complete ? 'Concluída' : current ? 'Próxima lição' : 'Bloqueada';
          return `<li class="step ${status}" ${current ? 'aria-current="step"' : ''}>
            ${trailConnector}
            <button type="button" class="step-link" data-start="${lesson.id}" ${status === 'locked' ? 'disabled' : ''}>
              <span class="step-node">${icon(status === 'locked' ? 'lock' : lesson.icon)}${complete ? `<span class="step-check">${icon('check')}</span>` : ''}</span>
              <span class="step-details"><strong>${lesson.title}</strong><small>${label}</small></span>
            </button>
          </li>`;
        }).join('')}
        <li class="step trail-finish ${next ? 'locked' : 'complete'}">
          <span class="step-link"><span class="step-node">${icon('flag')}</span><span class="step-details"><strong>Fim da trilha</strong></span></span>
        </li>
      </ol>
      <aside class="track-next surface">
        <span class="track-next-label">${icon(next ? 'play' : 'check')} ${next ? 'Próxima lição' : 'Trilha concluída'}</span>
        <h2>${next ? next.title : subject.name}</h2>
        <p>${next ? next.description : 'Você completou todas as lições desta matéria.'}</p>
        ${next
          ? `<button type="button" class="primary" data-start="${next.id}">Iniciar lição ${icon('arrow')}</button>`
          : `<a class="primary" href="#trilha">Explorar matérias ${icon('arrow')}</a>`}
      </aside>
    </div>
  </div>`;
}

function review() {
  const count = state.mistakes.length;
  return `<section class="focused surface enter"><span class="small-icon">${icon('refresh')}</span>
    <h1>Revisão</h1>
    <p>${count ? `Reveja as questões que você errou. Cada acerto retira uma questão da fila.` : 'As questões que você errar nas lições aparecerão aqui para praticar de novo.'}</p>
    ${count ? `<button class="primary" data-review>Revisar ${count} ${count === 1 ? 'questão' : 'questões'} ${icon('arrow')}</button>` : `<a class="primary" href="#trilha">Voltar à trilha ${icon('arrow')}</a>`}
  </section>`;
}

function performance() {
  return `<div class="dashboard-top secondary">
    <section class="focused surface enter"><span class="small-icon">${icon('chart')}</span>
      <h1>Seu progresso</h1><p>Desempenho nas lições e revisões neste navegador.</p>
      ${stats()}
      <p>${state.answered} ${state.answered === 1 ? 'questão respondida' : 'questões respondidas'} · ${state.mistakes.length} para revisar</p>
      <h2 class="progress-title">Por matéria</h2>
      <div class="progress-subjects">${subjects.map(subjectCard).join('')}</div>
    </section>${dailyCard()}</div>`;
}

function page() {
  const [hash] = location.hash.slice(1).split('/');
  return pages.includes(hash) ? hash : 'trilha';
}

function renderPage(focus = false) {
  session = undefined;
  const current = page();
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const subject = current === 'trilha' && subjects.find(({ id }) => location.hash === `#trilha/${id}`);
  screen.innerHTML = subject ? subjectTrack(subject) : { trilha: track, revisao: review, progresso: performance }[current]();
  if (focus) focusHeading();
}

function focusHeading() {
  const title = screen.querySelector('h1');
  title.tabIndex = -1;
  title.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function questionsFor(lesson) {
  return lesson.questions.map((question, index) => ({ ...question, id: `${lesson.id}-${index}`, subject: lesson.subject }));
}

function start(lesson) {
  const questions = lesson
    ? questionsFor(lesson)
    : lessons.flatMap(questionsFor).filter(question => state.mistakes.includes(question.id));
  if (!questions.length) return;
  session = { lesson, questions, index: 0, selected: null, checked: false, score: 0 };
  sound('start');
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
    <section class="question-card surface${focus ? ' enter' : ''}">
      <span class="subject">${icon(question.subject.icon)} ${question.subject.name}</span>
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
  sound(session.selected === question.answer ? 'correct' : 'incorrect');
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
  sound('finish');
  screen.innerHTML = `<section class="focused result surface enter">
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
soundToggle.addEventListener('click', () => {
  state.sound = !state.sound;
  updateSound();
  if (state.sound) sound('start');
  else muteCues();
  save();
});
window.addEventListener('hashchange', () => renderPage(true));
document.querySelectorAll('.nav a, .brand').forEach(link => {
  link.addEventListener('click', () => {
    if (session && link.hash === location.hash) renderPage(true);
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
updateSound();
renderPage();
