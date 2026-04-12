import { companies } from '../data/companies.js';
import { quizData } from '../data/quizData.js';
import { openModal, closeModal } from './modalHelpers.js';

let quizIdx = 0, quizScore = 0, answeredCurrent = false;
let currentCompany = null;

export function openQuiz(id){
  const c = companies.find(x=>x.id===id);
  currentCompany = c;

  quizIdx = 0;
  quizScore = 0;
  answeredCurrent = false;

  document.getElementById('quiz-company-label').textContent = 'Quiz · ' + c.name;
  document.getElementById('quiz-body').style.display = 'block';
  document.getElementById('quiz-score').style.display = 'none';

  renderQuestion();
  openModal('quiz-modal');
}

function renderQuestion(){
  const q = quizData[quizIdx];
  const total = quizData.length;

  document.getElementById('quiz-counter').textContent = `Question ${quizIdx+1} / ${total}`;
  document.getElementById('quiz-progress').style.width = `${(quizIdx/total)*100}%`;
  document.getElementById('quiz-q').textContent = q.q;

  const optsEl = document.getElementById('quiz-opts');
  optsEl.innerHTML = '';
  document.getElementById('quiz-next-btn').style.display = 'none';

  answeredCurrent = false;

  q.opts.forEach((o,i)=>{
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = o;
    btn.onclick = ()=> answerQuestion(i, q.correct, optsEl);
    optsEl.appendChild(btn);
  });
}

function answerQuestion(chosen, correct, container){
  if(answeredCurrent) return;

  answeredCurrent = true;

  const btns = container.querySelectorAll('.quiz-option');
  btns.forEach((b,i)=>{
    b.disabled = true;
    if(i===correct) b.classList.add('correct');
    else if(i===chosen) b.classList.add('wrong');
  });

  if(chosen===correct) quizScore++;
  document.getElementById('quiz-next-btn').style.display = 'inline-flex';
}

export function nextQuestion(){
  quizIdx++;
  if(quizIdx < quizData.length) renderQuestion();
  else showQuizScore();
}

function showQuizScore(){
  document.getElementById('quiz-body').style.display = 'none';

  const score = document.getElementById('quiz-score');
  score.style.display = 'block';

  document.getElementById('quiz-progress').style.width = '100%';
  document.getElementById('score-val').textContent = quizScore;
  document.getElementById('score-tot').textContent = `/${quizData.length}`;

  const pct = quizScore / quizData.length;
  let lbl, msg;

  if(pct===1){
    lbl='Excellent !';
    msg='Score parfait ! Vous êtes un candidat idéal pour ce stage. Complétez votre dossier pour envoyer votre candidature.';
  } else if(pct>=.6){
    lbl='Très bien !';
    msg='Vous avez de très bons résultats. Continuez pour soumettre votre dossier de candidature.';
  } else if(pct>=.4){
    lbl='Encourageant';
    msg="Des bases solides. N'hésitez pas à compléter votre candidature, votre motivation fera la différence !";
  } else {
    lbl='À améliorer';
    msg='Mais une candidature bien rédigée peut tout changer ! Poursuivez et montrez votre motivation.';
  }

  document.getElementById('score-lbl').textContent = lbl;
  document.getElementById('score-msg').textContent = msg;
}

export function openApplyModal(){
  closeModal('quiz-modal');

  setTimeout(()=>{
    document.getElementById('apply-badge').textContent =
      '🏢 ' + (currentCompany ? currentCompany.name : 'Entreprise');

    openModal('apply-modal');
  }, 350);
}