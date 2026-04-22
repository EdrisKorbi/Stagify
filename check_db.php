<?php
$db = new PDO('mysql:host=localhost;dbname=stagify', 'root', '');
foreach($db->query('DESCRIBE passedUsers') as $row) {
    echo $row['Field'] . "\n";
}
?>
