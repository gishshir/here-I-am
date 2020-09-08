
<?php

require './config/header.php';


if (islocaldist()) {
$servername =  $_SERVER['SERVER_NAME'];
echo "server name: ".$servername;
	
}
echo "<h2>version ".phpversion()."</h2>";

// Affiche toutes les informations, comme le ferait INFO_ALL
phpinfo();

// Affiche uniquement le module d'information.
// phpinfo(8) fournirait les mêmes informations.
phpinfo(INFO_MODULES);

?>
