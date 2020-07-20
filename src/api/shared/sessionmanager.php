<?php

session_start();

// session déjà ouverte. 
// vérification que le client est toujours le même...
// sinon on supprime la sesion
if (isset($_SESSION["ipaddress"])) {

    // Does IP Address match?
    if ($_SERVER['REMOTE_ADDR'] != $_SESSION['ipaddress'])
    {
        unsetSession();
    }

    // Does user agent match?
    if ($_SERVER['HTTP_USER_AGENT'] != $_SESSION['useragent'])
    {
      unsetSession();
    }

    // Is the last access over an hour ago?
    if (time() > ($_SESSION['lastaccess'] + 3600))
    {
        unsetSession();
        
    } else {
        $_SESSION['lastaccess'] = time();
    }

} 

// creation d'une nouvelle session
// on memorise les paramètres du client
// pour éviter le Session Hijacking
else {
    
    $_SESSION['ipadress'] = $_SERVER['REMOTE_ADDR'];
    $_SESSION['useragent'] = $_SERVER['HTTP_USER_AGENT'];
    $_SESSION['lastaccess'] = time();
}

function unsetSession () {
    
    // remove all session variables
    session_unset();

    // destroy the session
    session_destroy(); 
}

?>