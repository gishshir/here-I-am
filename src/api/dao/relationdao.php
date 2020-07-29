<?php

/**
 * Suppression d'une relation par son id
 */

function deleteRelation (int $id) : Resultat {

    $result; $stmt;

    $con = connectMaBase();
    $req_deleteRelation = "delete FROM relation WHERE id = ?";

    try {

        $stmt = _prepare ($con, $req_deleteRelation);
        if ($stmt->bind_param("i", $idrelation) ) {

            $idrelation = $id;
            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            $message = $nbligneImpactees > 0?"suppression de la relation reussie!":"Pas de modification!";
            
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

//========================================================================================
/*
* Creation d'une nouvelle relation
* et creation de l'invitation
*/function createRelationAndInvitation ( int $idperson) :Resultat {

    $result;

    $con = connectMaBase();
    _beginTransaction($con);

    try {

        // creation relation (et trigger person_rel)
       $resultAndEntity = _createRelation ($con, $idperson);
       if (!$resultAndEntity->is_error()) {

        $idrelation = $resultAndEntity->get_entity()->get_id();
        $result = _updateActionRelation ($con, $idrelation, "invitation");
        
        if ($result->is_error()) {
            throw new Exception("echec de l'invitation!!");    
        }
       } else {
        throw new Exception("echec de création!: "+ $resultAndEntity->get_msg());    
       }
       _commitTransaction($con);


    } catch (Exception $e) {
        $result = buildResultatError($e->getMessage());
        _rollbackTransaction($con);
    }
    finally {
        _closeAll(null, $con);
    }

    return $result;

}

/*
* Creation d'une nouvelle relation
* retour AmiRelation
*/
function _createRelation ($con, int $idperson) :ResultAndEntity {

    $resultAndEntity; $stmt;

    $idCurrentUser = getCurrentUserId();

    $req_createRelation = "insert INTO relation(person_a, person_b, etat) 
    VALUES (?, ?, ?)";

    try {

        $stmt = _prepare ($con, $req_createRelation);
        if ($stmt->bind_param("iis", $iduser, $pidperson, $petat) ) {
 
            $iduser = getCurrentUserId();
            $pidperson = $idperson;
            $petat = "pending";

            $stmt = _execute ($stmt);

            $nbligneImpactees = $stmt->affected_rows ;
            if ($nbligneImpactees == 1) {

                $resultAndEntity =  _findRelation($con, $idCurrentUser, $idperson);
                
            } else {
                throw new Exception("echec de création!!");    
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
function _findRelation (mysqli $con, $idperson_a, $idperson_b) : ResultAndEntity {

    $resultAndEntity; $stmt;
    $req_getRelation = "select id,  etat FROM relation WHERE person_a = ? and person_b = ?";

    try {

        $stmt = _prepare ($con, $req_getRelation);
        
        if ($stmt->bind_param("ii", $pidperson_a, $pidperson_b)) {

            $pidperson_a = $idperson_a;
            $pidperson_b = $idperson_b;

            $stmt = _execute($stmt);

            $trajet = null;
            $stmt->bind_result ($resId, $resEtat);
                   
            // fetch row ..............
            if ($stmt->fetch()) {
              $relation = _buildAmiRelation ($resId, $resEtat);
              $resultAndEntity = buildResultAndEntity("relation trouvée!", $relation);

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
        _closeAll($stmt, null);
    }

    return $resultAndEntity;
    
}

function _buildAmiRelation ($id, $etat) : AmiRelation {

    $amiRelation = new AmiRelation();
    $amiRelation->set_id($id);
    $amiRelation->set_suivre(false);
    $amiRelation->set_notifier (false);
    $amiRelation->set_etat ($etat);
    return $amiRelation;
}
//=======================================================================================

//  mise à jour de la table person_rel (action)
// et relation (etat)
function updateActionRelationAndState (int $relationId, string $action): Resultat {

    $result; 

    $idCurrentUser = getCurrentUserId();
   
    $con = connectMaBase();
    _beginTransaction($con);

    try {

            $result = _updateActionRelation($con, $relationId, $action);
            if (!$result->is_error()) {

                // mise à jour de l'état de la relation en fonction du modification action
                // acceptee --> open
                // refusee --> ended
                // [none --> pending] pour tests
                $etat;

                switch ($action){
                    case "acceptee": $etat = "open"; break;
                    case "refusee": $etat = "closed"; break;
                    default : $etat = "pending"; break;
                }
                $result = _updateStateRelation($con, $relationId, $etat);
                _commitTransaction($con);
            } else {
                throw new Exception ($resultAndEntity->get_msg());
            }
    }
    catch (Exception $e) {
        _rollbackTransaction($con);
        $result = buildResultAndDatasError($e->getMessage());
    }
    finally {
        _closeAll(null, $con);
    }

    return $result;
    
}

//  mise à jour de la table person_rel uniquement
function _updateActionRelation ($con, int $relationId, string $action): Resultat {

    $result; $stmt;

    $idCurrentUser = getCurrentUserId();
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