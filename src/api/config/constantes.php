<?php

// sur dist et en remote --------------------------------
//define('DIR_BASE',  $_SERVER['DOCUMENT_ROOT'].'/api/');
//define('DIR_GPX',  $_SERVER['DOCUMENT_ROOT'].'/gpx_files/');

// localhost ----------------------------------------
define('DIR_BASE',  $_SERVER['DOCUMENT_ROOT'].'/');
define('DIR_GPX',  dirname(DIR_BASE, 2)."/gpx_files/");

define('DIR_DAO',    DIR_BASE . 'dao/');
define('DIR_SHARED',    DIR_BASE . 'shared/');
define('DIR_ENTITIES',    DIR_BASE . 'entities/');


?>