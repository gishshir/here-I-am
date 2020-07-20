<?php

include '../dao/logindao.php';

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

//The original plaintext password.
/*$password = 'pwd1';
$passwordHashed = password_hash($password, PASSWORD_BCRYPT);
echo $passwordHashed;*/

// authentification : en cas de succès retourne le user (avec mot de passe masqué)
function authenticate ($login, $password):ResultAndEntity {
    
    $resultAndEntity;
    $success = false;

    // recuperation de l'utilisateur
    $resultAndEntity = findUtilisateurByLogin ($login);
    if ($resultAndEntity->is_error()) {
        sendHttpEntityAndExit($resultAndEntity);
    }

    $entity =  $resultAndEntity->get_entity();

    if ($entity != null) {

        // verification du mot de passe
        if (password_verify($password, $entity->get_password())) {
            
            $success = true;
            $_SESSION["login"] = $login;
            $_SESSION["role"] = "user"; 
            
            // on masque le password pour le retour client
            $entity->set_password ("****");
            $resultAndEntity = buildResultAndEntity("authentification réussie!", $entity);
            
        }
    }

    if (! $success) {
        $resultAndEntity = buildResultAndEntityError ("nom d'utilisateur ou mot de passe incorrect!");
    }

return $resultAndEntity;

}

?>