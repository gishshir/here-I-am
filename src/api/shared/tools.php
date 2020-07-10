<?php

  function sendHttpMessageAndExit (string $message) {
     _sendHttpMessage ($message, false);
  }
  function sendHttpErrorAndExit (string $errorMessage) {
     _sendHttpMessage ($errorMessage, true);
  }

 function _sendHttpMessage (string $message, bool $error) {

    $code = $error?400:200;
    http_response_code($code);

    $response = array();
    $response["message"] = $message;
    $response["error"] = $error;

    echo json_encode($response);
    exit;
 }

?>