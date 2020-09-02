<?php

/**
 * Création d'un token d'une durée de 15mn 
 * dans la table geoportail 
 * avec infos necessaires à l'affichage de la map geoportail
 * retour du token
 */
function createMapTokenFromTrajetId(int $trajetid, string $description, string $gpxfile):Resultat{

    $result; $stmt;
   
    $con = connectMaBase();
    $req_insertgeoportail = "insert INTO geoportail( token, trajetid, endtime, description, gpxfile)
     VALUES (?, ?, ?, ?)";

    try {

        $stmt = _prepare ($con, $req_insertgeoportail);
        if ($stmt->bind_param("siiss", $token, $trajetid, $endtime, $description, $gpxfile) ) {
    
            $token = buildToken ($projetid);
            $endtime = buildEndtime(15);

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            if ($nbligneImpactees == 1) {

                $result = buildResultat($token);
            } else {
                throw new Exception("Pas de modification!!");    
            }

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

function buildToken (int $trajetid): string {

    $date = new DateTime();
    $timestamp = $date->getTimestamp();
    return hash('sha256', $trajetid."token".$timestamp);

}


function buildEndtime (int $dansXJour): int {

    $date = new DateTime();
    $intervalle =  new DateInterval('P'.$dansXJour.'D');

    $date2 = $date->add($intervalle);
    return $date2->getTimestamp();
}


?>