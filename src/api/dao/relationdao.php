<?php

include_once DIR_DAO.'dao.php';

//  mise à jour de la table person_rel
function updateActionRelation (int $relationId, string $action): Resultat {

    $result; $stmt;

    $idCurrentUser = getCurrentUserId();
   
    $con = connectMaBase();
    $con->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

    $req_updateActionRelation = "update person_rel SET action = ?  WHERE personid = ? and relationid = ?";

    try {

        $stmt = _prepare ($con, $req_updateActionRelation);
        if ($stmt->bind_param("sii", $paction, $ppersonid, $prelationid) ) {

            $paction = $action;
            $ppersonid = $idCurrentUser;
            $prelationid = $relationId;

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            $result = buildResultat ($nbligneImpactees > 0?"update action de la relation reussi!":"Pas de modification!"); 
            if (!$result->is_error()) {

                // mise à jour de l'état de la relation en fonction du modification action
                // acceptee --> open
                // refusee --> ended
                $etat;

                switch ($action){
                    case "acceptee": $etat = "open"; break;
                    case "refusee": $etat = "closed"; break;
                    default : $etat = "pending"; break;
                }
                $result = _updateStateRelation($con, $relationId, $etat);
                $con->commit();
            } else {
                throw new Exception ($resultAndEntity->get_msg());
            }

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $con->rollback();
        $result = buildResultAndDatasError($e->getMessage());
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $result;
    
}

// mise à jour de l'état de la relation en fonction du modification action
// acceptee --> open
// refusee --> ended
function _updateStateRelation ($con, int $relationId, string $etat): Resultat {

    $result; $stmt;

    $idCurrentUser = getCurrentUserId();

    $req_updateStateRelation = "update relation SET etat = ?  WHERE  id = ?";

    try {

        $stmt = _prepare ($con, $req_updateStateRelation);
        if ($stmt->bind_param("si", $petat, $prelationid) ) {

            $petat = $etat;
            $prelationid = $relationId;

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            $result = buildResultat ($nbligneImpactees > 0?"update etat de la relation reussi!":"Pas de modification!");            

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $result = buildResultAndDatasError($e->getMessage());
    }
    finally {
        _closeAll($stmt, null);
    }

    return $result;
}


// detail de la relation etat/action pour l'utilisateur en cours
function getRelationInfo (int $id) : ResultAndEntity {

    $con = connectMaBase();
    $resultAndEntity; $stmt;

    $idCurrentUser = getCurrentUserId();

    $sql_getRelationByIdAndPerson = "select relation.etat as etat_relation, user_rel.action as action, ami_rel.action as ami_action
    FROM person_rel as user_rel
    
    left join person_rel as ami_rel on user_rel.relationid = ami_rel.relationid and user_rel.personid != ami_rel.personid
    
    left join relation on relation.id = user_rel.relationid
    WHERE user_rel.relationid = ? and user_rel.personid  = ?";


    try {

        $stmt = _prepare ($con, $sql_getRelationByIdAndPerson);
        
        if ($stmt->bind_param("ii", $id, $idCurrentUser)) {

            $stmt = _execute($stmt);

            $trajet = null;
            $stmt->bind_result ($resEtatRelation, $resUserAction, $resAmiAction);
                   
            // fetch row ..............
            if ($stmt->fetch()) {
                $relationInfo = _buildRelationInfo ($id, $resEtatRelation, $resUserAction, $resAmiAction);
                $resultAndEntity = buildResultAndEntity("relationinfo trouvée!", $relationInfo);

            }  else {
                $resultAndEntity = buildResultAndEntity("Pas de relation trouvé!", null);
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

function _buildRelationInfo (int $id, string $etat, string $action, string $amiaction): RelationInfo {

    $relationInfo = new RelationInfo();
    $relationInfo->set_id($id);
    $relationInfo->set_etat($etat);
    $relationInfo->set_action($action);
    $relationInfo->set_amiaction($amiaction);

    return $relationInfo;
}



?>