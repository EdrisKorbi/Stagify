import { switchRole, doLogin, doLogout, showSignup, showLogin, toggleSignupFields, doRegister } from './auth/auth.js';
import { scrollToSection } from './navigation/navigation.js';
import { renderGrid, renderHistory, openCompanyPosts } from './companies/grid.js';
import { filterFiliere } from './companies/filter.js';


import { openInfo, startApplyFlow } from './modals/infoModal.js';
import { openQuiz, nextQuestion, openApplyModal } from './modals/quizModal.js';
import { openModal, closeModal } from './modals/modalHelpers.js';

import { handleCvDrop, submitApplication } from './modals/applyModal.js';
import { submitContact } from './misc/contact.js';
import { changeAboutImg } from './misc/about.js';
import { openCreatePostModal, submitNewPost, addQuizQuestion, renderEnterprisePosts, deletePost, viewApplicants, updateAppStatus, updateEnterpriseProfile, loadEnterpriseProfile } from './modals/enterpriseModal.js';




import './ui/cursor.js';
import './ui/canvas.js';
import './ui/theme.js';

console.log("APP LOADED");

// 🔥 MAKE EVERYTHING GLOBAL (THIS IS THE FIX)
window.switchRole = switchRole;
window.doLogin = doLogin;
window.doLogout = doLogout;
window.showSignup = showSignup;
window.showLogin = showLogin;
window.toggleSignupFields = toggleSignupFields;
window.doRegister = doRegister;
window.scrollToSection = scrollToSection;

window.renderGrid = renderGrid;
window.filterFiliere = filterFiliere;
window.openCompanyPosts = openCompanyPosts;

window.openInfo = openInfo;
window.startApplyFlow = startApplyFlow;

window.openQuiz = openQuiz;
window.nextQuestion = nextQuestion;
window.openApplyModal = openApplyModal;

window.handleCvDrop = handleCvDrop;
window.submitApplication = submitApplication;

window.submitContact = submitContact;
window.changeAboutImg = changeAboutImg;

window.openModal = openModal;
window.closeModal = closeModal;

window.openCreatePostModal = openCreatePostModal;
window.submitNewPost = submitNewPost;
window.addQuizQuestion = addQuizQuestion;
window.deletePost = deletePost;
window.viewApplicants = viewApplicants;
window.updateAppStatus = updateAppStatus;
window.updateEnterpriseProfile = updateEnterpriseProfile;


export function initApp(user) {
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('main-app').classList.add('active');
    
    if(user.type === 'enterprise') {
        document.getElementById('home-page').style.display = 'none';
        document.getElementById('history-section').style.display = 'none';
        document.getElementById('enterprise-dashboard').style.display = 'block';
        
        // Update nav links for enterprise
        const homeLink = document.querySelector('.nav-links a[onclick*="home-page"]');
        if(homeLink) homeLink.setAttribute('onclick', "scrollToSection('enterprise-dashboard')");
        
        const historyLink = document.getElementById('nav-history');
        if(historyLink) historyLink.style.display = 'none';

        renderEnterprisePosts(); 
        loadEnterpriseProfile();
    } else {
        document.getElementById('home-page').style.display = 'block';
        document.getElementById('history-section').style.display = 'block';
        document.getElementById('enterprise-dashboard').style.display = 'none';
        document.getElementById('nav-history').style.display = 'block';
        document.querySelector('.nav-links a[onclick*="enterprise-dashboard"]')?.setAttribute('onclick', "scrollToSection('home-page')");
        renderGrid();
        renderHistory();
    }

}
window.initApp = initApp;

// SESSION CHECK
const savedUser = localStorage.getItem('user');
if (savedUser) {
    initApp(JSON.parse(savedUser));
}



