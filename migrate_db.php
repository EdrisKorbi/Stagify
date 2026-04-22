<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=stagify', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $cols = ['cv_link' => 'TEXT', 'motivation' => 'TEXT', 'phone' => 'VARCHAR(20)'];
    
    foreach ($cols as $col => $type) {
        try {
            $db->exec("ALTER TABLE passedUsers ADD COLUMN $col $type");
            echo "Column $col added.\n";
        } catch (PDOException $e) {
            echo "Column $col already exists or error: " . $e->getMessage() . "\n";
        }
    }
    echo "MIGRATION COMPLETE\n";
} catch (Exception $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
}
?>
