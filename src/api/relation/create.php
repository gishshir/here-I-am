<?php
require_once '../shared/config.php';
require_once DIR_DAO.'relationdao.php';



// liste des trajets de l'utilisateur couran
if($_SERVER["REQUEST_METHOD"] == "POST")  {

    verifyUserAuthentifie();

     // read-only stream that allows us to read raw data from the request body
     $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
         $bodyobj = json_decode ($postdata);
         
         $idperson = (int) $bodyobj->idperson;
         $action = (string)$bodyobj->action;
 
         if ($action === "invitation") {
            $result = createRelationAndInvitation($idperson);
            sendHttpResponseAndExit($result);
         }
     }


}



?>