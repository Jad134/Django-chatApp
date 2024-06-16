/**
 * This function validate the register inputs for requirements
 */
function validateForm() {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    let allFieldsFilled = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            allFieldsFilled = false;
        }
    });
    submitBtn.disabled = !allFieldsFilled;
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('registerForm').addEventListener('change', validateForm);
});;


/**
 * register the user if the passwords are similar
 */
async function registerUser() {
    let { username, email, pw1, pw2 } = getUserInput();
    let notSimilarPassword = document.getElementById('notSimilarPassword');
    let usernameExists = document.getElementById('usernameExists');

    if (pw1 === pw2) {
        notSimilarPassword.style.display = 'none';
        let fd = createFormData(username, email, pw1);
        await submitRegistration(fd, usernameExists);
    } else {
        notSimilarPassword.style.display = 'block';
    }
}

/**
 * 
 * @returns the value from the respective input
 */
function getUserInput() {
    return {
        username: document.getElementById('newUsername').value,
        email: document.getElementById('createMail').value,
        pw1: document.getElementById('passwordOne').value,
        pw2: document.getElementById('passwordTwo').value,
    };
}

/**
 * returns the formData
 */
function createFormData(username, email, password) {
    let fd = new FormData();
    let token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fd.append('csrfmiddlewaretoken', token);
    fd.append('createUsername', username);
    fd.append('createMail', email);
    fd.append('createPassword', password);
    return fd;
}

/**
 * This function sends the FormData object to the server and handles the response.
 */
async function submitRegistration(fd, usernameExists) {
    try {
       let response = await responseRegister(fd)
        let result = await response.json();
        if (result.success) {
            window.location.href = result.redirect_url;
        } else {
            if (result.error === 'username_exists') {
                usernameExists.style.display = 'block';
            }
        }
    } catch (e) {
        console.error('An error occurred', e);
    }
}

/**
 * 
 * @returns the response to the server
 */
async function responseRegister(fd){
    let response = await fetch('/register/', {
        method: 'POST',
        body: fd,
        headers: {
            'Accept': 'application/json' // This tells the server that we expect a JSON response
        }
    });
    return response
}

function routeBack() {
    window.location.href = '/login/';
}