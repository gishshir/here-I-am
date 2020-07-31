<?php
require_once '../config/config.php';

// logout de l'utilisateur courant
if($_SERVER["REQUEST_METHOD"] == "DELETE")  {

    verifyUserAuthentifie();
    
    $result;
    $user = getCurrentUserFromSession();
    if ($user != null) {

        unsetSession();
        $result = buildResultat("utilisateur ".$user->get_login()." déconnecté.");

    } else {

        $result  = buildResultat("aucune session ouverte pour cet utilisateur!");
    }

    sendHttpResponseAndExit($result);

}


?>