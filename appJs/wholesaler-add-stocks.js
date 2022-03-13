let auth = firebase.auth()
auth.onAuthStateChanged((user) => {
    if (user) {
        let loginForm = document.getElementById("stockip");
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            let image = document.getElementById("fileId")
            let nameField = document.getElementById("stockname");
            let quantityField = document.getElementById("qty");
            let rateField = document.getElementById("rt");
            let buttonField = document.getElementById("Sbutton")
            let name = nameField.value;
            let quantity = quantityField.value;
            let rate = rateField.value;
            let imageExt = image.value.split("\\")[2].split(".")[1];
            let imageFile = image.files[0];


            if(rate >= 0 && quantity > 0 && isFileImage(imageFile)){
                buttonField.textContent = "Adding Stock...";
                buttonField.disabled = true;
                let db = firebase.firestore();
                let storage = firebase.storage();
                db.collection("items").add({
                    name: name,
                    quantity: parseInt(quantity),
                    rate: parseInt(rate),
                    wholeseller: user.uid,
                    category: category.value
                }).then((result) => {
    
                    let imageRef = storage.ref().child("images/" + result.id + "." + imageExt);
                    imageRef.put(imageFile).then((resultImage) => {
                        resultImage.ref.getDownloadURL().then((url) => {
                            db.collection("items").doc(result.id).update({
                                image: url,
                            }).then((result) => {
                                alert("Stock Added Successfully");
                                buttonField.textContent = "Add Stock";
                                buttonField.disabled = false;
                                loginForm.reset();
                            }).catch((error) => {
                                alert(error.message)
                                buttonField.textContent = "Add Stock";
                                buttonField.disabled = false;
                            })
                        }).catch((error) => {
                            alert(error.message)
                            buttonField.textContent = "Add Stock";
                            buttonField.disabled = false;
                        })
                    }).catch((error) => {
                        alert(error.message)
                        buttonField.textContent = "Add Stock";
                        buttonField.disabled = false;
                    })
    
                }).catch((error) => {
                    alert(error.message)
                    buttonField.textContent = "Add Stock";
                    buttonField.disabled = false;
                })
            }
            else{
                if(rate < 0){
                    alert("Rate Must Be Greater Than Or Equal To 0");
                    rateField.focus();
                }
                else if(quantity < 0){
                    alert("Rate Must Be Greater Than Zero")
                    quantityField.focus();
                }
                else{
                    alert("Only Image Files Allowed")
                    image.focus();
                }
            }
            

        })
    }
})


function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
}