<?php

// on s'assure que le token existe dans la table geoportail et
// qu'il est toujours valide
function verifyToken (string $token) : Resultat {


    $sql_countToken = "select count(*) as total FROM geoportail where token = ? and endtime > UNIX_TIMESTAMP()";

    $con = connectMaBase();
    $result; $stmt;

    try {

        $stmt = _prepare ($con, $sql_countToken);
        
        if ($stmt->bind_param("s", $token)) {

            $stmt = _execute($stmt);

            $success = false;
            $stmt->bind_result ($resCount);
                   
            // fetch row .............
            $stmt->fetch();

            $success =  ((int)$resCount) > 0;
            $result = $success?buildResultat("token valide!")
            :buildResultatError("token inexistant ou invalide!");
                        

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }

    }
    catch (Exception $e) {
        $result = buildResultatError($e->getMessage());
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $result;
}

function _buildGeoportailUrl(string $token) : string {

    $url_base;
    if (islocaldev()) {
        $url_base = "geoportail-dev.secure";
    } 
    else if (islocaldist()) {
        $url_base = "geoportail-dev.secure";
    } 
    else if (isremote()){
        $url_base = "geoportail.tsadeoapp.info";
    }

    return "https://".$url_base."/index.php?token=".$token;
}

function findGeoportailInfo (string $token) : ResultAndEntity {

    $resultAndEntity; $stmt;
    $con = connectMaBase();

    $req_getGeoportailByToken = "select id, trajetid, endtime, description, gpxfile, center_lat, center_long
    FROM geoportail WHERE token = ?";

    try {

        $stmt = _prepare ($con, $req_getGeoportailByToken);
        
        if ($stmt->bind_param("s", $token)) {

            $stmt = _execute($stmt);

            $trajet = null;
            $stmt->bind_result ($resId, $resTrajetid, $resEndTime, $resDescription, $resGpxfile, $resCenterLat, $resCenterLong);
                   
            // fetch row ..............
            if ($stmt->fetch()) {
              $centerPosition = _buildPosition(-1, $resTrajetid, $resCenterLong, $resCenterLat, -1);
              $geoportail = _buildGeoportailInfo ($resId, $resTrajetid, $token, $resEndTime, $resDescription, 
              $resGpxfile, $centerPosition);
              $resultAndEntity = buildResultAndEntity("find geoportail succès!!", $geoportail);

            }  else {
                $resultAndEntity = buildResultAndEntityError("Pas de ligne geoportail trouvée!");
            }            

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }

    }
    catch (Exception $e) {
        $resultAndEntity = buildResultAndEntityError($e->getMessage());
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $resultAndEntity;
}

function _buildGeoportailInfo (int $id, int $trajetid, string $token, int $endtime, string $description, string $gpxfile,
                         Position $center): GeoPortailInfo {

    $geoportail = new GeoPortailInfo();
    $geoportail->set_id($id);
    $geoportail->set_trajetid($trajetid);
    $geoportail->set_token($token);
    $geoportail->set_endtime($endtime);
    $geoportail->set_description($description);
    $geoportail->set_gpxfile($gpxfile);
    $geoportail->set_center($center);
    $geoportail->set_url(_buildGeoportailUrl($token));

    return $geoportail;
}

/**
 * Création d'un token d'une durée de 15mn 
 * dans la table geoportail 
 * avec infos necessaires à l'affichage de la map geoportail
 * retour du token
 */
function createMapTokenFromTrajetId(int $trajetid, string $gpxfile, array $listPositions):ResultAndEntity{

    $resultAndEntity; $stmt;
   
    $con = connectMaBase();
    _beginTransaction($con);

    $req_insertgeoportail = "insert INTO geoportail( token, trajetid, endtime, description, gpxfile, center_lat, center_long)
     VALUES (?, ?, ?, ?, ?, ?, ?)";

    try {

        // information sur le trajet
        $resultAndEntity = _findTrajetById($con, $trajetid);
        if ($resultAndEntity->is_error()) {
            throw new Exception($resultAndEntity->get_msg());
        }
        $trajet = $resultAndEntity->get_entity();
        $dateformat = formatDate($trajet->get_starttime());
        $description = "Trajet ".$trajetid." du ".$dateformat." [".$trajet->get_mean()."]";

        $centerPosition = calculCoordPointCentral($listPositions);
        $latitude = $centerPosition->get_latitude();
        $longitude = $centerPosition->get_longitude();

        $stmt = _prepare ($con, $req_insertgeoportail);
        if ($stmt->bind_param("siissss", $token, $trajetid, $endtime, $description, $gpxfile, 
                            $latitude, $longitude) ) {
    
            $token = buildToken ($trajetid);
            $endtime = buildEndtime(15);

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            if ($nbligneImpactees == 1) {

                $geoportail = _buildGeoportailInfo(-1, $trajetid, $token, $endtime, $description, $gpxfile, $centerPosition);
                $resultAndEntity = buildResultAndEntity("Creation ligne geoportail reussie!",  $geoportail);
                _commitTransaction($con);
            } else {
                throw new Exception("Pas de modification!!");    
            }

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $resultAndEntity = buildResultAndEntityError($e->getMessage());
        _rollbackTransaction($con);
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $resultAndEntity;

}

function calculCoordPointCentral (array $listPositions) : Position {

    $size = sizeof ($listPositions);
    // premiere et dernier position
    $firstPosition = $listPositions[0];
    $lastPosition = $listPositions[$size - 1];

    $firstLong = (float) $firstPosition->get_longitude();
    $lastLong =  (float) $lastPosition->get_longitude();
    $centerLong = strval(moyenne($firstLong, $lastLong));

    $firstLat = (float) $firstPosition->get_latitude();
    $lastLat = (float) $lastPosition->get_latitude();
    $centerLat = strval(moyenne($firstLat, $lastLat));

    $center = new Position();
    $center->set_id(-1);
    $center->set_longitude($centerLong);
    $center->set_latitude ($centerLat);
    $center->set_trajetid($firstPosition->get_trajetid());
    $center->set_timestamp(-1);
    return $center;
}
function moyenne (float $first, float $last): float {
    return (float) (($first + $last)/2);
}

function formatDate (int $timestamp) : string {

    $date = new DateTime();
    $date->setTimestamp ($timestamp);
    return date_format($date,"d/m/Y H:i:s");
}

function buildToken (int $trajetid): string {

    $date = new DateTime();
    $timestamp = $date->getTimestamp();
    return hash('sha256', $trajetid."token".$timestamp);

}


function buildEndtime (int $dansXJour): int {

    $date = new DateTime();
    $intervalle =  new DateInterval('P'.$dansXJour.'D');

    $date2 = $date->add($intervalle);
    return $date2->getTimestamp();
}


?>