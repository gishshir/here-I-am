<?php
require_once '../../config.php';
/**
 * Vérifie si un compte existe déjà
 * - avec le login
 * - avec le pseudo
 */
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();

    $resultAndBoolean;

    if (isset($_GET["login"])) {

        $resultAndBoolean = existUtilisateurWithLogin($_GET["login"]);
    } 

    else if (isset($_GET["pseudo"])) {
        
        $resultAndBoolean = existUtilisateurWithPseudo($_GET["pseudo"]);
    }
    else {
        $resultAndBoolean = buildResultAndBooleanError("aucun paramètre en entrée !!");
    }
    sendHttpBooleanAndExit($resultAndBoolean);


}



?>