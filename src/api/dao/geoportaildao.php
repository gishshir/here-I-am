<?php

/**
 * Création d'un token d'une durée de 15mn 
 * dans la table geoportail 
 * avec infos necessaires à l'affichage de la map geoportail
 * retour du token
 */
function createMapTokenFromTrajetId(int $trajetid, string $gpxfile):ResultAndEntity{

    $resultAndEntity; $stmt;
   
    $con = connectMaBase();
    _beginTransaction($con);

    $req_insertgeoportail = "insert INTO geoportail( token, trajetid, endtime, description, gpxfile)
     VALUES (?, ?, ?, ?, ?)";

    try {

        // information sur le trajet
        $resultAndEntity = _findTrajetById($con, $trajetid);
        if ($resultAndEntity->is_error()) {
            throw new Exception($resultAndEntity->get_msg());
        }
        $trajet = $resultAndEntity->get_entity();
        $dateformat = formatDate($trajet->get_starttime());
        $description = "Trajet ".$trajetid." du ".$dateformat." [".$trajet->get_mean()."]";

        $stmt = _prepare ($con, $req_insertgeoportail);
        if ($stmt->bind_param("siiss", $token, $trajetid, $endtime, $description, $gpxfile) ) {
    
            $token = buildToken ($trajetid);
            $endtime = buildEndtime(15);

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            if ($nbligneImpactees == 1) {

                $geoportail = new GeoportailInfo();
                $geoportail->set_id(-1);
                $geoportail->set_trajetid($trajetid);
                $geoportail->set_token($token);
                $geoportail->set_endtime($endtime);
                $geoportail->set_description($description);
                $geoportail->set_gpxfile($gpxfile);

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