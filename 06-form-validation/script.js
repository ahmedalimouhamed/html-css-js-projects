const form = document.getElementById('registration-form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');

form.addEventListener('submit', function(e){
    e.preventDefault();

    const isRequiresValid = checkRequired([username, email, password, confirmPassword]);

    let isFormValid = isRequiresValid;

    if(isFormValid){
        const isUsernameValid = checkLength(username, 3, 15);
        const isEmailValid = checkEmail(email);
        const isPasswordValid = checkLength(password, 6, 25);
        const isPasswordsMatch = checkPasswordsMatch(password, confirmPassword);

        isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isPasswordsMatch;
    }

    if(isFormValid){
        alert("Registration Successfull");
        form.reset();
        document.querySelectorAll('.form-group').forEach((group) => {
            group.className = 'form-group';
        })
    }
});

function checkPasswordsMatch(input1, input2){
    if(input1.value !== input2.value){
        setError(input2, 'Passwords do not match');
        return false;
    }
    return true;
}

function checkEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(emailRegex.test(email.value.trim())){
        showSuccess(email);
        return true;
    }else{
        showError(email, "Email is not valid");
        return false;
    }
}

function checkLength(input, min, max){
    if(input.value.length < min){
        showError(input, `${formatFieldName(input)} must be at least ${min} characters.`);
        return false;
    }else if(input.value.length > max){
        showError(input, `${formatFieldName(input)} must be less than ${max} characters.`);
        return false;
    }else{
        showSuccess(input);
        return true;
    }
}

function checkRequired(inputArr){
    let isValid = true;

    inputArr.forEach((input) => {
        if(input.value.trim() === ''){
            showError(input, `${formatFieldName(input)} is required`);
            isValid = false;
        }else{
            showSuccess(input);
        }
    });

    return isValid;
}

function formatFieldName(input){
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function showError(input, message){
    const formGroup = input.parentElement;
    formGroup.className = 'form-group error';
    const small = formGroup.querySelector('small');
    console.log(small);
    //console.log(message);
    small.innerText = message;
}

function showSuccess(input){
    const formGroup = input.parentElement;
    formGroup.className = 'form-group success';
}
