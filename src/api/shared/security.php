<?php
    

// pour les textes contenant des balises html qu'on doit garder
// on supprime la partie <script> si existe
function xssPreventScript(array $tab, string $key) {

    $value = isset ($tab[$key])?$tab[$key]:null;
    if ($value != null) {     
        $value =  str_replace ("<script>", "*script*", $value);
        $value =  str_replace ("</script>", "*/script*", $value);
        return $value;
    }  else {
        return $value;
    }    
}
function xssPreventFromArray (array $tab, string $key): string {
    
    $value = isset ($tab[$key])?$tab[$key]:null;
    if ($value != null) {     
        return htmlspecialchars($value,ENT_NOQUOTES , 'UTF-8');        
    } else {
        return $value;
    }    
}
function xssPrevent (string $value): string {
    if (isset($value) &&$value != null) {     
        return htmlspecialchars($value,ENT_NOQUOTES , 'UTF-8');        
    } else {
        return $null;
    }
}
function getFromPost (string $postKey):?string {
    
    return isset ($_POST[$postKey])?$_POST[$postKey]:null;
}

// protection contre XSS: Cross-site scripting
function xssPreventFromPost (string $postKey):?string {
    
    return xssPreventFromArray ($_POST, $postKey);    
}
function xssPreventFromPut (string $putKey):?string {
    
    return xssPreventFromArray ($_PUT, $putKey);    
}
function xssPreventFromGet (string $getKey):?string {
    
    return xssPreventFromArray ($_GET, $getKey);    
}     
      
?>