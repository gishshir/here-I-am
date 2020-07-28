<?php

require '../dao/dao.php';

verifyUserAuthentifie();
if(!empty($_GET))  {

    
    $service = xssPreventFromGet("service");
    if (!empty($service)) {
    
        if ($service == "testConnection") {
            $result = testConnection();
            sendHttpResponseAndExit ($result);
        }

    }   
}


function testConnection(): Resultat {
    
    $con = connectMaBase();
    $result;

    if ($con != null) {
      
      $result = buildResultat("test de connection réussi! - Jeu de caractères courant :".$con->character_set_name());

    } else {
      $result = buildResultatError("Echec de connection!");
    }
                        
 
    $con->close();
    return $result;
}

?>