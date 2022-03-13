
let regform = document.getElementById("wholesellerregister");
let db = firebase.firestore();

db.collection("wholesellers").doc(localStorage.uid).get().then((user) => {

    let nameField = document.getElementById("name");
    let mobilephoneField = document.getElementById("phone");
    let addressField = document.getElementById("address");
    let stateField = document.getElementById("state");
    let GSTField = document.getElementById("gst");

    nameField.value = user.data().name;
    mobilephoneField.value = user.data().phone;
    addressField.value = user.data().address;
    stateField.value = user.data().state;
    GSTField.value = user.data().GST_number;

})


regform.addEventListener('submit', function (event) {
    event.preventDefault();
    let nameField = document.getElementById("name");
    let mobilephoneField = document.getElementById("phone");
    let addressField = document.getElementById("address");
    let stateField = document.getElementById("state");
    let GSTField = document.getElementById("gst");

    let buttonField = document.getElementById("button");
    let name = nameField.value;
    let mobilephone = mobilephoneField.value;
    let address = addressField.value;
    let state = stateField.value;
    let gst = GSTField.value;


    if (mobilephone.length == 10 && gst.length == 15 && checkGST(gst)) {
        buttonField.innerHTML = "Updating...";
        buttonField.disabled = true;


        db.collection("wholesellers").doc(localStorage.uid).update({
            address: address,
            name: name,
            phone: mobilephone,
            state: state,
            GST_number: gst,
        }).then((result) => {
            buttonField.innerHTML = "Update";
            buttonField.disabled = false;
            //redirect to retailer home page
        }).catch((error) => {
                alert(error);
                buttonField.innerHTML = "Update";
                buttonField.disabled = false;
            })


    }
    else {
        if (mobilephone.length != 10) {
            mobilephoneField.focus();
            alert("Please Enter 10 Digits In Your Phone Number")
        }
        else if(gst.length != 15){
            GSTField.focus();
            alert("Please Enter 15 Characters In Your GST Number")
        }
        

    }


})

function checkGST(inputvalues) {

    var gstinformat = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
    if (gstinformat.test(inputvalues)) {
        return true;
    } else {
        alert('Please Enter Valid GSTIN Number');
    }
}
