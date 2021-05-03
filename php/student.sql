CREATE TABLE IF NOT EXISTS `warden` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `post` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` int(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `warden`
--

INSERT INTO `warden` (`id`, `name`, `post`, `email`,`phone`) VALUES
(1, 'Prof.S.Prabakar', 'Director', 'director.mh@vit.ac.in',04162205999),
(2, 'Prof.Shiva Shankar', 'Chief Warden', 'cw.mh@vit.ac.in',04162202127),
(3, 'Prof.S.Sivakumar', 'A. Cheif Warden', 'acw.mh@vit.ac.in',04162202186),
(4, 'Prof.R,MohanSundaram', 'A. Cheif warden', 'acw1.mh@vit.ac.in',04162202186),
(5, 'Prof.M.P Gopinath', 'Warden', 'warden.attendence@vit.ac.in',04162202028);
