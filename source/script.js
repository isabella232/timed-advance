/* class Choice {
  constructor(value, index, label, selected, image) {
    this.CHOICE_VALUE = value
    this.CHOICE_INDEX = index
    this.CHOICE_LABEL = label
    this.CHOICE_SELECTED = selected
    this.CHOICE_IMAGE = image
  }
}

var fieldProperties = {
  "CHOICES": [],
  "APPEARANCE": ["quick"],
  "FIELDTYPE": "integer",
  "PARAMETERS": [
    {
      "key": "duration",
      "value": 10
    },
    {
      "key": "unit",
      "value": "s"
    }
  ],
  "CURRENT_ANSWER": undefined,
  "METADATA": 9000
}

function getMetaData(){
  return fieldProperties.METADATA
}

function setMetaData(value){
  fieldProperties.METADATA = value
}

// fieldProperties.CHOICES[0] = new Choice(0, 0, "Hi")

function testing(message) {
  console.log(message)
  infoDiv.innerHTML += "<br>" + message
}

// */

function cursorToEnd (el) { // Moves cursor to end of text in text box (incondistent in non-text fields)
  if (typeof el.selectionStart === 'number') {
    el.selectionStart = el.selectionEnd = el.value.length
  } else if (typeof el.createTextRange !== 'undefined') {
    el.focus()
    var range = el.createTextRange()
    range.collapse(false)
    range.select()
  }
}

function handleConstraintMessage (message) {
  formGroup.classList.add('has-error')
  controlMessage.innerHTML = message
}

function handleRequiredMessage (message) {
  handleConstraintMessage(message)
}

function establishTimeLeft () { // This checks the current answer and leftover time, and either auto-advances if there is no time left, or establishes how much time is left.
  if ((leftoverTime == null) || isNaN(leftoverTime)) {
    checkComplete(currentAnswer)
    startTime = Date.now()
    timeLeft = timeStart
  } else if (isNaN(leftoverTime)) {
    checkComplete(currentAnswer)
    startTime = Date.now()
    timeLeft = timeStart
  } else {
    complete = false
    timeLeft = parseInt(leftoverTime)
    startTime = Date.now() - (timeStart - timeLeft)
  }
}

function checkComplete (cur) {
  if (Array.isArray(cur)) {
    if (cur.length !== 0) {
      complete = true
      goToNextField()
    } else {
      complete = false
    }
  } else if (cur != null) {
    complete = true
    goToNextField()
  } else {
    complete = false
  }
}

function timer () {
  if (!complete) {
    timePassed = Date.now() - startTime
    timeLeft = timeStart - timePassed
  }

  if (timeLeft < 0) { // Timer ended
    complete = true
    timeLeft = 0
    timerDisp.innerHTML = String(Math.ceil(timeLeft / round))

    if ((currentAnswer == null) || (Array.isArray(currentAnswer) && (currentAnswer.length === 0))) {
      setAnswer(missed)
    }
    setMetaData(0)
    goToNextField()
  }
  setMetaData(timeLeft)

  timerDisp.innerHTML = String(Math.ceil(timeLeft / round))
}

// Save the user's response (update the current answer)
function change () {
  const selectedButtons = []
  for (let i = 0; i < numButtons; i++) {
    if (buttons[i].checked) {
      selectedButtons.push(choices[i].CHOICE_VALUE)
    }
  }
  currentAnswer = selectedButtons.join(' ')

  if (complete === false) { // This IF statement is added so if swiping back and quickly selecting a new answer, the value of the field will not be changed
    setAnswer(currentAnswer)
  }

  // If the appearance is 'quick', then also progress to the next field
  if (appearance.includes('quick') === true) {
    goToNextField()
  }
}

function clearAnswer () {
  if ((fieldType === 'select_one') || (fieldType === 'select_multiple')) {
    for (const b of buttons) {
      b.checked = false
    }
  } else {
    textBox.value = ''
  }
  setAnswer()
  timePassed = 0
}

function setFocus () {
  if ((fieldType !== 'select_one') && (fieldType !== 'select_multiple')) {
    textBox.focus()

    if (!fieldProperties.READONLY) {
      if (window.showSoftKeyboard) {
        window.showSoftKeyboard()
      }
    } // End not read-only
  } // End not s_o or s_m
} // End setFocus

/* global getMetaData, setMetaData, setAnswer, goToNextField, fieldProperties */

// Find the input element
var buttons = document.querySelectorAll('input[name="opt"]')
var formGroup = document.querySelector('.form-group')
var controlMessage = document.querySelector('.control-message')
var textBox = document.querySelector('#field')
var formattedSpan = document.querySelector('#formatted')
var choiceDiv = document.querySelector('#radio-buttons-container')
var choiceContainers = document.querySelectorAll('.choice-container')
var choiceLabels = document.querySelectorAll('#choicelabels')
var timerDisp = document.querySelector('#timerdisp')
var unitDisp = document.querySelector('#unitdisp')
var numButtons = buttons.length

// var infoDiv = document.querySelector('#info')

var fieldType = fieldProperties.FIELDTYPE
var appearance = fieldProperties.APPEARANCE
var parameters = fieldProperties.PARAMETERS
var numParam = parameters.length
var leftoverTime
var error = false
var complete
var currentAnswer

