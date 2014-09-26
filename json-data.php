<?php
/*
    This file is calles by jquery to get results from the database and display the table
*/
header('Content-type: application/json');
// Configuration
$dbhost = 'localhost';
$dbname = 'syslog';
// end configuration


// Connect to the database
$m = new Mongo("mongodb://$dbhost");
$db = $m->$dbname;

//Get the query parameters
//first set the defaults
$message=".";
$program=".";
$host=".";
$prio=".";
$limit=100;
//Fetch the parameters, if set
if ((isset($_GET['host']))&&(strlen($_GET['host'])>2)) $host=$_GET['host'];
if ((isset($_GET['message']))&&(strlen($_GET['message'])>2)) $message=$_GET['message'];
if ((isset($_GET['limit']))&&(strlen($_GET['limit'])>2)) $limit=$_GET['limit'];
if ((isset($_GET['prio']))&&(strlen($_GET['prio'])>2)) $prio=$_GET['prio'];
if ((isset($_GET['program']))&&(strlen($_GET['program'])>2)) $program=$_GET['program'];

//build the mongo query
$where = (
            array('$and' => array(
                array('MESSAGE' => array('$regex' => new MongoRegex("/$message/i"))),
                array('HOST_FROM' => array('$regex' => new MongoRegex("/$host/i"))),
                array('PRIORITY' => array('$regex' => new MongoRegex("/$prio/i"))),
                array('PROGRAM' => array('$regex' => new MongoRegex("/$program/i")))
                )
            )
        );
try {
    //execute the query, and return the json
    $logs = $db->messages->find($where)->timeout(240000)->limit($limit)->sort(array("DATE" => -1));
    echo json_encode(iterator_to_array($logs));

} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

?>
