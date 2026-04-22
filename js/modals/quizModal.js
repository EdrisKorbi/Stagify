import { openModal, closeModal } from './modalHelpers.js';

let quizIdx = 0, quizScore = 0, answeredCurrent = false;
let currentCompanyId = null;
let currentQuiz = null;
let userAnswers = [];

export async function openQuiz(id){
  const response = await fetch(`api.php?action=getQuiz&postId=${id}`);
  currentQuiz = await response.json();
  
  if(!currentQuiz || !currentQuiz.content || currentQuiz.content.length === 0) {
    alert("Désolé, aucun quiz n'est disponible pour ce poste actuellement.");
    return;
  }

  currentCompanyId = id;
  quizIdx = 0;
  quizScore = 0;
  userAnswers = [];
  answeredCurrent = false;

  document.getElementById('quiz-company-label').textContent = `Quiz · ${currentQuiz.postTitle || 'Entreprise'}`;
  document.getElementById('quiz-body').style.display = 'block';
  document.getElementById('quiz-score').style.display = 'none';

  renderQuestion();
  openModal('quiz-modal');
}

function renderQuestion(){
  const questions = currentQuiz.content;
  const q = questions[quizIdx];
  const total = questions.length;

  document.getElementById('quiz-counter').textContent = `Question ${quizIdx+1} / ${total}`;
  document.getElementById('quiz-progress').style.width = `${(quizIdx/total)*100}%`;
  document.getElementById('quiz-q').textContent = q.question;

  const optsEl = document.getElementById('quiz-opts');
  optsEl.innerHTML = '';
  document.getElementById('quiz-next-btn').style.display = 'none';

  answeredCurrent = false;

  q.options.forEach((o,i)=>{
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
  userAnswers[quizIdx] = chosen;

  const btns = container.querySelectorAll('.quiz-option');
  btns.forEach((b,i)=>{
    b.disabled = true;
    if(i===correct) b.classList.add('correct');
    else if(i===chosen) b.classList.add('wrong');
  });

  if(chosen===correct) quizScore++;
  document.getElementById('quiz-next-btn').style.display = 'inline-flex';
}

let pendingAnswers = [];

export async function nextQuestion(){
  quizIdx++;
  if(quizIdx < currentQuiz.content.length) renderQuestion();
  else {
    pendingAnswers = [...userAnswers];
    showQuizScore();
  }
}

export function getQuizResults() {
  return {
    postId: currentCompanyId,
    answers: pendingAnswers
  };
}


function showQuizScore(){
  document.getElementById('quiz-body').style.display = 'none';

  const score = document.getElementById('quiz-score');
  score.style.display = 'block';

  const total = currentQuiz.content.length;
  document.getElementById('quiz-progress').style.width = '100%';
  document.getElementById('score-val').textContent = quizScore;
  document.getElementById('score-tot').textContent = `/${total}`;

  const pct = quizScore / total;
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
      '🏢 ' + (currentQuiz ? currentQuiz.enterpriseName : 'Entreprise');

    openModal('apply-modal');
  }, 350);
}