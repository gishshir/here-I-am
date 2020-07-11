<?php
require 'config.php';
  
function sendHttpDatasAndExit (array $datas){
   http_response_code(200);
   echo json_encode ($datas);
   exit;
  }

function sendHttpMessageAndExit (string $message) {
     _sendHttpMessage ($message, false);
  }

  function sendHttpResultAndExit (Result $result) {
   _sendHttpMessage ($result->get_msg(), $result->is_error());
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

 function buildResultAndDataError (string $message): ResultAndDatas {
   $result = new ResultAndDatas();
   $result->set_error(true);
   $result->set_msg($message);
   $result->set_datas (null);
   return $result; 
 }
 function buildResultAndData (string $message, array $datas) : ResultAndDatas {

   $result = new ResultAndDatas();
   $result->set_error(false);
   $result->set_msg($message);
   $result->set_datas ($datas);
   return $result;
 }

?>