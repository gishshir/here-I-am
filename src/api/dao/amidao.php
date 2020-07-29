<?php

//  mise à jour de la table person_rel
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


//  mise à jour de la table person_rel
function updateNotifierAmis (array $listIdRelationEtNotifier): Resultat {

    $result; $stmt;

    $idCurrentUser = getCurrentUserId();
   
    $con = connectMaBase();
    _beginTransaction($con);
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
            _commitTransaction($con);

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $result = buildResultAndDatasError($e->getMessage());
        _rollbackTransaction($con);
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $result;
    
}

/*
* construit la liste des non - amis de l'utilisateur courant
* retourne une liste de personne (avec etat masqué)
*/
function displayListPersonneNonAmis(): ResultAndDatas {

    $idCurrentUser = getCurrentUserId();
    $resultAndDatas; $stmt;
      
    $con = connectMaBase();
    $req_ListNonAmis = "select id, pseudo from utilisateur where utilisateur.id not in
    (
    SELECT ami_rel.personid as amiid FROM person_rel user_rel
    left join person_rel ami_rel on user_rel.relationid = ami_rel.relationid 
    
    where user_rel.personid = ?
    ) 
    order by pseudo";    
    
    try {

        $stmt = _prepare ($con, $req_ListNonAmis);
        
        if ($stmt->bind_param("i", $idCurrentUser)) {

            $stmt = _execute($stmt);

            $listePersonnes = array();
            $infoAmi = null;
            $stmt->bind_result ($resAmiId, $resPseudo);
                   
            // fetch row ..............
            while($stmt->fetch()) {

                $personne = new Personne();
                $personne->set_id ($resAmiId);
                $personne->set_pseudo($resPseudo);

                // on masque l'etat 
                $personne->set_etat ("NonConnu");

                array_push ($listePersonnes, $personne);
            }  // --- fin du fetch


            $resultAndDatas = buildResultAndDatas("Récupération liste non amis réussie!", $listePersonnes);

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

/*
* retourne un ami de l'utilisateur courant
* retourne un objet AmiInfo
*/
function displayAmiInfo (int $idami) : ResultAndEntity {

    $idCurrentUser = getCurrentUserId();
    $resultAndEntity; $stmt;
      
    $con = connectMaBase();
    $req_ListAmis = "select amiid, relationid, suivre, notifier, U.pseudo, U.etat as ami_etat, R.etat as rel_etat from
    (
    select tab_user.personid, tab_user.relationid as relationid, tab_ami.personid as amiid, tab_user.suivre as suivre, tab_user.notifier as notifier  from person_rel as tab_user
    
    join person_rel as tab_ami on tab_user.relationid = tab_ami.relationid and tab_user.personid != tab_ami.personid
    
    where tab_user.personid = ? and tab_ami.personid = ?) as tab
    
    left join utilisateur as U on amiid = U.id
    left join relation as R on relationid = R.id";    
    
    try {

        $stmt = _prepare ($con, $req_ListAmis);
        
        if ($stmt->bind_param("ii", $idCurrentUser, $idami)) {

            $stmt = _execute($stmt);

            $stmt->bind_result ($resAmiId, $resRelId, $resSuivre, $resNotifier, $resPseudo,
             $resPersonEtat, $resRelationEtat);
                   
            // fetch row ..............
            $infoAmi = null;
            if($stmt->fetch()) {

                $infoAmi = buildAmiInfoFromRow($resAmiId, $resPseudo, $resRelationEtat, 
                $resPersonEtat, $resRelId, $resSuivre, $resNotifier);
                $resultAndEntity = buildResultAndEntity("Récupération info ami réussie!", $infoAmi);
            }  else {
                $resultAndEntity = buildResultAndEntityError("Echec de récupération info ami!");
            }// --- fin du fetch          

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
function buildAmiInfoFromRow (int $resAmiId, string $resPseudo, string $resRelationEtat, 
            string $resPersonEtat, int $resRelId, int $resSuivre, int $resNotifier) {

    $infoAmi = new AmiInfo();
    $personne = new Personne();
    $personne->set_id ($resAmiId);
    $personne->set_pseudo($resPseudo);

     // on masque l'etat si la relation n'est pas validée
    $etat = $resRelationEtat == "open"?$resPersonEtat:"NonConnu";
    $personne->set_etat ($etat);

    $amirelation = new AmiRelation();
    $amirelation->set_id($resRelId);
    $amirelation->set_suivre($resSuivre);
    $amirelation->set_notifier($resNotifier);
    $amirelation->set_etat($resRelationEtat);

    $infoAmi->set_personne($personne);
    $infoAmi->set_relation($amirelation);

  return $infoAmi;
}

/*
* construit la liste des amis de l'utilisateur courant
* retourne une liste de AmiInfo
*/
function displayListAmis() : ResultAndDatas {
    
    $idCurrentUser = getCurrentUserId();
    $resultAndDatas; $stmt;
      
    $con = connectMaBase();
    $req_ListAmis = "select amiid, relationid, suivre, notifier, U.pseudo, U.etat as ami_etat, R.etat as rel_etat from
    (
    select tab_user.personid, tab_user.relationid as relationid, tab_ami.personid as amiid, tab_user.suivre as suivre, tab_user.notifier as notifier  from person_rel as tab_user
    
    join person_rel as tab_ami on tab_user.relationid = tab_ami.relationid and tab_user.personid != tab_ami.personid
    
    where tab_user.personid = ?) as tab
    
    left join utilisateur as U on amiid = U.id
    left join relation as R on relationid = R.id
    order by U.pseudo";    
    
    try {

        $stmt = _prepare ($con, $req_ListAmis);
        
        if ($stmt->bind_param("i", $idCurrentUser)) {

            $stmt = _execute($stmt);

            $listeAmis = array();
            $infoAmi = null;
            $stmt->bind_result ($resAmiId, $resRelId, $resSuivre, $resNotifier, $resPseudo,
             $resPersonEtat, $resRelationEtat);
                   
            // fetch row ..............
            while($stmt->fetch()) {

                $infoAmi = buildAmiInfoFromRow($resAmiId, $resPseudo, $resRelationEtat, 
                $resPersonEtat, $resRelId, $resSuivre, $resNotifier);
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