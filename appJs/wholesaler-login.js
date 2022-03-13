let loginForm = document.getElementById("Wholesellerlogin");
loginForm.addEventListener('submit',function(event)
{
    event.preventDefault();
    let emailField = document.getElementById("inputEmail");
    let passwordField = document.getElementById("password");
    let buttonField = document.getElementById("button")
    let email = emailField.value;
    let password = passwordField.value;
    buttonField.innerHTML = "Logging...";
    buttonField.disabled = true;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (result){
        checkUser("wholesellers", result.user.uid, result.user)
        

    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        alert("Login Failed"+" "+errorMessage);
        buttonField.innerHTML = "Log in";
        buttonField.disabled = false;

      });
})

function checkUser(userType, userId, user) {
    let db = firebase.firestore();
    db.collection(userType).doc(userId).get().then((res) => {
        if (!res.exists) {
            Swal.fire({
                icon: "error",
                title: "Oops! An Error Occured",
                text: "Not " + userType
            }).then(() => {
                firebase.auth().signOut().then((res) => {
                    location.href = "index.html";

                })

            })
        }
        else {
            Swal.fire("login success");
            localStorage.uid = user.uid;
            localStorage.user = "wholesaler";


            window.open("wholesalerHome.html", "_blank")
                window.open('', '_self').close()

        }

    })
}
