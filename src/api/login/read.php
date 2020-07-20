<?php
require_once '../dao/logindao.php';



if($_SERVER["REQUEST_METHOD"] == "GET")  {

    $resultAndEntity;
    $user = getCurrentUserFromSession();
    if ($user != null) {

        $resultAndEntity = buildResultAndEntity ("utilisateur authentifié", $user);
        
    } else {

        $resultAndEntity = buildResultAndEntityError("Pas d'utilisateur authentifié ou session fermée.");
    }

     
    sendHttpEntityAndExit($resultAndEntity);

}



?>