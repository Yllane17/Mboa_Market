const carrousel = document.querySelector("#carrousel");

// ========================
// DECLARATION DES DONNEES
// ========================

const datas_slides = [
  {
    titre: "Le gout du pays livré chez vous",
    description: "Epices, cafés, miel et pagnes naturels",
  },
  {
    titre: "Le café des hauts plateaux",
    description: "Arabica, Robusta et Nescafé",
  },
  {
    titre: "Payez par Mobile Money",
    description: "Reglez vos factures et achats par mobile money",
  },
];

carrousel.innerHTML = "";
for (let i = 0; i < datas_slides.length; i++) {
  const data = datas_slides[i];
  carrousel.innerHTML += `<div
          class="slide"
          style="background-image: url('images/slide${i + 1}.jpg')"
        >
          <div class="slide_conteneur">
            <div class="slide_text">
              <h2>${data.titre}</h2>
              <p>
                ${data.description}
              </p>
              <div class="buttons">
                <a href="#"
                  >En savoir plus <i class="fa-solid fa-arrow-right"></i
                ></a>
              </div>
            </div>
          </div>
        </div>`;
}

carrousel.innerHTML += `
    <div class="slide_options">
          <span class="silde_left">
            <i class="fa-solid fa-chevron-left"></i>
          </span>
          <span class="silde_right">
            <i class="fa-solid fa-chevron-right"></i>
          </span>
        </div>
`;

// ==========================
// DECLARATION DES VARIABLES
// ==========================

const slides = document.querySelectorAll("#carrousel .slide");
const slides_left = document.querySelector("#carrousel .slide_left");
const slides_right = document.querySelector("#carrousel .slide_right");

//Contient l'indice du slide actuellement affiché
let slide_courant = 0;

/*
==========================================
MASQUER TOUS LES SLIDES SAUF LE PREMIER
==========================================
*/

for(let i=0; i<slides.length; i++){
  slides[i].classList.add('hide');
}


/*
==========================================
QUELQUES FONCTIONS UTILES
==========================================
*/

//FONCTION PERMETTANT D'AFFICHER LES SLIDES COURANTS

function showSlide(index, direction){
  //ON MASQUE LE SLIDE COURANT
  slides[slide_courant].classList.add('hide');

  //ON CHERCHE L'INDICE DU NOUVEAU SLIDE A AFFICHER
  if(direction.trim().toLowerCase() == "right"){
    if(index >= slides.length){
      slide_courant = 0
    }
    else if(direction.trim().toLowerCase() == "left"){
      slide_courant = index;
    }
  }

  //ON AFFICHE LE SLIDE COURANT
  slides[slide_courant].classList.remove('hide');
}

/*
==========================================
LANCER LE SLIDE
==========================================
*/

slides_left.addEventListener("click", function(){
  showSlide(slide_courant - 1, "left"); 
});

slides_right.addEventListener("click", function(){
  showSlide(slide_courant + 1, "right");
});

/*
==========================================
LANCER LE SLIDE AUTOMATIQUEMENT
==========================================
*/

setInterval( function(){
  showSlide(slide_courant + 1, "right");
}, 5000);