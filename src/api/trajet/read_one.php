<?php
require_once '../dao/trajetdao.php';



// liste des trajets de l'utilisateur couran
if($_SERVER["REQUEST_METHOD"] == "GET")  {

    $resultAndEntity = findLastTrajet();
    sendHttpEntityAndExit($resultAndEntity);


}



?>