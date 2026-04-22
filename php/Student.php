<?php
require_once 'User.php';

class Student extends User {
    public $studentId;
    public $university;
    public $cin;
    public $field;
    public $age;
    public $address;

    public function __construct($db) {
        parent::__construct($db);
    }

    public function registerStudent($userId, $university, $cin, $field, $age, $address) {
        $query = "INSERT INTO Student (userId, University, CIN, field, age, address) 
                  VALUES (:userId, :univ, :cin, :field, :age, :address)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':univ', $university);
        $stmt->bindParam(':cin', $cin);
        $stmt->bindParam(':field', $field);
        $stmt->bindParam(':age', $age);
        $stmt->bindParam(':address', $address);
        return $stmt->execute();
    }


    public function getDetailsByUserId($userId) {
        $query = "SELECT * FROM Student WHERE userId = :userId LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->studentId = $row['studentId'];
            $this->university = $row['University'];
            $this->cin = $row['CIN'];
            $this->field = $row['field'];
            $this->age = $row['age'];
            $this->address = $row['address'];
            return true;
        }
        return false;
    }

    public function enrollInPost($postId) {
        // Logic to check if already enrolled or just prepare for quiz
        return true; 
    }

    public function submitQuizResults($postId, $score, $wrongAnswers, $correctAnswers, $cv_link = null, $motivation = null, $phone = null) {
        $query = "INSERT INTO passedUsers (studentId, postId, score, wrongAnswers, correctAnswers, acceptState, cv_link, motivation, phone) 
                  VALUES (:studentId, :postId, :score, :wrong, :correct, 'pending', :cv, :motivation, :phone)";
        $stmt = $this->conn->prepare($query);
        
        $wrongJson = json_encode($wrongAnswers);
        $correctJson = json_encode($correctAnswers);
        
        $stmt->bindParam(':studentId', $this->studentId);
        $stmt->bindParam(':postId', $postId);
        $stmt->bindParam(':score', $score);
        $stmt->bindParam(':wrong', $wrongJson);
        $stmt->bindParam(':correct', $correctJson);
        $stmt->bindParam(':cv', $cv_link);
        $stmt->bindParam(':motivation', $motivation);
        $stmt->bindParam(':phone', $phone);
        
        return $stmt->execute();
    }

    public function getCompletedPosts() {

        $query = "SELECT p.*, e.name as enterpriseName, pu.score, pu.acceptState 
                  FROM posts p
                  JOIN passedUsers pu ON p.postId = pu.postId
                  JOIN Enterprise e ON p.enterpriseId = e.enterpriseId
                  WHERE pu.studentId = :studentId";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':studentId', $this->studentId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>

