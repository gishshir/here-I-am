-- phpMyAdmin SQL Dump
-- version 3.4.11.1
-- http://www.phpmyadmin.net
--
-- Client: 50.31.138.79
-- Généré le: Lun 24 Août 2020 à 09:21
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
-- Contenu de la table `relation`
--

INSERT INTO `relation` (`id`, `person_a`, `person_b`, `etat`) VALUES
(6, 2, 3, 'open'),
(8, 1, 5, 'open'),
(11, 3, 4, 'closed'),
(25, 4, 15, 'open'),
(26, 4, 18, 'pending'),
(27, 5, 19, 'closed'),
(29, 15, 2, 'open'),
(30, 5, 17, 'pending'),
(31, 5, 18, 'pending'),
(32, 5, 2, 'closed'),
(33, 15, 3, 'open'),
(35, 15, 17, 'pending'),
(36, 15, 1, 'closed'),
(37, 16, 3, 'closed'),
(38, 16, 17, 'pending'),
(39, 16, 1, 'open'),
(42, 15, 18, 'pending'),
(43, 19, 16, 'pending'),
(45, 1, 18, 'pending'),
(46, 20, 18, 'pending'),
(48, 21, 18, 'pending'),
(49, 19, 17, 'open'),
(50, 22, 17, 'pending'),
(51, 32, 19, 'open'),
(52, 32, 21, 'open'),
(53, 32, 20, 'pending'),
(54, 21, 19, 'open'),
(55, 21, 2, 'open'),
(56, 15, 19, 'open');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
