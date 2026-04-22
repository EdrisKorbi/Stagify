-- Create Database
DROP DATABASE IF EXISTS stagify;
CREATE DATABASE stagify;
USE stagify;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('student', 'enterprise') NOT NULL
);

-- Student Table
CREATE TABLE IF NOT EXISTS Student (
    studentId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    University VARCHAR(255),
    CIN VARCHAR(50),
    field VARCHAR(255),
    address TEXT,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);


-- Enterprise Table
CREATE TABLE IF NOT EXISTS Enterprise (
    enterpriseId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    name VARCHAR(255),
    validity ENUM('pending', 'accepted', 'refused') DEFAULT 'pending',
    address TEXT,
    proof_link TEXT, -- Google Drive link for verification
    sector VARCHAR(255),
    description TEXT,
    revenue VARCHAR(100),
    employees VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);


-- posts Table
CREATE TABLE IF NOT EXISTS posts (
    postId INT AUTO_INCREMENT PRIMARY KEY,
    enterpriseId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    requirements JSON, -- Array of strings
    filiere VARCHAR(255),
    FOREIGN KEY (enterpriseId) REFERENCES Enterprise(enterpriseId) ON DELETE CASCADE
);

-- Quiz Table
CREATE TABLE IF NOT EXISTS Quiz (
    quizId INT AUTO_INCREMENT PRIMARY KEY,
    postId INT NOT NULL UNIQUE, -- Each post has exactly one quiz
    content JSON, -- Array of strings
    FOREIGN KEY (postId) REFERENCES posts(postId) ON DELETE CASCADE
);


-- passedUsers Table (Evaluations/Applications)
CREATE TABLE IF NOT EXISTS passedUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL, -- Specifically students
    postId INT NOT NULL,
    score INT,
    wrongAnswers JSON, -- Array of strings
    correctAnswers JSON, -- Array of strings
    acceptState ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    cv_link TEXT,
    motivation TEXT,
    phone VARCHAR(20),
    FOREIGN KEY (studentId) REFERENCES Student(studentId) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES posts(postId) ON DELETE CASCADE
);
