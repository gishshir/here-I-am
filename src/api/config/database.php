<?php
 
 require 'config.php';
 require '../shared/tools.php';
 require '../entities/ami.php';

 $listAmis = getListeAmis();
 

 function getListeAmis () {

    if (empty ($listAmis)){
    
        $listAmis = array();
        error_log ("remplissage de la liste d'amis");
   
        // on construit la liste d'Ami
        array_push($listAmis, new Ami(1, "JoJo les gros bras", "Arret", false));
        array_push($listAmis, new Ami(2, "Fanfan la Tulipe", "EnChemin", true));
        array_push($listAmis, new Ami(3, "Savate le vagabon", "Arret", false));
        array_push($listAmis, new Ami(4, "La Belle au bois dormant", "EnChemin", true));
        array_push($listAmis, new Ami(5, "Petit chaperon rouge", "Pause", false));

    }
    return $listAmis;
 }

?>