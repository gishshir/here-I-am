<?php

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Allow-Origin-With-Credentials: true");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// sur dist et en remote
//define('DIR_BASE',  $_SERVER['DOCUMENT_ROOT'].'/api/');
// localhost
define('DIR_BASE',  dirbase());
define('DIR_DAO',    DIR_BASE . 'dao/');
define('DIR_SHARED',    DIR_BASE . 'shared/');
define('DIR_ENTITIES',    DIR_BASE . 'entities/');


require DIR_ENTITIES.'ientity.php';
require DIR_ENTITIES.'amirelation.php';
require DIR_ENTITIES.'relationinfo.php';
require DIR_ENTITIES.'amiinfo.php';
require DIR_ENTITIES.'personne.php';
require DIR_ENTITIES.'trajet.php';
require DIR_ENTITIES.'utilisateur.php';
require DIR_ENTITIES.'account.php';
require DIR_ENTITIES.'accountinfo.php';

require DIR_SHARED.'sessionmanager.php';
require DIR_SHARED.'resultAndDatas.php';
require DIR_SHARED.'security.php';
require DIR_SHARED.'tools.php';

require DIR_DAO.'bdd.php';
require DIR_DAO.'database.php';
require DIR_DAO.'dao.php';
require DIR_DAO.'accountdao.php';
require DIR_DAO.'amidao.php';
require DIR_DAO.'logindao.php';
require DIR_DAO.'relationdao.php';
require DIR_DAO.'trajetdao.php';

function callLocalhost() : bool {
    $servername = $_SERVER['SERVER_NAME'];
    return strchr($servername, "secure") || strchr($servername, "localhost");
}

function dirbase () {
    $dir = callLocalhost()?"/":"/api";
    return $_SERVER['DOCUMENT_ROOT'].$dir;
}


?>