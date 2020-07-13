<?php
require_once 'dao.php';
require_once '../entities/trajet.php';

/*
* construit la liste des trajets de l'utilisateur courant
*/
function displayListTrajets() : ResultAndDatas {
    
    $idCurrentUser = getCurrentUserId();
    $resultAndDatas; $stmt;
      
    $con = connectMaBase();
    $req_ListTrajets = "select id, starttime, endtime, etat FROM trajet WHERE userid = ?";


    try {

        $stmt = _prepare ($con, $req_ListTrajets);
        
        if ($stmt->bind_param("i", $idCurrentUser)) {

            $stmt = _execute($stmt);

            $listeTrajets = array();
            $trajet = null;
            $stmt->bind_result ($resId, $resStartTime, $resEndTime, $resEtat);
                   
            // fetch row ..............
            while($stmt->fetch()) {

                $trajet = new Trajet();

                $trajet->set_id($resId);
                $trajet->set_starttime($resStartTime);
                $trajet->set_endtime($resEndTime);
                $trajet->set_etat($resEtat);

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