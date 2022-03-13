var db = firebase.firestore();
var progress = document.getElementById("progress");
var container = document.getElementById("container");
let i = 1;
var uid;

firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        uid = user.uid;
        db.collection("items").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                if (uid != doc.id) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    appendTable(doc.data(), doc.id, i);
                    i++;
                }
            });

            progress.remove();
            container.hidden = false;
        });
    }
})
function appendTable(data, id, number) {
    let tr = document.createElement("tr");

    let th = document.createElement("th");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    let td7 = document.createElement("td");

    th.className = "custom-row text-center";
    th.scope = "row";
    td1.className = "custom-row text-center";
    td2.className = "custom-row text-center";
    td3.className = "custom-row text-center";
    td4.className = "custom-row text-center";
    td5.className = "custom-row text-center";
    td7.className = "custom-row text-center";

    td1.textContent = data.name;
    td2.textContent = data.category;
    td3.textContent = data.quantity;
    td4.textContent = data.rate;
    td5.textContent = data.wholeseller;

    th.textContent = number;

    if(data.status == "approved")
    {
        let button = document.createElement("button");
        button.innerHTML = "Approved";
        button.className = "btn btn-success";
        button.disabled = true;
        td7.appendChild(button);

    }
    else
    {
        let button = document.createElement("button");
        button.innerHTML = "Approve";
        button.className = "btn btn-primary";
        button.addEventListener("click", (e) => {
            let choice = confirm("Are you sure?");

            if(choice){
                let db = firebase.firestore();

                db.collection("items").doc(id).update({
                    status: "approved"
                }).then((res) => {
                    window.location.reload();
                })
            }
        })
       // button.disabled = true;
        td7.appendChild(button);
    }

    let tbody = document.getElementById("tbody");
    tr.append(th);
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.append(td4);
    tr.append(td5);
    tr.append(td7);

    tbody.append(tr);
}
