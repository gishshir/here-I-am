<?php
require_once '../shared/config.php';
require_once DIR_DAO.'amidao.php';


// recupération d'un ami par son id personne
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();

    if (isset($_GET["idperson"])) {
        
        $resultAndEntity = displayAmiInfo($_GET["idperson"]);
        sendHttpEntityAndExit($resultAndEntity);
    } 
    
}



?>