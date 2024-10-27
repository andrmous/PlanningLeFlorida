// Définition des jours de la semaine
const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const colonnesSupplementaires = []; // Stocke les nouvelles colonnes ajoutées

// Fonction pour générer le planning des barmans
function genererPlanningBarmans() {
    const planningTable = document.getElementById("planning-table");

    // Création de l'en-tête du tableau avec les créneaux horaires spécifiés
    let thead = `
        <thead>
            <tr>
                <th>Jour</th>
                <th>7h</th>
                <th>9h</th>
                <th>14h</th>
                <th>16h30 1</th>
                <th>16h30 2</th>`;
                
    // Ajouter les colonnes supplémentaires au besoin
    colonnesSupplementaires.forEach((colonne) => {
        thead += `<th>${colonne}</th>`;
    });

    thead += `</tr></thead>`;
    planningTable.innerHTML = thead;

    // Création du corps du tableau
    let tbody = "<tbody>";
    joursSemaine.forEach(jour => {
        tbody += `<tr>
            <td>${jour}</td>
            <td><select class="select-barman">${creerOptionsBarmans()}</select></td>
            <td><select class="select-barman">${creerOptionsBarmans()}</select></td>
            <td><select class="select-barman">${creerOptionsBarmans()}</select></td>
            <td><select class="select-barman">${creerOptionsBarmans()}</select></td>
            <td><select class="select-barman">${creerOptionsBarmans()}</select></td>`;

        // Ajouter les cellules pour les colonnes supplémentaires
        colonnesSupplementaires.forEach(() => {
            tbody += `<td><select class="select-barman">${creerOptionsBarmans()}</select></td>`;
        });

        tbody += `</tr>`;
    });
    tbody += "</tbody>";
    planningTable.innerHTML += tbody;

    // Appliquer l'événement de changement pour éviter les doublons pour chaque jour
    document.querySelectorAll("tbody tr").forEach(row => {
        const selects = row.querySelectorAll("select");
        selects.forEach(select => {
            select.addEventListener("change", () => mettreAJourOptions(selects));
        });
    });
}

// Fonction pour ajouter une nouvelle colonne
function ajouterColonne() {
    const nouvelHoraire = prompt("Entrez le nom du créneau supplémentaire (par ex. Barman Supplémentaire):");
    if (nouvelHoraire) {
        colonnesSupplementaires.push(nouvelHoraire);
        genererPlanningBarmans();
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

// Fonction pour créer les options de sélection pour les barmans
function creerOptionsBarmans() {
    const barmans = ["Tao", "Océane", "Valentin", "Juliette", "Edouard", "Aurélie", "Alaa", "Olivier", "Basil"];
    let options = "<option value=''>-- Choisir --</option>";
    barmans.forEach(barman => {
        options += `<option value="${barman}">${barman}</option>`;
    });
    return options;
}

// Générer le planning et configurer les boutons au chargement de la page
window.onload = () => {
    genererPlanningBarmans();

    // Ajouter l'événement pour le bouton d'ajout de colonne
    document.getElementById("add-column-btn").addEventListener("click", ajouterColonne);

    // Ajouter l'événement pour le bouton d'impression
    document.getElementById("print-btn").addEventListener("click", () => {
        window.print();
    });
};
