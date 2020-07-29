<?php
require_once '../config.php';

/**
 * Récupère la listes des personnes non amies avec l'utilisateur courant
 */
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();

    // retourne une liste de Personne
    $resultAndDatas = displayListPersonneNonAmis();
    sendHttpDatasAndExit($resultAndDatas);

}



?>