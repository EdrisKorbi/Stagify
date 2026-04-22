<?php
require_once 'User.php';

class Enterprise extends User {
    public $enterpriseId;
    public $name;
    public $validity;
    public $address;
    public $proof_link;
    public $sector;
    public $description;
    public $revenue;
    public $employees;

    public function __construct($db) {
        parent::__construct($db);
    }

    public function registerEnterprise($userId, $name, $address, $proof_link) {
        $query = "INSERT INTO Enterprise (userId, name, address, proof_link, validity) 
                  VALUES (:userId, :name, :address, :proof, 'pending')";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':proof', $proof_link);
        return $stmt->execute();
    }


    public function getDetailsByUserId($userId) {
        $query = "SELECT * FROM Enterprise WHERE userId = :userId LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->enterpriseId = $row['enterpriseId'];
            $this->name = $row['name'];
            $this->validity = $row['validity'];
            $this->address = $row['address'];
            $this->sector = $row['sector'];
            $this->description = $row['description'];
            $this->revenue = $row['revenue'];
            $this->employees = $row['employees'];
            return true;
        }
        return false;
    }

    public function createPostWithQuiz($title, $content, $requirements, $quizContent) {
        try {
            $this->conn->beginTransaction();

            $query = "INSERT INTO posts (enterpriseId, title, content, requirements) VALUES (:entId, :title, :content, :req)";
            $stmt = $this->conn->prepare($query);
            
            $reqJson = json_encode($requirements);
            $stmt->bindParam(':entId', $this->enterpriseId);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':content', $content);
            $stmt->bindParam(':req', $reqJson);
            $stmt->execute();
            
            $postId = $this->conn->lastInsertId();

            $queryQuiz = "INSERT INTO Quiz (postId, content) VALUES (:postId, :content)";
            $stmtQuiz = $this->conn->prepare($queryQuiz);
            $quizJson = json_encode($quizContent);
            $stmtQuiz->bindParam(':postId', $postId);
            $stmtQuiz->bindParam(':content', $quizJson);
            $stmtQuiz->execute();

            $this->conn->commit();
            return $postId;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }


    public function viewApplications($postId) {
        $query = "SELECT p.*, s.field, s.address, u.email, u.username, q.content as quizContent
                  FROM passedUsers p
                  JOIN Student s ON p.studentId = s.studentId
                  JOIN Users u ON s.userId = u.userId
                  JOIN Quiz q ON p.postId = q.postId
                  WHERE p.postId = :postId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':postId', $postId);
        $stmt->execute();
        
        $apps = [];
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $quizData = json_decode($row['quizContent']);
            $row['totalQuestions'] = is_array($quizData) ? count($quizData) : 0;
            unset($row['quizContent']);

            // Visibility logic removed as per Task 10: email and phone should be visible
            $apps[] = $row;
        }
        return $apps;
    }

    public function updateApplicationStatus($appId, $status) {
        $query = "UPDATE passedUsers SET acceptState = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $appId);
        return $stmt->execute();
    }

    public function getEnterpriseById($entId) {

        $query = "SELECT * FROM Enterprise WHERE enterpriseId = :id LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $entId);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->enterpriseId = $row['enterpriseId'];
            $this->name = $row['name'];
            $this->validity = $row['validity'];
            $this->address = $row['address'];
            $this->sector = $row['sector'];
            $this->description = $row['description'];
            $this->revenue = $row['revenue'];
            $this->employees = $row['employees'];
            return true;
        }
        return false;
    }

    public function updateProfile($sector, $description, $revenue, $employees, $address) {
        $query = "UPDATE Enterprise SET sector = :sector, description = :description, revenue = :revenue, employees = :employees, address = :address WHERE enterpriseId = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':sector', $sector);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':revenue', $revenue);
        $stmt->bindParam(':employees', $employees);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':id', $this->enterpriseId);
        return $stmt->execute();
    }

    public function getAllCompanies($filiere = 'all') {
        $query = "SELECT enterpriseId, name, sector, address as location, description FROM Enterprise WHERE validity = 'accepted'";
        if ($filiere !== 'all') {
            $query .= " AND sector = :sector";
        }
        $stmt = $this->conn->prepare($query);
        if ($filiere !== 'all') {
            $stmt->bindParam(':sector', $filiere);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

?>
