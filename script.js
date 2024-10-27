// Définition des jours de la semaine
const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const horaires = ["6h", "8h", "9h", "10h", "11h", "14h", "15h", "16h", "17h"];
const colonnesSupplementaires = []; // Stocke les nouvelles colonnes ajoutées

// Liste des serveurs
const serveurs = ["Adrien", "Andrew", "Baptiste", "Damien", "Felix", "Flo", "Frank", "Jeremy", "Laurence", "Majd", "Marwan", "Merwan", "Olivier", "Raph", "Thomas", "Arnauld", "Laurent", "Franck"];

// Fonction pour générer le planning des serveurs
function genererPlanningServeurs() {
    const planningTable = document.getElementById("planning-table");

    // Création de l'en-tête du tableau
    let thead = `
        <thead>
            <tr>
                <th>Jour</th>`;
    horaires.concat(colonnesSupplementaires).forEach(horaire => {
        thead += `<th>${horaire}</th>`;
    });
    thead += `</tr></thead>`;
    planningTable.innerHTML = thead;

    // Création du corps du tableau
    let tbody = "<tbody>";
    joursSemaine.forEach(jour => {
        tbody += `<tr>
            <td>${jour}</td>`;
        horaires.concat(colonnesSupplementaires).forEach(() => {
            tbody += `<td><select class="select-serveur">${creerOptionsServeurs()}</select></td>`;
        });
        tbody += `</tr>`;
    });
    tbody += "</tbody>";
    planningTable.innerHTML += tbody;

    // Appliquer l'événement de changement pour éviter les doublons pour chaque ligne
    document.querySelectorAll("tbody tr").forEach(row => {
        const selects = row.querySelectorAll("select");
        selects.forEach(select => {
            select.addEventListener("change", () => mettreAJourOptions(selects));
        });
    });
}

// Fonction pour ajouter une nouvelle colonne
function ajouterColonne() {
    const nouvelHoraire = prompt("Entrez le nom du créneau supplémentaire (par ex. 18h):");
    if (nouvelHoraire) {
        colonnesSupplementaires.push(nouvelHoraire);
        genererPlanningServeurs(); // Re-générer le planning avec la nouvelle colonne
    }
}

// Fonction pour mettre à jour les options dans les sélecteurs pour éviter les doublons
function mettreAJourOptions(selects) {
    const selectedValues = Array.from(selects)
        .map(select => select.value)
        .filter(value => value);

    selects.forEach(select => {
        const options = select.querySelectorAll("option");
        options.forEach(option => {
            if (selectedValues.includes(option.value) && option.value !== select.value) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
    });
}

// Fonction pour créer les options de sélection pour les serveurs
function creerOptionsServeurs() {
    let options = "<option value=''>-- Choisir --</option>";
    serveurs.forEach(serveur => {
        options += `<option value="${serveur}">${serveur}</option>`;
    });
    return options;
}

// Générer le planning des serveurs et configurer les boutons au chargement de la page
window.onload = () => {
    genererPlanningServeurs();

    // Ajouter l'événement pour le bouton d'ajout de colonne
    document.getElementById("add-column-btn").addEventListener("click", ajouterColonne);

    // Ajouter l'événement pour le bouton d'impression
    document.getElementById("print-btn").addEventListener("click", () => {
        window.print();
    });
};
