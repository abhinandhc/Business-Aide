let loginForm = document.getElementById("adminfpform");
loginForm.addEventListener('submit',function(event)
{
    event.preventDefault();
    let emailField = document.getElementById("inputEmail");
    let buttonField = document.getElementById("button")
    let email = emailField.value;
    buttonField.innerHTML = "Submiting..";
    buttonField.disabled = true;

    firebase.auth().sendPasswordResetEmail(email)
    .then(function (result){
        alert("Reset Mail Sent")
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        alert(error.message)
        buttonField.innerHTML = "Submit";
        buttonField.disabled = false;

      });
})



