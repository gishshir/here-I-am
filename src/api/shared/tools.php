<?php

 function sendHttpMessage (string $message, int $code) {

    http_response_code($code);
    echo json_encode(array("message" => $message));
    exit;
 }

?>