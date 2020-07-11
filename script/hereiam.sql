-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 11 juil. 2020 à 11:25
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
  `relationid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `person_rel`
--

INSERT INTO `person_rel` (`personid`, `relationid`) VALUES
(1, 5),
(1, 7),
(1, 8),
(2, 5),
(2, 6),
(3, 6),
(3, 10),
(3, 11),
(4, 7),
(4, 11),
(5, 8),
(5, 10);

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
(5, 2, 1, 0, 0, 0, 0),
(6, 2, 3, 0, 0, 0, 0),
(7, 1, 4, 0, 0, 0, 0),
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
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `login` varchar(60) NOT NULL,
  `password` varchar(30) NOT NULL,
  `pseudo` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `login`, `password`, `pseudo`) VALUES
(1, 'login1', 'pwd1', 'Jojo les gros bras'),
(2, 'login2', 'pwd2', 'Fanfan la Tulipe'),
(3, 'login3', 'pwd3', 'Savate le vagabon'),
(4, 'login4', 'pwd4', 'La Belle au Bois dormant'),
(5, 'login5', 'pwd5', 'Petit Chaperon Rouge');

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
