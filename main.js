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
    
    const partyNames  = partyResults.map(party => party[0]).filter((_, idx) => unCheckedBoxes[idx]);
    const partyShares = partyResults.map(party => party[1]).filter((_, idx) => unCheckedBoxes[idx]);
    const partyColors = partyResults.map(party => party[2]).filter((_, idx) => unCheckedBoxes[idx]);
    const partyIdx = drawFromCustomDistr(partyShares)
    document.getElementById('party-name').innerHTML = partyNames[partyIdx];
    const bgColor = partyColors[partyIdx] ? partyColors[partyIdx] : "FFFFFF";
    //src http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round((
        (parseInt("0x" + bgColor.slice(0,2)) * 299) +
        (parseInt("0x" + bgColor.slice(2,4)) * 587) +
        (parseInt("0x" + bgColor.slice(4,6)) * 114)
        ) / 1000);
    const textColor = (brightness > 125) ? 'black' : 'white';
    document.getElementById('modal-content').style = `background-color: #${bgColor}; color:${textColor}`;
    document.getElementsByClassName("modal-backdrop")[0].style =
        `background-color: color-mix(in hsl, #${bgColor=="FFFFFF" ? "000000" : bgColor} 50%, black);`;
}


(async function main() {
    const response = await fetch("./data.json");
    const partyResults = await response.json();
    generateCheckboxes(partyResults);

    const btn = document.getElementById("wuerfel-btn");
    btn.onclick = () => rollDice(partyResults);
})()
