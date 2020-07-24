<?php

include_once DIR_DAO.'dao.php';

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