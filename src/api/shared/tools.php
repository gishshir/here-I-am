<?php

 function sendHttpMessage (string $message, int $code, bool $error) {

    http_response_code($code);

    $response = array();
    $response["message"] = $message;
    $response["error"] = $error;

    echo json_encode($response);
    exit;
 }

?>