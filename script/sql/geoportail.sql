-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 07 sep. 2020 à 16:43
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
-- Structure de la table `geoportail`
--

CREATE TABLE `geoportail` (
  `id` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `trajetid` int(11) NOT NULL,
  `endtime` int(11) NOT NULL COMMENT 'timestamp maxi de validite du token',
  `description` varchar(100) NOT NULL,
  `gpxfile` varchar(20) NOT NULL COMMENT 'fichier gpx contenant les points du trajet',
  `center_lat` varchar(20) NOT NULL DEFAULT '0',
  `center_long` varchar(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `geoportail`
--
ALTER TABLE `geoportail`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IND_TOKEN` (`token`) USING BTREE,
  ADD KEY `geoportail_ibfk_1` (`trajetid`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `geoportail`
--
ALTER TABLE `geoportail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `geoportail`
--
ALTER TABLE `geoportail`
  ADD CONSTRAINT `geoportail_ibfk_1` FOREIGN KEY (`trajetid`) REFERENCES `trajet` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
