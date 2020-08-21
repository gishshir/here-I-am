<?php

date_default_timezone_set('Europe/Brussels');

// cree le fichier gpx a partir d'une liste de positions d'un trajet
// si existe et retourne le nom du fichier
// sinon erreur
function createGpxFileFromTrajetId(int $trajetid, string $target_dir):Resultat{

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
                $path = createGpxFile ($trajet, $datas, $target_dir);  
                $result = buildResultat($path); 
            } else {
                $result = buildResultatError($resultAndEntity->get_msg());
            }
        }
        
    } else {
        $result = buildResultatError($resultAndDatas->get_msg());
    }

    return $result;
}

// cree le fichier gpx et retourne son chemin
function createGpxFile (Trajet $trajet, array $listPositions, string $target_dir): string {

    $SAUT = "\n";
    $TAB =  "\t"; 

    // Check if target_dir exists
	if (!file_exists($target_dir)) {
		mkdir($target_dir);
	}

    $filename = "trajet".$trajet->get_id().".gpx";
    $filepath = $target_dir.$filename;
    // s'il existe on ne le cree pas une deuxième fois
    if (file_exists($filepath)) {
        return $filename;
    }

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
        $time = getTime($position->get_timestamp());
        $wp = array (
            $TAB."<wpt lat=\"".$position->get_latitude()."\" lon=\"".$position->get_longitude()."\">".$SAUT,
            $TAB.$TAB."<time>".$date."</time>".$SAUT,
            $TAB.$TAB."<name>Position ".$position->get_id().": ".$time."</name>".$SAUT,
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
function getTime(int $timestamp): string {

    $unix_timestamp = $timestamp;
 
    return date("H:i:s" , $unix_timestamp);
 
 }
function getXmlDateNow(): string {
 
    return date("Y-m-d")."T".date("H:i:s")."Z";
 
 }

function findListPositionForTrajet (int $trajetid): ResultAndDatas {

    $resultAndDatas; $stmt;
      
    $con = connectMaBase();
    $req_ListPositions = "select id, longitude, latitude, timestamp FROM geolocation WHERE trajetid = ?
    order by timestamp";


    try {

        $stmt = _prepare ($con, $req_ListPositions);
        
        if ($stmt->bind_param("i", $trajetid)) {

            $stmt = _execute($stmt);

            $listePositions = array();
            $trajet = null;
            $stmt->bind_result ($resId, $resLongitude, $resLatitude, $resTimestamp);
                   
            // fetch row ..............
            while($stmt->fetch()) {

                $position = _buildPosition ($resId, $trajetid, $resLongitude, $resLatitude, $resTimestamp);
                array_push ($listePositions, $position);
            }  // --- fin du fetch


            $resultAndDatas = buildResultAndDatas("Récupération liste positions réussie!", $listePositions);

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }

    }
    catch (Exception $e) {
        $resultAndDatas = buildResultAndDatasError($e->getMessage());
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $resultAndDatas;
}

//=======================================================================================
/**
 * Trouver la dernière position d'un trajet
 * return une entity Position ou rien si pas de position pour ce trajet
 */
function findLastTrajetPosition (int $trajetid) : ResultAndEntity {

    $resultAndEntity; $stmt;
    
    $con = connectMaBase();
    $req_lastPosition = "select g2.id, g2.longitude, g2.latitude, g2.timestamp from geolocation as g2 where g2.timestamp =
    (SELECT  MAX(g1.timestamp) FROM geolocation as g1  where g1.trajetid = g2.trajetid)
    and g2.trajetid = ?";
    
    try {

        $stmt = _prepare ($con, $req_lastPosition);
        
        if ($stmt->bind_param("i", $trajetid)) {

            $stmt = _execute($stmt);

            $position = null;
            $stmt->bind_result ($resId, $reslongitude, $resLatitude, $resTimestamp);
                   
            // fetch row ..............
            if ($stmt->fetch()) {
              $position = _buildPosition ($resId, $trajetid, $reslongitude, $resLatitude, $resTimestamp);
              $resultAndEntity = buildResultAndEntity("Position trouvée", $position);

            }  else {
                //echo "pas de trajet trouvé!";
                $resultAndEntity = buildResultAndEntity("Pas de position trouvée!", null);
            }            

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }

    }
    catch (Exception $e) {
        $resultAndEntity = buildResultAndEntityError($e->getMessage());
    }
    finally {
        _closeAll($stmt, null);
    }

    return $resultAndEntity;
    
}

function _buildPosition (int $id, int $trajetid, string $longitude, string $latitude, int $timestamp) {

    $position = new Position();
    $position->set_id($id);
    $position->set_trajetid($trajetid);
    $position->set_longitude($longitude);
    $position->set_latitude($latitude);
    $position->set_timestamp($timestamp);

    return $position;
}

//========================================================================================
/**
 * Suppression de toutes les positions d'un trajet
 */

function _deleteTrajetPositions ($con, int $trajetid) : Resultat {

    $result; $stmt;

    $req_deleteAllPositions = "delete FROM geolocation WHERE trajetid = ?";

    try {

        $stmt = _prepare ($con, $req_deleteAllPositions);
        if ($stmt->bind_param("i", $ptrajetid) ) {

            $ptrajetid = $trajetid;
            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            $message = $nbligneImpactees > 0?"suppression des positions du trajet reussie!":"Pas de modification!";
            
            $result = buildResultat($message);
            

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $result = buildResultatError($e->getMessage());
    }
    finally {
        _closeAll($stmt, null);
    }

    return $result;
}

function buildPositionFromObj (object $bodyobj): Position {

    $position = new Position();
    $position->set_trajetid($bodyobj->trajetid);
         
    $latitude = $bodyobj->latitude;
    $position->set_latitude($latitude);

    $longitude = $bodyobj->longitude;
    $position->set_longitude($longitude);
    $position->set_timestamp($bodyobj->timestamp);

    return $position;
}

/*
* Insertion d'une liste de position pour un trajet
* deleteOther: (on supprime toutes les autres)
*/
function insertTrajetListePositions (array $listPositions, bool $deleteOther) :Resultat {

    $result; $stmt;
   
    $con = connectMaBase();
    _beginTransaction($con);

    $req_insertPosition = "insert INTO geolocation(trajetid, longitude, latitude, timestamp)
     VALUES (?,?,?,?)";

    try {

        // on supprime toutes les autres positions
        if ($deleteOther && sizeof($listPositions) > 0) {

          $position =  current($listPositions);
          $idTrajet = $position->get_trajetid();
          _deleteTrajetPositions($con, $idTrajet);
        }

        // on insère la position
        $stmt = _prepare ($con, $req_insertPosition);
        $nbligneImpactees = 0;
        if ($stmt->bind_param("issi", $trajetid, $longitude, $latitude, $timestamp) ) {

            foreach ($listPositions as $position) {

                $trajetid = $position->get_trajetid();
                $longitude = $position->get_longitude();
                $latitude = $position->get_latitude();
                $timestamp = $position->get_timestamp();
    
                $stmt = _execute ($stmt);
                $nbligneImpactees += $stmt->affected_rows;
            }
    
            if ($nbligneImpactees >= 1) {

                $result = buildResultat("Liste de positions inserées!");
                _commitTransaction($con);
            } else {
                throw new Exception("Pas de modification!!");    
            }

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $result = buildResultatError($e->getMessage());
        _rollbackTransaction($con);
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $result;
}
//========================================================================================



?>