<?php
class Post {
    private $conn;
    public $postId;
    public $enterpriseId;
    public $title;
    public $content;
    public $requirements;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getDetails($postId) {
        $query = "SELECT p.*, e.name as enterpriseName FROM posts p 
                  JOIN Enterprise e ON p.enterpriseId = e.enterpriseId 
                  WHERE p.postId = :postId LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':postId', $postId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllPosts($filiere = null) {
        $query = "SELECT p.*, e.name as enterpriseName, e.address as location FROM posts p 
                  JOIN Enterprise e ON p.enterpriseId = e.enterpriseId";
        
        if ($filiere) {
            // Assuming we add a filiere column to posts or derive it from content/tags
            // For now, let's assume it's a column for simplicity
            $query .= " WHERE p.filiere = :filiere";
        }
        
        $stmt = $this->conn->prepare($query);
        if ($filiere) {
            $stmt->bindParam(':filiere', $filiere);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getPostsByEnterprise($entId) {

        $query = "SELECT * FROM posts WHERE enterpriseId = :entId ORDER BY postId DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':entId', $entId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deletePost($postId) {

        $query = "DELETE FROM posts WHERE postId = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $postId);
        return $stmt->execute();
    }
}


?>
