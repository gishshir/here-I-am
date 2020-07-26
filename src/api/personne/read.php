<?php
require_once '../shared/config.php';
require_once DIR_DAO.'amidao.php';


/**
 * Récupère la listes des personnes non amies avec l'utilisateur courant
 */
if($_SERVER["REQUEST_METHOD"] == "GET")  {


    // retourne une liste de Personne
    $resultAndDatas = displayListPersonneNonAmis();
    sendHttpDatasAndExit($resultAndDatas);

}



?>