<?php
require_once '../dao/accountdao.php';



// creation d'un compte
if($_SERVER["REQUEST_METHOD"] == "POST")  {

     // read-only stream that allows us to read raw data from the request body
     $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
         $bodyobj = json_decode ($postdata);
         
         
     }


}



?>