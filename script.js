// Données pour les jours et les horaires
const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const horairesMatinComplet = ["6h", "8h", "9h", "10h", "11h"];
const horairesSoirComplet = ["14h", "15h", "16h", "17h"];
const horairesSupplementaires = []; // Stocke les nouvelles colonnes ajoutées

// Équipe pour les créneaux aléatoires du soir
const equipeSoirAleatoire = ["Laurence", "Majd", "Baptiste", "Flo", "Raph", "Marwan", "Thomas"];

// Liste complète des employés
const employes = ["Adrien", "Andrew", "Baptiste", "Damien", "Felix", "Flo", "Frank", "Jeremy", "Laurence", "Majd", "Marwan", "Merwan", "Olivier", "Raph", "Thomas", "Arnauld", "Laurent", "Franck"];

// Jours de repos des employés
const joursRepos = {
    "Arnauld": ["Dimanche", "Lundi"],
    "Olivier": ["Vendredi"],
    "Andrew": ["Jeudi", "Vendredi"],
    "Damien": ["Lundi", "Mardi"],
    "Merwan": ["Jeudi", "Vendredi"],
    "Laurent": ["Mardi", "Mercredi"],
    "Franck": ["Jeudi", "Vendredi"],
    "Marwan": ["Mercredi", "Jeudi"]
};

// Fonction pour vérifier si un employé peut travailler un jour donné (hors jours de repos)
function estDisponible(employe, jour, assignments) {
    return (!joursRepos[employe] || !joursRepos[employe].includes(jour)) && !Object.values(assignments).includes(employe);
}

// Fonction pour générer des listes déroulantes avec les employés disponibles
function creerSelectEmployesDisponibles(jour, assignments) {
    const select = document.createElement("select");
    const optionVide = document.createElement("option");
    optionVide.text = "";
    optionVide.value = "";
    select.add(optionVide);

    employes.forEach(employe => {
        if (estDisponible(employe, jour, assignments)) {
            const option = document.createElement("option");
            option.text = employe;
            option.value = employe;
            select.add(option);
        }
    });

    select.addEventListener("change", (e) => {
        const selectedEmploye = e.target.value;
        assignments[select.name] = selectedEmploye;
    });

    return select;
}

// Fonction pour assigner des créneaux fixes et aléatoires selon les règles spécifiques
function assignerCreneauxFixes(jour, assignments) {
    if (["Lundi", "Mardi", "Mercredi"].includes(jour)) assignments["10h"] = "Merwan";
    if (["Samedi", "Dimanche"].includes(jour)) assignments["10h"] = "Andrew";
    if (["Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].includes(jour)) assignments["14h"] = "Damien";
    if (["Lundi", "Mardi", "Mercredi"].includes(jour) && estDisponible("Andrew", jour, assignments)) assignments["15h"] = "Andrew";
    if (["Lundi", "Mardi", "Mercredi", "Samedi", "Dimanche"].includes(jour)) assignments["11h"] = "Olivier";
}

// Fonction pour assigner aléatoirement les créneaux de matin
function assignerCreneauxMatinAleatoires(jour, assignments) {
    let candidatsMatin = ["Arnauld", "Laurent", "Franck"].filter(employe => estDisponible(employe, jour, assignments));
    if (jour === "Jeudi" || jour === "Vendredi") {
        candidatsMatin = candidatsMatin.filter(employe => employe !== "Franck");
    }
    ["6h", "8h", "9h"].forEach(heure => {
        const employeChoisi = candidatsMatin[Math.floor(Math.random() * candidatsMatin.length)];
        assignments[heure] = employeChoisi;
        candidatsMatin.splice(candidatsMatin.indexOf(employeChoisi), 1);
    });
}

// Fonction pour assigner aléatoirement les créneaux de soir
function assignerCreneauxSoirAleatoires(jour, assignments) {
    const candidatsSoir = equipeSoirAleatoire.filter(employe => estDisponible(employe, jour, assignments));
    ["15h", "16h", "17h"].forEach(heure => {
        if (!assignments[heure]) {
            const employeChoisi = candidatsSoir[Math.floor(Math.random() * candidatsSoir.length)];
            assignments[heure] = employeChoisi;
            candidatsSoir.splice(candidatsSoir.indexOf(employeChoisi), 1);
        }
    });
}

// Fonction pour générer des données aléatoires pour le planning
function genererPlanningAleatoire() {
    return joursSemaine.map(jour => {
        const assignments = {};
        assignerCreneauxFixes(jour, assignments);
        assignerCreneauxMatinAleatoires(jour, assignments);
        assignerCreneauxSoirAleatoires(jour, assignments);
        return { jour, assignments };
    });
}

// Fonction pour générer et afficher le planning avec des inputs pour les cases vides
function genererPlanning(planningData) {
    const table = document.getElementById("planning-table");

    let thead = "<thead><tr><th>Jour</th>";
    horairesMatinComplet.concat(horairesSoirComplet, horairesSupplementaires).forEach(horaire => {
        thead += `<th>${horaire}</th>`;
    });
    thead += "</tr></thead>";
    table.innerHTML = thead;

    let tbody = "<tbody>";
    planningData.forEach(day => {
        tbody += `<tr><td>${day.jour}</td>`;
        horairesMatinComplet.concat(horairesSoirComplet, horairesSupplementaires).forEach(horaire => {
            const td = document.createElement("td");
            td.id = `${day.jour}-${horaire}`;
            if (day.assignments[horaire]) {
                td.textContent = day.assignments[horaire];
            } else {
                const select = creerSelectEmployesDisponibles(day.jour, day.assignments);
                select.id = `${day.jour}-${horaire}`;
                td.appendChild(select);
            }
            tbody += td.outerHTML;
        });
        tbody += "</tr>";
    });
    tbody += "</tbody>";
    table.innerHTML += tbody;
}

// Fonction pour ajouter une colonne supplémentaire
function ajouterColonne() {
    const nouvelHoraire = prompt("Entrez l'horaire supplémentaire (par ex. 18h):");
    if (nouvelHoraire) {
        horairesSupplementaires.push(nouvelHoraire);
        const nouveauPlanning = genererPlanningAleatoire();
        genererPlanning(nouveauPlanning);
    }
}

// Initialisation pour afficher le planning initial
window.onload = () => {
    const planningInitial = genererPlanningAleatoire();
    genererPlanning(planningInitial);

    // Bouton pour changer le planning
    document.getElementById("change-planning-btn").addEventListener("click", () => {
        const nouveauPlanning = genererPlanningAleatoire();
        genererPlanning(nouveauPlanning);
    });

    // Bouton pour ajouter une colonne
    document.getElementById("add-column-btn").addEventListener("click", ajouterColonne);
};
