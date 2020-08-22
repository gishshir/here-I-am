<?php

// This sends a persistent cookie that lasts a day.
session_start([
    'cookie_lifetime' => 86400,
    'gc_maxlifetime' => 86400
]);

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

    // Is the last access over 3 hour ago?
    if (time() > ($_SESSION['lastaccess'] + (3600 * 3)))
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
    
    //console.log ("creation d'une nouvelle session ".$_SERVER['REMOTE_ADDR']);
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

// TODO voir si on peut stocker User à la place
function storeCurrentUser (Utilisateur $user) : void {

    $_SESSION["userid"] = $user->get_id();
    $_SESSION["login"] = $user->get_login();
    $_SESSION["pseudo"] = $user->get_pseudo();
    $_SESSION["role"] = "user"; 
}
// retourne le user authentifié si existe
function getCurrentUserFromSession () : ?Utilisateur {
    
    if (isset($_SESSION["login"])) {
        
        $user = new Utilisateur();
        $user->set_id($_SESSION["userid"]);
        $user->set_login($_SESSION["login"]);
        $user->set_pseudo($_SESSION["pseudo"]);
        //$user->set_role($_SESSION["role"]); 
        return $user;
        
    } else {
        return null;
    }
    
}
/*
* retourne l'id de l'utilisateur de la session en cours
*/
function getCurrentUserId () :int {
     $user = getCurrentUserFromSession();
     return $user == null?-1:$user->get_id();
 }


?>