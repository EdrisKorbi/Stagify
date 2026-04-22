# 🎓 Stagify – Plateforme de Gestion des Stages

Stagify est une application web full-stack permettant de gérer le processus de stage entre **étudiants** et **entreprises**.

---

## 🚀 Fonctionnalités

### 👨‍🎓 Étudiant
- Création de compte  
- Connexion / Déconnexion  
- Choix de domaine et d’entreprise  
- Dépôt de demande de stage  
- Passage d’un quiz d’évaluation  
- Ajout d’un CV (lien)  
- Rédaction d’une lettre de motivation  

### 🏢 Entreprise
- Création de compte entreprise  
- Publication d’offres de stage  
- Ajout de description et prérequis  
- Création d’un quiz pour les candidats  
- Consultation des candidatures  
- Évaluation des stagiaires  
- Attribution d’un score bonus  

---

## 🛠️ Technologies utilisées

- **Frontend** : HTML, CSS, JavaScript  
- **Backend** : PHP  
- **Base de données** : MySQL  
- **Serveur local** : XAMPP  

---

## ⚙️ Installation (XAMPP)

### 1. Installer XAMPP
Installer XAMPP dans :

```text
C:\xampp
```

### 2. Cloner le projet
```text
cd C:\xampp\htdocs
git clone https://github.com/EdrisKorbi/Stagify.git
```

### 3. Lancer les services
Ouvrir XAMPP Control Panel et démarrer :

- Apache
- MySQL

### 4. Importer la base de données
- Aller sur : http://localhost/phpmyadmin
- Cliquer sur Import
- Sélectionner schema.sql
- Cliquer sur Go

### 5. Accéder à l’application
http://localhost/stagify/

## 🧪 Utilisation
Étapes de test recommandées :

- Créer un compte entreprise
- Publier une offre avec quiz
- Créer un compte étudiant
- Postuler à l’offre (CV + motivation + quiz)
- Revenir côté entreprise
- Consulter les candidatures
- Évaluer le stagiaire

## 📊 Organisation Scrum

### Sprint 1 – Gestion des comptes
- Création de compte
- Connexion / Déconnexion
- Choix type utilisateur

### Sprint 2 – Demande de stage
- Choix domaine / entreprise
- Dépôt de demande
- Quiz + CV

### Sprint 3 – Publication des offres
- Création d’offres
- Ajout description + prérequis + quiz

### Sprint 4 – Gestion des candidatures
- Consultation des candidatures
- Évaluation des stagiaires
- Attribution de bonus

## 📁 Structure du projet

```text
stagify/
│── css/
│── js/
│── php/
│── api.php
│── index.html
│── schema.sql
```

## ⚠️ Remarques
- Le lien du CV est obligatoire (format URL)
- Le quiz est intégré dans le processus de candidature
- L’application fonctionne en local via XAMPP

## 👥 Équipe
- **Korbi Edris** — Chef de projet
- **Urun mohamed** — Backend
- **Ben fraj ons** — Frontend
- **Amri wala** et **Njeh fadia** — Conception
- **Abedlia raslen** — Rapport du projet

- Projet académique – ISITCom
