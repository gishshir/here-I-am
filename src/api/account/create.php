<?php
require_once '../shared/config.php';
include_once DIR_DAO.'accountdao.php';



// creation d'un compte
if($_SERVER["REQUEST_METHOD"] == "POST")  {

     // read-only stream that allows us to read raw data from the request body
     $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
         $bodyobj = json_decode ($postdata);

         $utilisateur = new Utilisateur();
         $utilisateur->set_id(-1);
         $utilisateur->set_login(xssPrevent($bodyobj->login));
         $utilisateur->set_password(xssPrevent($bodyobj->password));
         $utilisateur->set_pseudo(xssPrevent($bodyobj->pseudo));
         
         $email = xssPrevent($bodyobj->email);

         $resultAndEntity = createUtilisateurAndAccount ($utilisateur,$email);
         sendHttpEntityAndExit ($resultAndEntity);
     }


}



?>