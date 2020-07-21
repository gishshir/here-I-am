<?php


/*
* Bean incluant les informations complète sur un compte utilisateur
*/
class AccountInfo  {

    // information sur l'utilisateur'
    private Utilisateur $utilisateur;

    // information sur le compte cette personne
    private Account $account;


    function get_utilisateur () : Utilisateur {
        return $this->utilisateur
;
    }
    function set_utilisateur (Utilisateur $utilisateur) {
        $this->utilisateur = $utilisateur;
    }
    

    function get_account () : Account {
        return $this->account;
    }
    function set_account (Account $account) {
        $this->account = $account;
    }

    function toArray() : array {
        $info = array(
            "utilisateur"=>$this->utilisateur->toArray(),
            "account"=>$this->account->toArray()
        );
        return $info;
    }
}


?>