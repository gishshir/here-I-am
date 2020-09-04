<?php

header("Access-Control-Allow-Origin: http://localhost:4200");

date_default_timezone_set('Europe/Brussels');

require 'header.php';

require DIR_ENTITIES.'ientity.php';
require DIR_ENTITIES.'amirelation.php';
require DIR_ENTITIES.'relationinfo.php';
require DIR_ENTITIES.'amiinfo.php';
require DIR_ENTITIES.'personne.php';
require DIR_ENTITIES.'trajet.php';
require DIR_ENTITIES.'utilisateur.php';
require DIR_ENTITIES.'account.php';
require DIR_ENTITIES.'accountinfo.php';
require DIR_ENTITIES.'position.php';
require DIR_ENTITIES.'geoportail.php';

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
require DIR_DAO.'geolocationdao.php';
require DIR_DAO.'geoportaildao.php';

?>