// Données pour les jours et les horaires
const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const horairesMatin = ["7h", "9h", "11h"]; // 3 créneaux le matin
const horairesSoir = ["14h", "16h30", "16h30-1", "16h30-2"]; // 4 créneaux pour l'après-midi et soir, dont trois à 16h30

// Liste des barmans
const barmans = ["Tao", "Océane", "Valentin", "Juliette", "Edouard", "Aurélie", "Alaa", "Olivier", "Basil"];

// Stockage des shifts attribués pour limiter à 5 par semaine
const shiftsParSemaine = {};

// Initialisation du compteur de shifts pour chaque barman
barmans.forEach(barman => {
    shiftsParSemaine[barman] = 0;
});

// Stocker les affectations par jour
const assignmentsParJour = {};

// Initialiser les assignments pour chaque jour
joursSemaine.forEach(jour => {
    assignmentsParJour[jour] = {};  // Un objet vide pour chaque jour
});

// Fonction pour vérifier si un employé peut travailler
function estDisponible(barman, jour, assignmentsJour) {
    // Vérifier si l'employé travaille déjà 5 fois dans la semaine
    if (shiftsParSemaine[barman] >= 5) return false;

    // Vérifier si l'employé travaille déjà ce jour-là
    for (let heure in assignmentsJour) {
        if (assignmentsJour[heure] === barman) {
            return false;
        }
    }
    return true;
}

// Fonction pour mettre à jour toutes les listes déroulantes pour un jour donné
function mettreAJourSelects(jour) {
    horairesMatin.concat(horairesSoir).forEach(horaire => {
        const selectElement = document.getElementById(`${jour}-${horaire}`);
        const selectedValue = assignmentsParJour[jour][horaire];

        // Effacer toutes les options actuelles
        while (selectElement.firstChild) {
            selectElement.removeChild(selectElement.firstChild);
        }

        // Ajouter une option vide
        const optionVide = document.createElement("option");
        optionVide.text = "";
        optionVide.value = "";
        selectElement.add(optionVide);

        // Ajouter les barmans disponibles
        barmans.forEach(barman => {
            if (estDisponible(barman, jour, assignmentsParJour[jour]) || barman === selectedValue) {
                const option = document.createElement("option");
                option.text = barman;
                option.value = barman;
                selectElement.add(option);
            }
        });

        // Pré-sélectionner le barman s'il y en a déjà un
        selectElement.value = selectedValue || "";
    });
}

// Fonction pour générer des listes déroulantes avec les barmans disponibles
function creerSelectBarmans(jour, heure) {
    const select = document.createElement("select");
    select.id = `${jour}-${heure}`;

    // Ajouter une option vide
    const optionVide = document.createElement("option");
    optionVide.text = "";
    optionVide.value = "";
    select.add(optionVide);

    // Ajouter les barmans disponibles
    barmans.forEach(barman => {
        if (estDisponible(barman, jour, assignmentsParJour[jour])) {
            const option = document.createElement("option");
            option.text = barman;
            option.value = barman;
            select.add(option);
        }
    });

    // Gérer le changement de sélection
    select.addEventListener("change", (e) => {
        const selectedBarman = e.target.value;

        // Supprimer l'ancien barman s'il était déjà assigné à ce créneau
        const ancienBarman = assignmentsParJour[jour][heure];
        if (ancienBarman) {
            shiftsParSemaine[ancienBarman]--;
        }

        // Mettre à jour l'assignation dans le jour et l'heure choisis
        assignmentsParJour[jour][heure] = selectedBarman;

        // Mettre à jour le nombre de shifts par semaine
        if (selectedBarman) {
            shiftsParSemaine[selectedBarman]++;
        }

        // Mettre à jour les selects pour ce jour
        mettreAJourSelects(jour);
    });

    return select;
}

// Fonction pour générer le planning avec des selects dans chaque case
function genererPlanning() {
    const table = document.getElementById("planning-table");

    // Créer l'entête du tableau
    let thead = "<thead><tr><th>Jour</th>";
    horairesMatin.concat(horairesSoir).forEach(horaire => {
        thead += `<th>${horaire}</th>`;
    });
    thead += "</tr></thead>";
    table.innerHTML = thead;

    // Créer le corps du tableau
    let tbody = "<tbody>";

    joursSemaine.forEach(jour => {
        tbody += `<tr><td>${jour}</td>`;
        horairesMatin.concat(horairesSoir).forEach(horaire => {
            const select = creerSelectBarmans(jour, horaire);  // Créer un select pour chaque créneau
            const td = document.createElement("td");
            td.appendChild(select);
            tbody += td.outerHTML;
        });
        tbody += "</tr>";
    });

    tbody += "</tbody>";
    table.innerHTML += tbody;
}

// Générer le planning initial
window.onload = () => {
    genererPlanning();

    // Fonction pour changer le planning
    document.getElementById("change-planning-btn").addEventListener("click", () => {
        genererPlanning();
    });

    // Fonction pour imprimer
    document.getElementById("print-btn").addEventListener("click", function () {
        window.print(); // Ouvre la boîte de dialogue d'impression
    });
};
