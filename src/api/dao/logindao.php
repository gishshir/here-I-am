<?php

include_once DIR_DAO.'dao.php';

function existUtilisateurWithLogin (string $login) : ResultAndBoolean {

    
    $sql_countUtilisateurByLogin = "select count(*) as total FROM utilisateur where LOWER(login) = ?";
    return _existUtilisateurWithValue($sql_countUtilisateurByLogin, strtolower($login), "login exists: ");
}

function existUtilisateurWithPseudo (string $pseudo) : ResultAndBoolean {

    
    $sql_countUtilisateurByLogin = "select count(*) as total FROM utilisateur where LOWER(pseudo) = ?";
    return _existUtilisateurWithValue($sql_countUtilisateurByLogin, strtolower($pseudo), "pseudo exists: ");
}

function _existUtilisateurWithValue (string $sql, string $value, string $message) : ResultAndBoolean {

    $con = connectMaBase();
    $resultAndBoolean; $stmt;

    try {

        $stmt = _prepare ($con, $sql);
        
        if ($stmt->bind_param("s", $value)) {

            $stmt = _execute($stmt);

            $result = false;
            $stmt->bind_result ($resCount);
                   
            // fetch row .............
            $stmt->fetch();

            $result =  ((int)$resCount) > 0;
            $resultAndBoolean = buildResultAndBoolean($message.$result, $result);

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }

    }
    catch (Exception $e) {
        $resultAndBoolean = buildResultAndBooleanError($e->getMessage());
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $resultAndBoolean;

}

function findUtilisateurByLogin (string $login) : ResultAndEntity {

    $con = connectMaBase();
    $resultAndEntity; $stmt;
    $sql_findUtilisateurByLogin = "select id, login, password, pseudo FROM  utilisateur WHERE login = ?";

    try {

        $stmt = _prepare ($con, $sql_findUtilisateurByLogin);
        
        if ($stmt->bind_param("s", $login)) {

            $stmt = _execute($stmt);

            $utilisateur = null;
            $stmt->bind_result ($resId, $resLogin, $resPassword, $resPseudo);
                   
            // fetch row ..............
            if ($stmt->fetch()) {
              $utilisateur = _buildUtilisateur ($resId, $resLogin, $resPassword, $resPseudo);
              $resultAndEntity = buildResultAndEntity("Utilisateur trouvé!", $utilisateur);

            }  else {
                $resultAndEntity = buildResultAndEntity("Pas de utilisateur trouvé!", null);
            }            

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }

    }
    catch (Exception $e) {
        $resultAndEntity = buildResultAndEntityError($e->getMessage());
    }
    finally {
        _closeAll($stmt, $con);
    }

    return $resultAndEntity;
    
}

function _buildUtilisateur (int $id, string $login, string $password, string $pseudo) {

    $utilisateur = new Utilisateur();

    $utilisateur->set_id($id);
    $utilisateur->set_login($login);
    $utilisateur->set_password($password);
    $utilisateur->set_pseudo($pseudo);

    return $utilisateur;
}

?>