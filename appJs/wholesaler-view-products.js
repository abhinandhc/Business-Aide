var db = firebase.firestore();




        let id = localStorage.uid;
        db.collection("items").where("wholeseller", "==", id).get()
        .then((result)=>{
            if(result.empty)
            {
                // alert("No Stocks Found!"+"\n"+"Please add stocks");
                card_id.parentNode.append("Welcome! Please add stocks");
                progress.hidden = true;
            }
            else
            {
                result.forEach((el) => {
                    let cardCopy = card_id.cloneNode(true);
                    cardCopy.hidden = false;
                    cardCopy.querySelector(".card-category").textContent = el.data().category; 
                    cardCopy.querySelector(".card-image").src = el.data().image; 
                    cardCopy.querySelector(".card-image").style.height = "150px"; 
                    cardCopy.querySelector(".card-name").textContent = el.data().name; 
                    cardCopy.querySelector(".card-quantity").textContent ="No: " + el.data().quantity; 
                    cardCopy.querySelector(".card-rate").textContent = el.data().rate + "Rs"; 


                    cardCopy.querySelector(".card-button").addEventListener("click", (e) => {
                        let choice = confirm("Are you sure?");

                        if(choice){
                            db.collection("items").doc(el.id).delete().then((res) => {
                                alert("Deleted!")
                                window.location.reload();
                            })
                        }
                    })

                    cardCopy.querySelector(".card-button-update").addEventListener("click", (e) => {
                        let choice = confirm("Are you sure?");

                        if(choice){
                            let quantity = prompt("Quantity", 0);
                            quantity = parseInt(quantity);
                            console.log(typeof quantity)
                            if(typeof quantity == "number" && quantity > 0){
                                db.collection("items").doc(el.id).update({
                                    quantity: el.data().quantity + quantity
                                }).then((res) => {
                                    alert("Updated!")
                                    window.location.reload();
                                })
                            }
                            else{
                                alert("Enter A Number Greater Than 0")
                            }
                            
                        }
                    })

                    card_id.parentNode.append(cardCopy)
                })
                progress.hidden = true;

                
            }
        })
    