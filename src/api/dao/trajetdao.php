<?php

/**
 * Suppression d'un trajet par son id
 */

function deleteTrajet (int $id) : Resultat {

    $result; $stmt;

    $con = connectMaBase();
    $req_deleteTrajet = "delete FROM trajet WHERE id = ?";

    try {

        $stmt = _prepare ($con, $req_deleteTrajet);
        if ($stmt->bind_param("i", $idtrajet) ) {

            $idtrajet = $id;
            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            $message = $nbligneImpactees > 0?"suppression du trajet reussie!":"Pas de modification!";
            
            $result = buildResultat($message);
            

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
/*
* Creation d'une position à un trajet
* (on supprime toutes les autres, on ne garde toujours que la dernière)
*/
function insertTrajetPosition (Position $position) :Resultat {

    $result; $stmt;
   
    $con = connectMaBase();
    _beginTransaction($con);

    $req_insertPosition = "insert INTO geolocation(trajetid, longitude, latitude, timestamp)
     VALUES (?,?,?,?)";

    try {

        // on supprime toutes les autres positions
        _deleteTrajetPositions($con, $position->get_trajetid());

        // on insère la position
        $stmt = _prepare ($con, $req_insertPosition);
        if ($stmt->bind_param("issi", $trajetid, $longitude, $latitude, $timestamp) ) {

            $trajetid = $position->get_trajetid();
            $longitude = $position->get_longitude();
            $latitude = $position->get_latitude();
            $timestamp = $position->get_timestamp();

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            if ($nbligneImpactees == 1) {

                $result = buildResultat("Position inserée!");
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


//========================================================================================
/*
* Creation d'un nouveau trajet
*/
function createTrajet (Trajet $trajet) :ResultAndEntity {

    $resultAndEntity; $stmt;
   
    $con = connectMaBase();
    $req_insertPosition = "insert INTO trajet(userid, starttime, endtime, etat, mean) 
    VALUES (?, ?, ?, ?, ?)";

    try {

        $stmt = _prepare ($con, $req_insertPosition);
        if ($stmt->bind_param("iiiss", $userid, $starttime, $endtime, $etat, $mean) ) {

            $userid = getCurrentUserId();
            $starttime = $trajet->get_starttime();
            $endtime = $trajet->get_endtime();
            $etat = $trajet->get_etat();
            $mean = $trajet->get_mean();

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            if ($nbligneImpactees == 1) {

                $resultAndEntity = _findLastTrajet($con, getCurrentUserId());
            } else {
                throw new Exception("Pas de modification!!");    
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

//========================================================================================
/**
 * Retourne le trajet par son id si existe
 */
function findTrajetById (int $id) : ResultAndEntity {

    $con = connectMaBase();

    $resultAndEntity = _findTrajetById ($con, $id);
    _closeAll(null, $con);
    
    return $resultAndEntity;

}
function _findTrajetById (mysqli $con, int $id) : ResultAndEntity {

    $req_trajetById = "select id, starttime, endtime, etat, mean FROM trajet WHERE id = ?";
    return _findTrajet ($con, $req_trajetById, $id, "Récupération du trajet reussie!");
    
}
//========================================================================================

//========================================================================================
/**
 * Retourne le dernier (le plus récent) trajet de l'utilisateur courant si ce trajet existe
 */
function findLastTrajet () : ResultAndEntity {

    $con = connectMaBase();

    $resultAndEntity = _findLastTrajet ($con, getCurrentUserId());
    _closeAll(null, $con);
    
    return $resultAndEntity;

}
function findAmiLastTrajet (int $amiid) : ResultAndEntity {

    $con = connectMaBase();

    $resultAndEntity = _findLastTrajet ($con, $amiid);
    _closeAll(null, $con);
    
    return $resultAndEntity;

}

function _findLastTrajet (mysqli $con, int $iduser) : ResultAndEntity {

    $req_lastTrajet = "select t2.id, t2.starttime, t2.endtime, t2.etat, t2.mean from trajet t2
    where starttime =
    (SELECT MAX(starttime) FROM trajet t1 where t1.userid = t2.userid)
    and t2.userid = ?";
    
    return _findTrajet ($con, $req_lastTrajet, $iduser, "Récupération dernier trajet reussie!");
    
}
//========================================================================================

// cherche un Trajet et return null si aucun
function _findTrajet (mysqli $con, string $req_sql, $idToBind, string $message) : ResultAndEntity {


    $resultAndEntity; $stmt;

    try {

        $stmt = _prepare ($con, $req_sql);
        
        if ($stmt->bind_param("i", $idToBind)) {

            $stmt = _execute($stmt);

            $trajet = null;
            $stmt->bind_result ($resId, $resStartTime, $resEndTime, $resEtat, $resMean);
                   
            // fetch row ..............
            if ($stmt->fetch()) {
              $trajet = _buildTrajet ($resId, $resStartTime, $resEndTime, $resEtat, $resMean);
              $resultAndEntity = buildResultAndEntity($message, $trajet);

            }  else {
                //echo "pas de trajet trouvé!";
                $resultAndEntity = buildResultAndEntity("Pas de trajet trouvé!", null);
                //echo var_dump($resultAndEntity);
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

function updateMeanTrajet (int $trajetid, string $trajetMean) : ResultAndEntity {

    $resultAndEntity; $stmt;
   
    $con = connectMaBase();
    $req_updateMeanTrajet = "update trajet SET mean = ?  WHERE id = ?";

    try {

        $stmt = _prepare ($con, $req_updateMeanTrajet);
        if ($stmt->bind_param("si", $pmean, $pid) ) {

            $pid = $trajetid;
            $pmean = $trajetMean;

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            $resultAndEntity = _findTrajetById ($con, $trajetid);
            $message = $nbligneImpactees > 0?"moyen transport enregistré!":"Pas de modification!";
            $resultAndEntity->set_msg ($message);

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
/*
* met à jour d'un trajet (TrajetState)
*/
function updateStateTrajet (Trajet $trajet) : ResultAndEntity {

    $resultAndEntity; $stmt;
   
    $con = connectMaBase();
    $req_updateEtatTrajet = "update trajet SET etat = ?, endtime = ?  WHERE id = ?";

    try {

        $stmt = _prepare ($con, $req_updateEtatTrajet);
        if ($stmt->bind_param("sii", $etat, $endtime, $id) ) {

            $id = $trajet->get_id();
            $endtime = $trajet->get_endtime();
            $etat = $trajet->get_etat();

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            $resultAndEntity = _findTrajetById ($con, $trajet->get_id());
            $message = $nbligneImpactees > 0?"update etat du trajet reussi!":"Pas de modification!";
            $resultAndEntity->set_msg ($message);

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

/*
* construit la liste des trajets de l'utilisateur courant
*/
function displayListTrajets() : ResultAndDatas {
    
    $idCurrentUser = getCurrentUserId();
    $resultAndDatas; $stmt;
      
    $con = connectMaBase();
    $req_ListTrajets = "select id, starttime, endtime, etat, mean FROM trajet WHERE userid = ? 
    order by starttime DESC";


    try {

        $stmt = _prepare ($con, $req_ListTrajets);
        
        if ($stmt->bind_param("i", $idCurrentUser)) {

            $stmt = _execute($stmt);

            $listeTrajets = array();
            $trajet = null;
            $stmt->bind_result ($resId, $resStartTime, $resEndTime, $resEtat, $resMean);
                   
            // fetch row ..............
            while($stmt->fetch()) {

                $trajet = _buildTrajet ($resId, $resStartTime, $resEndTime, $resEtat, $resMean);
                array_push ($listeTrajets, $trajet);
            }  // --- fin du fetch


            $resultAndDatas = buildResultAndDatas("Récupération liste trajets réussie!", $listeTrajets);

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
function _buildTrajet (int $id, int $starttime, int $endtime, string $etat, string $mean) {

    $trajet = new Trajet();

    $trajet->set_id($id);
    $trajet->set_starttime($starttime);
    $trajet->set_endtime($endtime);
    $trajet->set_etat($etat);
    $trajet->set_mean($mean);

    return $trajet;
}

?>