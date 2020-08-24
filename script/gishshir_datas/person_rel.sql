-- phpMyAdmin SQL Dump
-- version 3.4.11.1
-- http://www.phpmyadmin.net
--
-- Client: 50.31.138.79
-- Généré le: Lun 24 Août 2020 à 09:20
-- Version du serveur: 5.5.28
-- Version de PHP: 7.2.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `gishshir_hereiam`
--

--
-- Contenu de la table `person_rel`
--

INSERT INTO `person_rel` (`personid`, `relationid`, `position`, `suivre`, `notifier`, `action`) VALUES
(1, 8, 'A', 1, 1, 'invitation'),
(1, 36, 'B', 0, 0, 'refusee'),
(1, 39, 'B', 1, 1, 'acceptee'),
(1, 45, 'A', 0, 0, 'invitation'),
(2, 6, 'A', 1, 0, 'invitation'),
(2, 29, 'B', 1, 1, 'acceptee'),
(2, 32, 'B', 0, 0, 'refusee'),
(2, 55, 'B', 0, 0, 'acceptee'),
(3, 6, 'B', 1, 0, 'acceptee'),
(3, 11, 'A', 0, 1, 'invitation'),
(3, 33, 'B', 0, 1, 'acceptee'),
(3, 37, 'B', 0, 0, 'refusee'),
(4, 11, 'B', 0, 1, 'refusee'),
(4, 25, 'A', 0, 1, 'invitation'),
(4, 26, 'A', 0, 0, 'invitation'),
(5, 8, 'B', 1, 1, 'acceptee'),
(5, 27, 'A', 0, 0, 'invitation'),
(5, 30, 'A', 0, 0, 'invitation'),
(5, 31, 'A', 0, 0, 'invitation'),
(5, 32, 'A', 0, 0, 'invitation'),
(15, 25, 'B', 1, 1, 'acceptee'),
(15, 29, 'A', 1, 1, 'invitation'),
(15, 33, 'A', 0, 0, 'invitation'),
(15, 35, 'A', 0, 0, 'invitation'),
(15, 36, 'A', 0, 0, 'invitation'),
(15, 42, 'A', 0, 0, 'invitation'),
(15, 56, 'A', 1, 0, 'invitation'),
(16, 37, 'A', 0, 0, 'invitation'),
(16, 38, 'A', 0, 0, 'invitation'),
(16, 39, 'A', 1, 1, 'invitation'),
(16, 43, 'B', 0, 0, 'none'),
(17, 30, 'B', 0, 0, 'none'),
(17, 35, 'B', 0, 0, 'none'),
(17, 38, 'B', 0, 0, 'none'),
(17, 49, 'B', 0, 1, 'acceptee'),
(17, 50, 'B', 0, 0, 'none'),
(18, 26, 'B', 0, 0, 'none'),
(18, 31, 'B', 0, 0, 'none'),
(18, 42, 'B', 0, 0, 'none'),
(18, 45, 'B', 0, 0, 'none'),
(18, 46, 'B', 0, 0, 'none'),
(18, 48, 'B', 0, 0, 'none'),
(19, 27, 'B', 0, 0, 'refusee'),
(19, 43, 'A', 0, 0, 'invitation'),
(19, 49, 'A', 1, 0, 'invitation'),
(19, 51, 'B', 1, 0, 'acceptee'),
(19, 54, 'B', 1, 1, 'acceptee'),
(19, 56, 'B', 1, 0, 'acceptee'),
(20, 46, 'A', 0, 0, 'invitation'),
(20, 53, 'B', 0, 0, 'none'),
(21, 48, 'A', 0, 0, 'invitation'),
(21, 52, 'B', 0, 0, 'acceptee'),
(21, 54, 'A', 1, 1, 'invitation'),
(21, 55, 'A', 0, 0, 'invitation'),
(22, 50, 'A', 0, 0, 'invitation'),
(32, 51, 'A', 1, 1, 'invitation'),
(32, 52, 'A', 1, 1, 'invitation'),
(32, 53, 'A', 0, 0, 'invitation');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
