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
-- Contenu de la table `account`
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
(17, 19, 'coco@coco.fr', 'waiting'),
(18, 20, 'rififi@fifi.fr', 'waiting'),
(19, 21, 'mimi.line@tarkweb.fr', 'waiting'),
(20, 22, 'roxie@roxie.fr', 'waiting'),
(30, 32, 'turnstone@tarkweb.fr', 'waiting');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
