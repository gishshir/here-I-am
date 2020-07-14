-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 14 juil. 2020 à 14:17
-- Version du serveur :  10.4.11-MariaDB
-- Version de PHP : 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `hereiam`
--

-- --------------------------------------------------------

--
-- Structure de la table `person_rel`
--

CREATE TABLE `person_rel` (
  `personid` int(11) NOT NULL,
  `relationid` int(11) NOT NULL,
  `position` varchar(1) NOT NULL DEFAULT 'A' COMMENT 'Personne A ou B',
  `suivre` int(1) NOT NULL DEFAULT 0 COMMENT 'Indique que la personne souhaite suivre trajet de sa relation',
  `notifier` int(1) NOT NULL DEFAULT 0 COMMENT 'La personne accèpte d''envoyer les notifications à sa relation'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `person_rel`
--

INSERT INTO `person_rel` (`personid`, `relationid`, `position`, `suivre`, `notifier`) VALUES
(1, 5, 'B', 1, 0),
(1, 7, 'A', 1, 0),
(1, 8, 'A', 0, 0),
(2, 5, 'A', 0, 0),
(2, 6, 'A', 1, 0),
(3, 6, 'B', 0, 1),
(3, 10, 'A', 0, 0),
(3, 11, 'A', 0, 0),
(4, 7, 'B', 0, 0),
(4, 11, 'B', 0, 0),
(5, 8, 'B', 0, 0),
(5, 10, 'B', 0, 0);

--
-- Déclencheurs `person_rel`
--
DELIMITER $$
CREATE TRIGGER `after_update_personrel` AFTER UPDATE ON `person_rel` FOR EACH ROW BEGIN

IF (NEW.suivre != OLD.suivre) THEN
update relation

set 
a_suivi_b = case NEW.position
    WHEN 'A' THEN NEW.suivre ELSE a_suivi_b END,
b_suivi_A = case NEW.position
    WHEN 'B' THEN NEW.suivre ELSE b_suivi_a END

where id = OLD.relationid;

END IF;

IF (NEW.notifier != OLD.notifier) THEN
update relation

set 
a_notification_b = case NEW.position
    WHEN 'A' THEN NEW.notifier ELSE a_notification_b  END,
b_notification_a = case NEW.position
    WHEN 'B' THEN NEW.notifier ELSE b_notification_a END

where id = OLD.relationid;

END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `relation`
--

CREATE TABLE `relation` (
  `id` int(11) NOT NULL,
  `person_a` int(11) NOT NULL COMMENT 'personne A ayant pour ami personne B',
  `person_b` int(11) NOT NULL COMMENT 'personne B  étant l''ami de personne A ',
  `a_suivi_b` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'personne A souhaite suivre les déplacements de la personne B ',
  `a_notification_b` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'personne A accepte envoi notification pour personne B concernant sa situation géographique',
  `b_suivi_a` int(1) NOT NULL DEFAULT 0 COMMENT 'personne B souhaite suivre les déplacements de la personne A ',
  `b_notification_a` int(1) NOT NULL DEFAULT 0 COMMENT 'personne B accepte envoi notification pour personne A concernant sa situation géographique'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `relation`
--

INSERT INTO `relation` (`id`, `person_a`, `person_b`, `a_suivi_b`, `a_notification_b`, `b_suivi_a`, `b_notification_a`) VALUES
(5, 2, 1, 0, 0, 1, 0),
(6, 2, 3, 1, 0, 0, 1),
(7, 1, 4, 1, 0, 0, 0),
(8, 1, 5, 0, 0, 0, 0),
(10, 3, 5, 0, 0, 0, 0),
(11, 3, 4, 0, 0, 0, 0);

--
-- Déclencheurs `relation`
--
DELIMITER $$
CREATE TRIGGER `after_insert_relation` AFTER INSERT ON `relation` FOR EACH ROW BEGIN

INSERT INTO person_rel (personid, relationid) VALUES (NEW.person_a, NEW.id);

INSERT INTO person_rel (personid, relationid) VALUES (NEW.person_b, NEW.id);

END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_delete_relation` BEFORE DELETE ON `relation` FOR EACH ROW DELETE from person_rel
where relationid = OLD.id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `trajet`
--

CREATE TABLE `trajet` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL COMMENT 'id de l''initiateur du trajet',
  `starttime` int(10) NOT NULL DEFAULT 0 COMMENT 'timestamp début trajet en secondes',
  `endtime` int(10) NOT NULL DEFAULT -1 COMMENT 'timestamp fin trajet en secondes',
  `etat` varchar(20) NOT NULL DEFAULT 'Started' COMMENT 'Started, Ended, Pausing',
  `mean` varchar(20) NOT NULL DEFAULT 'Pied' COMMENT '"Pied", "Velo", "Moto", "Voiture", "Bus", "Train", "Avion", "Bateau"'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `trajet`
--

INSERT INTO `trajet` (`id`, `userid`, `starttime`, `endtime`, `etat`, `mean`) VALUES
(1, 1, 1588382988, 1588391220, 'Ended', 'Pied'),
(2, 1, 1591252320, 1591283643, 'Ended', 'Pied'),
(3, 1, 1591048838, 1594655198, 'Ended', 'Pied'),
(4, 1, 1594656161, 1594711739, 'Ended', 'Voiture'),
(5, 2, 1594656750, 1594656792, 'Ended', 'Voiture'),
(6, 2, 1594656812, 1594712198, 'Ended', 'Bus'),
(7, 1, 1594711643, 1594718301, 'Ended', 'Bus'),
(8, 1, 1594711664, 1594711988, 'Ended', 'Bus'),
(9, 1, 1594712000, 1594712091, 'Ended', 'Train'),
(10, 2, 1594712206, 1594713693, 'Ended', 'Moto'),
(11, 2, 1594713700, 1594718650, 'Ended', 'Velo'),
(12, 2, 1594718673, 1594718717, 'Ended', 'Pied'),
(13, 2, 1594718728, 1594719565, 'Ended', 'Bateau'),
(14, 2, 1594719632, 1594719656, 'Ended', 'Bus');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `login` varchar(60) NOT NULL,
  `password` varchar(30) NOT NULL,
  `pseudo` varchar(30) NOT NULL,
  `etat` varchar(10) NOT NULL DEFAULT 'Arret' COMMENT 'Arret, EnChemin, Pause'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `login`, `password`, `pseudo`, `etat`) VALUES
(1, 'login1', 'pwd1', 'Jojo les gros bras', 'Arret'),
(2, 'login2', 'pwd2', 'Fanfan la Tulipe', 'Arret'),
(3, 'login3', 'pwd3', 'Savate le vagabon', 'Arret'),
(4, 'login4', 'pwd4', 'La Belle au Bois dormant', 'Arret'),
(5, 'login5', 'pwd5', 'Petit Chaperon Rouge', 'Arret');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `person_rel`
--
ALTER TABLE `person_rel`
  ADD PRIMARY KEY (`personid`,`relationid`) USING BTREE,
  ADD KEY `person_rel_ibfk_2` (`relationid`);

--
-- Index pour la table `relation`
--
ALTER TABLE `relation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IND_PERSON_AB` (`person_a`,`person_b`) USING BTREE,
  ADD KEY `person_a` (`person_a`),
  ADD KEY `person_b` (`person_b`);

--
-- Index pour la table `trajet`
--
ALTER TABLE `trajet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IND_USER` (`userid`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IND_LOGIN` (`login`),
  ADD UNIQUE KEY `IND_PSEUDO` (`pseudo`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `relation`
--
ALTER TABLE `relation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `trajet`
--
ALTER TABLE `trajet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `person_rel`
--
ALTER TABLE `person_rel`
  ADD CONSTRAINT `person_rel_ibfk_1` FOREIGN KEY (`personid`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `person_rel_ibfk_2` FOREIGN KEY (`relationid`) REFERENCES `relation` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `relation`
--
ALTER TABLE `relation`
  ADD CONSTRAINT `relation_ibfk_1` FOREIGN KEY (`person_a`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `relation_ibfk_2` FOREIGN KEY (`person_b`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