var startTime // This will get an actual value when the timer starts in startStopTimer()
var timeStart = 10000 // Default values may be overwritten depending on the number of paramaters given,
var unit = 's' // Default, may be changed
var round = 1000 // Default, may be changed
var missed = -99 // Default, may be changed
var timeLeft // Starts this way for the display.
var timePassed = 0 // Time passed so far

switch (numParam) {
  case 4:
    if (parameters[3].value == 1) {
      leftoverTime = getMetaData()
    }
  case 3:
    missed = parameters[2].value
  case 2:
    unit = parameters[1].value

    if (unit === 'ms') {
      unit = 'milliseconds'
      round = 1
    } else if (unit === 'cs') {
      unit = 'centiseconds'
      round = 10
    } else if (unit === 'ds') {
      unit = 'deciseconds'
      round = 100
    } else {
      unit = 'seconds'
      round = 1000
    }
  case 1:
    timeStart = parameters[0].value * 1000 // Time limit on each field in milliseconds\
}
unitDisp.innerHTML = unit

if ((leftoverTime != null) && (leftoverTime <= 0)) { // True if all time has run out if it is okay to have leftover time
  complete = true
  goToNextField()
}

if ((fieldType === 'select_one') || (fieldType === 'select_multiple')) {
  currentAnswer = []
  textBox.style.display = 'none'
  formattedSpan.style.display = 'none'
  var choices = fieldProperties.CHOICES
  var choiceValues = []
  for (var i = 0; i < numButtons; i++) {
    choiceLabels[i].innerHTML = choices[i].CHOICE_LABEL // Gives each choice its HTML style

    if (fieldType === 'select_multiple') {
      buttons[i].type = 'checkbox'
    }

    buttons[i].onchange = change

    const choiceValue = choices[i].CHOICE_VALUE
    choiceValues.push(choiceValue)
    if (choices[i].CHOICE_SELECTED) {
      buttons[i].checked = true
      currentAnswer.push(choiceValue)
    }
  }
  establishTimeLeft()

  var missedChoice = choiceValues.indexOf(String(missed))
  if (missedChoice === -1) {
    error = true
    const labelDiv = document.querySelector('.label')
    labelDiv.innerHTML = 'Error! The form needs to have "' + missed + '" as one of the choice values.'
    labelDiv.style.color = '#ff0000'
  } else {
    var passDiv = document.querySelector('#choicevalue' + missed)
    passDiv.style.display = 'none'
  }

  // When a button is pressed, call the change() function and tell it which button was pressed.

  // quick appearance
  if ((appearance.includes('quick') === true) && (fieldType === 'select_one')) {
    // go through all the available choices
    window.onload = function () {
      for (var i = 0; i < choiceContainers.length; i++) {
        // add the 'appearance-quick' class
        choiceContainers[i].classList.add('appearance-quick')
        // insert the 'quick' icon
        choiceContainers[i].getElementsByClassName('choice-label-text')[0].insertAdjacentHTML('beforeend', '<svg class="quick-appearance-icon"><use xlink:href="#quick-appearance-icon" /></svg>')
      }
    }
  }
} else { // A text, integer, or decimal field
  currentAnswer = fieldProperties.CURRENT_ANSWER
  establishTimeLeft()
  if (fieldType === 'integer') {
    textBox.inputmode = 'numeric'
    textBox.type = 'number'
  } else if (fieldType === 'decimal') {
    textBox.inputmode = 'decimal'
    textBox.type = 'number'
  } else if (fieldType === 'text') {
    if (appearance.includes('numbers_phone')) {
      textBox.inputmode = 'tel'
      textBox.type = 'tel'
    } else if (appearance.includes('numbers_decimal')) {
      textBox.inputmode = 'decimal'
      textBox.type = 'number'
    } else if (appearance.includes('numbers')) {
      textBox.inputmode = 'numeric'
      textBox.type = 'number'
    }
  }
  choiceDiv.style.display = 'none'

  textBox.oninput = function () {
    formGroup.classList.remove('has-error')
    controlMessage.innerHTML = ''
    currentAnswer = textBox.value

    if (appearance.includes('show_formatted')) {
      const ansString = currentAnswer.toString()
      const pointLoc = currentAnswer.indexOf('.')

      if (pointLoc === -1) {
        formattedSpan.innerHTML = ansString.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        const beforePoint = ansString.substring(0, pointLoc).replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Before the decimal point

        // The part below adds commas to the numbers after the decimal point. Unfortunately, a lookbehind assersion breaks the JS in iOS right now, so this has been commented out for now.
        /* let midPoint = answer.substring(pointLoc + 1, pointLoc + 3) // The first two digits after the decimal point; this is because the first two digits after the decimal point are the "tenths" and "hundredths", while after that is "thousandths"
        let afterPoint = answer.substring(pointLoc + 3, answer.length).replace(/\B(?<=(^(\d{3})+))/g, ",") // After the first two digits after the decimal point
        let total = beforePoint

        if (midPoint != '') { // Adds the decimal point only if it is needed
          total += '.' + midPoint
          if (afterPoint != '') { // Adds the comma after "midPoint" and the rest only if they are needed
            total += ',' + afterPoint
          }
        } */
        const afterPoint = ansString.substring(pointLoc, ansString.length)
        const total = beforePoint + afterPoint

        formattedSpan.innerHTML = total
      }
    }

    setAnswer(currentAnswer)
  }
}

if (!error) {
  setInterval(timer, 1)
}
