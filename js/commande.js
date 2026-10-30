(() => {
  const fcfa = (n) => `${new Intl.NumberFormat("fr-FR").format(n)} FCFA`;

  const overlay = document.createElement("div");
  overlay.id = "commande-overlay";
  const panneau = document.createElement("aside");
  panneau.id = "commande-panneau";
  panneau.setAttribute("aria-label", "Finaliser la commande");
  panneau.innerHTML = `
    <div class="commande-entete">
      <h2>Finaliser la commande</h2>
      <button type="button" id="commande-fermer" aria-label="Fermer"><i class="fa-solid fa-circle-xmark"></i></button>
    </div>
    <form id="commande-form" novalidate>
      <label>Nom
        <input type="text" name="nom" autocomplete="family-name">
        <small class="erreur"></small>
      </label>
      <label>Prénom
        <input type="text" name="prenom" autocomplete="given-name">
        <small class="erreur"></small>
      </label>
      <label>Téléphone
        <input type="tel" name="telephone" placeholder="6XX XX XX XX" autocomplete="tel">
        <small class="erreur"></small>
      </label>
      <label>Adresse de livraison
        <input type="text" name="adresse" placeholder="Quartier, ville, repère">
        <small class="erreur"></small>
      </label>
      <label>Moyen de paiement
        <select name="paiement">
          <option value="">-- Choisir --</option>
          <option value="Orange Money">Orange Money</option>
          <option value="MTN Mobile Money">MTN Mobile Money</option>
          <option value="Paiement à la livraison">Paiement à la livraison</option>
        </select>
        <small class="erreur"></small>
      </label>
      <label id="label-num-paiement" hidden>Numéro Mobile Money
        <input type="tel" name="numPaiement" placeholder="6XX XX XX XX">
        <small class="erreur"></small>
      </label>

      <h3>Récapitulatif</h3>
      <div id="commande-recap"></div>
      <p class="commande-total">Total : <strong id="commande-total"></strong></p>

      <button type="submit" id="commande-payer">Payer</button>
    </form>
    <div id="commande-succes" hidden></div>`;
  document.body.append(overlay, panneau);

  const form = panneau.querySelector("#commande-form");
  const recap = panneau.querySelector("#commande-recap");
  const succes = panneau.querySelector("#commande-succes");
  const labelNum = panneau.querySelector("#label-num-paiement");

  function ouvrir() {
    recap.replaceChildren();
    panierApi.getArticles().forEach((a) => {
      const l = document.createElement("p");
      l.className = "recap-ligne";
      l.textContent = `${a.qte} × ${a.nom} — ${fcfa(a.prix * a.qte)}`;
      recap.append(l);
    });
    panneau.querySelector("#commande-total").textContent = fcfa(panierApi.getTotal());
    form.hidden = false;
    succes.hidden = true;
    panneau.classList.add("ouvert");
    overlay.classList.add("ouvert");
  }
  function fermer() {
    panneau.classList.remove("ouvert");
    overlay.classList.remove("ouvert");
  }

  // Le numéro Mobile Money n'est demandé que pour OM / MTN
  form.paiement.addEventListener("change", () => {
    labelNum.hidden = !/Money/.test(form.paiement.value);
  });

  const regles = {
    nom: (v) => v.trim().length >= 2 || "Nom obligatoire (2 lettres min.)",
    prenom: (v) => v.trim().length >= 2 || "Prénom obligatoire (2 lettres min.)",
    telephone: (v) => /^(\+?237)?\s?6[\d\s]{8,11}$/.test(v.trim()) || "Numéro camerounais invalide (ex : 6XX XX XX XX)",
    adresse: (v) => v.trim().length >= 5 || "Adresse de livraison obligatoire",
    paiement: (v) => v !== "" || "Choisissez un moyen de paiement",
    numPaiement: (v) => labelNum.hidden || /^6[\d\s]{8,11}$/.test(v.trim()) || "Numéro Mobile Money invalide",
  };

  function valider() {
    let ok = true;
    Object.keys(regles).forEach((nom) => {
      const champ = form.elements[nom];
      const res = regles[nom](champ.value);
      const msg = res === true ? "" : res;
      champ.closest("label").querySelector(".erreur").textContent = msg;
      champ.classList.toggle("invalide", msg !== "");
      if (msg) ok = false;
    });
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!valider()) return;

    const btn = panneau.querySelector("#commande-payer");
    btn.disabled = true;
    btn.textContent = "Paiement en cours...";

    // Simulation du paiement (2 secondes)
    setTimeout(() => {
      const ref = "MBM-" + Date.now().toString().slice(-6);
      const total = fcfa(panierApi.getTotal());
      succes.innerHTML = `
        <div class="succes-icone">✔</div>
        <h3>Paiement réussi !</h3>
        <p>Merci ${form.prenom.value.trim()}, votre commande <strong>${ref}</strong>
        de <strong>${total}</strong> a bien été enregistrée.</p>
        <p>Livraison à : ${form.adresse.value.trim()}</p>
        <button type="button" id="succes-fermer">Fermer</button>`;
      form.hidden = true;
      succes.hidden = false;
      panierApi.vider();
      form.reset();
      labelNum.hidden = true;
      btn.disabled = false;
      btn.textContent = "Payer";
      succes.querySelector("#succes-fermer").addEventListener("click", fermer);
    }, 2000);
  });

  overlay.addEventListener("click", fermer);
  panneau.querySelector("#commande-fermer").addEventListener("click", fermer);
  document.addEventListener("keydown", (e) => e.key === "Escape" && fermer());

  window.ouvrirCommande = ouvrir;
})();