<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start();

require_once 'php/Database.php';
require_once 'php/User.php';
require_once 'php/Student.php';
require_once 'php/Enterprise.php';
require_once 'php/Post.php';
require_once 'php/Quiz.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    ob_clean();
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$action = $_GET['action'] ?? '';

switch($action) {
    case 'login':
        $data = json_decode(file_get_contents("php://input"));
        $user = new User($db);
        if($user->login($data->email, $data->password)) {
            // Check if Enterprise is approved
            if($user->type === 'enterprise') {
                $ent = new Enterprise($db);
                if($ent->getDetailsByUserId($user->userId)) {
                    if($ent->validity !== 'accepted') {
                        $statusMsg = ($ent->validity === 'pending') 
                            ? "Votre compte est en attente d'approbation." 
                            : "Votre compte a été refusé par l'administration.";
                        echo json_encode(["status" => "error", "message" => $statusMsg]);
                        break;
                    }
                }
            }


            echo json_encode([
                "status" => "success",
                "userId" => $user->userId,
                "username" => $user->username,
                "type" => $user->type
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
        }
        break;


    case 'register':
        $data = json_decode(file_get_contents("php://input"));
        $user = new User($db);
        $user->username = $data->username;
        $user->email = $data->email;
        $user->password = $data->password;
        $user->type = $data->type;

        if($user->register()) {
            if($user->type === 'student') {
                $student = new Student($db);
                $cin = $data->cin ?? null;
                $univ = $data->university ?? null;
                $field = $data->field ?? null;
                $age = $data->age ?? 20;
                $addr = $data->address ?? '';
                $student->registerStudent($user->userId, $univ, $cin, $field, $age, $addr);
            } else if($user->type === 'enterprise') {
                $ent = new Enterprise($db);
                $name = $data->name ?? null;
                $addr = $data->address ?? '';
                $proof = $data->proof_link ?? null;
                $ent->registerEnterprise($user->userId, $name, $addr, $proof);
            }
            echo json_encode(["status" => "success", "message" => "Account created!"]);

        } else {
            echo json_encode(["status" => "error", "message" => "Registration failed"]);
        }
        break;

    case 'getPosts':

        $post = new Post($db);
        $filiere = $_GET['filiere'] ?? null;
        echo json_encode($post->getAllPosts($filiere));
        break;

    case 'getQuiz':
        $postId = $_GET['postId'];
        $quiz = new Quiz($db);
        $result = $quiz->getQuestionsByPostId($postId);
        
        $post = new Post($db);
        $pDetails = $post->getDetails($postId);
        $ent = new Enterprise($db);
        if($pDetails) {
            $ent->getEnterpriseById($pDetails['enterpriseId']);
        }
        
        echo json_encode([
            "content" => $result ? json_decode($result['content']) : [],
            "enterpriseName" => $ent->name ?? 'Entreprise',
            "postTitle" => $pDetails['title'] ?? 'Poste'
        ]);
        break;

    case 'submitQuiz':
        $data = json_decode(file_get_contents("php://input"));
        if (!$data || !isset($data->postId) || !isset($data->answers)) {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Données invalides"]);
            break;
        }

        $quiz = new Quiz($db);
        $results = $quiz->calculateScore($data->answers, $data->postId);
        
        $student = new Student($db);
        $student->getDetailsByUserId($data->userId ?? 0);
        
        $cv = $data->cv_link ?? null;
        $mot = $data->motivation ?? null;
        $ph = $data->phone ?? null;

        if($student->submitQuizResults($data->postId, $results['score'], $results['wrong'], $results['correct'], $cv, $mot, $ph)) {
            ob_clean();
            echo json_encode(["status" => "success", "results" => $results]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Failed to save results"]);
        }
        break;

    case 'createPost':
        $data = json_decode(file_get_contents("php://input"));
        $enterprise = new Enterprise($db);
        $enterprise->getDetailsByUserId($data->userId);
        $postId = $enterprise->createPostWithQuiz($data->title, $data->content, $data->requirements, $data->quizContent);
        if($postId) {
            echo json_encode(["status" => "success", "postId" => $postId]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to create post/quiz"]);
        }
        break;

    case 'getHistory':
        $userId = $_GET['userId'];
        $student = new Student($db);
        $student->getDetailsByUserId($userId);
        echo json_encode($student->getCompletedPosts());
        break;

    case 'updateStatus':

        $data = json_decode(file_get_contents("php://input"));
        $enterprise = new Enterprise($db);
        if($enterprise->updateApplicationStatus($data->appId, $data->status)) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error"]);
        }
        break;

    case 'viewApplications':
        $postId = $_GET['postId'];
        $ent = new Enterprise($db);
        $apps = $ent->viewApplications($postId);
        echo json_encode($apps);
        break;

    case 'updateApplicationStatus':
        $appId = $_GET['appId'];
        $status = $_GET['status'];
        $ent = new Enterprise($db);
        if($ent->updateApplicationStatus($appId, $status)) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error"]);
        }
        break;

    case 'getCompanies':
        $filiere = $_GET['filiere'] ?? 'all';
        $ent = new Enterprise($db);
        echo json_encode($ent->getAllCompanies($filiere));
        break;

    case 'getEnterprisePosts':
        $userId = $_GET['userId'] ?? null;
        $entId = $_GET['enterpriseId'] ?? null;
        $post = new Post($db);
        if ($userId) {
            $ent = new Enterprise($db);
            $ent->getDetailsByUserId($userId);
            echo json_encode($post->getPostsByEnterprise($ent->enterpriseId));
        } else if ($entId) {
            echo json_encode($post->getPostsByEnterprise($entId));
        }
        break;

    case 'deletePost':
        $postId = $_GET['postId'];
        $post = new Post($db);
        if($post->deletePost($postId)) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error"]);
        }
        break;

    case 'getPostDetails':
        $postId = $_GET['postId'];
        $post = new Post($db);
        $details = $post->getDetails($postId);
        if ($details) {
            $ent = new Enterprise($db);
            $ent->getEnterpriseById($details['enterpriseId']);
            $details['enterpriseInfo'] = [
                'sector' => $ent->sector,
                'description' => $ent->description,
                'revenue' => $ent->revenue,
                'employees' => $ent->employees,
                'address' => $ent->address
            ];
            ob_clean();
            echo json_encode($details);
        } else {
            ob_clean();
            echo json_encode(["status" => "error"]);
        }
        break;

    case 'getEnterpriseDetails':
        $userId = $_GET['userId'];
        $ent = new Enterprise($db);
        if ($ent->getDetailsByUserId($userId)) {
            echo json_encode([
                "sector" => $ent->sector,
                "employees" => $ent->employees,
                "revenue" => $ent->revenue,
                "address" => $ent->address,
                "description" => $ent->description
            ]);
        } else {
            echo json_encode(["status" => "error"]);
        }
        break;

    case 'updateProfile':
        $data = json_decode(file_get_contents("php://input"));
        $ent = new Enterprise($db);
        if ($ent->getDetailsByUserId($data->userId)) {
            if ($ent->updateProfile($data->sector, $data->description, $data->revenue, $data->employees, $data->address)) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error"]);
            }
        } else {
            echo json_encode(["status" => "error"]);
        }
        break;

    default:
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
        break;
}
?>
