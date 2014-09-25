<?php
header('Content-type: application/json');
// Configuration
$dbhost = 'localhost';
$dbname = 'syslog';

// Connect to test database
$m = new Mongo("mongodb://$dbhost");
$db = $m->$dbname;

$hosts=$db->messages->distinct('HOST_FROM');
echo json_encode($hosts);

?>