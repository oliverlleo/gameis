export class TalentSystem {
  constructor(scene){ this.scene=scene; this.passives = Array.from({length:24},(_,i)=>({id:`talent_${i+1}`,name:`Talent ${i+1}`}));
    this.synergies = ['bleed+flowblade','freeze+rupture','shock+overload','crit+bleed','summon+aoe','dash+afterimage','tankbreak+heavy','chain+prism']; }
}
