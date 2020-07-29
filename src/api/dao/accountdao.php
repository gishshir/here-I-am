<?php

//========================================================================================
/*
* Creation d'un nouvel utilisateur et de son compte
* retour d'un AccountInfo
*/
function createUtilisateurAndAccount(Utilisateur $utilisateur, string $email) : ResultAndEntity {

    $con = connectMaBase();
    _beginTransaction($con);

    $resultAndEntity; $utilisateur; $account;

    try {
        $resultAndEntity = _createUtilisateur($con, $utilisateur);
        if (!$resultAndEntity->is_error()) {

            $utilisateur = $resultAndEntity->get_entity();
            $resultAndEntity = _createAccount($con, $utilisateur->get_id(), $email);

            if (!$resultAndEntity->is_error()) {

                // on masque le password
                $utilisateur->set_password("****");

                $account = $resultAndEntity->get_entity();
                $accountInfo = new AccountInfo();
                $accountInfo->set_utilisateur($utilisateur);
                $accountInfo->set_account($account);

                $resultAndEntity = buildResultAndEntity("AccountInfo constitué!", $accountInfo);

                _commitTransaction($con);
            } else {
                throw new Exception ($resultAndEntity->get_msg());
            }
        }     

    }
    catch (Exception $e) {
        $resultAndEntity = buildResultAndEntityError($e->getMessage());
        _rollbackTransaction($con);
    }
    finally {
        _closeAll(null, $con);
    }

    return $resultAndEntity;
}

/*
* Creation d'un nouvel utilisateur
*/
function _createUtilisateur (mysqli $con, Utilisateur $user) :ResultAndEntity {

    $resultAndEntity; $stmt;
   
    $req_createAccount = "insert INTO utilisateur(login, password, pseudo) VALUES (?, ?, ?)";

    try {

        $stmt = _prepare ($con, $req_createAccount);
        if ($stmt->bind_param("sss", $login, $password, $pseudo) ) {

            $login = $user->get_login();
            $password = password_hash($user->get_password(),PASSWORD_BCRYPT);
            $pseudo = $user->get_pseudo();

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            if ($nbligneImpactees == 1) {
                $resultAndEntity = _findUtilisateurByLogin($con, $login);
            } else {
                throw new Exception("Pas de modification!!");    
            }

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $resultAndEntity = buildResultAndEntityError($e->getMessage());
    }
    finally {
        _closeAll($stmt, null);
    }

    return $resultAndEntity;
}
/*
* Creation d'un compte pour cet utilisateur
*/
function _createAccount (mysqli $con, int $userid, string $email) :ResultAndEntity {

    $resultAndEntity; $stmt;
   
    $req_createAccount = "insert INTO account(userid, email) VALUES (?, ?)";

    try {

        $stmt = _prepare ($con, $req_createAccount);
        if ($stmt->bind_param("is", $userid, $email) ) {

            $stmt = _execute ($stmt);
            
            $nbligneImpactees = $stmt->affected_rows ;
            if ($nbligneImpactees == 1) {
                $resultAndEntity = _findAccountByUserId($con, $userid);
            } else {
                throw new Exception("Pas de modification!!");    
            }

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }
    }
    catch (Exception $e) {
        $resultAndEntity = buildResultAndEntityError($e->getMessage());
    }
    finally {
        _closeAll($stmt, null);
    }

    return $resultAndEntity;
}

function _findAccountByUserId (mysqli $con, int $userid) : ResultAndEntity {

    
    $resultAndEntity; $stmt;
    $sql_findAccountByUserId = "select id, email, etat FROM  account WHERE userid = ?";

    try {

        $stmt = _prepare ($con, $sql_findAccountByUserId);
        
        if ($stmt->bind_param("i", $userid)) {

            $stmt = _execute($stmt);

            $utilisateur = null;
            $stmt->bind_result ($resId, $resEmail, $resEtat);
                   
            // fetch row ..............
            if ($stmt->fetch()) {
              $account = _buildAccount ($resId, $userid, $resEmail, $resEtat);
              $resultAndEntity = buildResultAndEntity("Account trouvé!", $account);

            }  else {
                $resultAndEntity = buildResultAndEntity("Pas de compte trouvé!", null);
            }            

        } else {
            throw new Exception( _sqlErrorMessageBind($stmt));
        }

    }
    catch (Exception $e) {
        $resultAndEntity = buildResultAndEntityError($e->getMessage());
    }
    finally {
        _closeAll($stmt, null);
    }

    return $resultAndEntity;
    
}

function _buildAccount (int $id, int $userid, string $email, string $etat) :Account {

    $account = new Account();
    $account->set_id($id);
    $account->set_userid($userid);
    $account->set_email($email);
    $account->set_etat($etat);

    return $account;
}



?>