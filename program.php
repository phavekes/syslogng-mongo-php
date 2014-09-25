<?php
header('Content-type: application/json');
// Configuration
$dbhost = 'localhost';
$dbname = 'syslog';

// Connect to test database
$m = new Mongo("mongodb://$dbhost");
$db = $m->$dbname;

$result=$db->messages->distinct('PROGRAM');
$programs=array();
foreach ($result as $program) {
  if (strlen($program)>2) $programs[]=$program;
}
echo json_encode($programs);

?>