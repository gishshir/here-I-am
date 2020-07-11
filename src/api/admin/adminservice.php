<?php

require '../dao/dao.php';


if(!empty($_GET))  {

    
    $service = xssPreventFromGet("service");
    if (!empty($service)) {
    
        if ($service == "testConnection") {
            $result = testConnection();
            sendHttpResultAndExit ($result);
        }

    }   
}


function testConnection(): Result {
    
    $con = connectMaBase();
    $result = new Result();

    if ($con != null) {
      
      $result->set_msg("test de connection réussi! - Jeu de caractères courant :".$con->character_set_name());
      $result->set_error(false);

    } else {
      $result->set_msg("Echec de connection!");
      $result->set_error(true);
    }
                        
 
    $con->close();
    return $result;
}

?>