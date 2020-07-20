<?php

require './dao/dao.php';

//The original plaintext password.
/*$password = 'pwd5';
$passwordHashed = password_hash($password, PASSWORD_BCRYPT);
echo $passwordHashed;*/

//phpinfo();

echo "current user id: " .getCurrentUserId();
?>