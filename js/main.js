import { switchRole, doLogin, doLogout } from './auth/auth.js';
import { scrollToSection } from './navigation/navigation.js';
import { renderGrid } from './companies/grid.js';
import { filterFiliere } from './companies/filter.js';

import { openInfo, startApplyFlow } from './modals/infoModal.js';
import { openQuiz, nextQuestion, openApplyModal } from './modals/quizModal.js';

import { handleCvDrop, submitApplication } from './modals/applyModal.js';
import { submitContact } from './misc/contact.js';
import { changeAboutImg } from './misc/about.js';

import './ui/cursor.js';
import './ui/canvas.js';

console.log("APP LOADED");

// 🔥 MAKE EVERYTHING GLOBAL (THIS IS THE FIX)
window.switchRole = switchRole;
window.doLogin = doLogin;
window.doLogout = doLogout;
window.scrollToSection = scrollToSection;

window.renderGrid = renderGrid;
window.filterFiliere = filterFiliere;

window.openInfo = openInfo;
window.startApplyFlow = startApplyFlow;

window.openQuiz = openQuiz;
window.nextQuestion = nextQuestion;
window.openApplyModal = openApplyModal;

window.handleCvDrop = handleCvDrop;
window.submitApplication = submitApplication;

window.submitContact = submitContact;
window.changeAboutImg = changeAboutImg;