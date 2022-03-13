let card_id = document.getElementById("card_id");
let container = document.getElementById("container");
let searchForm = document.getElementById("searchForm");
let submitButton = document.getElementById("submitButton");
let searchTerm = document.getElementById("searchTerm");



function retailerProducts(search = false) {
    var db = firebase.firestore();

    container.innerHTML = "";

    db.collection("items").where("status", "==", "approved").get()
        .then((result) => {
            if (result.empty) {
                // alert("No Stocks Found!"+"\n"+"Please add stocks");
                card_id.parentNode.childNodes.forEach((el) => {
                    if (el.nodeType == Node.TEXT_NODE) {
                        el.remove();
                    }
                })
                card_id.parentNode.append("No Items!");

                progress.hidden = true;
            }
            else {
                result.forEach((el) => {
                    if (search) {
                        let item_name = el.data().name.toLowerCase();
                        let search_name = search.toLowerCase();
                        console.log(item_name + " = "+ search_name);

                        if (item_name.includes(search_name)) {
                            buildCards(el)
                        }
                    }
                    else {
                        buildCards(el)

                    }
                })
                progress.hidden = true;
                submitButton.disabled = false;


            }
        })

}


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    container.innerHTML = "";
    submitButton.disabled = true;

    let searchTerm = document.getElementById("searchTerm");

    if (searchTerm.value != "") {
        retailerProducts(searchTerm.value);
    }
    else {
        retailerProducts()
    }
})

function buildCards(el) {
    let cardCopy = card_id.cloneNode(true);
    cardCopy.hidden = false;
    cardCopy.querySelector(".card-category").textContent = el.data().category;
    cardCopy.querySelector(".card-image").src = el.data().image;
    cardCopy.querySelector(".card-image").style.height = "150px";
    cardCopy.querySelector(".card-name").textContent = el.data().name;
    cardCopy.querySelector(".card-quantity").textContent = el.data().quantity;
    cardCopy.querySelector(".card-rate").textContent = el.data().rate;

    if (el.data().quantity < 1) {
        cardCopy.querySelector("#buy").disabled = true;
        cardCopy.querySelector("#buy").textContent = "Out Of Stock";
        cardCopy.querySelector("#buy").classList.add("btn-danger");
        cardCopy.querySelector("#buy").classList.remove("btn-primary");
        cardCopy.querySelector("#cart").disabled = true;

    }

    cardCopy.querySelector("#buy").addEventListener("click", async (e) => {

        makePayment(async (quantity) => {
            console.log(quantity)

            if (quantity != false) {
                let address = quantity['address'];
                quantity = quantity['quantity']
                let userData = await db.collection("retailers").doc(localStorage.uid).get();
                let productDetails = el.data();
                let userDetails = userData.data();
                userDetails['retailer_id'] = userData.id;
                userDetails['retailer_name'] = userDetails['name'];
                userDetails['quantity'] = quantity;
                userDetails['address'] = address;

                productDetails['product_name'] = productDetails['name'];
                productDetails['product_id'] = el.id;
                delete productDetails['name'];
                delete userDetails['name'];
                delete productDetails['quantity']

                let salesDetails = { ...userDetails, ...productDetails };
                let remaining = el.data().quantity - parseInt(quantity);
                console.log(remaining)
                db.collection("sales").add(salesDetails).then((res) => {

                    return db.collection("items").doc(el.id).update({
                        quantity: remaining
                    });

                }).then((result) => {
                    alert("Purchased!")
                    window.location.reload();
                })
            }
        });



    })

    let db = firebase.firestore();
    db.collection("cart").where("product_id", "==", el.id).where("retailer_id", "==", localStorage.uid).get().then((cartItem) => {
        if (cartItem.empty) {
            cardCopy.querySelector("#cart").addEventListener("click", async (e) => {
                let choice = confirm("Are you sure?");

                if (choice) {

                    let userData = await db.collection("retailers").doc(localStorage.uid).get();
                    let productDetails = el.data();
                    let userDetails = userData.data();
                    userDetails['retailer_id'] = userData.id;
                    userDetails['retailer_name'] = userDetails['name'];

                    productDetails['product_name'] = productDetails['name'];
                    productDetails['product_id'] = el.id;

                    delete productDetails['name'];
                    delete userDetails['name'];

                    let salesDetails = { ...userDetails, ...productDetails };

                    db.collection("cart").add(salesDetails).then((res) => {

                        return 1;

                    }).then((result) => {
                        alert("Added To Cart!")
                        window.location.reload();
                    })


                }
            })
        }
        else {
            cardCopy.querySelector("#cart").textContent = "Added To Cart";
            cardCopy.querySelector("#cart").disabled = true;
        }
    })



    container.append(cardCopy)
}

retailerProducts();

function makePayment(callback) {
    $('#payment').modal('toggle')
    let paymentForm = document.getElementById("payment-form");
    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let quantity = document.getElementById("item_quantity");
        let address = document.getElementById("user_address");
        let card_number = document.getElementById("card_number");
        let card_name = document.getElementById("card_name");
        let card_expiry = document.getElementById("card_expiry");
        let card_cvv = document.getElementById("card_cvv");

        if (quantity.value < 0 && typeof parseInt(quantity) != "number") {
            alert("Invalid Quantity");
            quantity.focus();
        }
        else if (card_number.value.length != 16) {
            alert("Card Number Requires 16 Digits");
            card_number.focus();
        }
        else if (card_cvv.value.length != 3) {
            alert("CVV Must Be 3 Digits");
            card_cvv.focus();
        }
        else {
            $('#payment').modal('toggle')
            console.log(quantity, address)
            callback({
                quantity: quantity.value,
                address: address.value
            })
        }

        callback(false);

    })
}