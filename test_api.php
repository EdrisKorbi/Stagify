<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'php/Database.php';
require_once 'php/User.php';
require_once 'php/Student.php';
require_once 'php/Enterprise.php';
require_once 'php/Post.php';
require_once 'php/Quiz.php';

$database = new Database();
$db = $database->getConnection();

// Simulation data
$data = (object)[
    "userId" => 1, // Change if needed
    "postId" => 1, // Change if needed
    "answers" => [],
    "cv_link" => "http://test.com",
    "motivation" => "Test",
    "phone" => "123456"
];

$quiz = new Quiz($db);
$results = $quiz->calculateScore($data->answers, $data->postId);

$student = new Student($db);
$student->getDetailsByUserId($data->userId ?? 0);

$cv = $data->cv_link ?? null;
$mot = $data->motivation ?? null;
$ph = $data->phone ?? null;

if($student->submitQuizResults($data->postId, $results['score'], $results['wrong'], $results['correct'], $cv, $mot, $ph)) {
    echo "SUCCESS\n";
} else {
    echo "FAILED\n";
}
?>
