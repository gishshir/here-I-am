<?php
require_once '../shared/config.php';
require_once DIR_DAO.'trajetdao.php';

if($_SERVER["REQUEST_METHOD"] == "DELETE")  {
    

    $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {

        $bodyobj = json_decode ($postdata);

        $result; 
        $id = $bodyobj->id;
        if (isset($id)) {
            
            $result = deleteTrajet($id);

        } else {
            $result = buildResultatError ("paramètre de requete id absent!");
        }

        sendHttpResponseAndExit($result);      


    }

    

}


?>