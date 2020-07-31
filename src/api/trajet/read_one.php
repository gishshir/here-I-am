<?php
require_once '../config/config.php';

// retourne un trajet de l'utilisateur courant
// si pas id retourne le dernier trajet si existe
// sinon retourne une chaine vide
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();

    if (isset($_GET["id"])) {
        // find trajet by id
        $resultAndEntity = findTrajetById((int)$_GET["id"]);
    } else {

        // dernier trajet de l'ami
        if (isset($_GET["idrelation"])){

            $resultAndEntity = findPersonByIdRelation($_GET["idrelation"]);
            if (!$resultAndEntity->is_error()) {

                $personne = $resultAndEntity->get_entity();

                //TODO s'assurer des droits pour voir ce trajet

                $resultAndEntity = findAmiLastTrajet($personne->get_id());
            } 

        }
        // dernier trajet de l'utilisateur
        else {
            
            $resultAndEntity = findLastTrajet();
        }
    }
    
    if (!$resultAndEntity->is_error()) {
        if ($resultAndEntity->get_entity()) {
            sendHttpEntityAndExit($resultAndEntity);
        } else {
            // pas de trajet trouvé
            $resultAndBoolean = buildResultAndBoolean("Pas de trajet trouvé!", false);
            sendHttpBooleanAndExit ($resultAndBoolean);
        }
    }
    

    //avec erreur
    sendHttpEntityAndExit($resultAndEntity);


}



?>