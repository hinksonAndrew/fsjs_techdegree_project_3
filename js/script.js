const nameInput = document.getElementById('name');
const otherJobRoleInput = document.getElementById('other-title');
const colorLabel = document.querySelector('label[for=color]');
const colorDropdown = document.getElementById('color');
const themeSelect = document.getElementById('design');
const option = document.createElement('option');
const activity = document.querySelector('.activities');
const activityOutput = document.createElement('p');
const payment = document.getElementById('payment');
const paymentOptions = payment.options;
const creditCardDiv = document.getElementById('credit-card');
const paypalDiv = document.getElementById('paypal');
const bitcoinDiv = document.getElementById('bitcoin');
const button = document.querySelector('button');
activity.appendChild(activityOutput);

let punShirts = [];
let heartShirts = [];
let activityTotalCost = 0;

// Regex constants
const regexClipColor = /\s\W(.+)\W/i;
const regexPunShirts = /.+\s\W(JS Puns shirt only)\W/i;
const regexHeartShirts = /.+\s\W(.+ JS shirt only)\W/;

// functions
/*
fixColorNames clips the added html text that indicates which shirt it goes with.
*/
const fixColorNames = (color) => {
    color.innerHTML = color.innerHTML.replace(regexClipColor, '');
}

/*
showColors limits the shown colors depending on what theme is chosen. Also, 
it calls fixColorNames to only show the color itself rather than the 
extra information.
*/
const showColors = (shirts) => {
    for (let i = 0; i < shirts.length; i++) {
        colorDropdown[shirts[i]].hidden = false;
        fixColorNames(colorDropdown[shirts[i]]);
    }
    colorDropdown[shirts[0]].selected = true;
}

/*
createOption creates an option and adds it to the colorDropdown at index 0.
Also checks if there is already a 'select a theme' option. If there is
it wont create one, it will only select it.
*/
const hideColors = () => {
    colorLabel.hidden = true;
    // if (colorDropdown[0].value !== 'select_theme') {
    //     let option = document.createElement('option');
    //     option.text = 'Please select a theme';
    //     option.value = 'select_theme'
    //     colorDropdown.add(option, 0);
    // }
    colorDropdown[0].selected = true;
    colorDropdown.hidden = true;
}

/*
selectPaymentMethod is given the value of the target from activity and shows/hides
the information about the various payment methods. There is a default value of
credit card to make sure when its first called before the listener below it sets
the page correctly.
*/
const selectPaymentMethod = (option = 'credit card') => {
    if (option === 'credit card') {
        creditCardDiv.hidden = false;
        paypalDiv.hidden = true;
        bitcoinDiv.hidden = true;
    } else if (option === 'paypal') {
        creditCardDiv.hidden = true;
        paypalDiv.hidden = false;
        bitcoinDiv.hidden = true;
    } else if (option === 'bitcoin') {
        creditCardDiv.hidden = true;
        paypalDiv.hidden = true;
        bitcoinDiv.hidden = false;
    }
}

const validateName = (string) => {
    const nameRegex = /^[a-z]* [a-z]*$/i;
    return nameRegex.test(string);
}

const validateEmail = (string) => {
    const emailRegex = ;
    return emailRegex.test(string);
}

// initilize
nameInput.focus();
otherJobRoleInput.hidden = true;
hideColors();
paymentOptions[0].hidden = true;
paymentOptions[1].selected = true;
selectPaymentMethod();


/*
this for loop pushes the colors that are provided at load into their own
array's. This way if they add colors for those specific shirts then it should
update and still only show the colors that are available.
*/
for (let i = 0; i < colorDropdown.length; i++) {
    colorDropdown[i].hidden = true;
    if (regexPunShirts.test(colorDropdown[i].innerHTML)) {
        punShirts.push(colorDropdown[i].index);
    } else if (regexHeartShirts.test(colorDropdown[i].innerHTML)) {
        heartShirts.push(colorDropdown[i].index);
    }
}

// event listeners
/*
the listener on themeselect waits for the user to select a theme and based
on the value of that selection will update the colorDropdown to only
show available colors with formated names. Also if user for some reason 
changes it back to default then the list will still update to wait for theme
to change again.
*/
themeSelect.addEventListener('change', (e) => {
    for (let i = 0; i < colorDropdown.length; i++) {
        colorDropdown[i].hidden = true;
    }
    if (e.target.value === 'js puns') {
        colorDropdown.hidden = false;
        colorLabel.hidden = false;
        showColors(punShirts);
    } else if (e.target.value === 'heart js') {
        colorDropdown.hidden = false;
        colorLabel.hidden = false;
        showColors(heartShirts);
    } else {
        hideColors();
    }
});

/*
the listener on activity grabs the events data day time and also loops through 
all activities in list and compares the day time to see if matched. If they are
then its disables options that are not available and also this updates the total cost.
*/
activity.addEventListener('change', (e) => {
    const checkedCost = +e.target.getAttribute('data-cost');
    const targetDate = e.target.getAttribute('data-day-and-time');
    const activityInput = document.querySelectorAll('input[type=checkbox]');

    if (e.target.checked === true) {
        activityTotalCost += checkedCost;
    } else {
        activityTotalCost -= checkedCost;
    }
    activityOutput.innerHTML = `Total: $${activityTotalCost}`;

    for (let i = 0; i < activityInput.length; i++) {
        let tempActivity = activityInput[i];
        let tempDate = activityInput[i].getAttribute('data-day-and-time');
        if (tempDate === targetDate && tempActivity !== e.target) {
            if (e.target.checked) {
                tempActivity.disabled = true;
            } else if (!e.target.checked) {
                tempActivity.disabled = false;
            }
        }
    }
});

/*
the listener on payment calls the selectPaymentMethod whenever the dropdown is changed.
*/
payment.addEventListener('change', (e) => {
    selectPaymentMethod(e.target.value);
});

button.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(validateName(nameInput.value));
});