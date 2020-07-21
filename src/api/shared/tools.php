<?php

//echo "current user id: " .getCurrentUserId();


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

// reponse http avec value boolean
function sendHttpBooleanAndExit (ResultAndBoolean $resultAndBoolean) {

  if ($resultAndBoolean->is_error()) {

     _sendHttpMessage ($resultAndBoolean->get_msg(), true);

 } else {

     http_response_code(200);
     echo (string) json_encode(array ("retour" => $resultAndBoolean->get_value()));
     exit;

 }
}

// reponse http avec entity
function sendHttpEntityAndExit (ResultAndEntity $resultAndEntity) {

  if ($resultAndEntity->is_error()) {

     _sendHttpMessage ($resultAndEntity->get_msg(), true);

 } else {

     http_response_code(200);
     if ($resultAndEntity->get_entity()) {
        echo (string) json_encode($resultAndEntity->get_entity()->toArray());
     } else {
        echo "";
     }
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



 

 //----------------------------------------------------------------------
 function buildResultatError (string $message) : Resultat {

  $result = buildResultat($message);
  $result->set_error(true);
  return $result;
}

 function buildResultat (string $message) : Resultat {

   $result = new Resultat();
   $result->set_error(false);
   $result->set_msg($message);
   return $result;
 }
 //----------------------------------------------------------------------

 //----------------------------------------------------------------------
 function buildResultAndBooleanError (string $message) : ResultAndBoolean {

  $result = buildResultatBoolean($message, false);
  $result->set_error(true);
  return $result;
}

 function buildResultAndBoolean (string $message, bool $value) : ResultAndBoolean {

   $result = new ResultAndBoolean();
   $result->set_error(false);
   $result->set_msg($message);
   $result->set_value($value);
   return $result;
 }
 //----------------------------------------------------------------------

 //----------------------------------------------------------------------
 function buildResultAndEntityError (string $message): ResultAndEntity {
  $result = buildResultAndEntity($message, null);
  $result->set_error(true);
  return $result; 
}
 function buildResultAndEntity (string $message, ?IEntity $entity) : ResultAndEntity {

  $result = new ResultAndEntity();
  $result->set_error(false);
  $result->set_msg($message);
  $result->set_entity ($entity);
  return $result;
}
//----------------------------------------------------------------------

//----------------------------------------------------------------------
function buildResultAndDatasError (string $message): ResultAndDatas {
  $result = buildResultAndDatas($message, null);
  $result->set_error(true);
  return $result; 
}

 function buildResultAndDatas (string $message, ?array $datas) : ResultAndDatas {

   $result = new ResultAndDatas();
   $result->set_error(false);
   $result->set_msg($message);
   $result->set_datas ($datas);
   return $result;
 }
 //----------------------------------------------------------------------

?>