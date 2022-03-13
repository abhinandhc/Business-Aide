var db = firebase.firestore();

let id = localStorage.uid;
db.collection("sales").where("retailer_id", "==", id).get()
    .then((result) => {
        if (result.empty) {
            // alert("No Stocks Found!"+"\n"+"Please add stocks");
            container.parentNode.append("No Purchases");
            progress.hidden = true;
            container.hidden = false;
        }
        else {
            let tbody = document.getElementById("tbody");

            result.forEach((el) => {
                let tr = document.createElement("tr");

                let no = document.createElement("td");
                no.textContent = tbody.childElementCount + 1;

                let id = document.createElement("td");
                id.textContent = el.data().retailer_id;

                let name = document.createElement("td");
                name.textContent = el.data().retailer_name;

                let address = document.createElement("td");
                address.textContent = el.data().address;


                let phno = document.createElement("td");
                phno.textContent = el.data().phone;

                let product_name = document.createElement("td");
                product_name.textContent = el.data().product_name;

                let amount = document.createElement("td");

                let rate = el.data().rate;
                let quantity = el.data().quantity;

                amount.textContent = `${rate} Rs * ${quantity} = ${rate * quantity} Rs`;

                tr.append(no)
                tr.append(id)
                tr.append(name)
                tr.append(address)
                tr.append(phno)
                tr.append(product_name)
                tr.append(amount)

                tbody.append(tr)
            })

            container.hidden = false;

            progress.hidden = true;


        }
    })
