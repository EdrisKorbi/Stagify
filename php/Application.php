<?php
class Application {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function saveResults($studentId, $postId, $score, $wrongAnswers, $correctAnswers) {
        $query = "INSERT INTO passedUsers (studentId, postId, score, wrongAnswers, correctAnswers, acceptState) 
                  VALUES (:studentId, :postId, :score, :wrong, :correct, 'pending')";
        $stmt = $this->conn->prepare($query);
        
        $wrongJson = json_encode($wrongAnswers);
        $correctJson = json_encode($correctAnswers);
        
        $stmt->bindParam(':studentId', $studentId);
        $stmt->bindParam(':postId', $postId);
        $stmt->bindParam(':score', $score);
        $stmt->bindParam(':wrong', $wrongJson);
        $stmt->bindParam(':correct', $correctJson);
        
        return $stmt->execute();
    }

    public function updateStatus($appId, $newState) {
        $query = "UPDATE passedUsers SET acceptState = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $newState);
        $stmt->bindParam(':id', $appId);
        return $stmt->execute();
    }
}
?>
