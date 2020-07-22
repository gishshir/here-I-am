<?php

require_once '../shared/config.php';
include_once DIR_DAO.'logindao.php';

// authentification d'un utilisateur
if($_SERVER["REQUEST_METHOD"] == "PUT")  {
    
    
    // read-only stream that allows us to read raw data from the request body
    $postdata = file_get_contents ("php://input");

    if (isset($postdata) && !empty ($postdata)) {

        $bodyobj = json_decode ($postdata);

        if (isset($bodyobj->login) && isset($bodyobj->password)) {

            $resultAndEntity = authenticate($bodyobj->login, $bodyobj->password);
            
            sendHttpEntityAndExit($resultAndEntity);        
        }

    }

    $result = buildResultatError ("login et password manquants!");
    sendHttpResponseAndExit($result);

}



// authentification : en cas de succès retourne le user (avec mot de passe masqué)
function authenticate ($login, $password):ResultAndEntity {
    
    $resultAndEntity;
    $success = false;

    // recuperation de l'utilisateur
    $resultAndEntity = findUtilisateurByLogin ($login);
    if ($resultAndEntity->is_error()) {
        sendHttpEntityAndExit($resultAndEntity);
    }

    $user =  $resultAndEntity->get_entity();

    if ($user != null) {

        // verification du mot de passe
        if (password_verify($password, $user->get_password())) {
            
            $success = true;
            storeCurrentUser($user);

            //test
            //echo "current user id: " .getCurrentUserId();
            
            // on masque le password pour le retour client
            $user->set_password ("****");
            $resultAndEntity = buildResultAndEntity("authentification réussie!", $user);
            
        }
    }

    if (! $success) {
        $resultAndEntity = buildResultAndEntityError ("nom d'utilisateur ou mot de passe incorrect!");
    }

return $resultAndEntity;

}

?>