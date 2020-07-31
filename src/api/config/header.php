<?php

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Allow-Origin-With-Credentials: true");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// sur dist et en remote
define('DIR_BASE',  $_SERVER['DOCUMENT_ROOT'].'/api/');
// localhost
//define('DIR_BASE',  $_SERVER['DOCUMENT_ROOT'].'/');
define('DIR_DAO',    DIR_BASE . 'dao/');
define('DIR_SHARED',    DIR_BASE . 'shared/');
define('DIR_ENTITIES',    DIR_BASE . 'entities/');



?>