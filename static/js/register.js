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
    // Hier wird das DOM vollständig geladen
    document.getElementById('registerForm').addEventListener('change', validateForm);
});;


async function registerUser() {
    let username = document.getElementById('newUsername').value;
    let email = document.getElementById('createMail').value
    let pw1 = document.getElementById('passwordOne').value
    let pw2 = document.getElementById('passwordTwo').value
    let notSimilarPassword = document.getElementById('notSimilarPassword');
    let usernameExists = document.getElementById('usernameExists');
    let fd = new FormData()
    let token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fd.append('csrfmiddlewaretoken', token);
    fd.append('createUsername', username);
    fd.append('createMail', email)
    fd.append('createPassword', pw1)

    if(pw1 === pw2){
        console.log('pw right');
        notSimilarPassword.style.display = 'none'; 
        try {
            let response = await fetch('/register/', {
                method: 'POST',
                body: fd,
                headers: {
                    'Accept': 'application/json' // This tells the server that we expect a JSON response
                }
            });
            let result = await response.json();
            if (result.success) {
                console.log('User registered successfully');
                window.location.href = result.redirect_url;
            } else {
                if (result.error === 'username_exists') {
                    usernameExists.style.display = 'block';
                }
            }
        } catch (e) {
            console.error('An error occurred', e);
        }
    } else {
        notSimilarPassword.style.display = 'block';
    }
}

function routeBack(){
    window.location.href = '/login/';
}