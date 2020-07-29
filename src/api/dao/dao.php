<?php

function _beginTransaction ($con): void{

     // version mysql >= 5.6.5
     // SHOW GLOBAL VARIABLES LIKE '%version%'
    //$con->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

    $con->autocommit(FALSE);
}

function _commitTransaction ($con): void {
    $con->commit();
    $con->autocommit(TRUE);
}

function _rollbackTransaction ($con): void {
    $con->rollback();
    $con->autocommit(TRUE);
}

function _prepare ($con, $sql) : mysqli_stmt {

    if ($stmt = $con->prepare($sql)) {
       return $stmt;
    } else {
       throw new Exception (_sqlErrorMessagePrepare ($con));
    }
}

function _execute ($stmt) : mysqli_stmt {

    if ($stmt->execute()) {
        return $stmt;
    } else {
        throw new Exception ( _sqlErrorMessageExecute($stmt));
    }
}

function _closeAll (?mysqli_stmt $stmt, ?mysqli $con) {
    
    if (isset($stmt)){
        $stmt->close();
    }
    if (isset ($con)){
        $con->close();
    }
}

function _sqlErrorMessageBind ($stmt) : string {
    return "Echec lors lors du liage : (" . $stmt->errno . ") " . $stmt->error;
}
function _sqlErrorMessageExecute ($stmt) : string {
    return "Echec lors lors du l'exécution' : (" . $stmt->errno . ") " . $stmt->error;
}
function _sqlErrorMessageBindAndExecute ($stmt) : string {
    return "Echec lors lors du liage ou de l'execution : (" . $stmt->errno . ") " . $stmt->error;
}
function _sqlErrorMessagePrepare ($con) : string {
    return "Echec lors de la préparation : (" . $con->errno . ") " . $con->error;
}

?>