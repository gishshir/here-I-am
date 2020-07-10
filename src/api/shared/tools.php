<?php

  
function sendHttpDatasAndExit (array $datas){
   http_response_code(200);
   echo json_encode ($datas);
   exit;
  }

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
    $response["msg"] = $message;
    $response["error"] = $error;

    echo json_encode($response);
    exit;
 }

?>