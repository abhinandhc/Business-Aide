let regform = document.getElementById("wholesellerregister");
regform.addEventListener('submit', function (event) {
    event.preventDefault();
    let nameField = document.getElementById("name");
    let mobilephoneField = document.getElementById("phone");
    let addressField = document.getElementById("address");
    let stateField = document.getElementById("state");
    let pinField = document.getElementById("pin");
    let GSTField = document.getElementById("gst");
    let emailField = document.getElementById("email");
    let passwordField = document.getElementById("password");
    let buttonField = document.getElementById("button");
    let name = nameField.value;
    let mobilephone = mobilephoneField.value;
    let address = addressField.value;
    let state = stateField.value;
    let pin = pinField.value;
    let gst = GSTField.value;
    let email = emailField.value;
    let password = passwordField.value;

    if(mobilephone.length == 10 && gst.length == 15){
        buttonField.innerHTML = "Registering...";
        buttonField.disabled = true;
    
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (result) {
                localStorage.uid = result.user.uid;
                localStorage.user = "wholesaler";
                let db = firebase.firestore();
                db.collection("wholesellers").doc(result.user.uid).set({
                    address: address,
                    name: name,
                    phone: mobilephone,
                    state:state,
                    pin:pin,
                    GST_number:gst,
                    email: email
                }).then((result) => {
                    buttonField.innerHTML = "Register";
                    buttonField.disabled = false;
                    //redirect to retailer home page
                    window.location = "wholesalerHome.html";
                })
                    .catch((error) => {
                        alert(error);
                        buttonField.innerHTML = "Register";
                        buttonField.disabled = false;
                    })
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // ...
                        alert("Registering failed")
                        buttonField.innerHTML = "Register";
                        buttonField.disabled = false;
    
                    });
            })
    }
    else{
        if(mobilephone.length != 10){
            mobilephoneField.focus();
        alert("Please Enter 10 Digits In Your Phone Number")
        }
        else{
            GSTField.focus();
            alert("Please Enter 15 Characters In Your GST Number")
        }
        
    }
   

})
