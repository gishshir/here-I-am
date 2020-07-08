import { Ami } from './ami.type';
import { AmiState } from './ami.etat.enum';

export const AMIS : Ami[] = [

 {id: 1, pseudo: "JoJo les gros bras", etat: AmiState.Arret, suivre:false},
 {id: 2, pseudo: "Fanfan la Tulipe", etat: AmiState.EnChemin, suivre:true},
 {id: 3, pseudo: "Savate le vagabon",  etat: AmiState.Arret, suivre: false},
 {id: 4, pseudo: "LaBelle au bois dormant", etat: AmiState.EnChemin, suivre:true},
 {id: 5, pseudo: "Petit chaperon rouge",  etat: AmiState.Pause, suivre:false}

];