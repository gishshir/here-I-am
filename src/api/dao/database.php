<?php
 
 require 'bdd.php';


 function connectMaBase() {
		
    // Connexion MySQL 
    /*if ($_SERVER['SERVER_NAME'] == "whereIAm.localhost") {*/
        
      global $local_user;
      global $local_pwd;
      $con = new mysqli('localhost', $local_user,$local_pwd, 'hereiam');    
   /* } else {
        
      global $remote_user;
      global $remote_pwd;
      $con = new mysqli('50.31.138.79', $remote_user,$remote_pwd, 'gishshir_tournerie_net');    
    }*/
    
    $con->set_charset("utf8");
 

    // Check connection
    if ($con->connect_errno > 0)
    {
        echo var_dump($con);
        echo "<p class=\"w3-yellow\">Failed to connect to MySQL: " . $con->connect_error."</p>";
    }

    return $con;
}


?>