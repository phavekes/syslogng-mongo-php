<?php
header('Content-type: application/json');
// Configuration
$dbhost = 'localhost';
$dbname = 'syslog';

// Connect to test database
$m = new Mongo("mongodb://$dbhost");
$db = $m->$dbname;

$stats=$db->command(array('collStats' => 'messages'));

$oldest=$db->messages->find()->sort(array('DATE'=>1))->limit(1);

foreach ($oldest as $doc) {
    $stats['oldest']=$doc['DATE'];
}

unset($stats['ns']);
unset($stats['numExtents']);
unset($stats['indexSizes']);

echo json_encode($stats);

?>