<?php
require 'config.php';

// reponse http simple avec message
function sendHttpResponseAndExit (Resultat $resultat) {

   if ($resultat->is_error()) {
      _sendHttpMessage ($resultat->get_msg(), true);

  } else {
      _sendHttpMessage ($resultat->get_msg(), false);   
  }
} 

// reponse http avec datas
function sendHttpDatasAndExit (ResultAndDatas $resultAndDatas) {

   if ($resultAndDatas->is_error()) {

      _sendHttpMessage ($resultAndDatas->get_msg(), true);

  } else {

      http_response_code(200);
      echo (string) json_encode($resultAndDatas->get_datasAsArrays());
      exit;

  }
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
 function buildResultat (string $message) : Resultat {

   $result = new Resultat();
   $result->set_error(false);
   $result->set_msg($message);
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