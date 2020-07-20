<?php

require '../entities/ientity.php';
require '../entities/amirelation.php';
require '../entities/amiinfo.php';
require '../entities/personne.php';
require '../entities/trajet.php';
require '../entities/utilisateur.php';

require 'sessionmanager.php';
require 'resultAndDatas.php';
require 'security.php';



header("Access-Control-Allow-Origin: http://localhost:4200");
header("Allow-Origin-With-Credentials: true");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

?>