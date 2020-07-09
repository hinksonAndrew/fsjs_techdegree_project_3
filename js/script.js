const nameInput = document.getElementById('name');
const otherJobRoleInput = document.getElementById('other-title');
const colorDropdown = document.getElementById('color');
const themeSelect = document.getElementById('design');
const option = document.createElement('option');
let punShirts = [];
let heartShirts = [];

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
const createOption = () => {
    if (colorDropdown[0].value !== 'select_theme') {
        let option = document.createElement('option');
        option.text = 'Please select a theme';
        option.value = 'select_theme'
        colorDropdown.add(option, 0);
    }
    colorDropdown[0].selected = true;
}

// initilize
nameInput.focus();
otherJobRoleInput.hidden = true;
createOption();

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
        showColors(punShirts);
    } else if (e.target.value === 'heart js') {
        showColors(heartShirts);
    } else {
        createOption();
    }
});