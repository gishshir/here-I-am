<?php

require 'database.php';
require '../shared/tools.php';

/*
* retourne l'id de l'utilisateur de la session en cours
*/
function getCurrentUserId () :int {
   // TODO implementer
    return 2;
}

function _sqlErrorMessageBindAndExecute ($stmt) : string {
    return "Echec lors lors du liage ou de l'execution : (" . $stmt->errno . ") " . $stmt->error;
}
function _sqlErrorMessagePrepare ($con) : string {
    return "Echec lors de la préparation : (" . $con->errno . ") " . $con->error;
}

?>