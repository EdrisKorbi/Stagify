<?php
class User {
    protected $conn;
    public $userId;
    public $username;
    public $email;
    public $password;
    public $type;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($email, $password) {
        $query = "SELECT * FROM Users WHERE email = :email LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row && password_verify($password, $row['password'])) {
            $this->userId = $row['userId'];
            $this->username = $row['username'];
            $this->email = $row['email'];
            $this->type = $row['type'];
            return true;
        }
        return false;
    }

    public function register() {
        $query = "INSERT INTO Users (username, email, password, type) VALUES (:username, :email, :password, :type)";
        $stmt = $this->conn->prepare($query);
        
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':type', $this->type);
        
        if($stmt->execute()) {
            $this->userId = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }
}
?>
