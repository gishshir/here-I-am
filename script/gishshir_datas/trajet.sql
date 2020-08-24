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
-- Contenu de la table `trajet`
--

INSERT INTO `trajet` (`id`, `userid`, `starttime`, `endtime`, `etat`, `mean`) VALUES
(2, 1, 1591252320, 1591283643, 'Ended', 'Pied'),
(5, 2, 1594656750, 1594656792, 'Ended', 'Voiture'),
(9, 1, 1594712000, 1594712091, 'Ended', 'Train'),
(12, 2, 1594718673, 1594718717, 'Ended', 'Pied'),
(13, 2, 1594718728, 1594719565, 'Ended', 'Bateau'),
(16, 1, 1594738996, 1594739001, 'Ended', 'Voiture'),
(18, 1, 1594739890, 1595256019, 'Ended', 'Moto'),
(19, 4, 1594741034, 1595499546, 'Ended', 'Voiture'),
(20, 2, 1594741217, 1595256047, 'Ended', 'Moto'),
(21, 2, 1595256055, 1596201039, 'Ended', 'Avion'),
(22, 1, 1595256070, 1595517619, 'Ended', 'Velo'),
(23, 3, 1595494481, 1595670596, 'Ended', 'Bus'),
(24, 4, 1595499559, 1595689889, 'Ended', 'Velo'),
(25, 5, 1595510214, -1, 'Started', 'Bateau'),
(26, 16, 1595512393, 1595514303, 'Ended', 'Voiture'),
(27, 16, 1595514400, 1595860260, 'Ended', 'Moto'),
(28, 1, 1595517636, 1595600817, 'Ended', 'Bateau'),
(29, 1, 1595600824, 1595669472, 'Ended', 'Train'),
(30, -1, 1595669516, 1595669557, 'Ended', 'Velo'),
(31, 1, 1595669813, 1596032085, 'Ended', 'Moto'),
(32, 3, 1595670611, 1597253342, 'Ended', 'Pied'),
(33, 4, 1595773581, 1595925338, 'Ended', 'Pied'),
(34, 16, 1595860439, 1596197382, 'Ended', 'Bus'),
(35, -1, 1595917544, -1, 'Started', 'Bus'),
(36, 4, 1595925349, -1, 'Pausing', 'Avion'),
(38, 1, 1596032103, 1596200967, 'Ended', 'Bus'),
(39, 20, 1596032618, -1, 'Started', 'Pied'),
(45, 22, 1596126487, -1, 'Started', 'Velo'),
(47, 1, 1596200979, 1597254545, 'Ended', 'Train'),
(53, 19, 1596259741, 1596262793, 'Ended', 'Velo'),
(55, 19, 1596265172, 1596267761, 'Ended', 'Velo'),
(57, 15, 1596289668, 1596361409, 'Ended', 'Moto'),
(58, 17, 1596295972, 1597501770, 'Ended', 'Velo'),
(62, 15, 1596361428, 1597334282, 'Ended', 'Train'),
(66, 19, 1596469988, 1596471740, 'Ended', 'Pied'),
(67, 19, 1596523722, 1596529639, 'Ended', 'Voiture'),
(68, 19, 1596610005, 1596619862, 'Ended', 'Velo'),
(69, 19, 1596692081, 1596700063, 'Ended', 'Pied'),
(71, 21, 1596861090, 1596868219, 'Ended', 'Velo'),
(72, 19, 1596863518, 1596866819, 'Ended', 'Velo'),
(73, 19, 1596868865, 1596872918, 'Ended', 'Velo'),
(74, 21, 1597122582, 1597163148, 'Ended', 'Voiture'),
(75, 19, 1597126800, 1597130759, 'Ended', 'Pied'),
(76, 19, 1597132264, 1597134573, 'Ended', 'Pied'),
(77, 19, 1597210311, 1597225681, 'Ended', 'Velo'),
(78, 3, 1597253367, 1597663761, 'Ended', 'Velo'),
(79, 1, 1597254562, 1597254628, 'Ended', 'Velo'),
(80, 15, 1597334448, -1, 'Started', 'Moto'),
(81, 19, 1597391039, 1597392539, 'Ended', 'Voiture'),
(82, 19, 1597472350, 1597480423, 'Ended', 'Velo'),
(85, 18, 1597505385, 1597505941, 'Ended', 'Voiture'),
(86, 2, 1597587721, -1, 'Started', 'Moto'),
(87, 21, 1597726948, 1597736945, 'Ended', 'Velo'),
(88, 19, 1597734913, 1597740752, 'Ended', 'Pied'),
(89, 19, 1597813880, 1597816828, 'Ended', 'Velo'),
(90, 21, 1597814927, 1597819772, 'Ended', 'Voiture'),
(91, 19, 1597818608, 1597822480, 'Ended', 'Velo'),
(92, 19, 1597895822, 1597898857, 'Ended', 'Voiture'),
(93, 19, 1597899821, 1597913499, 'Ended', 'Velo'),
(94, 21, 1597987191, 1597990999, 'Ended', 'Voiture'),
(95, 1, 1598110931, 1598111436, 'Ended', 'Bateau'),
(96, 1, 1598111719, 1598112063, 'Ended', 'Train'),
(97, 17, 1598112939, 1598121571, 'Ended', 'Pied'),
(98, 21, 1598167482, 1598175237, 'Ended', 'Pied'),
(99, 16, 1598193179, 1598246186, 'Ended', 'Bus'),
(100, 21, 1598249547, 1598258219, 'Ended', 'Velo'),
(101, 19, 1598276303, 1598277173, 'Ended', 'Pied');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
