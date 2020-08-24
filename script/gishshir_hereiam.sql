-- phpMyAdmin SQL Dump
-- version 3.4.11.1
-- http://www.phpmyadmin.net
--
-- Client: 50.31.138.79
-- Généré le: Lun 24 Août 2020 à 09:05
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

-- --------------------------------------------------------

--
-- Structure de la table `account`
--

CREATE TABLE IF NOT EXISTS `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL COMMENT 'id de utilisateur',
  `email` varchar(40) NOT NULL,
  `etat` varchar(10) NOT NULL DEFAULT 'waiting' COMMENT 'open, close, waiting',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IND_USERID` (`userid`),
  UNIQUE KEY `IND_EMAIL` (`email`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=31 ;

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

-- --------------------------------------------------------

--
-- Structure de la table `geolocation`
--

CREATE TABLE IF NOT EXISTS `geolocation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trajetid` int(11) NOT NULL,
  `longitude` varchar(20) NOT NULL,
  `latitude` varchar(20) NOT NULL,
  `timestamp` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trajetid` (`trajetid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=773 ;

--
-- Contenu de la table `geolocation`
--

INSERT INTO `geolocation` (`id`, `trajetid`, `longitude`, `latitude`, `timestamp`) VALUES
(43, 47, '2.213749', '46.227638', 1596379620),
(77, 66, '1.8164167', '43.2672095', 1596470016),
(78, 66, '1.8164169', '43.2672096', 1596470049),
(79, 66, '1.820415', '43.2729067', 1596470186),
(80, 66, '1.820415', '43.2729067', 1596470253),
(81, 66, '1.8152115', '43.2671179', 1596470268),
(82, 66, '1.8066533', '43.26869', 1596470900),
(83, 66, '1.8055067', '43.2681133', 1596470933),
(84, 66, '1.8160037', '43.266911', 1596471738),
(85, 67, '1.854832', '43.2794047', 1596523677),
(86, 67, '1.854832', '43.2794047', 1596523737),
(87, 67, '1.854832', '43.2794047', 1596523743),
(88, 67, '1.854832', '43.2794047', 1596523794),
(89, 67, '1.7853805', '43.2949035', 1596525042),
(90, 67, '1.7275739', '43.3853711', 1596525903),
(91, 67, '1.7065778', '43.3997574', 1596526007),
(92, 67, '1.7065778', '43.3997574', 1596526007),
(93, 67, '1.7065778', '43.3997574', 1596526068),
(94, 67, '1.7071918', '43.3994651', 1596526080),
(95, 67, '1.7071083', '43.399495', 1596526155),
(96, 67, '1.706579', '43.3997553', 1596526287),
(97, 67, '1.7075398', '43.3999267', 1596526812),
(98, 67, '1.706577', '43.3997571', 1596527147),
(99, 67, '1.7084234', '43.4022296', 1596527274),
(100, 67, '1.7053126', '43.3997605', 1596527864),
(101, 67, '1.7053169', '43.3997522', 1596527902),
(102, 67, '1.7053128', '43.3997608', 1596527914),
(103, 67, '1.7053181', '43.3997535', 1596528051),
(104, 67, '1.7053126', '43.3997605', 1596528121),
(105, 67, '1.7512958', '43.3536607', 1596528830),
(106, 67, '1.8536298', '43.2790263', 1596529615),
(107, 68, '42.9593817', '1.7728417', 1596603889),
(108, 68, '42.9763903', '1.6580036', 1596610014),
(109, 68, '1.6580036', '42.9763903', 1596610014),
(110, 68, '1.6580036', '42.9763903', 1596610028),
(111, 68, '1.68245', '42.9761417', 1596610074),
(112, 68, '1.6824513', '42.9760884', 1596606490),
(113, 68, '1.6824567', '42.9760883', 1596610125),
(114, 68, '1.6580036', '42.9763903', 1596610495),
(115, 68, '1.6580036', '42.9763903', 1596610586),
(116, 68, '1.6580036', '42.9763903', 1596610635),
(117, 68, '1.7263578', '42.9705218', 1596612022),
(118, 68, '1.7357839', '43.0004516', 1596612694),
(119, 68, '1.7357839', '43.0004516', 1596612719),
(120, 68, '1.7357839', '43.0004516', 1596612817),
(121, 68, '1.7357839', '43.0004516', 1596613946),
(122, 68, '1.7357839', '43.0004516', 1596614089),
(123, 68, '1.7555133', '43.0020383', 1596614132),
(124, 68, '1.7357839', '43.0004516', 1596614461),
(125, 68, '1.7357839', '43.0004516', 1596614518),
(126, 68, '1.7556067', '43.0019167', 1596614546),
(127, 69, '42.9737797', '1.8676584', 1596692105),
(128, 69, '42.9721867', '1.8754533', 1596692116),
(129, 69, '1.8732846', '42.9697964', 1596688530),
(130, 69, '1.8732845', '42.9697956', 1596692140),
(131, 69, '1.8732833', '42.969795', 1596692180),
(132, 69, '1.8735589', '42.9694627', 1596700014),
(133, 69, '1.8735601', '42.9694618', 1596700043),
(134, 69, '1.8735579', '42.9694565', 1596700060),
(135, 72, '1.8164169', '43.2672096', 1596862676),
(136, 72, '1.8164171', '43.267211', 1596863526),
(137, 72, '1.803042', '43.3275231', 1596866814),
(138, 73, '1.7909695', '43.3242548', 1596868738),
(139, 73, '1.7978646', '43.3318279', 1596868873),
(140, 73, '1.7865117', '43.3257683', 1596868884),
(141, 73, '1.7865826', '43.3258902', 1596868900),
(142, 73, '1.7905564', '43.3204774', 1596869310),
(143, 73, '1.7905564', '43.3204774', 1596869955),
(144, 73, '1.7905564', '43.3204774', 1596870681),
(145, 73, '1.8048695', '43.2731595', 1596872226),
(146, 73, '1.8162651', '43.2668924', 1596872913),
(147, 75, '1.7884251', '43.3156825', 1597126061),
(148, 75, '1.783157', '43.2950877', 1597126809),
(149, 75, '1.8051741', '43.3320149', 1597127903),
(150, 75, '1.7944067', '43.3084633', 1597128144),
(151, 75, '1.80702', '43.3066183', 1597128235),
(152, 75, '1.80702', '43.3066183', 1597128261),
(153, 75, '1.790252', '43.3204821', 1597129177),
(154, 75, '1.7978646', '43.3318279', 1597129482),
(155, 75, '1.7956775', '43.3167098', 1597129501),
(156, 75, '1.8074594', '43.3137127', 1597129830),
(157, 75, '1.7957', '43.3166567', 1597130755),
(158, 76, '1.7909169', '43.3242839', 1597131951),
(159, 76, '1.7909169', '43.3242839', 1597132270),
(160, 77, '1.9092444', '42.9552759', 1597210323),
(161, 77, '1.9742386', '42.9175856', 1597214331),
(162, 77, '1.9650669', '42.9150056', 1597214409),
(163, 77, '1.9772963', '42.9181413', 1597215991),
(164, 77, '2.0051307', '42.9106632', 1597217871),
(165, 77, '1.9769905', '42.9597956', 1597218983),
(166, 77, '2.0216133', '42.9381783', 1597219111),
(167, 77, '2.0452306', '42.9288113', 1597219658),
(168, 77, '2.0392017', '42.930605', 1597219741),
(169, 77, '1.925274', '42.9539149', 1597225245),
(170, 77, '1.909201', '42.9553082', 1597225651),
(171, 47, '1.8731822', '42.9694832', 1597254336),
(172, 47, '1.8731808', '42.9694812', 1597254534),
(173, 47, '1.8731816', '42.9694815', 1597254539),
(174, 79, '1.8731816', '42.9694815', 1597254539),
(175, 79, '1.8731809', '42.9694812', 1597254544),
(176, 79, '1.8731858', '42.9694875', 1597254562),
(177, 79, '1.8731822', '42.9694826', 1597254567),
(178, 79, '1.873181', '42.9694814', 1597254572),
(179, 79, '1.8731807', '42.9694811', 1597254577),
(180, 79, '1.8731814', '42.9694814', 1597254582),
(181, 79, '1.873182', '42.9694819', 1597254587),
(182, 79, '1.8731747', '42.9694822', 1597254592),
(183, 79, '1.87318', '42.9694839', 1597254597),
(184, 79, '1.8731712', '42.9694843', 1597254602),
(185, 79, '1.8731793', '42.9694845', 1597254607),
(186, 79, '1.8731818', '42.9694842', 1597254613),
(187, 79, '1.8731733', '42.9694851', 1597254617),
(188, 79, '1.8731795', '42.9694846', 1597254623),
(189, 79, '1.8730682', '42.9696865', 1597251025),
(190, 79, '1.8730089', '42.9697104', 1597251026),
(191, 79, '1.8729679', '42.9697076', 1597251028),
(192, 62, '1.8160857', '43.2670412', 1597333879),
(193, 62, '1.8160731', '43.2670447', 1597334217),
(194, 62, '1.8160737', '43.2670449', 1597334222),
(195, 62, '1.8160785', '43.2670436', 1597334227),
(196, 62, '1.8160789', '43.2670434', 1597334232),
(197, 62, '1.8160765', '43.2670444', 1597334237),
(198, 62, '1.8160768', '43.2670441', 1597334242),
(199, 62, '1.8160795', '43.2670435', 1597334247),
(200, 62, '1.8160813', '43.267043', 1597334257),
(201, 62, '1.8160839', '43.2670414', 1597334262),
(202, 62, '1.8160786', '43.2670434', 1597334267),
(203, 62, '1.8160808', '43.2670428', 1597334272),
(204, 62, '1.8160855', '43.2670415', 1597334277),
(222, 81, '1.7052833', '43.3997431', 1597391042),
(223, 81, '1.7049169', '43.4002115', 1597387449),
(224, 81, '1.7049667', '43.4001564', 1597387451),
(225, 81, '1.7049716', '43.400151', 1597391051),
(226, 81, '1.7050627', '43.4000657', 1597387454),
(227, 81, '1.7053009', '43.3997452', 1597391122),
(228, 81, '1.7053006', '43.3997446', 1597391127),
(229, 81, '1.7053006', '43.3997446', 1597391127),
(230, 81, '1.7053007', '43.3997442', 1597391146),
(231, 81, '1.7832495', '43.2952385', 1597392240),
(232, 81, '1.8012146', '43.278351', 1597392537),
(233, 82, '1.7596368', '43.3237409', 1597472354),
(234, 82, '1.7596368', '43.3237409', 1597472359),
(235, 82, '1.7595102', '43.3236732', 1597480418),
(243, 58, '6.1878074', '48.699802999999996', 1597501769),
(569, 80, '1.8160749', '43.2670466', 1597504754),
(580, 85, '1.816074', '43.2670457', 1597505401),
(581, 85, '1.8163768', '43.267404', 1597505437),
(582, 85, '1.8161863', '43.2669966', 1597501935),
(583, 85, '1.8161927', '43.2669978', 1597505538),
(584, 85, '1.816074', '43.2670457', 1597505719),
(585, 85, '1.8161022', '43.267075', 1597505766),
(591, 86, '1.8160846', '43.2670425', 1597590324),
(594, 87, '1.8732738', '42.9696556', 1597736917),
(598, 88, '1.8547764', '43.2795084', 1597734913),
(599, 88, '1.8100477', '43.273984', 1597738550),
(600, 88, '1.8036512', '43.2360158', 1597739128),
(601, 88, '1.80367', '43.2632517', 1597739202),
(602, 88, '1.8041183', '43.2635217', 1597739340),
(603, 88, '1.8162647', '43.2668911', 1597740744),
(612, 89, '1.8547835', '43.2795209', 1597813801),
(613, 89, '1.8547835', '43.2795209', 1597813881),
(614, 89, '1.8042603', '43.3314259', 1597816529),
(615, 89, '1.7909407', '43.3242851', 1597816801),
(623, 90, '1.873181', '42.9694844', 1597814925),
(624, 90, '1.8731793', '42.969485', 1597819758),
(627, 91, '1.7909323', '43.3242853', 1597818555),
(628, 91, '1.7909375', '43.3242846', 1597818608),
(629, 91, '1.790252', '43.3204821', 1597819024),
(630, 91, '1.7869028', '43.3235516', 1597819116),
(631, 91, '1.824795', '43.2735817', 1597821484),
(632, 91, '1.8162647', '43.2668921', 1597822391),
(633, 91, '1.8160777', '43.2669374', 1597818811),
(634, 91, '1.8162641', '43.2668909', 1597822475),
(646, 92, '1.8162641', '43.2668909', 1597895806),
(647, 92, '1.8383864', '43.1244173', 1597897219),
(648, 92, '1.8743693', '43.0880788', 1597897782),
(649, 92, '1.8778994', '43.0880766', 1597897918),
(650, 92, '1.8816915', '43.0060481', 1597898412),
(651, 92, '1.8666906', '42.9714653', 1597898726),
(659, 93, '1.873164', '42.9694887', 1597899220),
(660, 93, '1.8735343', '42.9694805', 1597899821),
(661, 93, '1.7802052', '43.0368055', 1597904409),
(662, 93, '1.7802052', '43.0368055', 1597904878),
(663, 93, '1.7802052', '43.0368055', 1597904908),
(664, 93, '1.9308426', '43.0446872', 1597910763),
(665, 93, '1.9269147', '43.0110741', 1597911103),
(666, 93, '1.8691835', '42.9767929', 1597913391),
(667, 93, '1.8732897', '42.9700662', 1597913496),
(672, 94, '1.8731724', '42.9694825', 1597987189),
(673, 94, '1.8730238', '42.9695436', 1597987219),
(674, 94, '1.8730288', '42.96972', 1597987249),
(675, 94, '1.8729928', '42.9696659', 1597987373),
(676, 94, '1.87349', '42.9694371', 1597987401),
(677, 94, '1.8732187', '42.9697561', 1597987431),
(678, 94, '1.8732615', '42.9696052', 1597987461),
(679, 94, '1.8732587', '42.9696073', 1597990986),
(690, 95, '1.8542396', '43.2642171', 1598111011),
(691, 95, '1.8160864', '43.2670412', 1598111049),
(692, 95, '1.816074', '43.2670457', 1598111109),
(693, 95, '1.8160807', '43.2670434', 1598111229),
(694, 95, '1.8160744', '43.2670465', 1598111380),
(707, 96, '1.8160731', '43.2670447', 1598111673),
(708, 96, '1.8160738', '43.2670454', 1598111750),
(709, 96, '1.8160731', '43.2670447', 1598111810),
(710, 96, '1.8160943', '43.2670365', 1598111906),
(711, 96, '1.8161293', '43.2670041', 1598111941),
(712, 96, '1.8161622', '43.266976', 1598112001),
(715, 97, '1.816075', '43.2670465', 1598112709),
(716, 97, '1.8160826', '43.2670427', 1598113035),
(717, 97, '1.816205', '43.266935', 1598118171),
(719, 98, '1.8731735', '42.9694893', 1598165516),
(720, 98, '1.8731733', '42.9694823', 1598168557),
(721, 98, '1.873171', '42.9694825', 1598175225),
(730, 99, '1.8160735', '43.2670448', 1598193037),
(731, 99, '1.8160737', '43.2670449', 1598193179),
(732, 99, '1.8547281', '43.2795045', 1598246103),
(735, 100, '1.873182', '42.969482', 1598249502),
(736, 100, '1.8730894', '42.9696561', 1598258173),
(737, 100, '1.8731816', '42.9694841', 1598258204),
(754, 101, '1.816082', '43.2670433', 1598267894),
(755, 101, '1.8162643', '43.2668912', 1598276304),
(756, 101, '1.8160636', '43.2670473', 1598276334),
(757, 101, '1.8161813', '43.2669611', 1598276373),
(758, 101, '1.8161011', '43.2670306', 1598276424),
(759, 101, '1.8162547', '43.2668896', 1598276458),
(760, 101, '1.8162547', '43.2668896', 1598276489),
(761, 101, '1.810259', '43.2737595', 1598276677),
(762, 101, '1.810259', '43.2737595', 1598276711),
(763, 101, '1.810259', '43.2737595', 1598276764),
(764, 101, '1.810259', '43.2737595', 1598276806),
(765, 101, '1.760019', '43.2980989', 1598276849),
(766, 101, '1.810259', '43.2737595', 1598276883),
(767, 101, '1.709779', '43.3224382', 1598276926),
(768, 101, '1.7027134', '43.3205584', 1598276979),
(769, 101, '1.810259', '43.2737595', 1598277009),
(770, 101, '1.8009944', '43.2443415', 1598277039),
(771, 101, '1.7917298', '43.2149235', 1598277080),
(772, 101, '1.81614', '43.2669974', 1598277130);

-- --------------------------------------------------------

--
-- Structure de la table `person_rel`
--

CREATE TABLE IF NOT EXISTS `person_rel` (
  `personid` int(11) NOT NULL,
  `relationid` int(11) NOT NULL,
  `position` varchar(1) NOT NULL DEFAULT 'A' COMMENT 'Personne A ou B',
  `suivre` int(1) NOT NULL DEFAULT '0' COMMENT 'Indique que la personne souhaite suivre trajet de sa relation',
  `notifier` int(1) NOT NULL DEFAULT '0' COMMENT 'La personne accèpte d''envoyer les notifications à sa relation',
  `action` varchar(20) NOT NULL DEFAULT 'none' COMMENT 'none | invitation| refusee | acceptee',
  PRIMARY KEY (`personid`,`relationid`) USING BTREE,
  KEY `person_rel_ibfk_2` (`relationid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

-- --------------------------------------------------------

--
-- Structure de la table `relation`
--

CREATE TABLE IF NOT EXISTS `relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `person_a` int(11) NOT NULL COMMENT 'personne A ayant pour ami personne B',
  `person_b` int(11) NOT NULL COMMENT 'personne B  étant l''ami de personne A ',
  `etat` varchar(30) NOT NULL DEFAULT 'pending' COMMENT 'pending| open | closed',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IND_PERSON_AB` (`person_a`,`person_b`) USING BTREE,
  KEY `person_a` (`person_a`),
  KEY `person_b` (`person_b`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=57 ;

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

--
-- Déclencheurs `relation`
--
DROP TRIGGER IF EXISTS `after_insert_relation`;
DELIMITER //
CREATE TRIGGER `after_insert_relation` AFTER INSERT ON `relation`
 FOR EACH ROW BEGIN

INSERT INTO person_rel (personid, relationid, position) VALUES (NEW.person_a, NEW.id, 'A');

INSERT INTO person_rel (personid, relationid, position) VALUES (NEW.person_b, NEW.id, 'B');

END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `before_delete_relation`;
DELIMITER //
CREATE TRIGGER `before_delete_relation` BEFORE DELETE ON `relation`
 FOR EACH ROW DELETE from person_rel
where relationid = OLD.id
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `trajet`
--

CREATE TABLE IF NOT EXISTS `trajet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL COMMENT 'id de l''initiateur du trajet',
  `starttime` int(10) NOT NULL DEFAULT '0' COMMENT 'timestamp début trajet en secondes',
  `endtime` int(10) NOT NULL DEFAULT '-1' COMMENT 'timestamp fin trajet en secondes',
  `etat` varchar(20) NOT NULL DEFAULT 'Started' COMMENT 'Started, Ended, Pausing',
  `mean` varchar(20) NOT NULL DEFAULT 'Pied' COMMENT '"Pied", "Velo", "Moto", "Voiture", "Bus", "Train", "Avion", "Bateau"',
  PRIMARY KEY (`id`),
  KEY `IND_USER` (`userid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=102 ;

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

--
-- Déclencheurs `trajet`
--
DROP TRIGGER IF EXISTS `after_insert_trajet`;
DELIMITER //
CREATE TRIGGER `after_insert_trajet` AFTER INSERT ON `trajet`
 FOR EACH ROW UPDATE utilisateur 
SET etat = 'EnChemin'
WHERE id = NEW.userid
//
DELIMITER ;
DROP TRIGGER IF EXISTS `after_update_trajet`;
DELIMITER //
CREATE TRIGGER `after_update_trajet` AFTER UPDATE ON `trajet`
 FOR EACH ROW UPDATE utilisateur 
SET etat = 
 CASE NEW.etat
 WHEN 'Started' THEN 'EnChemin' 
 WHEN 'Pausing' THEN 'Pause'
 WHEN 'Ended' THEN 'Arret'
 END 
WHERE id = NEW.userid
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE IF NOT EXISTS `utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(30) NOT NULL,
  `password` varchar(60) NOT NULL,
  `pseudo` varchar(30) NOT NULL,
  `etat` varchar(10) NOT NULL DEFAULT 'Arret' COMMENT 'Arret, EnChemin, Pause',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IND_LOGIN` (`login`),
  UNIQUE KEY `IND_PSEUDO` (`pseudo`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=33 ;

--
-- Contenu de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `login`, `password`, `pseudo`, `etat`) VALUES
(1, 'login1', '$2y$10$9u8Rq95M/j8rsYGXc4mMq.Ftyvq8J7LfPuq6rLkjdql6ddEegNaz6', 'Jojo les gros bras', 'Arret'),
(2, 'login2', '$2y$10$MJNtcJUK.iq9Crz0ZSTQE.QVrvAH8BUFVviRfBGJSA7sckrTXYUN.', 'Fanfan la Tulipe', 'EnChemin'),
(3, 'login3', '$2y$10$b/QNlKdDeWkVy.LMA3U/NeUk2APKLHfO8omo2CUIq6WSpBBfJN0/e', 'Savate le vagabond', 'Arret'),
(4, 'login4', '$2y$10$pD/1/UKIt/BvBjLrJGRLCewYYqqgK9WPj5SjFl8RF3dPhfoSdA3Ou', 'La Belle au Bois dormant', 'Pause'),
(5, 'login5', '$2y$10$Nm6/WG96MzJ/cVcZMA3TZOQO3YovWMSdMQstWlgt7oXCjkPP2v8du', 'Petit Chaperon Rouge', 'EnChemin'),
(15, 'login6', '$2y$10$9Fk8r.NTp3vNkir0AkJ8YO6Byf5l7IJXMLoM6O3XwUpp76XJGWbQ2', 'Fifi la ficelle', 'EnChemin'),
(16, 'login7', '$2y$10$VhC/HL2qPBhEbfIxz69CLejlJTwpNNilyhQ2Mrr9h5b8aDukeJsh2', 'Hophop le rougegorge', 'Arret'),
(17, 'login8', '$2y$10$9nmKvLS1AV05ROkMlwfKEuajqBCN1g2rorDQ.KeI3YOsLWzopmmbC', 'Fripouille la veine', 'Arret'),
(18, 'login9', '$2y$10$NkqRBKmTaHjAV2TYmYkz1.W3M1/qds6Z4PbYtPcqchW0pIvIHSUxS', 'Titi la combine', 'Arret'),
(19, 'toto', '$2y$10$5t6aFfJyteyJ7Ss0FgBuROlSZHB0fTpuSn4zI/h/ouY9Q9IKUH6Em', 'coco la poulette', 'Arret'),
(20, 'login10', '$2y$10$Em3DKLvo.EkAY3jwlIy8fujJAQE6r9SfBz0P4pDHBjGPQT/Wz4y7e', 'Rififi le malin', 'EnChemin'),
(21, 'MIMI', '$2y$10$wNID5w93uFwRzr3pJUIBl.Jl9laowEIaTDggMyiY7y1NXMa0z4w7u', 'Moutarde des champs', 'Arret'),
(22, 'login11', '$2y$10$g0ShyhkjphZP0NtZMUORYOY/pGx78K09LlNG2UjbssQTB31PG/CEe', 'Roxie la Rousse', 'EnChemin'),
(32, 'KoKo', '$2y$10$J/ZpWJMfFbaKK.Rzb5ad8.2EDJCBDZx6ybGNSKJYtSJh1sivyhfcu', 'Cygne chanteur', 'Arret');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `geolocation`
--
ALTER TABLE `geolocation`
  ADD CONSTRAINT `geolocation_ibfk_1` FOREIGN KEY (`trajetid`) REFERENCES `trajet` (`id`) ON DELETE CASCADE;

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
