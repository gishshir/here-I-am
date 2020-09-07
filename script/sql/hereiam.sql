-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 28 juil. 2020 à 13:05
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
-- Structure de la table `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL COMMENT 'id de utilisateur',
  `email` varchar(40) NOT NULL,
  `etat` varchar(10) NOT NULL DEFAULT 'waiting' COMMENT 'open, close, waiting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `account`
--

INSERT INTO `account` (`id`, `userid`, `email`, `etat`) VALUES
(1, 1, 'login1@site.fr', 'open'),
(2, 2, 'login2@site.fr', 'open'),
(3, 3, 'login3@site.fr', 'open'),
(4, 4, 'login4@site.fr', 'waiting'),
(5, 5, 'login5@site.fr', 'close'),
(13, 15, 'fifi@fifi.fr', 'waiting'),
(14, 16, 'hophop@hophpop.fr', 'waiting'),
(15, 17, 'fripouille@gmail.com', 'waiting'),
(16, 18, 'titi@titi.fr', 'waiting'),
(17, 19, 'coco@coco.fr', 'waiting');

-- --------------------------------------------------------

--
-- Structure de la table `person_rel`
--

CREATE TABLE `person_rel` (
  `personid` int(11) NOT NULL,
  `relationid` int(11) NOT NULL,
  `position` varchar(1) NOT NULL DEFAULT 'A' COMMENT 'Personne A ou B',
  `suivre` int(1) NOT NULL DEFAULT 0 COMMENT 'Indique que la personne souhaite suivre trajet de sa relation',
  `notifier` int(1) NOT NULL DEFAULT 0 COMMENT 'La personne accèpte d''envoyer les notifications à sa relation',
  `action` varchar(20) NOT NULL DEFAULT 'none' COMMENT 'none | invitation| refusee | acceptee'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `person_rel`
--

INSERT INTO `person_rel` (`personid`, `relationid`, `position`, `suivre`, `notifier`, `action`) VALUES
(1, 5, 'B', 1, 1, 'acceptee'),
(1, 8, 'A', 1, 1, 'invitation'),
(1, 36, 'B', 0, 0, 'none'),
(1, 39, 'B', 0, 0, 'none'),
(2, 5, 'A', 1, 1, 'invitation'),
(2, 6, 'A', 1, 0, 'invitation'),
(2, 29, 'B', 0, 0, 'acceptee'),
(2, 32, 'B', 0, 0, 'refusee'),
(3, 6, 'B', 0, 0, 'none'),
(3, 11, 'A', 0, 1, 'invitation'),
(3, 33, 'B', 0, 0, 'none'),
(3, 37, 'B', 0, 0, 'none'),
(4, 11, 'B', 0, 1, 'refusee'),
(4, 25, 'A', 0, 1, 'invitation'),
(4, 26, 'A', 0, 0, 'invitation'),
(5, 8, 'B', 1, 1, 'acceptee'),
(5, 27, 'A', 0, 0, 'invitation'),
(5, 30, 'A', 0, 0, 'invitation'),
(5, 31, 'A', 0, 0, 'invitation'),
(5, 32, 'A', 0, 0, 'invitation'),
(15, 25, 'B', 0, 0, 'acceptee'),
(15, 29, 'A', 0, 0, 'invitation'),
(15, 33, 'A', 0, 0, 'invitation'),
(15, 35, 'A', 0, 0, 'invitation'),
(15, 36, 'A', 0, 0, 'invitation'),
(15, 42, 'A', 0, 0, 'invitation'),
(16, 37, 'A', 0, 0, 'invitation'),
(16, 38, 'A', 0, 0, 'invitation'),
(16, 39, 'A', 0, 0, 'invitation'),
(17, 30, 'B', 0, 0, 'none'),
(17, 35, 'B', 0, 0, 'none'),
(17, 38, 'B', 0, 0, 'none'),
(18, 26, 'B', 0, 0, 'none'),
(18, 31, 'B', 0, 0, 'none'),
(18, 42, 'B', 0, 0, 'none'),
(19, 27, 'B', 0, 0, 'refusee');

-- --------------------------------------------------------

--
-- Structure de la table `relation`
--

CREATE TABLE `relation` (
  `id` int(11) NOT NULL,
  `person_a` int(11) NOT NULL COMMENT 'personne A ayant pour ami personne B',
  `person_b` int(11) NOT NULL COMMENT 'personne B  étant l''ami de personne A ',
  `etat` varchar(30) NOT NULL DEFAULT 'pending' COMMENT 'pending| open | closed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `relation`
--

INSERT INTO `relation` (`id`, `person_a`, `person_b`, `etat`) VALUES
(5, 2, 1, 'open'),
(6, 2, 3, 'pending'),
(8, 1, 5, 'open'),
(11, 3, 4, 'closed'),
(25, 4, 15, 'open'),
(26, 4, 18, 'pending'),
(27, 5, 19, 'closed'),
(29, 15, 2, 'open'),
(30, 5, 17, 'pending'),
(31, 5, 18, 'pending'),
(32, 5, 2, 'closed'),
(33, 15, 3, 'pending'),
(35, 15, 17, 'pending'),
(36, 15, 1, 'pending'),
(37, 16, 3, 'pending'),
(38, 16, 17, 'pending'),
(39, 16, 1, 'pending'),
(42, 15, 18, 'pending');

--
-- Déclencheurs `relation`
--
DELIMITER $$
CREATE TRIGGER `after_insert_relation` AFTER INSERT ON `relation` FOR EACH ROW BEGIN

INSERT INTO person_rel (personid, relationid, position) VALUES (NEW.person_a, NEW.id, 'A');

INSERT INTO person_rel (personid, relationid, position) VALUES (NEW.person_b, NEW.id, 'B');

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
(7, 1, 1594711643, 1594718301, 'Ended', 'Bus'),
(8, 1, 1594711664, 1594711988, 'Ended', 'Bus'),
(9, 1, 1594712000, 1594712091, 'Ended', 'Train'),
(10, 2, 1594712206, 1594713693, 'Ended', 'Moto'),
(11, 2, 1594713700, 1594718650, 'Ended', 'Velo'),
(12, 2, 1594718673, 1594718717, 'Ended', 'Pied'),
(13, 2, 1594718728, 1594719565, 'Ended', 'Bateau'),
(14, 2, 1594719632, 1594719656, 'Ended', 'Bus'),
(16, 1, 1594738996, 1594739001, 'Ended', 'Voiture'),
(18, 1, 1594739890, 1595256019, 'Ended', 'Moto'),
(19, 4, 1594741034, 1595499546, 'Ended', 'Voiture'),
(20, 2, 1594741217, 1595256047, 'Ended', 'Moto'),
(21, 2, 1595256055, -1, 'Pausing', 'Avion'),
(22, 1, 1595256070, 1595517619, 'Ended', 'Velo'),
(23, 3, 1595494481, 1595670596, 'Ended', 'Bus'),
(24, 4, 1595499559, 1595689889, 'Ended', 'Velo'),
(25, 5, 1595510214, -1, 'Started', 'Bateau'),
(26, 16, 1595512393, 1595514303, 'Ended', 'Voiture'),
(27, 16, 1595514400, 1595860260, 'Ended', 'Moto'),
(28, 1, 1595517636, 1595600817, 'Ended', 'Bateau'),
(29, 1, 1595600824, 1595669472, 'Ended', 'Train'),
(30, -1, 1595669516, 1595669557, 'Ended', 'Velo'),
(31, 1, 1595669813, -1, 'Started', 'Moto'),
(32, 3, 1595670611, -1, 'Started', 'Pied'),
(33, 4, 1595773581, 1595925338, 'Ended', 'Pied'),
(34, 16, 1595860439, -1, 'Started', 'Bus'),
(35, -1, 1595917544, -1, 'Started', 'Bus'),
(36, 4, 1595925349, -1, 'Started', 'Avion');

--
-- Déclencheurs `trajet`
--
DELIMITER $$
CREATE TRIGGER `after_insert_trajet` AFTER INSERT ON `trajet` FOR EACH ROW UPDATE utilisateur 
SET etat = 'EnChemin'
WHERE id = NEW.userid
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_trajet` AFTER UPDATE ON `trajet` FOR EACH ROW UPDATE utilisateur 
SET etat = 
 CASE NEW.etat
 WHEN 'Started' THEN 'EnChemin' 
 WHEN 'Pausing' THEN 'Pause'
 WHEN 'Ended' THEN 'Arret'
 END 
