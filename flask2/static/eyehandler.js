setInterval(keyboardUpdate, 200)

var last_button = undefined;
var button_hits = 0

var last_highlight = undefined;

function keyboardUpdate() {
    // Get element that the user's looking at
    let elems = document.elementsFromPoint(window.innerWidth * (globalPredX / 100), window.innerHeight * (globalPredY / 100));
    let target = undefined;

    for (let elem of elems) {
        if (elem.classList.contains("key")) {
            target = elem;
            break;
        }
    }

    if (target === undefined) {
        console.log(`${globalPredX}, ${globalPredY} (None)`);

        // Change the color back to red
        document.getElementById("dotelem").style.backgroundColor = "red";

        // Reset the highlight
        setHighlight(undefined);

        return;
    }

    // Update debug text
    // document.getElementById("debug-key").innerText = target.innerText;

    // Highlight the target
    setHighlight(target);

    // Update button count
    if (target === last_button) {
        button_hits++;
    } else {
        button_hits = 0;
        last_button = target;
    }

    // If over dwell time limit, then click
    if (button_hits >= 5){
        target.click();
        button_hits = 0;
        // Update color to green (for a short amount of time)
        document.getElementById("dotelem").style.backgroundColor = "green";
    } else if (button_hits >= 3){
        // Change color to yellow
        document.getElementById("dotelem").style.backgroundColor = "yellow";
    } else {
        // Change color to red
        document.getElementById("dotelem").style.backgroundColor = "red";
    }

    // Update debug text
    document.getElementById("debug-dwell").innerText = button_hits;
}

function setHighlight(elem) {
    // Remove highlight from the old element
    if (last_highlight !== undefined) {
        last_highlight.classList.remove("key-highlight");
    }

    if (elem !== undefined) {
        // Add highlight to new element
        elem.classList.add("key-highlight");

        // Keep track of the new element
        last_highlight = elem;
    } else {
        last_highlight = undefined;
    }
}