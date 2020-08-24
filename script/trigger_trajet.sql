CREATE TRIGGER `after_update_trajet` AFTER UPDATE ON `trajet`
 FOR EACH ROW UPDATE utilisateur 
SET etat = 
 CASE NEW.etat
 WHEN 'Started' THEN 'EnChemin' 
 WHEN 'Pausing' THEN 'Pause'
 WHEN 'Ended' THEN 'Arret'
 END 
WHERE id = NEW.userid;

CREATE TRIGGER `after_insert_trajet` AFTER INSERT ON `trajet`
 FOR EACH ROW UPDATE utilisateur 
SET etat = 'EnChemin'
WHERE id = NEW.userid;