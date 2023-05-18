/**
 * @param {array} distr Array of probability values
 * @returns index of result bin
 */
function drawFromCustomDistr(distr) {
    let sum = 0
    const cumsum = distr.map((sum = 0, val => sum += val));
    const totalsum = cumsum[cumsum.length-1];
    const diceResult = Math.random() * totalsum;
    return cumsum.findIndex(elem => elem >= diceResult);
}


function generateCheckboxes(partyResults) {
    partyResults.sort((a, b) => b[1] - a[1]).forEach(party => {
        party = party[0];
        const wrapperDiv = document.getElementById("checkboxes");
        const form = document.createElement("div");
        form.className = "form-check";
        
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.className = "form-check-input";
        checkbox.id = party;
        form.appendChild(checkbox);

        const label = document.createElement("label");
        label.setAttribute("for", party);
        label.className = "form-check-label";
        label.innerHTML = party;
        form.appendChild(label);
        wrapperDiv.appendChild(form);
    });
}

function rollDice(partyResults) {
    const boxes = Array.from(document.getElementsByClassName("form-check-input"));
    const unCheckedBoxes = boxes.map(box => !box.checked)
    
    const partyNames = partyResults.map(party => party[0]).filter((_, idx) => unCheckedBoxes[idx]);
    const partyShares = partyResults.map(party => party[1]).filter((_, idx) => unCheckedBoxes[idx]);
    window.alert("Der Zufallsgenerator hat die Partei '" + partyNames[drawFromCustomDistr(partyShares)] + "' ergeben.")
}


(async function main() {
    const response = await fetch("./data.json");
    const partyResults = await response.json();
    generateCheckboxes(partyResults);

    const btn = document.getElementById("wuerfel-btn");
    btn.onclick = () => rollDice(partyResults);
})()
