<?php

include_once DIR_DAO.'dao.php';

// attention mise à jour de la table person_rel
// la table relation mise à jour par trigger
function updateSuiviRelation (int $relationId, bool $suivre): Resultat {

    $result; $stmt;

    $idCurrentUser = getCurrentUserId();
   
    $con = connectMaBase();
    $req_updateSuiviAmi = "update person_rel SET suivre = ?  WHERE personid = ? and relationid = ?";

    try {

        $stmt = _prepare ($con, $req_updateSuiviAmi);
        if ($stmt->bind_param("iii", $psuivre, $ppersonid, $prelationid) ) {

            $psuivre = $suivre;
            $ppersonid = $idCurrentUser;
            $prelationid = $relationId;

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


// attention mise à jour de la table person_rel
// tableau des relations à notifier [{idrelation, notifier}, {idrelation, notifier}...]
function updateNotifierAmis (array $listIdRelationEtNotifier): Resultat {

    $result; $stmt;

    $idCurrentUser = getCurrentUserId();
   
    $con = connectMaBase();
    $con->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
    $req_updateSuiviAmi = "update person_rel SET notifier = ?  WHERE personid = ? and relationid = ?";

    try {

        $stmt = _prepare ($con, $req_updateSuiviAmi);
        if ($stmt->bind_param("iii", $pnotifier, $ppersonid, $prelationid) ) {

            $ppersonid = $idCurrentUser;

            $nbligneImpactees = 0;
            foreach ($listIdRelationEtNotifier as $obj) {

                $pnotifier = $obj->notifier;
                $prelationid = $obj->idrelation;

                $stmt = _execute ($stmt);
                $nbligneImpactees += $stmt->affected_rows ;
            }   
            $message = $nbligneImpactees > 0?"update notifier amis reussi! (".$nbligneImpactees.")":"Pas de modification!";
            $result = buildResultat ($message);            
            $con->commit();

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $result = buildResultAndDatasError($e->getMessage());
        $con->rollback();
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
    $req_ListAmis = "select amiid, relationid, suivre, notifier, pseudo, etat from
    (
    select tab1.personid, tab1.relationid as relationid, tab2.personid as amiid, tab1.suivre as suivre, tab1.notifier as notifier  from person_rel as tab1
    
    join person_rel as tab2 on tab1.relationid = tab2.relationid and tab1.personid != tab2.personid
    
    where tab1.personid = ?) as tab3
    
    left join utilisateur on amiid = utilisateur.id";    
    
    try {

        $stmt = _prepare ($con, $req_ListAmis);
        
        if ($stmt->bind_param("i", $idCurrentUser)) {

            $stmt = _execute($stmt);

            $listeAmis = array();
            $infoAmi = null;
            $stmt->bind_result ($resAmiId, $resRelId, $resSuivre, $resNotifier, $resPseudo, $resEtat);
                   
            // fetch row ..............
            while($stmt->fetch()) {

                $infoAmi = new AmiInfo();

                $personne = new Personne();
                $personne->set_id ($resAmiId);
                $personne->set_pseudo($resPseudo);
                $personne->set_etat ($resEtat);

                $amirelation = new AmiRelation();
                $amirelation->set_id($resRelId);
                $amirelation->set_suivre($resSuivre);
                $amirelation->set_notifier($resNotifier);

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