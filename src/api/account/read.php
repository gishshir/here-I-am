<?php
require_once '../dao/logindao.php';


/**
 * Retourne le compte par son login si existe
 * sinon null
 */
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    $resultAndEntity;


     
    sendHttpEntityAndExit($resultAndEntity);

}



?>