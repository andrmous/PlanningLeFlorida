
// Définition des jours de la semaine
const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const colonnesSupplementaires = []; // Stocke les nouvelles colonnes ajoutées

// Fonction pour générer le planning des runners
function genererPlanningRunners() {
    const planningTable = document.getElementById("planning-table");

    // Création de l'en-tête du tableau
    let thead = `
        <thead>
            <tr>
                <th>Jour</th>
                <th>Responsable Matin</th>
                <th>Responsable Soir</th>
                <th>Resto Matin (10h - 20h)</th>
                <th>Resto Soir (15h - 1h)</th>
                <th>Runner 1</th>
                <th>Runner 2</th>
                <th>Runner 3</th>
                <th>Runner 4</th>
                <th>Runner 5</th>`;
                
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
            <td><select class="select-responsable">${creerOptionsResponsables()}</select></td>
            <td><select class="select-responsable">${creerOptionsResponsables()}</select></td>
            <td><select class="select-resto-runner">${creerOptionsEmployes()}</select></td>
            <td><select class="select-resto-runner">${creerOptionsEmployes()}</select></td>
            <td><select class="select-resto-runner">${creerOptionsEmployes()}</select></td>
            <td><select class="select-resto-runner">${creerOptionsEmployes()}</select></td>
            <td><select class="select-resto-runner">${creerOptionsEmployes()}</select></td>
            <td><select class="select-resto-runner">${creerOptionsEmployes()}</select></td>
            <td><select class="select-resto-runner">${creerOptionsEmployes()}</select></td>`;

        // Ajouter les cellules pour les colonnes supplémentaires
        colonnesSupplementaires.forEach(() => {
            tbody += `<td><select class="select-resto-runner">${creerOptionsEmployes()}</select></td>`;
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
    const nouvelHoraire = prompt("Entrez le nom du créneau supplémentaire (par ex. Runner Supplémentaire):");
    if (nouvelHoraire) {
        colonnesSupplementaires.push(nouvelHoraire);
        genererPlanningRunners(); // Re-générer le planning avec la nouvelle colonne
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

// Fonction pour créer les options de sélection des responsables (Responsable Matin et Responsable Soir)
function creerOptionsResponsables() {
    const responsables = ["Véro", "Malo", "Cécilia", "Olivier", "Michel", "Romain"];
    let options = "<option value=''>-- Choisir --</option>";
    responsables.forEach(responsable => {
        options += `<option value="${responsable}">${responsable}</option>`;
    });
    return options;
}

// Fonction pour créer les options de sélection pour les autres rôles (Resto et Runners)
function creerOptionsEmployes() {
    const employesRestoRunners = ["Manon2", "Manon", "Mehdi", "Yovan", "Sima", "Jad", "Ambre", "Daf", "Lou", "Leilanh", "Erine", "Armend", "Maeva", "Leo"];
    let options = "<option value=''>-- Choisir --</option>";
    employesRestoRunners.forEach(employe => {
        options += `<option value="${employe}">${employe}</option>`;
    });
    return options;
}

// Générer le planning des runners et configurer les boutons au chargement de la page
window.onload = () => {
    genererPlanningRunners();

    // Ajouter l'événement pour le bouton d'ajout de colonne
    document.getElementById("add-column-btn").addEventListener("click", ajouterColonne);

    // Ajouter l'événement pour le bouton d'impression
    document.getElementById("print-btn").addEventListener("click", () => {
        window.print();
    });
};
