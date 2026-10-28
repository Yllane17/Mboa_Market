const produits = document.querySelector("#produits");

/*
==========================================
CHARGEMENT DES PRODUITS
==========================================
*/

async function chargerProduits() {
    try{
        const response = await fetch("data/produits.json");
        if(!response.ok){
            throw new Error("Fichier data/produits.json introuvable");
        }

        datas = await response.json();
        console.log(datas)
    }
    catch(erreur){
        console.error(erreur);
        produits.innerHTML = `
            <p class="danger">Impossible de charger les produits.</p>
        `;
    }
}

chargerProduits();
