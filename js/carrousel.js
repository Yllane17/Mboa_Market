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
