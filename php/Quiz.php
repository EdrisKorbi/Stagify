<?php
class Quiz {
    private $conn;
    public $quizId;
    public $postId;
    public $content;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getQuestionsByPostId($postId) {
        $query = "SELECT * FROM Quiz WHERE postId = :postId LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':postId', $postId);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            return $row;
        }
        return false;
    }

    public function calculateScore($userAnswers, $postId) {
        $quiz = $this->getQuestionsByPostId($postId);
        if (!$quiz) return ['score' => 0, 'total' => 0, 'correct' => [], 'wrong' => []];

        $questions = json_decode($quiz['content'], true);
        if (!is_array($questions)) return ['score' => 0, 'total' => 0, 'correct' => [], 'wrong' => []];

        $score = 0;
        $correct = [];
        $wrong = [];

        foreach ($questions as $index => $q) {
            $userAns = $userAnswers[$index] ?? null;
            if ($userAns !== null && $userAns == ($q['correct'] ?? -1)) {
                $score++;
                $correct[] = $q['question'] ?? 'Question';
            } else {
                $wrong[] = $q['question'] ?? 'Question';
            }
        }

        return [
            'score' => $score,
            'total' => count($questions),
            'correct' => $correct,
            'wrong' => $wrong
        ];
    }
}
?>
