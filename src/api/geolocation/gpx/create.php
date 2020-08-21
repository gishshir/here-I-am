<?php
require_once '../../config/config.php';

// cree le fichier gpx 
// et retourne le nom du fichier gpx (dans msg)
if($_SERVER["REQUEST_METHOD"] == "POST")  {

    verifyUserAuthentifie();

    $postdata = file_get_contents ("php://input");

     if (isset($postdata) && !empty ($postdata)) {
 
        $bodyobj = json_decode ($postdata);
        
        $result;
        $trajetid = $bodyobj->trajetid;
        $resultAndDatas = findListPositionForTrajet($trajetid);

        if (!$resultAndDatas->is_error()) {

            $datas = $resultAndDatas->get_datas();
            if (sizeof($datas) == 0) {

                $result = buildResultatError("pas de positions pour ce trajet!");
            }
            else {
                $resultAndEntity = findTrajetById($trajetid);
                if (!$resultAndEntity->is_error() && $resultAndEntity->get_entity() != null) {
                    $trajet = $resultAndEntity->get_entity();
                    $path = createGpxFile ($trajet, $datas);  
                    $result = buildResultat($path); 
                } else {
                    $result = buildResultatError($resultAndEntity->get_msg());
                }
            }
            
        } else {
            $result = buildResultatError($resultAndDatas->get_msg());
        }
        sendHttpResponseAndExit($result);
    
    } 
}

// cree le fichier gpx et retourne son chemin
function createGpxFile (Trajet $trajet, array $listPositions): string {

    $SAUT = "\n";
    $TAB =  "\t"; 

    $target_dir = "../../../../gpx_files/";
    // Check if target_dir exists
	if (!file_exists($target_dir)) {
		mkdir($target_dir);
	}

    $filename = "trajet".$trajet->get_id().".gpx";
    $filepath = $target_dir.$filename;
    $myfile = fopen($filepath, "w") or die("Unable to open file!");

    // ENTETE ET METADATA
    $date = getXmlDateNow();
    $startDate = getXmlDate($trajet->get_starttime());
    $endDate = getXmlDate($trajet->get_endtime());
    $entete = array (
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>".$SAUT,
        "<gpx xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" 
        creator=\"tsadeo\" 
        xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd\">".$SAUT,
        $TAB."<metadata>".$SAUT,
        $TAB.$TAB."<name>here-I-am</name>".$SAUT,
        $TAB.$TAB."<desc>trajet_".$trajet->get_id()." de ".$startDate." à ".$endDate."</desc>".$SAUT,
        $TAB.$TAB."<time>".$date."</time>".$SAUT,
        $TAB."</metadata>".$SAUT
    );

    foreach($entete as $line) {
        fwrite ($myfile, $line);
    }

    // WAY POINT
    foreach ($listPositions as $position) {

        $date = getXmlDate($position->get_timestamp());
        $wp = array (
            $TAB."<wpt lat=\"".$position->get_latitude()."\" lon=\"".$position->get_longitude()."\">".$SAUT,
            $TAB.$TAB."<time>".$date."</time>".$SAUT,
            $TAB.$TAB."<name>Position: ".$position->get_id()."</name>".$SAUT,
            $TAB."</wpt>".$SAUT
        );
        foreach($wp as $line) {
            fwrite ($myfile, $line);
        }
    }
    

    $fin = "</gpx>";
    fwrite ($myfile, $fin);
    fclose($myfile);

    return $filename;
}

//2020-08-19T11:49:06Z
function getXmlDate(int $timestamp): string {

   $unix_timestamp = $timestamp;

   return date("Y-m-d", $unix_timestamp)."T".date("H:i:s" , $unix_timestamp)."Z";

}
function getXmlDateNow(): string {
 
    return date("Y-m-d")."T".date("H:i:s")."Z";
 
 }



?>