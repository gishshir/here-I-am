<?php

require_once 'dao.php';
require_once '../entities/amiinfo.php';

function updateSuiviRelation (int $relationId, bool $suivre): Resultat {

    $result; $stmt;
   
    $con = connectMaBase();
    $req_updateSuiviAmi = "update relation SET a_suivi_b = ?  WHERE id = ?";

    try {

        $stmt = _prepare ($con, $req_updateSuiviAmi);
        if ($stmt->bind_param("ii", $asuivib, $id) ) {

            $id = $relationId;
            $asuivib = $suivre;

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            $result = buildResultat ($nbligneImpactees > 0?"update suivi de la relation reussi!":"Pas de modification!");            

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $result = buildResultAndDatasError($e->getMessage());
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $result;
    
}

/*
* construit la liste des amis de l'utilisateur courant
*/
function displayListAmis() : ResultAndDatas {
    
    $idCurrentUser = getCurrentUserId();
    $resultAndDatas; $stmt;
      
    $con = connectMaBase();
    $req_ListAmis = "select amiid, relid, a_suivi_b, a_notification_b, b_suivi_a, b_notification_a, pseudo, etat

    FROM 
    
    (SELECT personid as amiid, relationid as relid 
    from person_rel
    WHERE relationid = SOME 
    (
    SELECT relationid  FROM person_rel 
    where personid = ?
    )
    and personid != ?) as amisetrel
    
    left join relation on relid = relation.id
    left join utilisateur on amiid = utilisateur.id";    
    
    try {

        $stmt = _prepare ($con, $req_ListAmis);
        
        if ($stmt->bind_param("ii", $idCurrentUser, $idCurrentUser)) {

            $stmt = _execute($stmt);

            $listeAmis = array();
            $infoAmi = null;
            $stmt->bind_result ($resAmiId, $resRelId, $resASuiviB, $resANotifB, $resBSuiviA, $resBNotifA, $resPseudo, $resEtat);
                   
            // fetch row ..............
            while($stmt->fetch()) {

                $infoAmi = new AmiInfo();

                $personne = new Personne();
                $personne->set_id ($resAmiId);
                $personne->set_pseudo($resPseudo);
                $personne->set_etat ($resEtat);

                $amirelation = new AmiRelation();
                $amirelation->set_id($resRelId);
                $amirelation->set_suivre($resASuiviB);
                $amirelation->set_notificationVers($resANotifB);
                $amirelation->set_suiviPar($resBSuiviA);
                $amirelation->set_notifiePar($resBNotifA);

                $infoAmi->set_personne($personne);
                $infoAmi->set_relation($amirelation);

                array_push ($listeAmis, $infoAmi);
            }  // --- fin du fetch


            $resultAndDatas = buildResultAndDatas("Récupération liste amis réussie!", $listeAmis);

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



?>