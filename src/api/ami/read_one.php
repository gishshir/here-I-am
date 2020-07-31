<?php
require_once '../config/config.php';

// recupération d'un ami par son id personne
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();

    if (isset($_GET["idperson"])) {
        
        $resultAndEntity = displayAmiInfo($_GET["idperson"]);
        sendHttpEntityAndExit($resultAndEntity);
    } 
    
}



?>