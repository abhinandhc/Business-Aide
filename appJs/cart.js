var db = firebase.firestore();
let priceLabel = document.getElementById("priceLabel");

let cartProducts = {};
db.collection("cart").get()
    .then((result) => {
        if (result.empty) {
            // alert("No Stocks Found!"+"\n"+"Please add stocks");
            card_id.parentNode.append("No Items Found!");
            progress.hidden = true;
            sales_form.hidden = true;
        }
        else {
            priceLabel.textContent = 0 + "Rs"
            result.forEach((el) => {
                let cardCopy = card_id.cloneNode(true);
                cardCopy.id = "card_id_clone";
                cardCopy.hidden = false;
                cardCopy.querySelector(".card-category").textContent = el.data().category;
                cardCopy.querySelector(".card-image").src = el.data().image;
                cardCopy.querySelector(".card-image").style.height = "150px";
                cardCopy.querySelector(".card-name").textContent = el.data().name;
                cardCopy.querySelector(".card-quantity").textContent = el.data().quantity;
                cardCopy.querySelector(".card-rate").textContent = el.data().rate;

                cardCopy.querySelector(".rate-holder").value = el.data().rate;
                cardCopy.querySelector(".quantity-holder").max = el.data().quantity;
                cardCopy.querySelector(".quantity-holder").value = 0;
                let maxQuantity = el.data().quantity;
                cardCopy.querySelector(".quantity-holder").addEventListener("change", (e) => {
                    cartProducts[el.id] = el.data();
                    cartProducts[el.id]['number'] = e.srcElement.value;
                    console.log(e.srcElement)
                    let total = 0;
                    // console.log('here')
                    document.querySelectorAll("#card_id_clone").forEach((el) => {
                        let quantity = parseInt(el.querySelector(".quantity-holder").value);
                        // console.log(typeof quantity)
                        // console.log(quantity)

                        if (quantity <= maxQuantity && quantity >= 0 && typeof quantity == 'number') {
                            let rate = el.querySelector(".rate-holder").value;

                            // console.log(quantity + "quantity");
                            // console.log(rate + 'rate');
                            
                            document.querySelectorAll(".error-span").forEach((spans) => {
                                spans.remove();
                            })
                            console.log(`${quantity} and ${rate}`)
                            total += quantity * rate;
                        }
                        else {
                            let span = document.createElement("span");

                            el.querySelector(".quantity-holder").value = 0;
                            span.textContent = "Enter A Valid Value";
                            span.className = "text-danger error-span";
                            el.querySelector(".quantity-holder").after(span)
                        }

                    })


                    priceLabel.textContent = total + " Rs";
                })


                card_id.parentNode.append(cardCopy)
            })
            progress.hidden = true;


        }
    })

let sales_form = document.getElementById("sales-form");

sales_form.addEventListener("submit", (e) => {
    e.preventDefault();
    let has_items = 0;
    Object.keys(cartProducts).forEach((key) => {
        if(cartProducts[key]['number'] > 0){
            has_items = 1;
        }
    })

    if(has_items){
        makePayment((address) => {
            let db = firebase.firestore();
            let cartArray = [];
            
            Object.keys(cartProducts).forEach((key) => {
                if(cartProducts[key]['number'] > 0){
                    let remaining = cartProducts[key]['quantity'] - cartProducts[key]['number']
                    cartProducts[key]['quantity'] = cartProducts[key]['number'];
                    cartProducts[key]['address'] = address;
                    cartArray.push(db.collection("sales").add(cartProducts[key]));
                    cartArray.push(db.collection("cart").doc(key).delete());
                    let update = db.collection("items").doc(cartProducts[key]['product_id']).update({
                        quantity: remaining
                    });
            
                    cartArray.push(update);
                }
                
            })
        
            Promise.all(cartArray).then((res) => {
                if(res.length == 0){
                    alert("Please Select Items")
                }
                else{
                    alert("Purchased!");
        
                }
        
                window.location.href = "retailerHome.html";
            })
        })
    }
    else{
        alert("Please Select Item Quantities")
    }
    
    
})


function makePayment(callback) {
    $('#payment').modal('toggle')
    let paymentForm = document.getElementById("payment-form");
    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let address = document.getElementById("user_address");
        let card_number = document.getElementById("card_number");
        let card_name = document.getElementById("card_name");
        let card_expiry = document.getElementById("card_expiry");
        let card_cvv = document.getElementById("card_cvv");

        if (card_number.value.length != 16) {
            alert("Card Number Requires 16 Digits");
            card_number.focus();
        }
        else if (card_cvv.value.length != 3) {
            alert("CVV Must Be 3 Digits");
            card_cvv.focus();
        }
        else {
            $('#payment').modal('toggle')
            callback(address.value)
        }

        callback(false);

    })
}