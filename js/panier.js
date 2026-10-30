(() => {
  const CLE = "mboa_panier";
  let articles = charger();

  const bouton = document.querySelector("#btn_panier");
  const badge = document.querySelector("#nb-articles");
  const fcfa = (n) => `${new Intl.NumberFormat("fr-FR").format(n)} FCFA`;

  const overlay = document.createElement("div");
  overlay.id = "panier-overlay";
  const panneau = document.createElement("aside");
  panneau.id = "panier-panneau";
  panneau.setAttribute("aria-label", "Panier");
  panneau.innerHTML = `
    <div class="panier-entete">
      <h2>Mon panier</h2>
      <button type="button" id="panier-fermer" aria-label="Fermer"><i class="fa-solid fa-circle-xmark"></i></button>
    </div>
    <div id="panier-liste"></div>
    <div class="panier-pied">
      <p class="panier-total">Total : <strong id="panier-total">0 FCFA</strong></p>
       <button type="button" id="panier-valider">Valider la commande</button>
      <button type="button" id="panier-annuler">Annuler la commande</button>   
    </div>`;
  document.body.append(overlay, panneau);

  const liste = panneau.querySelector("#panier-liste");
  const total = panneau.querySelector("#panier-total");

  function charger() {
    try {
      const d = JSON.parse(localStorage.getItem(CLE));
      return Array.isArray(d) ? d : [];
    } catch {
      return [];
    }
  }
  function sauver() {
    try { localStorage.setItem(CLE, JSON.stringify(articles)); } catch {}
  }

  function ouvrir() {
    panneau.classList.add("ouvert");
    overlay.classList.add("ouvert");
  }
  function fermer() {
    panneau.classList.remove("ouvert");
    overlay.classList.remove("ouvert");
  }

  function ajouter(produit) {
    const ligne = articles.find((a) => a.nom === produit.nom);
    if (ligne) {
      if (ligne.qte < ligne.stock) ligne.qte++;
    } else {
      articles.push({
        nom: produit.nom,
        prix: produit.Prix,
        unite: produit.Unite,
        stock: produit.stock,
        qte: 1,
      });
    }
    maj();
    ouvrir();
  }

  function changerQte(nom, delta) {
    const ligne = articles.find((a) => a.nom === nom);
    if (!ligne) return;
    ligne.qte = Math.min(ligne.qte + delta, ligne.stock);
    if (ligne.qte <= 0) articles = articles.filter((a) => a !== ligne);
    maj();
  }

  function retirer(nom) {
    articles = articles.filter((a) => a.nom !== nom);
    maj();
  }

  function maj() {
    sauver();
    const nb = articles.reduce((s, a) => s + a.qte, 0);
    badge.textContent = nb;
    badge.classList.toggle("hide", nb === 0);
    total.textContent = fcfa(articles.reduce((s, a) => s + a.prix * a.qte, 0));

    liste.replaceChildren();
    if (articles.length === 0) {
      const vide = document.createElement("p");
      vide.className = "panier-vide";
      vide.textContent = "Votre panier est vide.";
      liste.append(vide);
      return;
    }
    articles.forEach((a) => {
      const l = document.createElement("div");
      l.className = "panier-ligne";

      const nom = document.createElement("p");
      nom.className = "panier-nom";
      nom.textContent = a.nom;

      const detail = document.createElement("p");
      detail.className = "panier-detail";
      detail.textContent = `${fcfa(a.prix)} / ${a.unite}`;

      const ctrl = document.createElement("div");
      ctrl.id = "panier-qte";
      const moins = document.createElement("button");
      moins.type = "button";
    //   moins.textContent = "−";
      moins.classList ="fa-solid fa-minus"
      moins.addEventListener("click", () => changerQte(a.nom, -1));

      const qte = document.createElement("span");
      qte.textContent = a.qte;

      const plus = document.createElement("button");
      plus.id ="panier-qte";
      plus.classList = "fa-solid fa-plus";
      plus.type = "button";
    //   plus.textContent = "+";
      plus.disabled = a.qte >= a.stock;
      plus.addEventListener("click", () => changerQte(a.nom, 1));
      ctrl.append(moins, qte, plus);

      const sous = document.createElement("p");
      sous.className = "panier-sous-total";
      sous.textContent = fcfa(a.prix * a.qte);

      const suppr = document.createElement("button");
      suppr.type = "button";
      suppr.className = "panier-retirer";
      suppr.textContent = "Retirer";
      suppr.addEventListener("click", () => retirer(a.nom));

      l.append(nom, detail, ctrl, sous, suppr);
      liste.append(l);
    });
  }

  bouton.addEventListener("click", (e) => {
    e.preventDefault();
    panneau.classList.contains("ouvert") ? fermer() : ouvrir();
  });
  overlay.addEventListener("click", fermer);
  panneau.querySelector("#panier-fermer").addEventListener("click", fermer);
  document.addEventListener("keydown", (e) => e.key === "Escape" && fermer());
  panneau.querySelector("#panier-annuler").addEventListener("click", () => {
    if (articles.length && confirm("Annuler toute la commande ?")) {
      articles = [];
      maj();
    }
  });

  window.ajouterAuPanier = ajouter;
  maj();
})();