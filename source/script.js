class Choice{
        constructor(value, index, label, selected, image){
                        this.CHOICE_VALUE = value;
                        this.CHOICE_INDEX = index;
                        this.CHOICE_LABEL = label;
                        this.CHOICE_SELECTED = selected;
                        this.CHOICE_IMAGE = image;
        }
}
                
var fieldProperties = {
        "CHOICES": [],
        "APPEARANCE": ["quick"],
        "FIELDTYPE": "integer"
}
fieldProperties.CHOICES[0] = new Choice(0, 0, "Hi");
//*/

// Find the input element
var buttons = document.querySelectorAll('input[name="opt"]');
var formGroup = document.querySelector('.form-group');
var controlMessage = document.querySelector('.control-message');
var textBox = document.querySelector('#field');
var choiceContainers = document.querySelectorAll(".choice-container");
var choiceLabels = document.querySelectorAll('#choicelabels');
var numButtons = buttons.length;

var fieldType = fieldProperties.FIELDTYPE;
var appearance = fieldProperties.APPEARANCE;

if ((fieldType == 'select_one') || (fieldType == 'select_multiple')) {
    textBox.style.display = 'none';

    // Define what happens when the user attempts to clear the response
    function clearAnswer() {
        document.querySelector('input[name="opt"]:checked').checked = false;
    }

    // Save the user's response (update the current answer)
    function change() {
        setAnswer(this.value);
        // If the appearance is 'quick', then also progress to the next field
        if (fieldProperties.APPEARANCE.includes("quick") == true) {
            goToNextField();
        }
    }

    // When a button is pressed, call the change() function and tell it which button was pressed.
    for (var i = 0; i < numButtons; i++) {
        choiceLabels[i].innerHTML = fieldProperties.CHOICES[i].CHOICE_LABEL; //Gives each choice its HTML style
        buttons[i].onchange = change;
    }

    // quick appearance
    if ((fieldProperties.APPEARANCE.includes("quick") == true) && (fieldProperties.FIELDTYPE == 'select_one')) {
        // go through all the available choices
        window.onload = function () {
            for (var i = 0; i < choiceContainers.length; i++) {
                // add the 'appearance-quick' class
                choiceContainers[i].classList.add("appearance-quick");
                // insert the 'quick' icon
                choiceContainers[i].getElementsByClassName("choice-label-text")[0].insertAdjacentHTML('beforeend', '<svg class="quick-appearance-icon"><use xlink:href="#quick-appearance-icon" /></svg>');
            }
        }
    }
}
else {

setFocus()
    function setFocus() {
        textBox.focus();
    
        if (!fieldProperties.READONLY) {
            if (window.showSoftKeyboard) {
                window.showSoftKeyboard();
            }
        }
    }

    
}

function cursorToEnd(el) { //Moves cursor to end of text in text box (incondistent in non-text fields)
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    }
    else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}


function handleConstraintMessage(message) {
    formGroup.classList.add('has-error');
    controlMessage.innerHTML = message;
}

function handleRequiredMessage(message) {
    handleConstraintMessage(message)
}