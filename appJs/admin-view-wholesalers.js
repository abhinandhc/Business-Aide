var db = firebase.firestore();
var progress = document.getElementById("progress");
var container = document.getElementById("container");
let i = 1;
var uid;

firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        uid = user.uid;
        db.collection("wholesellers").get().then(function (querySnapshot) {
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

    th.className = "custom-row text-center";
    th.scope = "row";
    td1.className = "custom-row text-center";
    td2.className = "custom-row text-center";
    td3.className = "custom-row text-center";

    td1.textContent = data.name;
    td2.textContent = data.address;
    td3.textContent = data.phone;

    th.textContent = number;

    let tbody = document.getElementById("tbody");
    tr.append(th);
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
   
    tbody.append(tr);
}
