<?php
require_once 'dao.php';
require_once '../entities/trajet.php';


/*
* met à jour d'un trajet (TrajetState)
*/
function updateTrajet (Trajet $trajet) : Resultat {

    $result; $stmt;
   
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
            $result = buildResultat ($nbligneImpactees > 0?"update etat du trajet reussi!":"Pas de modification!");            

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $result = buildResultAndDataError($e->getMessage());
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $result;

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

                $trajet = new Trajet();

                $trajet->set_id($resId);
                $trajet->set_starttime($resStartTime);
                $trajet->set_endtime($resEndTime);
                $trajet->set_etat($resEtat);
                $trajet->set_mean($resMean);

                array_push ($listeTrajets, $trajet);
            }  // --- fin du fetch


            $resultAndDatas = buildResultAndData("Récupération liste trajets réussie!", $listeTrajets);

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }

    }
    catch (Exception $e) {
        $resultAndDatas = buildResultAndDataError($e->getMessage());
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $resultAndDatas;
}
?>