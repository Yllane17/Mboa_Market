const produitsConteneur = document.querySelector("#produits");
const categoriesConteneur = document.querySelector("#categories");
const recherche = document.querySelector("#recherche");
const tri = document.querySelector("#tri");
const nbResultats = document.querySelector("#nb-resultats");

let tousLesProduits = [];
let categorieActive = "Toutes";

function afficherCategories() {
  const categories = [
    "Toutes",
    ...new Set(tousLesProduits.map((produit) => produit.Categorie)),
  ];

  categoriesConteneur.replaceChildren();

  categories.forEach((categorie) => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "categorie";
    bouton.textContent = categorie;
    bouton.classList.toggle("actif", categorie === categorieActive);
    bouton.addEventListener("click", () => {
      categorieActive = categorie;
      afficherCategories();
      afficherProduits();
    });
    categoriesConteneur.append(bouton);
  });
}

function afficherProduits() {
  const termeRecherche = recherche.value.trim().toLocaleLowerCase("fr");
  let produitsFiltres = tousLesProduits.filter((produit) => {
    const correspondCategorie =
      categorieActive === "Toutes" || produit.Categorie === categorieActive;
    const texteProduit =
      `${produit.nom} ${produit.Categorie} ${produit.description}`.toLocaleLowerCase(
        "fr",
      );

    return correspondCategorie && texteProduit.includes(termeRecherche);
  });

  if (tri.value === "prix-croissant") {
    produitsFiltres.sort((a, b) => a.Prix - b.Prix);
  } else if (tri.value === "prix-decroissant") {
    produitsFiltres.sort((a, b) => b.Prix - a.Prix);
  } else if (tri.value === "nom") {
    produitsFiltres.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  }

  nbResultats.textContent = `${produitsFiltres.length} produit${
    produitsFiltres.length > 1 ? "s" : ""
  }`;
  produitsConteneur.replaceChildren();

  if (produitsFiltres.length === 0) {
    const message = document.createElement("p");
    message.className = "aucun-produit";
    message.textContent = "Aucun produit ne correspond à votre recherche.";
    produitsConteneur.append(message);
    return;
  }

  produitsFiltres.forEach((produit) => {
    const carte = document.createElement("article");
    carte.className = "produit-carte";

    const icone = document.createElement("div");
    icone.className = "produit-icone";
    icone.setAttribute("aria-hidden", "true");
    const iconeFontAwesome = document.createElement("i");
    iconeFontAwesome.className = produit.icon;
    icone.append(iconeFontAwesome);

    const categorie = document.createElement("p");
    categorie.className = "produit-categorie";
    categorie.textContent = produit.Categorie;

    const nom = document.createElement("h3");
    nom.textContent = produit.nom;

    const description = document.createElement("p");
    description.className = "produit-description";
    description.textContent = produit.description;

    const piedCarte = document.createElement("div");
    piedCarte.className = "produit-pied";

    const prix = document.createElement("p");
    prix.className = "produit-prix";
    prix.textContent = `${new Intl.NumberFormat("fr-FR").format(
      produit.Prix,
    )} FCFA`;

    const unite = document.createElement("span");
    unite.className = "produit-unite";
    unite.textContent = `/ ${produit.Unite}`;
    prix.append(" ", unite);

    const stock = document.createElement("p");
    stock.className = "produit-stock";
    stock.textContent = `${produit.stock} en stock`;

    piedCarte.append(prix, stock);
    carte.append(icone, categorie, nom, description, piedCarte);
    produitsConteneur.append(carte);
  });
}

async function chargerProduits() {
  try {
    const reponse = await fetch("data/produits.json");
    if (!reponse.ok) {
      throw new Error(
        `Le chargement des produits a échoué (HTTP ${reponse.status}).`,
      );
    }

    const donnees = await reponse.json();
    if (!Array.isArray(donnees)) {
      throw new Error("Le fichier des produits doit contenir une liste.");
    }

    tousLesProduits = donnees;
    afficherCategories();
    afficherProduits();
  } catch (erreur) {
    console.error("Impossible de charger les produits :", erreur);
    produitsConteneur.textContent =
      "Impossible de charger les produits. Vérifiez le serveur et réessayez.";
    produitsConteneur.classList.add("danger");
  }
}

recherche.addEventListener("input", afficherProduits);
tri.addEventListener("change", afficherProduits);
chargerProduits();
