


var db = firebase.firestore();


db.collection("retailers").doc(localStorage.uid).get().then((user) => {

    let nameField = document.getElementById("name");
    let mobilephoneField = document.getElementById("phone");
    let addressField = document.getElementById("address");
    let stateField = document.getElementById("state");
    let pinField = document.getElementById("pin");
    let GSTField = document.getElementById("gst");

    nameField.value = user.data().name;
    mobilephoneField.value = user.data().phone;
    addressField.value = user.data().address;
    stateField.value = user.data().state;
    pinField.value = user.data().pin;
    GSTField.value = user.data().GST_number;

})
let registerform = document.getElementById("retailerregister");
registerform.addEventListener('submit', function (event) {
    event.preventDefault();
    let nameField = document.getElementById("name");
    let mobilephoneField = document.getElementById("phone");
    let addressField = document.getElementById("address");
    let stateField = document.getElementById("state");
    let pinField = document.getElementById("pin");
    let GSTField = document.getElementById("gst");

    let buttonField = document.getElementById("register");
    let name = nameField.value;
    let mobilephone = mobilephoneField.value;
    let address = addressField.value;
    let state = stateField.value;
    let pin = pinField.value;
    let gst = GSTField.value;


    if (mobilephone.length == 10 && gst.length == 15) {
        buttonField.innerHTML = "Updating...";
        buttonField.disabled = true;
        db.collection("retailers").doc(localStorage.uid).update({
            address: address,
            name: name,
            phone: mobilephone,
            state: state,
            pin: pin,
            GST_number: gst,
        }).
            then((res) => {
                buttonField.innerHTML = "Register";
                buttonField.disabled = false;
                //redirect to retailer home page
                window.location = "retailerHome.html"

            })
            .catch((error) => {
                alert(error);
                buttonField.innerHTML = "Register";
                buttonField.disabled = false;
            })

    }
    else {
        if (mobilephone.length != 10) {
            mobilephoneField.focus();
            alert("Please Enter 10 Digits In Your Phone Number")
        }
        else {
            GSTField.focus();
            alert("Please Enter 15 Characters In Your GST Number")
        }


    }


})