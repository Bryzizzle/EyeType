// Tracking Disable
var disable_tracking = false;

setTimeout(function () {
    setInterval(keyboardUpdate, 200)
}, 2000);

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

        // Reset the dwell time and last_button
        last_button = undefined;
        button_hits = 0;

        return;
    }

    // If the tracking is disabled, then exit (unless its a stop-button)
    if (disable_tracking && (!target.classList.contains("stop-button"))){
        last_button = undefined;
        return;
    }

    // Update debug text
    document.getElementById("debug-key").innerText = target.innerText;

    // Highlight the target
    setHighlight(target);

    // Update button count
    if (target === last_button) {
        button_hits++;
    } else {
        button_hits = 0;
        last_button = target;
    }


    // Modify the dwell limit depending on the target's class
    let dwell_limit = 5;
    if (target.classList.contains("slow-trigger")){
        dwell_limit = 10;
    }

    // If over dwell time limit, then click
    if (button_hits >= dwell_limit){
        target.click();
        button_hits = 0;

        // Handle the STOP button
        handleButton(target);

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

function handleButton(target){
    // Handle Entry Buttons
    if (target.classList.contains("key-entry")){
        if(target.innerText !== "space") {
            speak(target.innerText.split('').join(" "), 1.25);
        } else {
            speak(target.innerText);
        }

        return;
    }

    // Handle Delete Button
    if (target.classList.contains("delete")){
        speak("delete")
    }

    // Handle Cycle Button
    if (target.classList.contains("prediction-cycle")){
        // Get the currently worked on text
        let currText = document.querySelector("div.screen>span.current-text").innerText;
        console.log(currText);

        speak(currText);
    }

    // Handle Stop Button
    if (target.classList.contains("stop-button")){
        if (target.innerText === "STOP"){
            // If its currently at red STOP, switch it to green START
            target.innerText = "START";
            target.classList.add("green-key");
            target.classList.remove("red-key");

            // Disable tracking
            disable_tracking = true;

            // Trigger speech
            speak("Keyboard Stopped.");
        } else {
            // If its currently at red STOP, switch it to green START
            target.innerText = "STOP";
            target.classList.remove("green-key");
            target.classList.add("red-key");

            // Disable tracking
            disable_tracking = false;

            // Trigger speech
            speak("Keyboard Started.");
        }
    }
}

function speak(text, rate = 1){
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.rate = rate;
    window.speechSynthesis.speak(msg);
}