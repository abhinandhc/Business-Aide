let loginForm = document.getElementById("retailerfpform");
loginForm.addEventListener('submit',function(event)
{
    event.preventDefault();
    let emailField = document.getElementById("inputEmail");
    let buttonField = document.getElementById("button")
    let email = emailField.value;
    buttonField.innerHTML = "Submitinging...";
    firebase.auth().sendPasswordRestEmail(email)
    .then(function (result){
        checkUser("retailers", result.user.uid, result.user)
        
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        alert("Submiting failed")
        buttonField.innerHTML = "Submit";
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
            Swal.fire("Submiting success");
            localStorage.uid = user.uid;
            localStorage.user = "retailer";


            window.open("retailerHome.html", "_blank")
            window.open('', '_self').close()
        }

    })
}
