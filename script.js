// Données pour les jours et les horaires
const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const horairesMatinComplet = ["6h", "8h", "9h", "10h", "11h"]; // Horaires pour le matin
const horairesSoirComplet = ["14h", "15h", "16h", "17h"]; // Horaires pour le soir

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
    // Créneaux fixes pour 10h
    if (["Lundi", "Mardi", "Mercredi"].includes(jour)) {
        assignments["10h"] = "Merwan";
    }
    if (["Samedi", "Dimanche"].includes(jour)) {
        assignments["10h"] = "Andrew";
    }

    // Créneaux fixes pour 14h (mercredi à dimanche pour Damien)
    if (["Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].includes(jour)) {
        assignments["14h"] = "Damien";
    }

    // Créneaux fixes pour 15h (lundi, mardi, mercredi pour Andrew)
    if (["Lundi", "Mardi", "Mercredi"].includes(jour) && estDisponible("Andrew", jour, assignments)) {
        assignments["15h"] = "Andrew";
    }

    // Créneaux fixes pour 11h (lundi, mardi, mercredi, samedi, dimanche pour Olivier)
    if (["Lundi", "Mardi", "Mercredi", "Samedi", "Dimanche"].includes(jour)) {
        assignments["11h"] = "Olivier";
    }
}

// Fonction pour assigner aléatoirement les créneaux de 6h, 8h, et 9h entre Arnauld, Laurent, et Franck
function assignerCreneauxMatinAleatoires(jour, assignments) {
    let candidatsMatin = ["Arnauld", "Laurent", "Franck"].filter(employe => estDisponible(employe, jour, assignments));

    // Exclure Franck les jeudis et vendredis
    if (jour === "Jeudi" || jour === "Vendredi") {
        candidatsMatin = candidatsMatin.filter(employe => employe !== "Franck");
    }

    // Pour chaque créneau de matin (6h, 8h, 9h), assigner un employé aléatoire parmi les candidats disponibles
    ["6h", "8h", "9h"].forEach(heure => {
        const employeChoisi = candidatsMatin[Math.floor(Math.random() * candidatsMatin.length)];
        assignments[heure] = employeChoisi;
        candidatsMatin.splice(candidatsMatin.indexOf(employeChoisi), 1); // Supprimer l'employé assigné pour éviter les doublons
    });
}

// Fonction pour assigner aléatoirement un créneau horaire du soir
function assignerCreneauxSoirAleatoires(jour, assignments) {
    const candidatsSoir = equipeSoirAleatoire.filter(employe => estDisponible(employe, jour, assignments));

    // Assignation aléatoire pour 15h, 16h, 17h si non déjà attribué
    ["15h", "16h", "17h"].forEach(heure => {
        if (!assignments[heure]) {
            const employeChoisi = candidatsSoir[Math.floor(Math.random() * candidatsSoir.length)];
            assignments[heure] = employeChoisi;
            candidatsSoir.splice(candidatsSoir.indexOf(employeChoisi), 1); // Supprimer l'employé assigné pour éviter les doublons
        }
    });
}

// Fonction pour générer des données aléatoires pour le planning
function genererPlanningAleatoire() {
    return joursSemaine.map(jour => {
        const assignments = {};

        // Assignation des créneaux fixes
        assignerCreneauxFixes(jour, assignments);

        // Assignation aléatoire pour 6h, 8h, 9h
        assignerCreneauxMatinAleatoires(jour, assignments);

        // Assignation aléatoire pour les créneaux du soir
        assignerCreneauxSoirAleatoires(jour, assignments);

        return {
            jour,
            assignments
        };
    });
}

// Fonction pour générer et afficher le planning avec des inputs pour les cases vides
function genererPlanning(planningData) {
    const table = document.getElementById("planning-table");

    // Créer l'entête du tableau
    let thead = "<thead><tr><th>Jour</th>";
    horairesMatinComplet.concat(horairesSoirComplet).forEach(horaire => {
        thead += `<th>${horaire}</th>`;
    });
    thead += "</tr></thead>";
    table.innerHTML = thead;

    // Créer le corps du tableau
    let tbody = "<tbody>";

    planningData.forEach(day => {
        tbody += `<tr><td>${day.jour}</td>`;
        horairesMatinComplet.concat(horairesSoirComplet).forEach(horaire => {
            if (day.assignments[horaire]) {
                tbody += `<td>${day.assignments[horaire]}</td>`;
            } else {
                // Si l'assignation est vide, on affiche un select pour choisir un employé disponible
                const select = creerSelectEmployesDisponibles(day.jour, day.assignments);
                select.name = `${horaire}`;  // Correctement placer le select dans une cellule <td>
                const td = document.createElement("td");
                td.appendChild(select);  // Attacher le select à la cellule
                tbody += td.outerHTML;   // Assurer que le <td> contienne le <select>
            }
        });
        tbody += "</tr>";
    });

    tbody += "</tbody>";
    table.innerHTML += tbody;
}

// Générer un planning initial et configurer les boutons
window.onload = () => {
    const planningInitial = genererPlanningAleatoire();
    genererPlanning(planningInitial);

    // Bouton pour changer le planning
    const changePlanningBtn = document.getElementById("change-planning-btn");
    changePlanningBtn.addEventListener("click", () => {
        const nouveauPlanning = genererPlanningAleatoire();
        genererPlanning(nouveauPlanning);
    });
};
