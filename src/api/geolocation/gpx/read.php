<?php
require_once '../../config/config.php';

// download le fichier gpx
if($_SERVER["REQUEST_METHOD"] == "GET" )
 { 
   
    verifyUserAuthentifie();

    $result;
    if (isset($_GET["gpx"])) {

        $gpxfile = xssPreventFromGet("gpx");
        if (empty($gpxfile)) {
	
            $result = buildResultatError("Le parametre gpx est absent de la requete!");
        } 
        //on fait appel à basename afin d’être sur que ce ne soit qu’un nom de fichier 
        else if(basename($gpxfile) != $gpxfile) {
            $result = buildResultatError("Le parametre file a un mauvais format!");
        } 
              
         else {

      // Récupération du fichier passé en paramètre   
      $filename = DIR_GPX.$gpxfile;     
         
      // vérifie l'existence et l'accès en lecture au fichier
      if (!is_file($filename) || !is_readable($filename)) {
        $result = buildResultatError("Le fichier ".$filename." n\'existe pas!");
	   } else {
          
        //récupérer la taille du fichier
       $size = filesize($filename);
       $result = buildResultat("download OK");
          
        // désactivation compression GZip
         if (ini_get("zlib.output_compression")) {
            ini_set("zlib.output_compression", "Off");
         }
         
         // désactive la mise en cache
         header("Cache-Control: no-cache, must-revalidate");
         header("Cache-Control: GET-check=0,pre-check=0");
         header("Cache-Control: max-age=0");
         header("Pragma: no-cache");
         header("Expires: 0");

         // force le téléchargement du fichier avec un beau nom
         header("Content-type:application/xml");

        // The PDF source is in original.pdf
         header('Content-Disposition: attachment; filename="'.$gpxfile.'"');
         header("Content-Length: ".$size);
         
	
	   // The readfile() function reads a file and writes it to the output buffer.
	   // on envoie le contenu du fichier
	   //NOTE pas possible de savoir que l'utilisateur a annule le download
	   readfile($filename);  
          
          
      }
         }

         if ($result->is_error()) {
            sendHttpResponseAndExit($result);
         }

    }

 }

?>