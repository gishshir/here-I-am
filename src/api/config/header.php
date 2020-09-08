<?php
require 'constantes.php';

// CROS autorises
$array_origins = array ('https://geoportail-dev.secure', 'https://geoportail.tsadeoapp.info');

$header = apache_request_headers(); 
if (isset($header['Origin'])){
   $origin = $header['Origin'];

   if (in_array($origin, $array_origins)) {
        header("Access-Control-Allow-Origin: ".$origin);
   } else {
        header("Access-Control-Allow-Origin: https://localhost:4200");
   }
   
}

header("Allow-Origin-With-Credentials: true");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function isremote() : bool {

     $servername =  $_SERVER['SERVER_NAME'];
     $pos =  strpos($servername, 'tsadeoapp');
	 return $pos && $pos >= 0;
}

function islocaldist() : bool {

     $servername =  $_SERVER['SERVER_NAME'];
     $pos = strpos($servername, 'hereiam-dist.secure');
	 return $pos && $pos >= 0;
}
function islocaldev() : bool {

     $servername =  $_SERVER['SERVER_NAME'];
     //echo "server name: ".$servername;
	 $pos = strpos($servername, 'hereiam-api.secure'); 
     return $pos && $pos >= 0;
}
?>