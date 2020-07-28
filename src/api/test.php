<?php

require_once './shared/config.php';
include_once DIR_DAO.'dao.php';

//The original plaintext password.
/*$password = 'pwd5';
$passwordHashed = password_hash($password, PASSWORD_BCRYPT);
echo $passwordHashed;*/

//phpinfo();

unsetSession();
echo "unset session";

//echo "current user id: " .getCurrentUserId();
?>