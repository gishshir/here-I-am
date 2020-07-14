<?php
require_once 'dao.php';
require_once '../entities/trajet.php';



function createTrajet (Trajet $trajet) :ResultAndEntity {

    $resultAndEntity; $stmt;
   
    $con = connectMaBase();
    $req_createTrajet = "insert INTO trajet(userid, starttime, endtime, etat, mean) 
    VALUES (?, ?, ?, ?, ?)";

    try {

        $stmt = _prepare ($con, $req_createTrajet);
        if ($stmt->bind_param("iiiss", $userid, $starttime, $endtime, $etat, $mean) ) {

            $userid = getCurrentUserId();
            $starttime = $trajet->get_starttime();
            $endtime = $trajet->get_endtime();
            $etat = $trajet->get_etat();
            $mean = $trajet->get_mean();

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            if ($nbligneImpactees == 1) {

                $resultAndEntity = _findLastTrajet($con);
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

    $resultAndEntity = _findLastTrajet ($con);
    _closeAll(null, $con);
    
    return $resultAndEntity;

}

function _findLastTrajet (mysqli $con) : ResultAndEntity {

    $idCurrentUser = getCurrentUserId();

    $req_lastTrajet = "select t2.id, t2.starttime, t2.endtime, t2.etat, t2.mean from trajet t2
    where starttime =
    (SELECT MAX(starttime) FROM trajet t1 where t1.userid = t2.userid)
    and t2.userid = ?";
    
    return _findTrajet ($con, $req_lastTrajet, $idCurrentUser, "Récupération dernier trajet reussie!");
    
}
//========================================================================================

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
                $resultAndEntity = buildResultAndEntity("Pas de trajet trouvé!", null);
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

/*
* met à jour d'un trajet (TrajetState)
*/
function updateTrajet (Trajet $trajet) : ResultAndEntity {

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
    $req_ListTrajets = "select id, starttime, endtime, etat, mean FROM trajet WHERE userid = ?";


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