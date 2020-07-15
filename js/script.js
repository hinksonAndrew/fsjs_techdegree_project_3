const nameInput = document.getElementById('name');
const emailInput = document.getElementById('mail');
const title = document.getElementById('title');
const titleOptions = title.options;
const otherJobRoleInput = document.getElementById('other-title');
const colorLabel = document.querySelector('label[for=color]');
const colorDropdown = document.getElementById('color');
const themeSelect = document.getElementById('design');
const activity = document.querySelector('.activities');
const activities = document.querySelectorAll('input[type=checkbox]');
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

//Error functions
/*
creates div for error message to be used right after the error occured if there isnt
already a div there.
*/
const createDiv = (source, id, message) => {
    const div = document.getElementById(id);
    if (!div) {
        const parent = source.parentNode;
        const next = source.nextElementSibling;
        const div = document.createElement('div');
        div.setAttribute('id', id);
        div.innerText = message;
        parent.insertBefore(div, next);
    }
}

/*
removes the div created for error if it exists. No console error thrown
if it tries to remove one that isnt there.
*/
const removeDiv = (id) => {
    const div = document.getElementById(id);
    if (div) {
        div.parentNode.removeChild(div);
    }
    
}

/*
handles creating/removing/adding borders to error fields. 
Allows more fields to use errors in this fashion if added later.
*/
const handleError = (source, bool, message, id) => {
    if (bool) {
        source.style.border = '2px solid #5e97b0';
        removeDiv(id);
    } else {
        source.style.border = '2px solid red';
        createDiv(source, id, message);
    }
}

// Validator Functions
/*
Checks to make sure name is correctly formated and there is input.
*/
const validateName = () => {
    const message = 'Invalid Name Format';
    const type = 'name-error';
    const nameRegex = /^[a-z]* [a-z]*$/i;
    const string = nameInput.value; 
    if (nameRegex.test(string)) {
        handleError(nameInput, true, '', type);
        return true;
    } else {
        handleError(nameInput, false, message, type);
        return false;
    }
}

/*
This is used to make sure email is formated correctly and not empty.
Used in real-time listener down below in listeners section. 
*/

const validateEmail = () => {
    //pulled this regex from https://www.regular-expressions.info/email.html
    const message = 'Invalid Email Format';
    const noEmptyMessage = 'Email can not be empty';
    const type = 'email-error';
    const emailRegex = /^\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b$/i;
    const string = emailInput.value;

    if (emailInput.value === '') {
        handleError(emailInput, true, '', type);
        handleError(emailInput, false, noEmptyMessage, type);
    } else if (!emailRegex.test(string)) {
        handleError(emailInput, true, '', type);
        handleError(emailInput, false, message, type);
    } else {
        handleError(emailInput, true, '', type);
    }
}

/*
Goes through each activity and checks to see if any are checked.
Will return false and error if none are checked.
*/
const validateActivity = () => {
    const message = 'Must Select At Least One Activity';
    const type = 'activity-error';
    let check = false;
    for (let i = 0; i < activities.length; i++) {
        if (activities[i].checked) {
            check = true;
        }
    }
    if (check) {
        handleError(activity, true, '', type);
        activity.style.border = '0px';
        return true;
    } else {
        handleError(activity, false, message, type);
        return false;
    }
}

/*
Has error messages for different things that could go wrong, mainly not enough/too much in fields.
Also checks each field to make sure it passes tests based on regex.
*/
const validateCreditCard = () => {
    const numberMessage = 'Invalid Card Number: 13-16 digits allowed';
    const zipMessage = 'Invalid Zip: 5 digits allowed only';
    const cvvMessage = 'Invalid Cvv: 3 digits allowed only';
    const numberType = 'number-error';
    const zipType = 'zip-error';
    const cvvType = 'cvv-error';
    const number = cardNumberInput.value;
    const zip = zipcodeInput.value;
    const cvv = cvvInput.value;
    const cardNumber = /^[0-9]{13,16}$/.test(number);
    const zipCode = /^[0-9]{5}$/.test(zip);
    const cvvCode = /^[0-9]{3}$/.test(cvv);

    if (!cardNumber) {
        handleError(cardNumberInput, false, numberMessage, numberType);
    } else {
        handleError(cardNumberInput, true, '', numberType);
    }

    if (!zipCode) {
        handleError(zipcodeInput, false, zipMessage, zipType);
    } else {
        handleError(zipcodeInput, true, '', zipType);
    }
    
    if (!cvvCode) {
        handleError(cvvInput, false, cvvMessage, cvvType);
    } else {
        handleError(cvvInput, true, '', cvvType);
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
the listener on title hides or shows the other job role input bar
*/
title.addEventListener('change', (e) => {
    if (e.target.value === 'other') {
        otherJobRoleInput.hidden = false;
    } else {
        otherJobRoleInput.hidden = true;
    }
});

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

/*
the listener on emailInput is a realtime listener.
on keyup it validates email and also if it is empty it will show 
empty error and if invalid format it will show that instead.
*/
emailInput.addEventListener('keyup', (e) => {
    validateEmail();
});

button.addEventListener('click', (e) => {
    if (!masterValidator()) {
        e.preventDefault();
    }
});