WHERE id = NEW.userid
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `login` varchar(30) NOT NULL,
  `password` varchar(60) NOT NULL,
  `pseudo` varchar(30) NOT NULL,
  `etat` varchar(10) NOT NULL DEFAULT 'Arret' COMMENT 'Arret, EnChemin, Pause'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `login`, `password`, `pseudo`, `etat`) VALUES
(1, 'login1', '$2y$10$9u8Rq95M/j8rsYGXc4mMq.Ftyvq8J7LfPuq6rLkjdql6ddEegNaz6', 'Jojo les gros bras', 'EnChemin'),
(2, 'login2', '$2y$10$MJNtcJUK.iq9Crz0ZSTQE.QVrvAH8BUFVviRfBGJSA7sckrTXYUN.', 'Fanfan la Tulipe', 'Pause'),
(3, 'login3', '$2y$10$b/QNlKdDeWkVy.LMA3U/NeUk2APKLHfO8omo2CUIq6WSpBBfJN0/e', 'Savate le vagabon', 'EnChemin'),
(4, 'login4', '$2y$10$pD/1/UKIt/BvBjLrJGRLCewYYqqgK9WPj5SjFl8RF3dPhfoSdA3Ou', 'La Belle au Bois dormant', 'EnChemin'),
(5, 'login5', '$2y$10$Nm6/WG96MzJ/cVcZMA3TZOQO3YovWMSdMQstWlgt7oXCjkPP2v8du', 'Petit Chaperon Rouge', 'EnChemin'),
(15, 'login6', '$2y$10$9Fk8r.NTp3vNkir0AkJ8YO6Byf5l7IJXMLoM6O3XwUpp76XJGWbQ2', 'Fifi la ficelle', 'Arret'),
(16, 'login7', '$2y$10$VhC/HL2qPBhEbfIxz69CLejlJTwpNNilyhQ2Mrr9h5b8aDukeJsh2', 'Hophop le rougegorge', 'EnChemin'),
(17, 'login8', '$2y$10$9nmKvLS1AV05ROkMlwfKEuajqBCN1g2rorDQ.KeI3YOsLWzopmmbC', 'Fripouille la veine', 'Arret'),
(18, 'login9', '$2y$10$NkqRBKmTaHjAV2TYmYkz1.W3M1/qds6Z4PbYtPcqchW0pIvIHSUxS', 'Titi la combine', 'Arret'),
(19, 'toto', '$2y$10$5t6aFfJyteyJ7Ss0FgBuROlSZHB0fTpuSn4zI/h/ouY9Q9IKUH6Em', 'coco la poulette', 'Arret');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IND_USERID` (`userid`),
  ADD UNIQUE KEY `IND_EMAIL` (`email`) USING BTREE;

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
-- AUTO_INCREMENT pour la table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `relation`
--
ALTER TABLE `relation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT pour la table `trajet`
--
ALTER TABLE `trajet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE;

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
