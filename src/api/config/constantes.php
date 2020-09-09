<?php

$localdev = (bool) islocaldev();
if ($localdev) {
error_log("localdev:".$localdev);
}
// sur dist et en remote --------------------------------
$dirbase = $localdev?$_SERVER['DOCUMENT_ROOT'].'/': $_SERVER['DOCUMENT_ROOT'].'/api/';
//echo "dirbase: ".$dirbase;
define('DIR_BASE', $dirbase);

$dirgpx = $localdev?dirname(DIR_BASE, 2)."/gpx_files/": $_SERVER['DOCUMENT_ROOT'].'/gpx_files/';
define('DIR_GPX',  $dirgpx);

define('DIR_DAO',    DIR_BASE . 'dao/');
define('DIR_SHARED',    DIR_BASE . 'shared/');
define('DIR_ENTITIES',    DIR_BASE . 'entities/');

?>