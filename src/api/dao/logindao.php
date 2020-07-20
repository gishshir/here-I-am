<?php

require_once 'dao.php';
require_once '../entities/utilisateur.php';

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