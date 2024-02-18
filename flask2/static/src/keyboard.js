let Keyboard = window.SimpleKeyboard.default;
let swipe = window.SimpleKeyboardSwipe.default;
const autocorrect = window.SimpleKeyboardAutocorrect.default;

const wordList = ["my", "word", "list"];

let keyboard = new Keyboard({
    onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button),
    useMouseEvents: true,
    autocorrectDict: wordList,
    autocorrectHotkey: "{space}",
    modules: [
        swipe,
        autocorrect
    ]
});

console.log(keyboard);

function onChange(input) {
    document.querySelector(".input").value = input;
    console.log("Input changed", input);
}

function onKeyPress(button) {
    console.log("Button pressed", button);
}
