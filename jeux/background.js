var myBackground = {
  requestID : 0,
  compteur : 0,
  stage : 0,
  loading : function(item, key){
    this.divJeux = document.getElementById('jeux');
    this.divView = document.getElementById('view');
    this.divCircle = document.getElementById('circleView').style;
    this.divCircle.opacity = 0;
    this.divWin = document.getElementById('win').style;
    this.divWin.opacity = 0;
    this.imgCircle = document.getElementById('circle').style;
    this.imgCircle.left = '-1000px';
    this.zone = document.getElementById('background');
    this.text = document.getElementById('text').style;
    this.message = document.getElementById('message');
    window.linkEtat = new ConstructeurLinkEtat(item, key);
    //vérifi si le stage a déjà été initalisé
    if ( !linkAction.resetGame ) this.creatImage(0);
    // div de la limite du personnage pour les collision
    linkAction.divPersonnage = document.getElementById('limitePersonnage').style;
  	linkAction.divPersonnage.top = '34px';
    linkAction.divPersonnage.left = '73px';
    linkAction.divPersonnage.width = '14px';
    linkAction.divPersonnage.height = '16px';
    // image visible du personnage
    linkAction.persoShow = document.getElementById('show').style;
    // positionnement du sprite
    linkAction.linkSprite = document.getElementById('spriteLink');
    linkEtat.actionOff.sprite = linkAction.spriteLink[1][2][0][3];
    // div des objet
    this.item = document.getElementById('objet').style;
    // image des objet
    this.spriteObjet = document.getElementById('spriteObjet').style;
    // div de l'ombre
    this.shadow = document.getElementById('shadow').style;
    // image de l'ombre
    document.getElementById('spriteShadow').style.top = '-22px';
    document.getElementById('spriteShadow').style.left = '-1081px';
    //parcour les div des compétence
    for (var i = 0; i < window.document.getElementById('competences').getElementsByTagName('div').length; i++) {
      this.listeOfSkill[i] = window.document.getElementById('competences').getElementsByTagName('div')[i].style;
    }
    // div des caractéristique
    linkEtat.carac = document.getElementById('carac').style;
    //création des caractéistique affiché
    linkAction.creatCarac();
    linkAction.menu();
    //mouvement du personnage
    window.requestAnimationFrame(function(timestamp){linkAction.mouvement(timestamp)});
    //message début
    linkAction.counterMessage = 0;
    linkAction.messageLoading = this.arrayMessage[0];
    linkAction.textProgress = 1;
    linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
  },
  listeOfSkill : [],
  //ajoute l'image de fond et les élément du décor
  creatImage : function (){
    //image de fond
    this.zone.src = this.backgroundListe[this.stage];
    //ajoute une div est une image
    var typeObjet = function (id, element, type, opacity, url, zindex){
      var image = new Image();
      image.style.position = 'absolute';
      image.id = 'image' + id;
      element.id = id;
      image.src = url || 'image/Link.png';
      var div = document.createElement('div');
      div.id = 'div' + id;
      image.style.left = type.positionX + 'px';
      image.style.top = type.positionY + 'px';
      div.style.left = (element.argument.decallageX || element.positionX) + 'px';
      //vérifi si l'objet est à la même position
      div.style.top = (element.argument.decallageY || ( element.positionY + ( element.argument.positionExit || 0 ))) + 'px';
      div.style.width = type.tailleX + 'px';
      div.style.height = type.tailleY + 'px';
      div.style.overflow = 'hidden';
      div.style.position = 'absolute';
      div.appendChild(image);
      myBackground.divJeux.appendChild(div);
      div.style.opacity = opacity || 0;
      div.style['z-index'] = zindex || 1;
      myBackground.image[id] = document.getElementById('image' + id);
      myBackground.div[id] = document.getElementById('div' + id);
    };
    //parcour les éléments du décor interactif
    while(this.collisionListe[this.stage][this.compteur]){
      var opacity = 0;
      //vérifi les coffres
      if( this.collisionListe[this.stage][this.compteur].argument.chest ){
        //vérifi si le coffre a été ouvert
        if ( linkEtat.chestOpen[this.stage][this.compteur] ) { opacity = 1 }
        //ajoute une image par coffre
        typeObjet(this.compteur, this.collisionListe[this.stage][this.compteur],  this.decorObject[4], opacity);
      }
      //vérifi les entré cachet
      if( this.collisionListe[this.stage][this.compteur].argument.push ){
        //ajoute une image de la stelle
        typeObjet(this.compteur, this.collisionListe[this.stage][this.compteur],  this.decorObject[24], 1, 0, 1);
      }
      //vérifi les items
      if( this.collisionListe[this.stage][this.compteur].argument.treasure && !linkEtat.chestOpen[this.stage][this.compteur] ){
        //ajoute une image par items
        typeObjet(this.compteur, this.collisionListe[this.stage][this.compteur],  linkAction.spriteLink[4][this.collisionListe[this.stage][this.compteur].argument.item], 1);
      }
      //vérifi les maison
      if( this.collisionListe[this.stage][this.compteur].argument.home ){
        //ajoute pour la maison
        typeObjet(this.compteur, this.collisionListe[this.stage][this.compteur],  this.decorObject[this.collisionListe[this.stage][this.compteur].argument.indice], 1, 0, 6);
      }
      //vérifi les objet soulevable
      if( this.collisionListe[this.stage][this.compteur].argument.lift ){
        //ajoute une image par élément soulevable
        typeObjet(this.compteur, this.collisionListe[this.stage][this.compteur],  this.decorObject[this.collisionListe[this.stage][this.compteur].argument.indice] );
      }
      if( this.collisionListe[this.stage][this.compteur].argument.exit && this.collisionListe[this.stage][this.compteur].argument.indice ){
        //ajoute les éléments de sortie.
        typeObjet(this.compteur, this.collisionListe[this.stage][this.compteur],  this.decorObject[this.collisionListe[this.stage][this.compteur].argument.indice], ((this.collisionListe[this.stage][this.compteur].argument.opacity) || 1), 0, ((this.collisionListe[this.stage][this.compteur].argument.zindex) || 6));
      }
      if( this.collisionListe[this.stage][this.compteur].argument.door ){
        //ajoute les portes.
        typeObjet(this.compteur, this.collisionListe[this.stage][this.compteur],  this.decorObject[this.collisionListe[this.stage][this.compteur].argument.indice] );
      }
      if( this.collisionListe[this.stage][this.compteur].argument.tree ){
        //ajoute les arbres.
        typeObjet(this.compteur, this.collisionListe[this.stage][this.compteur],  this.decorObject[this.collisionListe[this.stage][this.compteur].argument.indice], 1, this.collisionListe[this.stage][this.compteur].argument.url, 6 );
      }
      if( this.collisionListe[this.stage][this.compteur].argument.bomb ){
        //ajoute les zones destructible.
        typeObjet(this.compteur, this.collisionListe[this.stage][this.compteur],  this.decorObject[this.collisionListe[this.stage][this.compteur].argument.indice], 0, 0, 2 );
      }
      if( this.collisionListe[this.stage][this.compteur].argument.hide && (!this.collisionListe[this.stage][this.compteur].argument.sword || linkEtat.item.sword )){
        //ajoute les item caché.
        typeObjet(this.compteur, this.collisionListe[this.stage][this.compteur],  linkAction.spriteLink[4][this.collisionListe[this.stage][this.compteur].argument.indice] );
      }
      this.compteur++;
    }
    this.compteur = 1000;
    //parcour les éléments du décor animé
    for ( var j=0;this.objetAnime[this.stage][j];j++ ){
      //vérifi si ce sont des fleures
      if ( this.objetAnime[this.stage][j].argument.animation == 9 || this.objetAnime[this.stage][j].argument.animation == 10 || this.objetAnime[this.stage][j].argument.animation == 11 ){
        //ajoute des fleures
        typeObjet(j + 1000, this.objetAnime[this.stage][j],  this.decorObject[this.objetAnime[this.stage][j].argument.animation], 1);
      }
      //vérifi si ce sont des grandes flammes
      if ( this.objetAnime[this.stage][j].argument.animation == 14 || this.objetAnime[this.stage][j].argument.animation == 15 || this.objetAnime[this.stage][j].argument.animation == 16 ){
        //ajoute des grandes flammes
        typeObjet(j + 1000, this.objetAnime[this.stage][j],  this.decorObject[this.objetAnime[this.stage][j].argument.animation], 1, 3);
      }
      //vérifi si ce sont des petites flammes
      if ( this.objetAnime[this.stage][j].argument.animation == 17 || this.objetAnime[this.stage][j].argument.animation == 18 || this.objetAnime[this.stage][j].argument.animation == 19 ){
        //ajoute des petites flammes
        typeObjet(j + 1000, this.objetAnime[this.stage][j],  this.decorObject[this.objetAnime[this.stage][j].argument.animation], 1);
      }
      this.compteur++;
    }
    //si l'épée a été trouvé ajoute les ennemis
    if ( linkEtat.item.sword ){
      this.compteur = 1100;
      //parcour la liste des ennemi
      for ( var k=0;this.enemiesStage[this.stage][k];k++ ){
        //ajoute les ennemis
        typeObjet(k + 1100, this.enemiesStage[this.stage][k],  this.enemiesListe[this.enemiesStage[this.stage][k].argument.type], 1);
        this.enemiesCollision[k] = false;
        this.compteur++;
      }
    }
    this.compteur = 0;
  },
  //scintillement de l'épée
  position : function( indice, x, y ){
    var nombre = Math.round(Math.random() * 20);
    //position du sprite
    this.spriteObjet.left = linkAction.spriteLink[indice][nombre].positionX + 'px';
    //position du sprite
    this.spriteObjet.top = linkAction.spriteLink[indice][nombre].positionY + 'px';
    //positionne la div au bout de l'épée de link
    this.item.left = parseFloat(linkAction.divPersonnage.left) + x + 'px';
    //positionne la div au bout de l'épée de link
    this.item.top = parseFloat(linkAction.divPersonnage.top) + y + 'px';
    //largeur de la div
    this.item.width = linkAction.spriteLink[indice][nombre].tailleX + 'px';
    //hauteur de la div
    this.item.height = linkAction.spriteLink[indice][nombre].tailleY + 'px';
  },
  centreObjet : function(){
    if ( linkEtat.touche.keyAPlusObjet ) {
      this.item.left = parseFloat(linkAction.divPersonnage.left) + ((parseFloat(linkAction.divPersonnage.width) - parseFloat(this.item.width)) / 2) + 'px';
      this.item.top = ( parseFloat(linkAction.divPersonnage.top) - parseFloat(this.item.height) )  + 'px';
      this.shadow.left = linkAction.divPersonnage.left;
      this.shadow.top = linkAction.divPersonnage.top;
      this.item.opacity = 1;
      this.shadow.opacity = 1;
    }
    //scintillement de l'épée
    if ( linkEtat.slachSword == 3 ) {
      //positionne la div du scintillement en fonction de la direction
      switch (linkEtat.touche.directionSword) {
        case 'S':
          this.position( 5, 4, 19 );
          break;
        case 'N':
          this.position( 5, 0, -15 );
          break;
        case 'E':
          this.position( 6, 19, 4 );
          break;
        case 'W':
          this.position( 6, -10, 4 );
          break;
      }
      this.item.opacity = 1;
    }
  },
  //affiche un objet
  affiche : function(item, div, boul){
    //position du sprite
    this.spriteObjet.left = item.positionX + 'px';
    //position du sprite
    this.spriteObjet.top = item.positionY + 'px';
    //fait si l'argument n'est pas fourni
    if( !boul ){
      //centre la div au dessus de link
      div.left = parseFloat(linkAction.divPersonnage.left) + ((parseFloat(linkAction.divPersonnage.width) - parseFloat(this.item.width)) / 2) + 'px';
      //centre la div au dessus de link
      div.top = parseFloat(linkAction.divPersonnage.top) -(parseFloat(this.item.height) - 0)  + 'px';
    }
    //largeur de la div
    div.width = item.tailleX + 'px';
    //hauteur de la div
    div.height = item.tailleY + 'px';
    div.opacity = 1;
  },
  start : null,
  lift : function(timestemps){
    var progress;
    if (!this.start) this.start = timestemps;
    progress = timestemps - this.start;
    if ( progress > 20 ){
      this.start = timestemps;
      if ( linkEtat.spritePosition.action == 2 ){
        this.shadow.opacity = 1;
        this.item.opacity = 1;
        //vérifi si la div objet est centré en left
        if ( Math.round(parseFloat(this.item.left)) != Math.round( (parseFloat(linkAction.divPersonnage.left) + ( (parseFloat(linkAction.divPersonnage.width) - parseFloat(this.item.width)) / 2 ) ) - 1 ) ){
          //centre la div en left
          this.item.left = ( parseFloat(this.item.left) + ( ( ( (parseFloat(linkAction.divPersonnage.left) + ( ( parseFloat(linkAction.divPersonnage.width) - parseFloat(this.item.width) ) / 2 ) ) - 1 ) - this.collisionListe[this.stage][linkEtat.collision.position].argument.positionX ) / linkAction.lastPosition ) ) + 'px';
        }
        //vérifi si la div objet est centré en top
        if ( Math.round(parseFloat(this.item.top)) != Math.round( (parseFloat(linkAction.divPersonnage.top) - ( parseFloat(this.item.height) ) ) ) ){
          //centre la div en top
          this.item.top = (  parseFloat( this.item.top ) + ( ( parseFloat(linkAction.divPersonnage.top) - parseFloat(this.item.height) - this.collisionListe[this.stage][linkEtat.collision.position].argument.positionX ) / linkAction.lastPosition ) ) + 'px';
        }
        if ( Math.round(parseFloat(this.shadow.top)) != Math.round(parseFloat(linkAction.divPersonnage.top)) ){
          this.shadow.top = ( parseFloat(this.shadow.top) + ((parseFloat(linkAction.divPersonnage.top) - this.collisionListe[this.stage][linkEtat.collision.position].argument.positionY) / linkAction.lastPosition) ) + 'px';
        }
        if ( Math.round(parseFloat(this.shadow.left)) != Math.round((parseFloat(linkAction.divPersonnage.left) - 1)) ){
          this.shadow.left = ( parseFloat(this.shadow.left) + ((parseFloat(linkAction.divPersonnage.left) - this.collisionListe[this.stage][linkEtat.collision.position].argument.positionX) / linkAction.lastPosition) ) + 'px';
        }
      }
      this.requestIDLift = window.requestAnimationFrame(function(timestamp){myBackground.lift(timestamp)});
    } else { window.cancelAnimationFrame(this.requestIDLift); }
  },
  nextstage : function( stage ){
    window.cancelAnimationFrame(this.requestID);
    //parcour les éléments du décor
    for(var i=0;this.collisionListe[this.stage][i];i++){
      //remet les objets interactif en collision
      this.collisionListe[this.stage][i].modif(true);
      //positionne la div objet
      this.item.top = '20px';
      this.item.left = '20px';
      //vérifi les coffres
      if( this.collisionListe[this.stage][i].argument.chest ){
        //supprime les div coffres ouvert
        this.divJeux.removeChild(this.div[i]);
      }
      //vérifi les objet soulevable
      if( this.collisionListe[this.stage][i].argument.lift ){
        //supprime les div élément soulevable
        this.divJeux.removeChild(this.div[i]);
      }
      //vérifi les sortie
      if( this.collisionListe[this.stage][i].argument.exit && this.collisionListe[this.stage][i].argument.indice ){
        //supprime les éléments de sortie.
        this.divJeux.removeChild(this.div[i]);
      }
       //vérifi les porte
      if( this.collisionListe[this.stage][i].argument.door ){
        //supprime les div des porte
        this.divJeux.removeChild(this.div[i]);
      }
      //vérifi les maison
      if( this.collisionListe[this.stage][i].argument.home ){
        //supprime les maison.
        this.divJeux.removeChild(this.div[i]);
      }
      if( this.collisionListe[this.stage][i].argument.tree ){
        //supprime les arbres.
        this.divJeux.removeChild(this.div[i]);
      }
      if( this.collisionListe[this.stage][i].argument.bomb ){
        //supprime les élément destructibles.
        this.divJeux.removeChild(this.div[i]);
      }
      if( this.collisionListe[this.stage][i].argument.hide  && (!this.collisionListe[this.stage][i].argument.sword || linkEtat.item.sword )){
        //supprime les élément caché.
        this.divJeux.removeChild(this.div[i]);
      }
      if( this.collisionListe[this.stage][i].argument.push  && (!this.collisionListe[this.stage][i].argument.sword || linkEtat.item.sword )){
        //supprime les élément caché.
        this.divJeux.removeChild(this.div[i]);
        this.collisionListe[this.stage][i].argument.positionY = this.collisionListe[this.stage][i].argument.sauvY;
      }
    }
    //parcour les élément animé
    for ( var j=0;this.objetAnime[this.stage][j];j++ ) {
      this.divJeux.removeChild(this.div[j + 1000]);
    }
    if ( linkEtat.item.sword ){
      //parcour la liste des ennemi
      for ( var k=0;this.enemiesStage[this.stage][k];k++ ){
        //reinitialise les ennemis
        this.enemiesStage[this.stage][k].modif(true);
        this.enemiesStage[this.stage][k].tailleX = this.enemiesStage[this.stage][k].argument.sauv.tailleX;
        this.enemiesStage[this.stage][k].tailleY = this.enemiesStage[this.stage][k].argument.sauv.tailleY;
        this.enemiesStage[this.stage][k].positionX = this.enemiesStage[this.stage][k].argument.sauv.positionX;
        this.enemiesStage[this.stage][k].positionY = this.enemiesStage[this.stage][k].argument.sauv.positionY;
        this.enemiesStage[this.stage][k].life = this.enemiesStage[this.stage][k].argument.sauv.life;
        //supprime les div ennemis
        this.divJeux.removeChild(this.div[k + 1100]);
      }
    }
    //positionne link en top et left
    if ( linkEtat.collision.position && !(this.collisionListe[this.stage][linkEtat.collision.position].argument.positionX === true) ){
      linkAction.divPersonnage.left = this.collisionListe[this.stage][linkEtat.collision.position].argument.positionX + 'px';
    }
    if ( linkEtat.collision.position && !(this.collisionListe[this.stage][linkEtat.collision.position].argument.positionY === true) ){
      linkAction.divPersonnage.top = this.collisionListe[this.stage][linkEtat.collision.position].argument.positionY + 'px';
    }
    this.stage = stage;
    this.creatImage();
    //vérifi si le stage en cour a des animations ou des ennemis
    if ( this.objetAnime[this.stage] || this.enemiesStage[this.stage] ){
      this.requestID = window.requestAnimationFrame(function(timestamp){myBackground.animation(timestamp)});
    }
    linkEtat.collision.position = null;
    linkEtat.collision.direction = null;
    linkEtat.collision.collisionBooleen = 0;
  },
  start : null,
  //animation du stage
  animation : function(timestamp) {
    var progress;
    if( !this.start ) this.start = timestamp;
    progress = timestamp - this.start;
    if ( progress > 100 ){
      this.start = timestamp;
      //parcour les élément animé
      for ( var i=0;this.objetAnime[this.stage][i];i++ ){
        //fleur
        if ( this.image[i + 1000] && this.objetAnime[this.stage][i].argument.animation == 9 || this.objetAnime[this.stage][i].argument.animation == 10 || this.objetAnime[this.stage][i].argument.animation == 11 ){
          this.image[i + 1000].style.top = this.decorObject[this.objetAnime[this.stage][i].argument.animation].positionY + 'px';//position de l'image en y
          this.image[i + 1000].style.left = this.decorObject[this.objetAnime[this.stage][i].argument.animation].positionX + 'px';//position de l'image en x
          //réinitialise l'animation
          this.objetAnime[this.stage][i].argument.animation++;
          if (this.objetAnime[this.stage][i].argument.animation > 11) this.objetAnime[this.stage][i].argument.animation = 9;
        }
        //grand flambo
        if ( this.image[i + 1000] && this.objetAnime[this.stage][i].argument.animation == 14 || this.objetAnime[this.stage][i].argument.animation == 15 || this.objetAnime[this.stage][i].argument.animation == 16 ){
          this.image[i + 1000].style.top = this.decorObject[this.objetAnime[this.stage][i].argument.animation].positionY + 'px';//position de l'image en y
          this.image[i + 1000].style.left = this.decorObject[this.objetAnime[this.stage][i].argument.animation].positionX + 'px';//position de l'image en x
          //réinitialise l'animation
          this.objetAnime[this.stage][i].argument.animation++;
          if (this.objetAnime[this.stage][i].argument.animation > 16) this.objetAnime[this.stage][i].argument.animation = 14;
        }
        //petit flambo
        if ( this.image[i + 1000] && this.objetAnime[this.stage][i].argument.animation == 17 || this.objetAnime[this.stage][i].argument.animation == 18 || this.objetAnime[this.stage][i].argument.animation == 19 || this.objetAnime[this.stage][i].argument.animation == 20 ){
          this.image[i + 1000].style.top = this.decorObject[this.objetAnime[this.stage][i].argument.animation].positionY + 'px';//position de l'image en y
          this.image[i + 1000].style.left = this.decorObject[this.objetAnime[this.stage][i].argument.animation].positionX + 'px';//position de l'image en x
          //réinitialise l'animation
          this.objetAnime[this.stage][i].argument.animation++;
          if (this.objetAnime[this.stage][i].argument.animation > 20) this.objetAnime[this.stage][i].argument.animation = 17;
        }
      }
      if ( linkEtat.item.sword ){
        //parcour la liste des ennemis
        for ( var j=0;this.enemiesStage[this.stage][j];j++ ){
          //vérifi si l'image à fini de chager
          if (this.image[j + 1100]) {
            var sprite;
            mouvement = 1;
            //vérifie si l'ennemi a encore de la vie
            if ( this.enemiesStage[this.stage][j].argument.life <= 0 ) {
              //supression de l'ennemi tué
              this.collisionListe[this.stage][j].modif(false);
              this.div[j + 1100].style.opacity = 0;
              this.div[j + 1100].style.top = '-1000px';
            }
            //vérifi que l'ennemi est vivant
            if ( this.enemiesStage[this.stage][j].existance() && this.enemiesStage[this.stage][j].argument.life > 0 ){
              //vérifi si l'ennemi a été touché pour le faire clignoter
              if ( ( !this.enemiesStage[this.stage][j].argument.hit ) && ( ( Date.now() - this.enemiesStage[this.stage][j].argument.lastFire ) < 500 ) ) {
                if ( this.div[j + 1100].style.opacity == 1 ) {
                  this.div[j + 1100].style.opacity = 0.4;
                } else {
                  this.div[j + 1100].style.opacity = 1;
                }
              } else {
                this.enemiesStage[this.stage][j].argument.hit = 1;
                this.div[j + 1100].style.opacity = 1;
              }
              //type d'ennemis 0, 2 et 3
              if ( this.enemiesStage[this.stage][j].argument.type == 0 || this.enemiesStage[this.stage][j].argument.type == 2 || this.enemiesStage[this.stage][j].argument.type == 3 ){
                this.enemiesStage[this.stage][j].argument.animation++;
                //réinitialise la postion du sprite
                if ( !this.enemiesListe[this.enemiesStage[this.stage][j].argument.type][this.enemiesStage[this.stage][j].argument.animation] ) this.enemiesStage[this.stage][j].argument.animation = 0;
                sprite = this.enemiesListe[this.enemiesStage[this.stage][j].argument.type][this.enemiesStage[this.stage][j].argument.animation];
                this.enemiesStage[this.stage][j].argument.visibly = this.enemiesStage[this.stage][j].argument.way.direction;
              }
              //type d'ennemis 4
              if ( this.enemiesStage[this.stage][j].argument.type == 4 ){
                if ( this.enemiesStage[this.stage][j].argument.aggro ||  Date.now() - this.enemiesStage[this.stage][j].argument.delay < 1000 ){
                  if( !this.enemiesStage[this.stage][j].argument.animation.position ){
                    this.enemiesStage[this.stage][j].argument.animation.position++;
                  } else {
                    this.enemiesStage[this.stage][j].argument.animation.position = 0;
                  }
                  this.enemiesStage[this.stage][j].argument.way.visibly = this.enemiesStage[this.stage][j].argument.way.direction;
                } else {
                  if ( Date.now() - this.enemiesStage[this.stage][j].argument.delay < 1500) {
                    this.enemiesStage[this.stage][j].argument.animation.position = 2;
                    //bloque le mouvement
                    mouvement = 0;
                  } else {
                    if ( Date.now() - this.enemiesStage[this.stage][j].argument.delay < 2000) {
                      //bloque le mouvement
                      mouvement = 0;
                      this.enemiesStage[this.stage][j].argument.animation.position = 3;
                    } else {
                      this.enemiesStage[this.stage][j].argument.delay = Date.now();
                    }
                  }
                }
                //vérifi la direction pour positionné le sprite correspondant
                switch ( this.enemiesStage[this.stage][j].argument.way.direction ) {
                  case 'N':
                  this.enemiesStage[this.stage][j].argument.animation.sens = 3;
                  if(this.enemiesStage[this.stage][j].argument.animation.position == 2){
                    this.enemiesStage[this.stage][j].argument.visibly = 'W';
                  } else {
                    if (this.enemiesStage[this.stage][j].argument.animation.position == 3) {
                      this.enemiesStage[this.stage][j].argument.visibly = 'E';
                    }
                  }
                  break;
                  case 'S':
                  this.enemiesStage[this.stage][j].argument.animation.sens = 0;
                  if(this.enemiesStage[this.stage][j].argument.animation.position == 2){
                    this.enemiesStage[this.stage][j].argument.visibly = 'E';
                  } else {
                    if (this.enemiesStage[this.stage][j].argument.animation.position == 3) {
                      this.enemiesStage[this.stage][j].argument.visibly = 'W';
                    }
                  }
                  break;
                  case 'W':
                  this.enemiesStage[this.stage][j].argument.animation.sens = 2;
                  if(this.enemiesStage[this.stage][j].argument.animation.position == 2){
                    this.enemiesStage[this.stage][j].argument.visibly = 'S';
                  } else {
                    if (this.enemiesStage[this.stage][j].argument.animation.position == 3) {
                      this.enemiesStage[this.stage][j].argument.visibly = 'N';
                    }
                  }
                  break;
                  case 'E':
                  this.enemiesStage[this.stage][j].argument.animation.sens = 1;
                  if(this.enemiesStage[this.stage][j].argument.animation.position == 2){
                    this.enemiesStage[this.stage][j].argument.visibly = 'N';
                  } else {
                    if (this.enemiesStage[this.stage][j].argument.animation.position == 3) {
                      this.enemiesStage[this.stage][j].argument.visibly = 'S';
                    }
                  }
                  break;
                }
                sprite = this.enemiesListe[this.enemiesStage[this.stage][j].argument.type][this.enemiesStage[this.stage][j].argument.animation.sens][this.enemiesStage[this.stage][j].argument.animation.position];
              }
              //positionne le sprite
              this.positionSprite(this.div[j + 1100].style, this.image[j + 1100].style, sprite);
              //test la zone d'aggro
              if (!this.enemiesStage[this.stage][j].argument.aggro || Date.now() - this.enemiesStage[this.stage][j].argument.lastAggro > 2000 ) { this.aggro(this.enemiesStage[this.stage][j], j); }
              //vérifi si link est à moins de 20px ou si il a été vue
              if ( ( Math.abs(parseFloat(this.div[j + 1100].style.top) - parseFloat(linkAction.divPersonnage.top)) < 40 && !this.enemiesCollision[j] && Math.abs(parseFloat(this.div[j + 1100].style.left) - parseFloat(linkAction.divPersonnage.left)) < 40 ) || this.enemiesStage[this.stage][j].argument.aggro ){
                var sens = 1;
                var direction = 'S';
                if ( parseFloat(this.div[j + 1100].style.top) - parseFloat(linkAction.divPersonnage.top) > 0 ) {
                  sens = 0;
                  direction = 'N';
                }
                this.enemiesStage[this.stage][j].argument.way.direction = direction;
                //test si une collision a lieu avec un obstacle ou avec link dans le sens top
                linkAction.moving('top', sens, this.div[j + 1100].style, this.collisionListe[this.stage], direction, this.enemiesStage[this.stage][j], 0, linkEtat.sauvPositionSprite, this.enemiesStage[this.stage][j].argument.collisionLink);
                linkAction.moving('top', sens, this.div[j + 1100].style, this.collisionListe[this.stage], direction, this.enemiesStage[this.stage][j], 0, linkEtat.sauvPositionSprite, this.enemiesStage[this.stage][j].argument.collisionLink);
                if ( this.enemiesStage[this.stage][j].argument.collisionLink.collisionBooleen  && ( ( Date.now() - this.enemiesStage[this.stage][j].argument.lastFire ) > 500 ) ){
                  this.hit(j);
                }
                if ( parseFloat(this.div[j + 1100].style.left) - parseFloat(linkAction.divPersonnage.left) > 0 ) {
                  sens = 0;
                  direction = 'W';
                } else {
                  sens = 1;
                  direction = 'E';
                }
                if ( ( Math.abs(parseFloat(this.div[j + 1100].style.top) - parseFloat(linkAction.divPersonnage.top)) < Math.abs(parseFloat(this.div[j + 1100].style.left) - parseFloat(linkAction.divPersonnage.left)) ) ){
                  this.enemiesStage[this.stage][j].argument.way.direction = direction;
                }
                //test si une collision a lieu avec un obstacle ou avec link dans le sens left
                linkAction.moving('left', sens, this.div[j + 1100].style, this.collisionListe[this.stage], direction, this.enemiesStage[this.stage][j], 0, linkEtat.sauvPositionSprite, this.enemiesStage[this.stage][j].argument.collisionLink);
                linkAction.moving('left', sens, this.div[j + 1100].style, this.collisionListe[this.stage], direction, this.enemiesStage[this.stage][j], 0, linkEtat.sauvPositionSprite, this.enemiesStage[this.stage][j].argument.collisionLink);
                if ( this.enemiesStage[this.stage][j].argument.collisionLink.collisionBooleen && ( ( Date.now() - this.enemiesStage[this.stage][j].argument.lastFire ) > 500 ) ){
                  this.hit(j);
                }
              } else {
                if ( mouvement ){
                  this.moving(this.enemiesStage[this.stage][j], j);
                }
              }
              //sauvegarde la position des ennemis
              this.enemiesStage[this.stage][j].tailleX = parseFloat(this.div[j + 1100].style.width);
              this.enemiesStage[this.stage][j].tailleY = parseFloat(this.div[j + 1100].style.width);
              this.enemiesStage[this.stage][j].positionX = parseFloat(this.div[j + 1100].style.left);
              this.enemiesStage[this.stage][j].positionY = parseFloat(this.div[j + 1100].style.top);
            } else {
              this.enemiesStage[this.stage][j].positionY = parseFloat(this.div[j + 1100].style.top);
              this.div[j + 1100].style.opacity = 0;
            }
          }
        }
      }
    }
    this.requestID = window.requestAnimationFrame(function(timestamp){myBackground.animation(timestamp)});
  },
  //zone de vue des monstre
  aggro : function(enemi, indice){
    //objet de zone de vue
    var withinSight;
    //présence de link ou non
    var linkPresent = 0;
    var iteration;
    //distance entre link et l'ennemi
    var distance;
    var tan;
    //calcul de la tangante
    if ( enemi.argument.visibly == 'N' || enemi.argument.visibly == 'S' ) {
      tan =  ( ( enemi.positionX + ( enemi.tailleX / 2 ) ) - ( linkEtat.sauvPositionSprite.positionX + ( linkEtat.sauvPositionSprite.tailleX / 2 ) ) ) / ( ( enemi.positionY + ( enemi.tailleY / 2 ) ) - (linkEtat.sauvPositionSprite.positionY + ( linkEtat.sauvPositionSprite.tailleY / 2 ) )) ;
    } else {
      tan = ( ( enemi.positionY + ( enemi.tailleY / 2 ) ) - ( linkEtat.sauvPositionSprite.positionY + ( linkEtat.sauvPositionSprite.tailleY / 2 ) ) ) / ( ( enemi.positionX + ( enemi.tailleX / 2 ) ) - ( linkEtat.sauvPositionSprite.positionX + ( linkEtat.sauvPositionSprite.tailleX / 2 ) ) );
    }
    //verifi le sens pour implémenter la variable
    switch (enemi.argument.visibly) {
      case 'N':
        //verifi si le personnage est à moins de 100px et qu'il n'est pas derière et dans un angle 45° a droite et à gauche
        if ( ( enemi.positionY <= ( linkEtat.sauvPositionSprite.positionY - linkEtat.sauvPositionSprite.tailleY + 100 )) && (enemi.positionY >= linkEtat.sauvPositionSprite.positionY) && ( Math.atan(tan) < 0.785398 ) && ( Math.atan(tan) > -0.785398 ) ){
          linkPresent = 1;
          withinSight = {
            left : enemi.positionX,
            top : enemi.positionY,
            width : enemi.tailleX,
            height : 1
          };
          iteration = -1;
          ditance = enemi.positionY - ( linkEtat.sauvPositionSprite.positionY + linkEtat.sauvPositionSprite.tailleY )
        }
        break;
      case 'S':
        if( ( enemi.positionY + enemi.tailleY >= ( linkEtat.sauvPositionSprite.positionY - 100 ) ) && ( ( enemi.positionY + enemi.tailleY ) <= ( linkEtat.sauvPositionSprite.positionY - linkEtat.sauvPositionSprite.tailleY ) ) && ( Math.atan(tan) < 0.785398 ) && ( Math.atan(tan) > -0.785398 ) ){
          linkPresent = 1;
          withinSight = {
            left : enemi.positionX,
            top : enemi.positionY + enemi.tailleY,
            width : enemi.tailleX,
            height : 1
          };
          iteration = 1;
          distance = linkEtat.sauvPositionSprite.positionY - ( enemi.positionY + enemi.tailleY );
        }
        break;
      case 'W':
        if( ( (enemi.positionX <= ( linkEtat.sauvPositionSprite.positionX + linkEtat.sauvPositionSprite.tailleX + 100 ) ) ) && ( enemi.positionX >= linkEtat.sauvPositionSprite.positionX ) && (enemi.positionY >= linkEtat.sauvPositionSprite.positionY) && ( Math.atan(tan) < 0.785398 ) && ( Math.atan(tan) > -0.785398 ) ){
          linkPresent = 1;
          withinSight = {
            left : enemi.positionX,
            top : enemi.positionY,
            width : 1,
            height : enemi.tailleY
          };
          iteration = -1;
          distance = enemi.positionX - ( linkEtat.sauvPositionSprite.positionX + linkEtat.sauvPositionSprite.tailleX );
        }
        break;
      case 'E':
        if( ( ( enemi.positionX + enemi.tailleX ) >= ( linkEtat.sauvPositionSprite.positionX - 100 ) ) && ( ( enemi.positionX + enemi.tailleX ) <= ( linkEtat.sauvPositionSprite.positionX + linkEtat.sauvPositionSprite.tailleX ) )  && ( Math.atan(tan) < 0.785398 ) && ( Math.atan(tan) > -0.785398 ) ){
          linkPresent = 1;
          withinSight = {
            left : enemi.positionX + enemi.tailleX,
            top : enemi.positionY,
            width : 1,
            height : enemi.tailleY
          };
          iteration = 1;
          distance = linkEtat.sauvPositionSprite.positionX - ( enemi.positionX + enemi.tailleX );
        }
        break;

    }
    //si link est à moins de 100px et dans un angle de 45° lance la boucle
    if(linkPresent){
      //boucle la ligne de vue entre link et l'enemi pour voir si un obstacle est présent
      for (var i=0;i<distance;i++){
        //boucle les obstacles
        for ( var j=0;this.collisionListe[this.stage][j];j++){
          //si un obstacle est rencontré sort de la boucle
          if(!linkAction.testObstacle(enemi.argument.way.axies, enemi.argument.way.sens, withinSight, this.collisionListe[this.stage][j])){
            enemi.argument.aggro = 0;
            return false;
          }
        }
        if ( enemi.argument.visibly == 'N' || enemi.argument.visibly == 'S' ){
          withinSight.left += tan;
          withinSight.top += iteration;
        } else {
          withinSight.left += iteration;
          withinSight.top += tan;
        }
      }
      //si tous les test sont fini link est bien visible
      enemi.argument.lastAggro = Date.now();
      enemi.argument.aggro = 1;
      return true;
    } else {
      //si link est à plus de 100px sort de la boucle ou derrière
      enemi.argument.aggro = 0;
      return false;
    }
  },
  hit : function(indice){
    var sensPlusCoup = 0;
    //vérifie si link est dans le même sens
    if ( !( ( linkEtat.touche.direction == 'S' && this.enemiesStage[this.stage][indice].argument.way.direction == 'N' ) || ( linkEtat.touche.direction == 'E' && this.enemiesStage[this.stage][indice].argument.way.direction == 'W' ) ) ) {
      sensPlusCoup = 1;
    } else {
      //vérifi si il donne un coup d'épée
      if ( linkEtat.slachSword != 0 ) sensPlusCoup = 1;
    }
    //vérifie si link a été touché ou l'ennemi
    if ( ( ( Date.now() - linkEtat.collisionEnemi.lastFire ) > 2000 ) && linkEtat.slachSword != 4 && sensPlusCoup && linkEtat.life[0] > 0 ){
      linkAction.touche(this.enemiesStage[this.stage][indice].argument.damage);
      linkEtat.collisionEnemi.lastFire = Date.now();
    } else {
      if ( linkEtat.slachSword ){
        this.enemiesStage[this.stage][indice].argument.life--;
        this.enemiesStage[this.stage][indice].argument.lastFire = Date.now();
      }
    }
  },
  enemiesCollision : [],
  //ronde de l'ennemi
  moving : function(enemi, indice){
    //vérifi le sens pour changer la direction
    switch (enemi.argument.way.direction) {
      case 'N':
        if (enemi.argument.path.positionY <= enemi.positionY){
          //test si une collision a lieu avec un obstacle
          linkAction.moving( 'top', 0, this.div[indice + 1100].style, this.collisionListe[this.stage], 'N', enemi );
        } else {
          enemi.argument.way.axies = 'left';
          enemi.argument.way.sens = 0;
          enemi.argument.way.direction = 'W';
        }
        break;
      case 'W':
        if (enemi.argument.path.positionX <= enemi.positionX){
          //test si une collision a lieu avec un obstacle
          linkAction.moving( 'left', 0, this.div[indice + 1100].style, this.collisionListe[this.stage], 'W', enemi );
        } else {
          enemi.argument.way.axies = 'top';
          enemi.argument.way.sens = 1;
          enemi.argument.way.direction = 'S';
        }
        break;
      case 'S':
        if ( (enemi.argument.path.positionY + enemi.argument.path.tailleY) >= (enemi.positionY + enemi.tailleY) ){
          //test si une collision a lieu avec un obstacle
          linkAction.moving( 'top', 1, this.div[indice + 1100].style, this.collisionListe[this.stage], 'S', enemi );
        } else {
          enemi.argument.way.axies = 'left';
          enemi.argument.way.sens = 1;
          enemi.argument.way.direction = 'E';
        }
        break;
      case 'E':
        if ( (enemi.argument.path.positionX + enemi.argument.path.tailleX) >= (enemi.positionX + enemi.tailleX) ){
          //test si une collision a lieu avec un obstacle
          linkAction.moving( 'left', 1, this.div[indice + 1100].style, this.collisionListe[this.stage], 'E', enemi );
        } else {
          enemi.argument.way.axies = 'top';
          enemi.argument.way.sens = 0;
          enemi.argument.way.direction = 'N';
        }
        break;
    }
  },
  positionSprite : function(div, img, sprite){
    div.width = sprite.tailleX + 'px';//largeur de l'image visible
    div.height = sprite.tailleY + 'px';//hauteur de l'image visible
    img.top = sprite.positionY + 'px';//position de l'image en y
    img.left = sprite.positionX + 'px';//position de l'image en x
  },
  // liste des collisition
  collisionListe : [[//indice 0 chambre de link
    cP(178, 114, 15, 15, {chest : true, item : 9,
      chestContent : function(){
        myBackground.listeOfSkill[0].opacity = 1;
        linkEtat.item.shield = true;
        linkAction.walk = 1;
        linkAction.messageLoading = myBackground.arrayMessage[2];
        linkAction.textProgress = 1;
        linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
      }}), /* coffre */
    cP(27, 58, 12, 12, {lift : true, indice : 3, destructible : true}), /* Liste des pot - pot bas */
    cP(27, 42, 12, 12, {lift : true, indice : 3, destructible : true}), /* pot milieu */
    cP(27, 26, 12, 12, {lift : true, indice : 3, destructible : true}), /* pot haut */
    // cP(97, 178, 20, 0, {axies : 'top', exit : true, stage : 11, positionX : 169, positionY : 432, indice : 5, positionExit : -8}), /* sortie */
    cP(97, 178, 20, 0, {axies : 'top', exit : true, stage : 1, positionX : 184, positionY : 272, indice : 5, positionExit : -8}), /* sortie */
    cP(1, 152, 103, 26),/* bord bas gauche */
    cP(122, 152, 104, 26),/* bord bas droit */
    cP(0, 0, 226, 26),/* bord haut */
    cP(0, 0, 26, 178), /* bord gauche */
    cP(200, 0, 26, 178), /* bord droit */
    cP(153, 97, 16, 16),  /* tabouré du bas */
    cP(153, 49, 16, 16), /* tabouré du haut */
    cP(137, 64, 48, 34), /* grande table */
    cP(40, 112, 32, 23),  /* petite table */
    cP(41, 26, 32, 39), /* lit */
    cP(153, 19, 31, 12)
  ],[//indice 1 zone de la maison de link
    cP(144, 183, 96, 80, {home : true, indice : 8, positionExit : -7}), /* maison */
    cP(147, 269, 29, 3), //bas de maison gauche
    cP(208, 269, 28, 3), //bas de maison droite
    cP(236, 267, 2, 2), //bas de maison droite
    cP(176, 272, 7, 4), //bas de porte gauche
    cP(201, 272, 7, 4), //bas de porte droite
    cP(176, 271, 32, 0, {axies : 'top', door : true, stage : 0, indice : 7, positionExit : -26}),//ouverture de la porte
    cP(176, 265, 32, 0, {axies : 'top', exit : true, stage : 0, positionX : 105, positionY : 153, indice : 6, positionExit : -20}),//retour dans la maison de link
    cP(144, 288, 16, 16,{sword : 1, indice : 17, item : 17, hide : 1, chestContent : function(){
      myBackground.listeOfSkill[8].opacity = 1;
      linkEtat.key.express = 1;
      linkAction.messageLoading = myBackground.arrayMessage[9];
      linkAction.textProgress = 1;
      linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
    }, condition : function () {
      return (linkEtat.item.sword == 1 && !myBackground.collisionListe[1][25].existance());
    }}),
    //liste buisson
    cP(160, 64, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(176, 48, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(272, 48, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(304, 64, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(304, 64, 16, 16, {indice : 10, item : 10, hide : 1,
      chestContent : function(){
        myBackground.listeOfSkill[1].opacity = 1;
        linkEtat.item.blueChainMail = 1;
        linkEtat.spritePosition.color = 2;
        linkAction.messageLoading = myBackground.arrayMessage[3];
        linkAction.textProgress = 1;
        linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
      }, condition : function () {
        return !(myBackground.collisionListe[1][12].existance());
      }}),
    cP(32, 272, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(32, 288, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(32, 304, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(48, 272, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(48, 288, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(48, 304, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(112, 272, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(112, 288, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(128, 272, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(128, 288, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(144, 272, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(144, 288, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(224, 272, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(224, 288, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(240, 272, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(240, 288, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(416, 336, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(416, 352, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(432, 368, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(432, 352, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(448, 368, 16, 16, {lift : true, indice : 0, destructible : true}),
    //liste des pierre
    cP(128, 321, 16, 15, {lift : true, indice : 1, glove : 1}),
    cP(144, 321, 16, 15, {lift : true, indice : 1, glove : 1}),
    cP(208, 321, 16, 15, {lift : true, indice : 1, glove : 1}),
    cP(208, 321, 16, 15, {item : 16, indice : 16, hide: 1,
      chestContent : function(){
        myBackground.listeOfSkill[7].opacity = 1;
        linkEtat.key.mongoDB = 1;
        linkAction.messageLoading = myBackground.arrayMessage[7];
        linkAction.textProgress = 1;
        linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
      },
      condition : function () {
        return !(myBackground.collisionListe[1][37].existance());
      }
      }),//clé 1 mongoDB
    cP(224, 321, 16, 15, {lift : true, indice : 1, glove : 1}),
    cP(240, 321, 16, 15, {lift : true, indice : 1, glove : 1}),
    //bord gauche
    cP(448, 0, 0, 29),
    cP(447, 30, 1, 1),
    cP(446, 31, 1, 1),
    cP(444, 32, 2, 1),
    cP(443, 33, 1, 1),
    cP(442, 34, 1, 1),
    cP(441, 35, 1, 1),
    cP(440, 36, 1, 2),
    cP(439, 38, 1, 1),
    cP(438, 39, 1, 1),
    cP(436, 40, 2, 1),
    cP(435, 41, 1, 1),
    cP(434, 42, 1, 1),
    cP(433, 43, 1, 1),
    cP(432, 44, 1, 2),
    cP(431, 46, 1, 1),
    cP(430, 47, 1, 1),
    cP(428, 48, 2, 1),
    cP(427, 49, 1, 1),
    cP(426, 50, 1, 1),
    cP(425, 51, 1, 1),
    cP(424, 52, 1, 2),
    cP(423, 54, 1, 1),
    cP(422, 55, 1, 1),
    cP(420, 56, 2, 1),
    cP(419, 57, 1, 1),
    cP(418, 58, 1, 1),
    cP(417, 59, 1, 1),
    cP(416, 60, 1, 2),
    cP(415, 62, 1, 1),
    cP(414, 63, 1, 1),
    cP(412, 64, 2, 1),
    cP(411, 65, 1, 1),
    cP(410, 66, 1, 1),
    cP(409, 67, 1, 1),
    cP(408, 68, 1, 2),
    cP(407, 70, 1, 1),
    cP(406, 71, 1, 1),
    cP(404, 72, 2, 1),
    cP(403, 73, 1, 1),
    cP(402, 74, 1, 1),
    cP(401, 75, 1, 1),
    cP(400, 76, 1, 2),
    cP(399, 78, 1, 1),
    cP(398, 79, 1, 1),
    cP(396, 80, 2, 1),
    cP(395, 81, 1, 1),
    cP(394, 82, 1, 1),
    cP(393, 83, 1, 1),
    cP(392, 84, 1, 2),
    cP(391, 86, 1, 1),
    cP(390, 87, 1, 1),
    cP(388, 88, 2, 1),
    cP(387, 89, 1, 1),
    cP(386, 90, 1, 1),
    cP(385, 91, 1, 1),
    cP(384, 92, 3, 89),
    cP(387, 181, 2, 5),
    cP(389, 186, 6, 3),
    cP(395, 189, 2, 5),
    cP(397, 194, 7, 3),
    cP(404, 198, 7, 7),
    cP(411, 205, 5, 7),
    cP(416, 212, 3, 81),
    cP(419, 293, 8, 8),
    cP(427, 301, 8, 8),
    cP(435, 309, 8, 8),
    cP(451, 325, 8, 8),
    cP(459, 333, 8, 8),
    cP(467, 341, 8, 8),
    cP(475, 349, 8, 8),
    cP(483, 357, 8, 8),
    cP(491, 365, 21, 8),
    //bord bas gauche
    cP(300, 432, 212, 4),
    cP(297, 435, 3, 6),
    cP(290, 441, 7, 9),
    cP(281, 450, 9, 8),
    cP(274, 458, 7, 8),
    cP(265, 466, 9, 8),
    cP(258, 474, 7, 13),
    cP(256, 485, 2, 27),
    //bord bas droite
    cP(206, 485, 2, 27),
    cP(199, 473, 7, 12),
    cP(190, 466, 9, 7),
    cP(182, 457, 8, 9),
    cP(174, 449, 8, 8),
    cP(163, 441, 11, 8),
    cP(135, 440, 28, 1),
    cP(126, 434, 9, 6),
    cP(115, 425, 11, 9),
    cP(86, 424, 29, 2),
    cP(82, 426, 4, 6),
    cP(82, 426, 4, 6),
    cP(78, 432, 4, 2),
    cP(74, 434, 4, 4),
    cP(73, 438, 1, 2),
    cP(0, 440, 73, 0),
    //bord droite bas
    cP(0, 383, 51, 1),
    cP(50, 378, 5, 5),
    cP(51, 368, 5, 10),
    cP(56, 364, 5, 4),
    cP(61, 352, 3, 12),
    cP(64, 336, 3, 16),
    cP(64, 326, 4, 10),
    //autour de la maison de link
    cP(108, 326, 4, 10),
    cP(109, 336, 2, 14),
    cP(111, 350, 2, 10),
    cP(113, 360, 2, 4),
    cP(115, 364, 4, 3),
    cP(119, 367, 1, 1),
    cP(120, 368, 2, 9),
    cP(122, 377, 3, 3),
    cP(125, 380, 3, 3),
    cP(129, 383, 144, 1),
    cP(272, 380, 5, 3),
    cP(277, 375, 3, 5),
    cP(280, 372, 6, 3),
    cP(286, 367, 2, 5),
    cP(288, 364, 6, 3),
    cP(294, 359, 2, 5),
    cP(296, 356, 6, 3),
    cP(302, 181, 2, 175),
    cP(298, 170, 3, 3),
    cP(295, 168, 3, 2),
    cP(292, 163, 3, 5),
    cP(288, 161, 4, 2),
    cP(286, 160, 2, 1),
    cP(282, 154, 4, 6),
    cP(279, 152, 3, 2),
    cP(276, 147, 3, 5),
    cP(272, 145, 4, 2),
    cP(270, 144, 2, 1),
    cP(266, 138, 4, 6),
    cP(263, 136, 3, 2),
    cP(260, 131, 3, 5),
    cP(256, 129, 4, 2),
    cP(254, 128, 2, 1),
    cP(250, 122, 4, 6),
    cP(243, 121, 7, 1),
    cP(125, 120, 118, 1),
    cP(118, 121, 7, 1),
    cP(114, 122, 4, 6),
    cP(110, 128, 4, 2),
    cP(106, 130, 4, 4),
    cP(104, 134, 2, 3),
    cP(99, 137, 5, 4),
    cP(98, 141, 1, 3),
    cP(94, 144, 4, 2),
    cP(90, 146, 4, 4),
    cP(88, 150, 2, 3),
    cP(86, 153, 2, 1),
    cP(82, 154, 4, 11),
    cP(80, 165, 2, 44),
    cP(76, 209, 4, 2),
    cP(73, 211, 3, 5),
    cP(70, 216, 3, 2),
    cP(66, 218, 4, 6),
    cP(64, 224, 2, 1),
    cP(60, 225, 4, 2),
    cP(58, 227, 2, 3),
    cP(57, 230, 1, 2),
    cP(0, 232, 58, 0),
    //barière
    cP(48, 256, 24, 15),
    cP(72, 248, 8, 15),
    cP(80, 240, 8, 15),
    cP(88, 232, 8, 15),
    cP(96, 224, 8, 15),
    cP(104, 216, 8, 15),
    cP(112, 176, 8, 47),
    //arbre bord gauche
    cP(0, 191, 11, 1),
    cP(11, 188, 1, 3),
    cP(11, 188, 1, 3),
    cP(12, 185, 1, 3),
    cP(13, 183, 1, 3),
    cP(14, 182, 10, 0),
    cP(24, 178, 8, 6),
    cP(24, 178, 8, 6),
    cP(29, 176, 2, 2),
    cP(29, 176, 2, 2),
    cP(28, 169, 1, 7),
    cP(29, 167, 5, 2),
    cP(34, 163, 3, 4),
    cP(37, 151, 1, 12),
    cP(38, 148, 1, 3),
    cP(39, 137, 1, 12),
    cP(40, 135, 15, 1),
    cP(55, 120, 1, 15),
    cP(56, 106, 5, 14),
    cP(61, 103, 1, 3),
    cP(62, 100, 1, 3),
    cP(63, 88, 1, 12),
    cP(64, 87, 35, 1),
    cP(99, 87, 10, 7),
    cP(101, 94, 6, 2),
    cP(109, 86, 11, 1),
    cP(120, 87, 7, 1),
    cP(127, 73, 1, 14),
    cP(128, 71, 3, 2),
    cP(131, 14, 2, 13),
    cP(133, 55, 1, 3),
    cP(134, 52, 1, 3),
    cP(135, 40, 1, 12),
    cP(136, 39, 15, 1),
    cP(151, 25, 1, 14),
    cP(152, 23, 2, 2),
    cP(154, 22, 2, 1),
    cP(154, 10, 3, 12),
    cP(157, 7, 1, 3),
    cP(158, 4, 1, 3),
    cP(159, 0, 1, 4),
    //sommet de la falaise bas gauche
    cP(0, 342, 52, 0, {decallageX : 0, decallageY : 42, cliff : true}),
    cP(52, 339, 4, 3, {decallageX : 11, decallageY : 37, cliff : true}),
    cP(56, 334, 4, 5, {decallageX : 8, decallageY : 29, cliff : true}),
    cP(60, 331, 4, 3, {decallageX : 3, decallageY : 31, cliff : true}),
    cP(64, 326, 4, 3, {decallageX : 5, decallageY : 0, cliff : true}),
    //sommet de la falaise gauche
    cP(0, 249, 61, 0, {decallageX : 18, decallageY : 0, cliff : true}),
    cP(105, 158, 0, 23, {decallageX : 26, decallageY : 0, cliff : true}),
    cP(106, 154, 2, 5, {decallageX : 26, decallageY : 27, cliff : true}),
    cP(108, 150, 4, 3, {decallageX : 24, decallageY : 24, cliff : true}),
    cP(112, 146, 4, 4, {decallageX : 26, decallageY : 27, cliff : true}),
    cP(116, 142, 4, 3, {decallageX : 24, decallageY : 24, cliff : true}),
    cP(120, 137, 4, 5, {decallageX : 26, decallageY : 21, cliff : true}),
    //sommet de la falaise haut
    cP(124, 137, 120, 0, {decallageX : 0, decallageY : -18, cliff : true}),
    //sommet de la falaise droite
    cP(244, 138, 4, 4, {decallageX : 26, decallageY : -21, cliff : true}),
    cP(248, 142, 4, 3, {decallageX : 24, decallageY : -24, cliff : true}),
    cP(252, 145, 4, 5, {decallageX : 26, decallageY : -27, cliff : true}),
    cP(256, 150, 4, 3, {decallageX : 24, decallageY : -24, cliff : true}),
    cP(260, 153, 4, 5, {decallageX : 26, decallageY : -27, cliff : true}),
    cP(264, 158, 4, 3, {decallageX : 24, decallageY : -24, cliff : true}),
    cP(268, 162, 4, 5, {decallageX : 26, decallageY : -27, cliff : true}),
    cP(272, 166, 4, 3, {decallageX : 24, decallageY : -24, cliff : true}),
    cP(276, 169, 4, 5, {decallageX : 26, decallageY : -27, cliff : true}),
    cP(278, 174, 0, 165, {decallageX : 0, decallageY : 26, cliff : true}),
    cP(276, 339, 2, 3, {decallageX : -28, decallageY : 42, cliff : true}),
    //sommet de la falaise bas
    cP(124, 342, 152, 0, {decallageX : 0, decallageY : 42, cliff : true}),
    cP(120, 339, 4, 3, {decallageX : 15, decallageY : 40, cliff : true}),
    cP(116, 334, 4, 5, {decallageX : 12, decallageY : 34, cliff : true}),
    cP(112, 331, 4, 3, {decallageX : 8, decallageY : 34, cliff : true}),
    //sortie
    cP(160, 0, 288, 0, {axies : 'top', exit : true, stage : 3, positionX : 840, positionY : 1005}),//sortie nord
    cP(0, 182, 0, 50, {axies : 'left', exit : true, stage : 2, positionX : 496, positionY : true}),//sortie ouest haut
    cP(0, 248, 0, 96, {axies : 'left', exit : true, stage : 2, positionX : 496, positionY : true}),//sortie ouest centre
    cP(0, 384, 0, 57, {axies : 'left', exit : true, stage : 2, positionX : 496, positionY : true}),//sortie ouest bas
    cP(511, 373, 0, 59, {notExit : 1, decallageX: -10}),//sortie est
    cP(208, 511, 48, 0, {notExit : 1, decallageY: -10})//sortie sud
  ],[//indice stage 2 Forest
    //arbre droite haut
    cP(448, 135, 64, 49),
    cP(467, 184, 10, 4),
    cP(468, 188, 8, 4),
    cP(467, 184, 1, 4),
    cP(445, 161, 3, 8),
    cP(443, 163, 2, 4),
    cP(424, 121, 24, 15),
    cP(411, 102, 13, 19),
    cP(376, 101, 14, 20),
    cP(328, 87, 48, 49),
    cP(347, 136, 10, 4),
    cP(348, 140, 8, 3),
    cP(350, 143, 4, 1),
    cP(325, 113, 3, 8),
    cP(323, 115, 2, 4),
    cP(208, 44, 208, 44),
    cP(275, 88, 10, 4),
    cP(276, 92, 8, 2),
    cP(277, 94, 6, 2),
    cP(227, 89, 10, 3),
    cP(228, 92, 8, 2),
    cP(229, 94, 6, 2),
    cP(206, 65, 2, 8),
    cP(204, 66, 2, 6),
    cP(203, 68, 1, 2),
    cP(184, 1, 24, 39),
    cP(181, 17, 3, 8),
    cP(179, 19, 2, 4),
    //arbre haut gauche
    cP(82, 0, 30, 24),
    cP(49, 24, 39, 48),
    cP(39, 72, 25, 336),
    cP(53, 121, 35, 143),
    cP(76, 168, 36, 48),
    cP(112, 7, 3, 2),
    cP(115, 0, 2, 7),
    cP(88, 49, 3, 8),
    cP(91, 51, 2, 4),
    cP(112, 193, 3, 8),
    cP(115, 195, 2, 4),
    cP(88, 241, 3, 8),
    cP(91, 243, 2, 4),
    cP(88, 337, 3, 8),
    cP(91, 339, 2, 4),
    cP(64, 385, 3, 8),
    cP(67, 387, 2, 4),
    cP(41, 255, 23, 153),
    cP(88, 337, 3, 8),
    cP(91, 339, 2, 4),
    cP(51, 312, 37, 48),
    cP(64, 385, 2, 8),
    cP(66, 386, 2, 6),
    cP(34, 405, 1, 44),
    cP(34, 448, 74, 46),
    cP(108, 492, 25, 20),
    //arbre milieu
    cP(112,338,144,38),
    cP(136,290,96,44),
    cP(160,242,144,38),
    cP(184,194,144,38),
    cP(160,146,144,38),
    cP(109,353,150,8),
    cP(107,355,154,4),
    cP(157,257,150,8),
    cP(307,259,2,4),
    cP(328,209,3,8),
    cP(331,211,2,4),
    cP(131, 326, 10, 54),
    cP(132, 323, 8, 60),
    cP(134, 383, 4, 1),
    cP(179, 376, 10, 4),
    cP(180, 380, 8, 3),
    cP(182, 383, 4, 1),
    cP(227, 326, 10, 54),
    cP(228, 323, 8, 60),
    cP(230, 383, 4, 1),
    cP(275, 230, 10, 54),
    cP(276, 227, 8, 60),
    cP(278, 287, 4, 1),
    //falaise bas
    cP(192, 487, 1, 25),
    cP(193, 485, 1, 2),
    cP(194, 477, 1, 8),
    cP(195, 474, 3, 3),
    cP(198, 473, 2, 1),
    cP(201, 470, 1, 3),
    cP(202, 466, 4, 4),
    cP(206, 465, 2, 1),
    cP(208, 464, 2, 1),
    cP(208, 464, 2, 1),
    cP(210, 460, 2, 4),
    cP(212, 458, 2, 2),
    cP(214, 457, 3, 1),
    cP(217, 454, 1, 3),
    cP(219, 451, 2, 3),
    cP(220, 450, 2, 1),
    cP(222, 449, 2, 1),
    cP(224, 448, 2, 1),
    cP(226, 446, 1, 3),
    cP(227, 442, 3, 3),
    cP(230, 441, 7, 1),
    cP(237, 440, 275, 1),
    cP(297, 438, 94, 2),
    cP(298, 436, 92, 2),
    cP(299, 435, 90, 2),
    cP(300, 434, 88, 2),
    cP(302, 433, 84, 1),
    cP(304, 432, 80, 1),
    cP(306, 429, 76, 3),
    cP(307, 427, 74, 2),
    cP(308, 426, 72, 1),
    cP(310, 425, 68, 1),
    cP(312, 424, 64, 1),
    cP(313, 422, 62, 2),
    cP(314, 420, 60, 2),
    cP(315, 419, 58, 1),
    cP(316, 418, 56, 1),
    cP(318, 417, 52, 1),
    cP(320, 416, 48, 1),
    cP(322, 413, 44, 3),
    cP(323, 411, 42, 2),
    cP(324, 410, 40, 2),
    cP(326, 409, 36, 1),
    cP(333, 408, 22, 1),
    //falaise droite bas
    cP(481, 383, 32, 1),
    cP(478, 381, 2, 2),
    cP(476, 379, 2, 2),
    cP(474, 377, 2, 2),
    cP(473, 374, 1, 3),
    cP(472, 368, 1, 6),
    cP(469, 366, 3, 1),
    cP(467, 364, 2, 2),
    cP(466, 362, 1, 2),
    cP(464, 352, 1, 8),
    cP(463, 350, 1, 2),
    cP(462, 346, 1, 4),
    cP(461, 327, 1, 19),
    cP(460, 328, 1, 8),
    cP(465, 326, 2, 1),
    //falaise droite milieu
    cP(461, 232, 51, 1),
    cP(454, 233, 7, 1),
    cP(450, 235, 4, 6),
    cP(446, 240, 4, 2),
    cP(442, 242, 4, 4),
    cP(441, 246, 1, 3),
    cP(438, 249, 3, 1),
    cP(435, 250, 3, 3),
    cP(435, 250, 3, 3),
    cP(434, 253, 1, 3),
    cP(432, 256, 2, 1),
    cP(430, 257, 2, 1),
    cP(428, 258, 2, 2),
    cP(426, 260, 2, 2),
    cP(425, 262, 1, 3),
    cP(422, 265, 3, 1),
    cP(419, 266, 3, 3),
    cP(418, 269, 1, 3),
    cP(416, 272, 2, 1),
    cP(414, 273, 2, 1),
    cP(412, 275, 2, 2),
    cP(410, 276, 2, 2),
    cP(409, 278, 1, 2),
    cP(390, 281, 7, 1),
    cP(388, 282, 3, 3),
    cP(386, 286, 1, 3),
    cP(384, 288, 2, 1),
    cP(382, 289, 2, 1),
    cP(380, 290, 2, 2),
    cP(378, 292, 2, 2),
    cP(377, 294, 1, 3),
    cP(374, 297, 3, 1),
    cP(371, 298, 3, 3),
    cP(370, 301, 1, 3),
    cP(368, 304, 2, 48),
    cP(366, 305, 2, 46),
    cP(364, 306, 2, 44),
    cP(362, 308, 2, 40),
    cP(361, 310, 1, 37),
    cP(360, 312, 1, 33),
    cP(358, 313, 2, 30),
    cP(357, 314, 2, 28),
    cP(355, 315, 1, 26),
    cP(354, 317, 1, 23),
    cP(353, 326, 1, 14),
    cP(352, 327, 1, 6),
    cP(369, 352, 1, 3),
    cP(370, 355, 3, 2),
    cP(373, 357, 5, 2),
    cP(377, 359, 2, 4),
    cP(379, 363, 50, 2),
    cP(380, 365, 48, 1),
    cP(381, 366, 46, 1),
    cP(381, 366, 46, 1),
    cP(384, 367, 41, 1),
    cP(385, 368, 39, 3),
    cP(386, 371, 38, 1),
    cP(387, 372, 37, 2),
    cP(389, 374, 34, 1),
    cP(393, 375, 30, 2),
    cP(393, 377, 29, 2),
    cP(394, 379, 26, 2),
    cP(396, 381, 22, 2),
    cP(400, 383, 16, 1),
    cP(430, 360, 2, 3),
    cP(431, 352, 1, 8),
    cP(432, 350, 1, 2),
    cP(433, 346, 1, 4),
    cP(434, 336, 1, 10),
    cP(435, 328, 1, 8),
    cP(432, 326, 3, 3),
    //sommet de la falaise bas droite
    cP(476, 342, 36, 0, {decallageX : 0, decallageY : 42, cliff : true}),
    cP(472, 339, 4, 3, {decallageX : 15, decallageY : 40, cliff : true}),
    cP(468, 334, 4, 5, {decallageX : 12, decallageY : 34, cliff : true}),
    cP(464, 331, 4, 4, {decallageX : 12, decallageY : 34, cliff : true}),
    //sommet de la falaise milieu
    cP(428, 331, 4, 4, {decallageX : 8, decallageY : 34, cliff : true}),
    cP(424, 334, 5, 6, {decallageX : 12, decallageY : 34, cliff : true}),
    cP(420, 339, 4, 3, {decallageX : 15, decallageY : 40, cliff : true}),
    cP(396, 342, 24, 0, {decallageX : 0, decallageY : 42, cliff : true}),
    cP(392, 349, 4, 3, {decallageX : 42, decallageY : 42, cliff : true}),
    cP(388, 334, 4, 5, {decallageX : 40, decallageY : 41, cliff : true}),
    cP(384, 331, 4, 3, {decallageX : 36, decallageY : 42, cliff : true}),
    cP(380, 326, 4, 4, {decallageX : 32, decallageY : 41, cliff : true}),
    cP(379, 313, 0, 13, {decallageX : 26, decallageY : 0, cliff : true}),
    cP(380, 310, 4, 3, {decallageX : 24, decallageY : 24, cliff : true}),
    cP(384, 306, 4, 5, {decallageX : 26, decallageY : 27, cliff : true}),
    cP(388, 302, 4, 3, {decallageX : 24, decallageY : 24, cliff : true}),
    cP(392, 298, 4, 4, {decallageX : 26, decallageY : 21, cliff : true}),
    cP(396, 296, 18, 2, {decallageX : 40, decallageY : 24, cliff : true}),
    cP(414, 294, 3, 2, {decallageX : 40, decallageY : 24, cliff : true}),
    cP(417, 289, 5, 3, {decallageX : 42, decallageY : 27, cliff : true}),
    cP(420, 286, 4, 3, {decallageX : 40, decallageY : 24, cliff : true}),
    cP(424, 281, 4, 5, {decallageX : 42, decallageY : 27, cliff : true}),
    cP(428, 278, 4, 3, {decallageX : 35, decallageY : 24, cliff : true}),
    cP(432, 273, 4, 5, {decallageX : 25, decallageY : 27, cliff : true}),
    cP(236, 270, 4, 3, {decallageX : 24, decallageY : 24, cliff : true}),
    cP(240, 265, 4, 5, {decallageX : 26, decallageY : 27, cliff : true}),
    cP(444, 262, 4, 3, {decallageX : 24, decallageY : 24, cliff : true}),
    cP(448, 257, 4, 5, {decallageX : 26, decallageY : 27, cliff : true}),
    cP(452, 255, 4, 3, {decallageX : 24, decallageY : 24, cliff : true}),
    cP(456, 250, 4, 4, {decallageX : 26, decallageY : 21, cliff : true}),
    cP(460, 249, 52, 0, {decallageX : 0, decallageY : 18, cliff : true}),
    //grosse plaque
    cP(384, 96, 32, 32, {lift : true, indice : 12, glove : true}),
    cP(384, 96, 7, 31),
    cP(409, 96, 7, 31),
    cP(391, 103, 18, 1, {axies : 'top', exit : true, stage : 7, positionX : 72, positionY : 374}),
    //tronc coupé
    cP(286, 320, 4, 32),
    cP(285, 321, 6, 29),
    cP(284, 322, 8, 1),
    cP(274, 323, 28, 26),
    cP(272, 333, 32, 5),
    //liste des buisson
    cP(112, 384, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(112, 400, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(128, 384, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(128, 400, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(144, 384, 16, 16, {lift : true, indice : 0, destructible : true}),
    //item
    cP(144, 384, 16, 16, {chestContent : function(){
      myBackground.listeOfSkill[5].opacity = 1;
      linkEtat.item.glove = 1;
      linkAction.messageLoading = myBackground.arrayMessage[5];
      linkAction.textProgress = 1;
      linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
    }, sword : 1, indice : 13, item : 13, hide : 1, condition: function(){
      return (linkEtat.item.sword == 1 && !myBackground.collisionListe[myBackground.stage][251].existance());
    }, }),
    cP(144, 400, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(176, 384, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(176, 400, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(192, 384, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(192, 384, 16, 16, {indice : 21, item : 21, hide : 1, condition: function(){
      return !myBackground.collisionListe[myBackground.stage][256].existance();
    }, chestContent : function(){
      myBackground.listeOfSkill[3].opacity = 1;
        linkEtat.item.heart4 = 1;
        linkEtat.life[3] = 4;
        linkEtat.life[2] = 4;
        linkEtat.life[1] = 4;
        linkEtat.life[0] = 4;
        linkAction.messageLoading = myBackground.arrayMessage[8];
        linkAction.textProgress = 1;
        linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)})
      } }),
    cP(192, 400, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(208, 384, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(208, 400, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(224, 96, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(240, 96, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(256, 96, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(272, 96, 16, 16, {lift : true, indice : 0, destructible : true}),
    cP(288, 96, 16, 16, {lift : true, indice : 0, destructible : true}),
    //arbre milieu
    cP(344, 210, 48, 38, {tree : true, decallageX : 1, decallageY : 1, indice : 13, url : 'image/Forest Area 2.2.png'}),
    cP(363, 206, 10, 46),
    cP(364, 203, 8, 52),
    cP(366, 202, 4, 54),
    cP(342, 225, 53, 8),
    cP(339, 227, 58, 4),
    cP(104, 511, 90, 1, {notExit : 1, decallageY : -10}),
    //sortie
    cP(512, 182, 0, 50, {axies : 'left', exit : true, stage : 1, positionX : 0, positionY : true}),//sortie est haut
    cP(512, 248, 0, 96, {axies : 'left', exit : true, stage : 1, positionX : 0, positionY : true}),//sortie est centre
    cP(512, 384, 0, 57, {axies : 'left', exit : true, stage : 1, positionX : 0, positionY : true}),//sortie est bas
    cP(116, 0, 61, 0, {axies : 'top', exit : true, stage : 5, positionX : 140, positionY : 496}),//sortie nord
  ],[//indice 3 chateau
    cP(704, 214, 9, 25),//contour gauche du souterrain
    cP(704, 191, 32, 23),//contour haut du souterrain
    cP(728, 214, 8, 25),//contour droite du souterrain
    cP(960, 957, 1, 66),
    cP(952, 950, 8, 8),
    cP(944, 942, 8, 8),
    cP(936, 934, 8, 8),
    cP(928, 926, 8, 8),
    cP(920, 918, 8, 8),
    cP(912, 910, 8, 8),
    cP(560, 735, 352, 175),
    cP(896, 727, 8, 8),
    cP(904, 719, 8, 8),
    cP(912, 711, 8, 8),
    cP(920, 703, 8, 8),
    cP(928, 695, 8, 8),
    cP(936, 646, 1, 49),
    cP(928, 660, 8, 22),
    cP(932, 656, 4, 4),
    cP(932, 682, 4, 4),
    cP(928, 638, 4, 4),
    cP(920, 223, 8, 15, {tree : true, decallageX : 1, decallageY : 1, indice : 13, url : 'image/castle-2.png'}),
    cP(904, 223, 32, 15),
    cP(936, 207, 24, 16),
    cP(904, 319, 16, 15),
    cP(952, 71, 8, 136),
    cP(848, 77, 105, 1),
    cP(176, 78, 672, 113),
    cP(752, 190, 80, 377),
    cP(736, 359, 112, 136),
    cP(176, 359, 112, 136),
    cP(560, 567, 288, 104),
    cP(463, 591, 98, 64),
    cP(384, 671, 80, 48),
    cP(560, 671, 80, 48),
    cP(617, 601, 80, 65),
    cP(176, 567, 288, 104),
    cP(192, 190, 80, 378),
    cP(456, 735, 7, 159),
    cP(112, 735, 344, 175),
    cP(104, 727, 8, 8),
    cP(96, 719, 8, 8),
    cP(88, 711, 8, 8),
    cP(80, 383, 8, 328),
    cP(32, 895, 8, 31),
    cP(218, 966, 415, 39),
    cP(193, 1005, 464, 18),
    cP(0, 957, 84, 66),
    cP(0, 951, 81, 48),
    cP(0, 906, 11, 45),
    cP(840, 907, 48, 44),
    cP(836, 928, 56, 8),
    cP(860, 893, 8, 65),
    cP(80, 63, 69, 15),
    cP(80, 63, 69, 15),
    cP(80, 78, 8, 144),
    cP(120, 76, 48, 43),
    cP(116, 96, 57, 8),
    cP(139, 95, 9, 31),
    cP(888, 70, 48, 49),
    cP(894, 96, 56, 8),
    cP(908, 59, 8, 67),
    cP(576, 287, 24, 112),
    cP(632, 328, 48, 47),
    cP(652, 324, 8, 58),
    cP(628, 353, 56, 6),
    cP(736, 271, 16, 15),
    cP(632, 271, 16, 15),
    cP(568, 271, 32, 16),
    cP(536, 271, 16, 32),
    cP(472, 267, 15, 36),
    cP(424, 271, 32, 16),
    cP(360, 271, 32, 16),
    cP(424, 303, 24, 80),
    cP(424, 399, 24, 48),
    cP(424, 463, 24, 48),
    cP(576, 511, 24, 32),
    cP(608, 415, 24, 80),
    cP(680, 415, 24, 80),
    cP(632, 463, 16, 21),
    cP(632, 431, 16, 21),
    cP(664, 431, 16, 21),
    cP(664, 463, 16, 21),
    cP(920, 223, 9, 415),
    cP(336, 399, 16, 21),
    cP(336, 431, 16, 21),
    cP(336, 463, 16, 21),
    cP(336, 495, 16, 21),
    cP(384, 399, 16, 21),
    cP(384, 431, 16, 21),
    cP(384, 463, 16, 21),
    cP(384, 495, 16, 21),
    cP(336, 190, 162, 81),
    cP(552, 188, 136, 83),
    cP(344, 329, 48, 46),
    cP(340, 353, 56, 6),
    cP(364, 326, 8, 56),
    cP(128, 127, 32, 32, {lift : true, indice : 23, glove : true}),
    cP(96, 159, 32, 32, {lift : true, indice : 23, glove : true}),
    cP(100, 165, 16, 16, {hide : true, sword : 1, indice : 11, item : 11,
      condition: function(){
        return !myBackground.collisionListe[myBackground.stage][98].existance();
      }, chestContent : function(){
        myBackground.listeOfSkill[4].opacity = 1;
        linkEtat.item.redChainMail = 1;
        linkEtat.spritePosition.color = 3;
        linkAction.messageLoading = myBackground.arrayMessage[17];
        linkAction.textProgress = 1;
        linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
      }}),
    cP(48, 911, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(64, 911, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(80, 911, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(96, 927, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(112, 943, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(128, 943, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(144, 943, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(160, 959, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(176, 959, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(176, 976, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 943, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 959, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 943, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 959, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(768, 943, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(784, 959, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(768, 959, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(784, 943, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(896, 943, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(928, 943, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(912, 927, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(896, 911, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(96, 79, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(96, 127, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(112, 127, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(96, 143, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(112, 143, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(160, 447, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(160, 462, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(192, 703, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(208, 703, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(224, 703, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(224, 719, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(208, 719, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(240, 719, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(256, 719, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(272, 719, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(656, 671, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(656, 703, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(656, 687, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 687, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 703, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 703, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(752, 703, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(800, 703, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(816, 703, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(896, 463, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(896, 415, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(896, 367, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(896, 303, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(896, 271, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(864, 271, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(864, 239, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(864, 159, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(928, 191, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(928, 143, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(864, 79, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(880, 191, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(609, 271, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(609, 287, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(864, 289, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(864, 399, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(864, 303, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(816, 687, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(672, 671, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(752, 671, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(768, 671, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(784, 671, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(688, 671, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(672, 687, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(752, 687, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(768, 687, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(288, 223, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(304, 223, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(320, 223, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(288, 239, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(304, 239, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(320, 239, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(416, 511, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(432, 511, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(416, 527, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(432, 527, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(576, 399, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(576, 415, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(576, 431, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(576, 447, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(576, 463, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(576, 479, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(576, 495, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(592, 399, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(592, 415, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(592, 431, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(592, 447, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(592, 463, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(592, 479, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(592, 495, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(608, 399, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(608, 495, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(624, 399, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(624, 495, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(672, 495, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(672, 495, 16, 15, {hide : true, sword : 1, indice : 22, item : 22,
      condition: function(){
        return !myBackground.collisionListe[myBackground.stage][200].existance();
      }, chestContent : function(){
        myBackground.listeOfSkill[12].opacity = 1;
        linkEtat.item.heart6 = 1;
        linkEtat.life[5] = 4;
        linkEtat.life[4] = 4;
        linkEtat.life[3] = 4;
        linkEtat.life[2] = 4;
        linkEtat.life[1] = 4;
        linkEtat.life[0] = 4;
        linkAction.messageLoading = myBackground.arrayMessage[13];
        linkAction.textProgress = 1;
        linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
      }}),
    cP(688, 495, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 495, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 479, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 463, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 447, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 431, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 399, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 527, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(688, 527, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(672, 527, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(688, 399, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(672, 399, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 415, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 495, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 479, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 463, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 447, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 431, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 399, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 415, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(736, 543, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 272, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 303, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 319, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 335, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 351, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 309, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(704, 325, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 272, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 303, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 319, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 335, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 351, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(896, 239, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(896, 239, 16, 15, {hide : true, indice : 14, sword : 1, item : 14,
      condition: function(){
        return !myBackground.collisionListe[myBackground.stage][235].existance();
      }, chestContent : function(){
        myBackground.listeOfSkill[6].opacity = 1;
        linkEtat.item.heart5 = 1;
        linkAction.messageLoading = myBackground.arrayMessage[6];
        linkEtat.life[4] = 4;
        linkEtat.life[3] = 4;
        linkEtat.life[2] = 4;
        linkEtat.life[1] = 4;
        linkEtat.life[0] = 4;
        linkAction.textProgress = 1;
        linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
      }}),
    cP(720, 309, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(720, 325, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(736, 207, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(736, 191, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(912, 944, 16, 15, {lift : true, indice : 1 , glove : true}),
    cP(896, 928, 16, 15, {lift : true, indice : 1 , glove : true}),
    //escalier
    cP(488, 302, 50, 1, {stairs : true, decallageY : -16}),
    cP(488, 303, 50, 1, {hide : 1, indice: 24, item: 24, condition: function(){
      if ( !( linkEtat.key.mongoDB && linkEtat.key.express && linkEtat.key.angular && linkEtat.key.nodeJS ) && linkEtat.collision.position == 244 ) {
        linkAction.messageLoading = myBackground.arrayMessage[18];
        linkEtat.collision.position = null;
      }
      return ( linkEtat.key.mongoDB && linkEtat.key.express && linkEtat.key.angular && linkEtat.key.nodeJS );
    }, chestContent : function(){
      myBackground.collisionListe[myBackground.stage][244].modif(false);
    }}),
    cP(487, 287, 50, 1, {stairs : true, decallageY : 16}),
    //stell à pousser
    cP(891, 151, 26, 24, {push : 24, decallageY : -10, sauvY : 151}),
    //pas une sortie
    cP(78, 1022, 120, 1, {notExit : 1, decallageY : -10 }),
    //pas une sortie
    cP(0, 292, 1, 40, {notExit : 1, decallageX : 10 }),
    cP(79, 221, 1, 164, {notExit : 1, decallageX : 10 }),
    //porte du chateau
    cP(496, 270, 32, 1, {axies : 'top', door : true, indice : 26, positionExit : -26}),
    //porte du principale
    cP(496, 269, 32, 1, {axies : 'top', door : true, indice : 27, positionExit : -25}),
    //sortie
    cP(496, 246, 32, 1, {axies : 'top', exit : 1, stage : 11, positionX : 169, positionY : 432}),//sortie nord
    cP(704, 214, 32, 1, {axies : 'top', exit : 1, stage : 4, positionX : 92, positionY : 433}),//sortie nord nord est
    cP(892, 156, 24, 1, {axies : 'top', exit : 1, stage : 4, positionX : 364, positionY : 146, indice : 22, positionExit :  -3, opacity: 0, zindex: 1}),//sortie nord est
    cP(654, 1022, 306, 1, {axies : 'top', exit : 1, stage : 1, positionX : 329, positionY : 2}),//sortie sud
  ],[//indice 4
    cP(386, 154, 43, 216, {tree : true, decallageX : 1, decallageY : 1, indice : 13, url : 'image/secret-2.png'}),
    cP(382, 154, 5, 29),
    cP(94, 154, 268, 121),
    cP(362, 274, 19, 1),
    cP(364, 315, 24, 16),
    cP(308, 315, 24, 16),
    cP(308, 275, 8, 40),
    cP(139, 370, 248, 41),
    cP(276, 323, 16, 16),
    cP(115, 306, 162, 66),
    cP(101, 363, 39, 31),
    cP(28, 363, 39, 31),
    cP(68, 356, 7, 30),
    cP(93, 356, 7, 30),
    cP(94, 410, 46, 28),
    cP(28, 410, 46, 28),
    cP(27, 394, 1, 16),
    cP(52, 274, 1, 88),
    cP(53, 131, 21, 145),
    cP(68, 50, 1, 81),
    cP(68, 50, 335, 1),
    cP(403, 50, 1, 56),
    cP(389, 106, 38, 32),
    cP(317, 106, 38, 32),
    cP(356, 100, 7, 30),
    cP(381, 100, 7, 30),
    cP(316, 138, 1, 17),
    cP(99, 82, 242, 23),
    cP(99, 88, 1, 43),
    // coffre
    cP(341, 292, 15, 15, {chest : true, item : 19,
      chestContent : function(){
        myBackground.listeOfSkill[10].opacity = 1;
        linkEtat.key.nodeJS = 1;
        linkAction.messageLoading = myBackground.arrayMessage[14];
        linkAction.textProgress = 1;
        linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
      }}),
      //pot
    cP(366, 332, 12, 12, {lift : true, indice : 3, destructible : true}),
    cP(366, 348, 12, 12, {lift : true, indice : 3, destructible : true}),
    //escalier
    cP(363, 130, 18, 1, {stairs : true, decallageY : -35}),
    cP(363, 100, 18, 1, {stairs : true, decallageY : 35}),
    cP(75, 356, 18, 1, {stairs : true, decallageY : 35}),
    cP(75, 386, 18, 1, {stairs : true, decallageY : -35}),
    cP(74, 147, 20, 1, {stairs : true, decallageY : 120}),
    cP(74, 261, 20, 1, {stairs : true, decallageY : -120}),
    //sortie
    cP(361, 176, 22, 1, {axies : 'top', exit : 1, stage : 3, positionX : 892, positionY : 170}),//sortie est
    cP(74, 431, 20, 1, {axies : 'top', exit : 1, stage : 3, positionX : 712, positionY : 226})//sortie sud
  ],[//indice 5 foret couloir
    //barrière gauche
    cP(112, 432, 8, 63),
    cP(80, 432, 32, 15),
    //barrière droite
    cP(168, 432, 8, 63),
    cP(176, 432, 32, 15),
    //poteau
    cP(134, 429, 4, 3),
    cP(129, 423, 14, 6),
    cP(128, 417, 16, 6),
    //arbre droite
    cP(192, 468, 48, 38),
    cP(216, 418, 15, 38),
    cP(192, 386, 48, 38),
    cP(188, 372, 10, 9),
    cP(169, 338, 34, 38),
    cP(144, 290, 88, 38),
    cP(174, 237, 29, 53),
    cP(198, 187, 38, 49),
    cP(168, 146, 48, 38),
    cP(163, 136, 10, 9),
    cP(144, 98, 48, 38),
    cP(163, 136, 10, 8),
    cP(120, 50, 48, 38),
    cP(139, 87, 10, 8),
    cP(107, 0, 48, 40),
    cP(117, 65, 3, 8),
    cP(115, 67, 2, 4),
    cP(141, 113, 3, 8),
    cP(139, 115, 2, 4),
    cP(165, 161, 3, 8),
    cP(163, 163, 2, 4),
    cP(141, 305, 3, 8),
    cP(139, 307, 2, 4),
    cP(165, 353, 3, 8),
    cP(163, 355, 2, 4),
    cP(189, 401, 3, 8),
    cP(187, 403, 2, 4),
    cP(123, 190, 10, 46),
    cP(124, 236, 8, 2),
    cP(125, 238, 6, 2),
    cP(101, 209, 54, 8),
    cP(99, 211, 58, 4),
    cP(67, 466, 15, 16),
    cP(66, 434, 6, 32),
    cP(67, 424, 10, 8),
    cP(48, 386, 48, 38),
    cP(67, 379, 10, 46),
    cP(72, 338, 48, 38),
    cP(91, 330, 10, 54),
    cP(48, 290, 48, 38),
    cP(67, 282, 10, 54),
    cP(24, 242, 48, 38),
    cP(43, 234, 10, 54),
    cP(0, 194, 47, 38),
    cP(19, 186, 10, 54),
    cP(24, 146, 48, 38),
    cP(43, 138, 10, 54),
    cP(0, 98, 48, 38),
    cP(19, 90, 10, 54),
    cP(24, 50, 48, 38),
    cP(43, 42, 10, 54),
    cP(35, 0, 50, 40),
    cP(73, 65, 3, 8),
    cP(76, 67, 2, 4),
    cP(72, 161, 3, 8),
    cP(75, 163, 2, 4),
    cP(120, 353, 3, 8),
    cP(123, 355, 2, 4),
    cP(96, 401, 3, 8),
    cP(99, 403, 2, 4),
    //arbre gauche
    cP(77, 482, 20, 30),
    //arbre milieu
    cP(104, 194, 48, 38, {tree : true, decallageX : 1, decallageY : 1, indice : 13, url : 'image/Forest Entrance 1-2.png'}),
    //buisson
    cP(96, 128, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(128, 240, 16, 15, {lift : true, indice : 0, destructible : true}),
    cP(112, 272, 16, 15, {lift : true, indice : 0, destructible : true}),
    //sortie
    cP(125, 512, 38, 0, {axies : 'top', exit : true, stage : 2, positionX : true, positionY : 0}),//sortie sud
    cP(83, 0, 27, 0, {axies : 'top', exit : true, stage : 10, positionX : 128, positionY : 480}),//sortie nord
  ],[//indice 6
  ],[//indice 7 grotte première partie
    //mur bas gauche
    cP(70, 374, 2, 17),
    cP(68, 372, 2, 2),
    cP(66, 370, 2, 2),
    cP(56, 368, 10, 2),
    cP(55, 264, 1, 104),
    cP(56, 263, 16, 1),
    //escalier
    cP(72, 263, 16, 1, {stairs : true, decallageY : -32}),
    cP(72, 232, 16, 1, {stairs : true, decallageY : 32}),
    //mure bas droite
    cP(88, 263, 16, 1),
    cP(104, 264, 1, 104),
    cP(94, 368, 10, 2),
    cP(92, 370, 2, 2),
    cP(90, 372, 2, 2),
    cP(88, 374, 2, 18),
    //mure haut gauche
    cP(64, 232, 8, 1),
    cP(32, 224, 32, 8),
    cP(31, 86, 1, 138),
    cP(32, 122, 4, 76),
    cP(36, 123, 2, 74),
    cP(38, 130, 6, 60),
    cP(44, 131, 2, 58),
    cP(46, 138, 6, 44),
    cP(52, 139, 2, 42),
    cP(54, 144, 2, 32),
    cP(32, 78, 6, 8),
    cP(38, 70, 8, 8),
    cP(46, 62, 8, 8),
    cP(54, 54, 8, 8),
    cP(62, 46, 8, 8),
    cP(70, 38, 8, 8),
    cP(78, 32, 8, 6),
    cP(86, 31, 69, 1),
    cP(154, 32, 6, 6),
    cP(160, 38, 27, 16),
    cP(160, 76, 28, 14),
    cP(154, 90, 6, 8),
    cP(146, 98, 8, 8),
    cP(138, 106, 8, 8),
    cP(130, 114, 8, 6),
    cP(128, 120, 2, 104),
    cP(96, 224, 32, 8),
    cP(88, 232, 8, 1),
    //sortie
    cP(187, 54, 1, 22, {axies : 'left', exit : true, stage : 8, positionX : 6, positionY : 96}),//sortie est
    cP(72, 391, 16, 1, {axies : 'top', exit : true, stage : 2, positionX : 392, positionY : 128}),//sortie sud
  ],[//indice 8 grotte seconde partie
    //partie gauche haut
    cP(1, 78, 31, 16),
    cP(32, 70, 6, 8),
    cP(38, 62, 8, 8),
    cP(46, 54, 8, 8),
    cP(54, 46, 8, 8),
    cP(62, 38, 8, 8),
    cP(70, 32, 8, 6),
    cP(78, 31, 84, 1),
    cP(162, 32, 8, 6),
    cP(170, 38, 8, 8),
    cP(178, 46, 8, 8),
    cP(186, 54, 6, 8),
    cP(192, 62, 1, 68),
    cP(186, 130, 6, 8),
    cP(178, 138, 8, 8),
    cP(170, 146, 8, 8),
    cP(162, 154, 8, 8),
    cP(154, 162, 8, 8),
    cP(146, 170, 8, 6),
    cP(122, 176, 24, 32),
    cP(124, 40, 16, 16, {chest : true, item : 20,
      chestContent : function(){
        myBackground.listeOfSkill[11].opacity = 1;
        linkEtat.item.bow = 1;
        linkAction.messageLoading = myBackground.arrayMessage[10];
        linkAction.textProgress = 1;
        linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
      }}), /* coffre */
    // cP(94, 176, 33, 1,{bomb : true, indice : 21, positionX : 94, positionY : 179}),//zone destructible
    cP(78, 176, 22, 32),
    cP(70, 170, 8, 6),
    cP(62, 162, 8, 8),
    cP(54, 154, 8, 8),
    cP(46, 146, 8, 8),
    cP(38, 138, 8, 8),
    cP(32, 130, 6, 8),
    cP(0, 116, 32, 14),
    //flambo petit
    cP(80, 128, 16, 16),
    cP(128, 128, 16, 16),
    //flambo grand
    cP(96, 98, 16, 14),
    cP(160, 82, 16, 14),
    cP(96, 42, 16, 14),
    //sortie
    cP(0, 94, 1, 20, {axies : 'left', exit : true, stage : 7, positionX : 158, positionY : 56}),//sortie est
    cP(100, 207, 22, 1, {axies : 'top', exit : true, stage : 9, positionX : 72, positionY : 22})//sortie sud
  ],[//indice 9 grotte troisième partie
    //tour de la grotte
    cP(46, 0, 23, 32),
    cP(91, 0, 5, 32),
    cP(96, 33, 1, 50),
    cP(90, 82, 6, 8),
    cP(82, 90, 8, 6),
    cP(32, 96, 50, 1),
    cP(31, 46, 1, 50),
    cP(32, 38, 6, 8),
    cP(38, 32, 8, 6),
    //coffre
    cP(48, 64, 16, 16, {chest : true, item : 18, chestContent : function(){
      myBackground.listeOfSkill[9].opacity = 1;
      linkEtat.key.angular = 1;
      linkAction.messageLoading = myBackground.arrayMessage[12];
      linkAction.textProgress = 1;
      myBackground.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)})}}),
    //sortie
    cP(69, 0, 22, 1, {axies : 'top', exit : true, stage : 8, positionX : 103, positionY : 180}),
  ],[//indice 10 zone épée
    //bord feuillage
    cP(60, 486, 60, 26, {tree : true, decallageX : 1, decallageY : 1, indice : 13, url : 'image/Master_Sword_Pedestal_Area_2.png'}),
    cP(22, 472, 38, 14),
    cP(22, 472, 38, 14),
    cP(22, 423, 1, 49),
    cP(22, 388, 18, 36),
    cP(22, 326, 1, 62),
    cP(8, 324, 15, 2),
    cP(8, 282, 1, 42),
    cP(8, 272, 17, 11),
    cP(24, 241, 17, 32),
    cP(8, 223, 16, 17),
    cP(8, 80, 1, 143),
    cP(8, 61, 12, 19),
    cP(20, 44, 20, 17),
    cP(40, 27, 17, 17),
    cP(57, 12, 16, 12),
    cP(73, 15, 79, 1),
    cP(152, 15, 16, 17),
    cP(168, 32, 16, 16),
    cP(184, 48, 16, 16),
    cP(200, 64, 16, 16),
    cP(216, 80, 16, 16),
    cP(232, 96, 16, 16),
    cP(248, 112, 1, 32),
    cP(232, 144, 17, 88),
    cP(248, 232, 1, 40),
    cP(232, 272, 17, 89),
    cP(248, 361, 1, 39),
    cP(232, 400, 17, 60),
    cP(240, 460, 1, 8),
    cP(232, 468, 9, 15),
    cP(216, 483, 16, 5),
    cP(180, 488, 36, 6),
    cP(153, 494, 27, 18),
    cP(152, 486, 7, 9),
    //contour de la zone surelvé
    cP(80, 199, 8, 22),
    cP(79, 193, 3, 23),
    cP(79, 193, 3, 23),
    cP(78, 190, 2, 25),
    cP(76, 188, 2, 26),
    cP(74, 186, 2, 26),
    cP(72, 184, 2, 26),
    cP(70, 182, 2, 26),
    cP(68, 180, 2, 26),
    cP(66, 178, 2, 26),
    cP(64, 176, 2, 26),
    cP(62, 113, 2, 87),
    cP(60, 115, 2, 83),
    cP(58, 117, 2, 79),
    cP(56, 119, 2, 75),
    cP(54, 121, 2, 71),
    cP(52, 123, 2, 67),
    cP(50, 125, 2, 63),
    cP(48, 127, 2, 59),
    cP(64, 111, 2, 17),
    cP(66, 109, 2, 17),
    cP(68, 107, 2, 17),
    cP(70, 105, 2, 17),
    cP(72, 103, 2, 17),
    cP(74, 101, 2, 17),
    cP(76, 99, 2, 17),
    cP(79, 98, 2, 16),
    cP(79, 97, 82, 15),
    cP(160, 98, 2, 16),
    cP(162, 99, 2, 17),
    cP(164, 101, 2, 17),
    cP(166, 103, 2, 17),
    cP(168, 105, 2, 17),
    cP(170, 107, 2, 17),
    cP(172, 109, 2, 17),
    cP(174, 111, 2, 17),
    cP(176, 113, 1, 87),
    cP(177, 114, 2, 85),
    cP(179, 116, 2, 81),
    cP(181, 118, 2, 77),
    cP(183, 120, 2, 73),
    cP(185, 122, 2, 69),
    cP(187, 124, 2, 65),
    cP(189, 126, 2, 61),
    cP(191, 128, 1, 57),
    cP(174, 176, 2, 26),
    cP(172, 178, 2, 26),
    cP(170, 180, 2, 26),
    cP(168, 182, 2, 26),
    cP(166, 184, 2, 26),
    cP(164, 186, 2, 26),
    cP(162, 188, 2, 26),
    cP(160, 190, 2, 26),
    cP(158, 194, 2, 5),
    cP(152, 199, 8, 22),
    //stell
    cP(109, 166, 22, 2),
    cP(107, 164, 26, 2),
    cP(105, 162, 30, 2),
    cP(104, 136, 8, 26),
    cP(128, 136, 8, 26),
    cP(112, 145, 16, 16, {treasure : true, item : 15, chestContent : function(){
      myBackground.listeOfSkill[2].opacity = 1;
      linkEtat.item.sword = true;
      linkAction.walk = 1;
      linkAction.messageLoading = myBackground.arrayMessage[4];
      linkAction.textProgress = 1;
      linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
    }}),
    //escalier
    cP(88, 201, 64, 1, {stairs : true, decallageY : 15}),
    cP(88, 215, 64, 1, {stairs : true, decallageY : -15}),
    //sortie sud
    cP(121, 511, 33, 1, {axies : 'top', exit : true, stage : 5, positionX : 88, positionY : 24}),
  ],[//indice 11
    cP(129, 445, 38, 25),
    cP(187, 445, 38, 25),
    cP(80, 341, 50, 104),
    cP(224, 341, 50, 104),
    cP(81, 78, 1, 263),
    cP(81, 54, 86, 24),
    cP(187, 54, 86, 24),
    cP(272, 78, 1, 263),
    cP(233, 77, 7, 88),
    cP(113, 77, 7, 88),
    cP(153, 150, 8, 16),
    cP(193, 150, 8, 16),
    cP(113, 158, 48, 8),
    cP(193, 158, 48, 8),
    cP(121, 146, 16, 13),
    cP(217, 146, 16, 13),
    cP(97, 198, 48, 24),
    cP(97, 238, 48, 24),
    cP(97, 278, 48, 24),
    cP(209, 198, 48, 24),
    cP(209, 238, 48, 24),
    cP(209, 278, 48, 24),
    cP(169, 98, 16, 16, {treasure : true, item : 25, chestContent : function(){
      linkAction.messageLoading = myBackground.arrayMessage[15];
      linkAction.textProgress = 1;
      myBackground.divWin.opacity = 0.3;
      linkAction.requestIDMessage = window.requestAnimationFrame(function(timestamp){linkAction.message(timestamp)});
    }}),
    //sortie
    cP(167, 462, 20, 1, {axies : 'top', exit : true, stage : 3, positionX : 504, positionY : 272}), //sortie sud
  ]],
  //liste des background
  backgroundListe : ['image/Link_House.png','image/Links House Area 2.png','image/Forest Area 2.png','image/castle.png','image/secret.png','image/Forest Entrance 1.png','image/Master Sword Pedestal Area.png','image/grotte_premiere_partie.png','image/grotte_seconde_partie.png','image/grotte_troisieme_partie.png','image/Master Sword Pedestal Area.png','image/chapel.png','image/final.png'],
  //objet du décor interactif
  decorObject : [
    cP(-396, -129, 16, 16), //indice 0 emplacement buissont
    cP(-434, -128, 16, 16), //indice 1 emplacement pierre
    cP(-434, -128, 16, 16), //indice 2 emplacement pierre foncé
    cP(-381, -148, 12, 12), //indice 3 emplacement pot
    cP(-400, -148, 14, 14), //indice 4 coffre ouvert
    cP(-224, -521, 32, 7), //indice 5 partie supérieur de la sortie
    cP(-224, -535, 32, 10), //indice 6 partie supérieur de l'entré des maison'
    cP(-224, -535, 32, 31), //indice 7 porte ouverte'
    cP(-106, -535, 96, 80), //indice 8 maison
    cP(-340, -146, 7, 8), //indice 9 fleur descente
    cP(-358, -146, 7, 8), //indice 10 fleur basse
    cP(-349, -146, 7, 8), //indice 11 fleur haute
    cP(-220, -221, 30, 31), //indice 12 passage secret
    cP(-1, -1, 1024, 1024), //indice 13 arbre
    cP(-256, -222, 16, 18), //indice 14 grand flambo flamme basse
    cP(-276, -222, 16, 18), //indice 15 grand flambo flamme milieu
    cP(-298, -222, 16, 18), //indice 16 grand flambo flamme haute
    cP(-319, -230, 16, 16), //indice 17 petit flambo pas de flamme
    cP(-338, -230, 16, 16), //indice 18 petit flambo flamme basse
    cP(-357, -230, 16, 16), //indice 19 petit flambo flamme milieu
    cP(-376, -230, 16, 16), //indice 20 petit flambo flamme haute
    cP(-184, -217, 33, 40), //indice 21 ouverture grotte
    cP(-60, -546, 24, 22), //indice 22 soutérrain
    cP(-263, -159, 32, 32), //indice 23 emplacement de gros roché
    cP(-59, -521, 26, 24), //indice 24 stell
    cP(-13, -566, 32, 11), //indice 25 haut de porte du chateau
    cP(-13, -583, 32, 24), //indice 26 porte du chateau entrain de s'ouvrir
    cP(-56, -583, 32, 24), //indice 27 porte du chateau ouverte
    cP(-13, -543, 32, 17), //indice 28 haut de souterrain du chateau
  ],
  //objet animé
  objetAnime : [[/* pas d'objet animé dans le stage 0 */
    ],[//indice 1
      //fleur haut
      cP(193, 16, 7, 8, {animation : 9}),
      cP(401, 16, 7, 8, {animation : 9}),
      cP(193, 64, 7, 8, {animation : 9}),
      cP(193, 80, 7, 8, {animation : 9}),
      cP(177, 80, 7, 8, {animation : 9}),
      cP(201, 72, 7, 8, {animation : 9}),
      cP(201, 88, 7, 8, {animation : 9}),
      cP(185, 88, 7, 8, {animation : 9}),
      //fleur milieu
      cP(161, 160, 7, 8, {animation : 9}),
      cP(177, 160, 7, 8, {animation : 9}),
      cP(169, 168, 7, 8, {animation : 9}),
      //fleur droite
      cP(369, 144, 7, 8, {animation : 9}),
      cP(353, 160, 7, 8, {animation : 9}),
      cP(369, 160, 7, 8, {animation : 9}),
      cP(361, 168, 7, 8, {animation : 9}),
      //bas droite
      cP(385, 256, 7, 8, {animation : 9}),
      cP(401, 256, 7, 8, {animation : 9}),
      cP(393, 264, 7, 8, {animation : 9}),
      //bas gauche
      cP(81, 304, 7, 8, {animation : 9}),
      cP(241, 465, 7, 8, {animation : 9})
    ],[//indice 2
      //fleur devant la grosse pierre
      cP(385, 128, 7, 8, {animation : 9}),
      cP(401, 128, 7, 8, {animation : 9}),
      cP(393, 136, 7, 8, {animation : 9}),
      cP(417, 144, 7, 8, {animation : 9}),
      //fleur milieu
      cP(433, 208, 7, 8, {animation : 9}),
      cP(305, 304, 7, 8, {animation : 9}),
      //fleur droite
      cP(497, 272, 7 , 8, {animation : 9}),
      cP(465, 304, 7 , 8, {animation : 9}),
      //fleur haut
      cP(145, 16, 7 , 8, {animation : 9}),
      cP(145, 32, 7 , 8, {animation : 9}),
      cP(145, 48, 7 , 8, {animation : 9}),
      cP(145, 64, 7 , 8, {animation : 9}),
      cP(145, 80, 7 , 8, {animation : 9}),
      cP(129, 32, 7 , 8, {animation : 9}),
      cP(129, 48, 7 , 8, {animation : 9}),
      cP(129, 64, 7 , 8, {animation : 9}),
      cP(129, 80, 7 , 8, {animation : 9}),
      cP(137, 40, 7 , 8, {animation : 9}),
      cP(137, 56, 7 , 8, {animation : 9}),
      cP(137, 72, 7 , 8, {animation : 9}),
      cP(137, 88, 7 , 8, {animation : 9}),
      cP(153, 56, 7 , 8, {animation : 9}),
      cP(153, 72, 7 , 8, {animation : 9}),
      cP(153, 88, 7 , 8, {animation : 9}),
      cP(113, 64, 7 , 8, {animation : 9}),
      cP(113, 80, 7 , 8, {animation : 9}),
      cP(113, 96, 7 , 8, {animation : 9}),
      cP(97, 80, 7 , 8, {animation : 9}),
      cP(97, 96, 7 , 8, {animation : 9}),
      cP(105, 88, 7 , 8, {animation : 9}),
      cP(105, 104, 7 , 8, {animation : 9}),
      cP(121, 72, 7 , 8, {animation : 9}),
      cP(121, 88, 7 , 8, {animation : 9}),
      cP(161, 64, 7 , 8, {animation : 9}),
      cP(177, 64, 7 , 8, {animation : 9}),
      cP(169, 72, 7 , 8, {animation : 9}),
    ],[//indice 3
    ],[//indice 4
    ],[//indice 5
    ],[//indice 6
    ],[//indice 7
    ],[//indice 8
      //grande flamme
      cP(96, 80, 16, 18, {animation : 14}),
      cP(96, 24, 16, 18, {animation : 14}),
      cP(160, 64, 16, 18, {animation : 14}),
      //petite flamme
      cP(80, 128, 16, 16, {animation : 17}),
      cP(128, 128, 16, 16, {animation : 17})
    ],[//indice 9
    ],[//indice 10
      //fleur
      cP(49, 80, 7, 8, {animation : 9}),
      cP(113, 80, 7, 8, {animation : 9}),
      cP(57, 88, 7, 8, {animation : 9}),
      cP(81, 240, 7, 8, {animation : 9}),
      cP(177, 336, 7, 8, {animation : 9})
    ],[//indice 11
      //grande flamme
      cP(121, 126, 16, 18, {animation : 14}),
      cP(126, 126, 16, 18, {animation : 14}),
    ],[//indice 12
    ]
    ],
  circle : [//arrivé dans une zone et game over (à l'enver)
    cP(-2,0,257,223),
    cP(-265,-1,256,223),
    cP(-2,-231,256,223),
    cP(-265,-230,256,223),
    cP(-2,-459,256,223),
    cP(-265,-459,256,223),
    cP(-3,-692,256,223),
    cP(-267,-692,256,223),
  ],
  image : [],
  div : [],
  save : [],
  enemiesListe : [[//indice 0 Popo
      cP(-261, -495, 16, 16),
      cP(-280, -494, 16, 17),
      cP(-300, -494, 16, 17),
    ],[//indice 1 rat
      cP(-261, -516, 12, 16),//vers le bas
      cP(-291, -518, 16, 11),//vers la gauche marche
      cP(-309, -517, 12, 15),//vers le bas marche
      cP(-275, -518, 16, 12),//vers la gauche
      cP(-324, -516, 15, 16),//se redresse
      cP(-339, -516, 15, 16)//se redresse
    ],[//indice 2 leever
      cP(-321, -494, 16, 17),
      cP(-341, -494, 14, 17)
    ],[//indice 3 leever
      cP(-361, -494, 16, 17),
      cP(-381, -494, 14, 17)
    ],[//indice 4 soldier
      [//indice 0 de face
        cP(-263, -537, 16, 28),//marche
        cP(-283, -537, 16, 28),//marche
        cP(-303, -537, 16, 28),//regade vers la droite
        cP(-323, -537, 16, 28)//regade vers la gauche
      ],[//indice 1 vers la gauche
        cP(-342, -537, 18, 28),//marche
        cP(-362, -537, 18, 28),//marche
        cP(-384, -537, 17, 28),//regade vers le haut
        cP(-405, -537, 17, 28)//regade vers le bas
      ],[//indice 2 vers la droite
        cP(-428, -537, 18, 28),//marche
        cP(-450, -537, 18, 28),//marche
        cP(-472, -537, 17, 28),//regade vers le bas
        cP(-493, -537, 17, 28)//regade vers le haut
      ],[//indice 3 vers le haut
        cP(-512, -537, 16, 29),//marche
        cP(-532, -537, 16, 28),//marche
        cP(-552, -537, 16, 28),//regade vers la gauche
        cP(-572, -537, 16, 28)//regade vers la droite
      ]
    ]
  ],
  enemiesStage : [[//indice 0 pas d'ennemi
    ],[//indice 1 zone de la maison
      cP(354, 385, 16, 16, cE1(4,cP(354, 385, 16, 16),cP(329, 117, 50, 200)) ),
      cP(320, 89, 16, 16, cE1(4,cP(320, 89, 16, 16),cP(200, 20, 150, 80)) ),
      cP(77, 394, 16, 16, cE1(4,cP(77, 394, 16, 16),cP(25, 385, 200, 25)) ),
    ],[//indice 2 foret
      cP(110, 50, 16, 16, cE1(4,cP(110, 50 , 16, 16),cP(93, 39, 93, 71)) ),
      cP(125, 440, 16, 16, cE1(0,cP(125, 440, 16, 16),cP(97, 416, 92, 33)) ),
      cP(350, 160, 16, 16, cE1(0,cP(350, 160, 16, 16),cP(318, 144, 109, 35)) ),
    ],[//indice 3 chateau
      cP(290, 285, 16, 16, cE1(4,cP(290, 285, 16, 16),cP(272, 277, 52, 70)) ),
      cP(457, 360, 16, 16, cE1(4,cP(457, 360, 16, 16),cP(457, 338, 94, 213)) ),
      cP(540, 515, 16, 16, cE1(4,cP(540, 515, 16, 16),cP(457, 338, 94, 213 )) ),
      cP(610, 520, 16, 16, cE1(4,cP(610, 520, 16, 16),cP(600, 511, 56, 39 )) ),
      cP(849, 335, 16, 16, cE0(1,cP(849, 335, 16, 16),cP(849,335,31,364))),
      cP(880, 669, 16, 16, cE0(1,cP(880, 669, 16, 16),cP(849,335,31,364))),
      cP(88, 221, 16, 16, cE0(1,cP(88, 221, 16, 16),cP(88,221,39,471))),
      cP(125, 690, 16, 16, cE0(1,cP(125, 690, 16, 16),cP(88,221,39,471))),
    ],[//indice 4
    ],[//indice 5 foret couloir
      cP(116, 108, 16, 16, cE0(0,cP(116, 108, 16, 16),cP(88,99,40,73))),
      cP(79, 176, 16, 16, cE0(0,cP(79, 176, 16, 16),cP(77,44,73,36)) ),
      cP(141, 357, 16, 16, cE0(0,cP(141, 357, 16, 16),cP(125,329,22,71)) )
    ],[//indice 6
    ],[//indice 7
    ],[//indice 8
    ],[//indice 9
    ],[//indice 10 pas d'ennemi
    ],[//indice 11
    ],[//indice 12

    ]
  ],
  //liste des messages.
  arrayMessage : ['J\'ai perdu mes competences. Aidez moi a les trouver. Vous pouvez egalement voir directement mon CV en cliquant sur le lien en haut.','Il me manque une competence dans la piece. Trouvez la avant de continuer.','Vous avez trouve HTML5.','Vous avez trouve CSS.','Yes! Vous avez retrouve javascript. Je vais pouvoir me battre contre les ennemis','Vous avez trouve JQuery. Je peux maintenant soulever les objets lourds.','Vous avez trouve JQuery UI','Vous avez trouve MongoDB. Il s\'agit de la première des 4 cles qui vous serviront à aller dans la zone finale.','Vous avez trouve Bootstrap','Vous avez trouve Express. La seconde cle pour acceder à la zone finale.','Vous avez trouve Meteor. Vous pouvez maintenant utiliser l\'arc.','Vous avez trouve PhotoShop.','Vous avez trouve Angular. La troisième cle de la zone finale.','Vous avez trouve Ajax.','Vous avez trouve Node. La derniere cle pour acceder a la zone finale.','Bravo vous avez trouve toutes mes competences. Vous pouvez voir mon CV ou rejouer en appuyant sur Entree','La zone est trop dangereuse.','Vous avez trouve PhotoShop.','Vous n\'avez pas encore toutes les clees pour entrer'],
};
