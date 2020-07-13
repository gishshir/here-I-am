<?php
require_once '../dao/trajetdao.php';



// liste des trajets de l'utilisateur couran
if($_SERVER["REQUEST_METHOD"] == "POST")  {

     // read-only stream that allows us to read raw data from the request body
     $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
         $bodyobj = json_decode ($postdata);
         echo var_dump($bodyobj);

     }

    /*$resultAndDatas = createTrajet($trajet);
    sendHttpDatasAndExit($resultAndDatas);*/


}



?>