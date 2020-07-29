<?php
require_once '../config.php';

// liste des trajets de l'utilisateur couran
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    verifyUserAuthentifie();
    
    $resultAndDatas = displayListTrajets();
    sendHttpDatasAndExit($resultAndDatas);


}



?>