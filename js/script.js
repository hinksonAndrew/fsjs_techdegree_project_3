const nameInput = document.getElementById('name');
const emailInput = document.getElementById('mail');
const otherJobRoleInput = document.getElementById('other-title');
const colorLabel = document.querySelector('label[for=color]');
const colorDropdown = document.getElementById('color');
const themeSelect = document.getElementById('design');
const activity = document.querySelector('.activities');
const activityOutput = document.createElement('p');
const payment = document.getElementById('payment');
const paymentOptions = payment.options;
const creditCardDiv = document.getElementById('credit-card');
const cardNumberInput = document.getElementById('cc-num');
const zipcodeInput = document.getElementById('zip');
const cvvInput = document.getElementById('cvv');
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
hideColors hides the color dropdown
*/
const hideColors = () => {
    colorLabel.hidden = true;
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

/*
This addes a red border to the incorrect field.
The type arg is used for specifying certain errors.
*/
const showError = (source, bool, type=false) => {
    if (bool) {
        source.style.border = '2px solid #5e97b0';
    } else {
        source.style.border = '2px solid red';
    }
}

// Validator Functions
const validateName = () => {
    const nameRegex = /^[a-z]* [a-z]*$/i;
    const string = nameInput.value; 
    if (nameRegex.test(string)) {
        showError(nameInput, true)
        return true;
    } else {
        showError(nameInput, false);
        return false;
    }
}

const validateEmail = () => {
    //pulled this regex from https://www.regular-expressions.info/email.html
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const string = emailInput.value;
    if (emailRegex.test(string)) {
        showError(emailInput, true);
        return true;
    } else {
        showError(emailInput, false);
        return false;
    }
}

const validateActivity = () => {
    if (activityTotalCost !== 0) {
        activity.style.border = '0px solid #5e97b0';
        return true;
    } else {
        showError(activity, false);
        return false;
    }
}

const validateCreditCard = () => {
    const number = cardNumberInput.value;
    const zip = zipcodeInput.value;
    const cvv = cvvInput.value;
    const cardNumber = /^[0-9]{13,16}$/.test(number);
    const zipCode = /^[0-9]{5}$/.test(zip);
    const cvvCode = /^[0-9]{3}$/.test(cvv);

    if (!cardNumber) {
        showError(cardNumberInput, false);
    } else {
        showError(cardNumberInput, true);
    }

    if (!zipCode) {
        showError(zipcodeInput, false);
    } else {
        showError(zipcodeInput, true);
    }
    
    if (!cvvCode) {
        showError(cvvInput, false);
    } else {
        showError(cvvInput, true);
    }

    if (cardNumber && zipCode && cvvCode) {
        return true;
    }
    
    return false;
}

/*
This validator uses all previous validator functions and also sees if
credit card is being used. Returns true or false depending on if everything
is correctly formated.
*/
const masterValidator = () => {
    const nameTest = validateName();
    const emailTest = validateEmail();
    const activityTest = validateActivity();
    const ccTest = validateCreditCard();

    if (paymentOptions[1].selected) {
        if (nameTest && emailTest && activityTest && ccTest) {
            return true;
        } else {
            return false;
        }
    } else {
        if (nameTest && emailTest && activityTest) {
            return true;
        } else {
            return false;
        }
    }
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
    if (!masterValidator()) {
        e.preventDefault();
    }
});