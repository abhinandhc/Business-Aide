// To get all data from a firebase collection and to build design

function firebaseGetAllDataAndBuild(collection, target, content, dataPoints, example = null) {
    let db = firebase.firestore().collection(collection);

    if (example == null) {
        db.get().then((array) => {
            array.forEach((element) => {
                content(target, element.data())

            })
        });
    }
    else {
        db.get().then((array) => {
            array.forEach((element) => {
                content(target, example, element.data(), dataPoints)

            })
        });
    }


}

function firebaseGetAllDataAndBuildWithId(collection, target, content, dataPoints, example = null) {
    let db = firebase.firestore().collection(collection);

    if (example == null) {
        db.get().then((array) => {
            array.forEach((element) => {
                content(target, element)

            })
        });
    }
    else {
        db.get().then((array) => {
            array.forEach((element) => {
                content(target, example, element, dataPoints)

            })
        });
    }


}

function firebaseGetDataAndBuild(collection, target, content, doc) {
    let db = firebase.firestore().collection(collection).doc(doc);


    db.get().then((res) => {
        content(target, res.data(), collection, res.id)

    });


}

function firebaseGetDataAndBuildWithId(collection, target, content, doc) {
    let db = firebase.firestore().collection(collection).doc(doc);


    db.get().then((res) => {
        content(target, res, collection, res.id)

    });


}

function firebaseGetAllDataAndBuildTable(collection, headTarget, bodyTarget, content, excluding = []) {
    let db = firebase.firestore().collection(collection);

    db.get().then((array) => {
        array.forEach((element) => {
            content(headTarget, bodyTarget, element.data(), excluding)

        })
    });


}

function firebaseGetAllDataAndBuildTableWithId(collection, headTarget, bodyTarget, content, excluding = []) {
    let db = firebase.firestore().collection(collection);

    db.get().then((array) => {
        if(array.empty){
            let target = document.getElementById(headTarget);
            target.parentNode.parentNode.append("No Data")
        }
        array.forEach((element) => {
            content(headTarget, bodyTarget, element, excluding)

        })
    });


}

function firebaseGetAllDataAndBuildTableWithIdAndWhere(collection, headTarget, bodyTarget, content, excluding = [], whereClauses = []) {
    let db = firebase.firestore().collection(collection);
    whereClauses.forEach((where) => {
        db = db.where(where.field, where.operator, where.data)
    })
    db.get().then((array) => {
        if (!array.empty) {
            array.forEach((element) => {
                content(headTarget, bodyTarget, element, excluding)

            })
        }
        else {
            let refEl = document.getElementById(headTarget);
            refEl.parentNode.parentNode.append("No Data")
        }

    });


}
//To get data from a document and build design, modify as needed

function firebaseGetDataWithDocumentID(collection, target, id, content) {
    let db = firebase.firestore();

    db.collection(collection).doc(id).get().then((element) => {
        content(target, element.data());
    });
}

//Get Data And Return result

async function firebaseGetAllData(collection) {
    let db = firebase.firestore();

    return db.collection(collection).get();
}

//To get data from a collection with where clauses

function firebaseGetDataWithWhereClause(collection, target, content, dataPoints, whereClauses, example = null) {

    let db = firebase.firestore().collection(collection);

    whereClauses.forEach((where) => {
        db = db.where(where.field, where.operator, where.data)
    })

    if (example == null) {
        db.get().then((array) => {
            array.forEach((element) => {
                content(target, element.data())

            })
        });
    }
    else {
        db.get().then((array) => {
            array.forEach((element) => {
                content(target, example, element.data(), dataPoints)

            })
        });
    }
}

function firebaseGetDataWithWhereClauseAndId(collection, target, content, dataPoints, whereClauses, example = null) {

    let db = firebase.firestore().collection(collection);

    whereClauses.forEach((where) => {
        db = db.where(where.field, where.operator, where.data)
    })

    if (example == null) {
        db.get().then((array) => {
            array.forEach((element) => {
                content(target, element)

            })
        });
    }
    else {
        db.get().then((array) => {
            if (array.empty) {
                let targetEl = document.getElementById(target)
                targetEl.append("No Data")
            }
            array.forEach((element) => {
                content(target, example, element, dataPoints)

            })
        });
    }
}



//To post data to firebase from a form

function firebaseGetDataFromFormAndPerformAction(collection, form_id, form_fields, action) {

    let form = document.getElementById(form_id);

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let data = {};

        form_fields.forEach((form_field) => {
            data[form_field.field] = document.getElementById(form_field.form_field).value;
        })


        action(collection, data);


    })


}


function firebaseGetDataFromFormAndPerformActionAndFillValues(collection, form_id, form_fields, action, doc_id = null, whereClauses = null) {

    let form = document.getElementById(form_id);
    doc_id = sessionStorage.doc_id;
    let db = firebase.firestore().collection(collection).doc(doc_id);
    db.get().then((result) => {
        form_fields.forEach((form_field) => {

            document.getElementById(form_field.form_field).value = result.data()[form_field.field];
        })
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let data = {};

        form_fields.forEach((form_field) => {
            data[form_field.field] = document.getElementById(form_field.form_field).value;
        })


        if (doc_id == null && whereClauses != null) {
            action(collection, data, whereClauses);
        }
        else {
            action(collection, data, doc_id);
        }
    })


}



function firebaseGetDataFromFormAndPerformActionWithFile(collection, form_id, form_fields, action) {

    let form = document.getElementById(form_id);

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let data = {};
        let fileFields = [];
        let files = [];

        form_fields.forEach((form_field) => {
            if (document.getElementById(form_field.form_field).type != "file") {
                data[form_field.field] = document.getElementById(form_field.form_field).value;

            }
            else {
                fileFields.push(document.getElementById(form_field.form_field));
            }
        })

        fileFields.forEach((fileField) => {
            if (fileField.files.length != 0) {
                files.push({
                    extension: fileField.value.split("\\")[2].split(".")[1],
                    fileData: fileField.files[0],
                    id: fileField.id
                })
            }

        })

        console.log(files)

        action(collection, data, files);

    })


}


function firebaseGetDataFromFormAndPerformActionWithFileAndFillValues(collection, form_id, form_fields, action, doc_id = null, whereClauses = null) {

    let form = document.getElementById(form_id);

    let db = firebase.firestore().collection(collection).doc(sessionStorage.doc_id);

    db.get().then((result) => {
        form_fields.forEach((form_field) => {
            if (document.getElementById(form_field.form_field).type != "file") {

                document.getElementById(form_field.form_field).value = result.data()[form_field.field];
            }
        })
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let data = {};
        let fileFields = [];
        let files = [];



        form_fields.forEach((form_field) => {
            if (document.getElementById(form_field.form_field).type != "file") {
                data[form_field.field] = document.getElementById(form_field.form_field).value;

            }
            else {
                fileFields.push(document.getElementById(form_field.form_field));
            }
        })

        fileFields.forEach((fileField) => {
            if (fileField.files.length != 0) {
                files.push({
                    extension: fileField.value.split("\\")[2].split(".")[1],
                    fileData: fileField.files[0],
                    id: fileField.id
                })
            }

        })

        console.log(files)


        if (doc_id == null && whereClauses != null) {
            action(collection, data, whereClauses, files);
        }
        else {
            let doc_id = sessionStorage.doc_id;
            action(collection, data, doc_id, files);
        }
    })


}



// To post data to firebase with add

function firebaseAddData(collection, data) {
    let db = firebase.firestore().collection(collection);



    db.add(data).then((result) => {
        Swal.fire("done").then((res) => {
            window.location.href = "volunteerreference.html"
        })
    })
}

function firebaseAddDataAndUploadFile(collection, data, files) {
    console.log(files)
    let db = firebase.firestore().collection(collection);
    let storage = firebase.storage();
    db.add(data).then((result) => {

        let filePromises = files.map((file, index) => {
            let date = new Date();

            let imageRef = storage.ref().child("images/" + (Math.round(date / 1000)).toString() + index + "." + file.extension);
            return imageRef.put(file.fileData);

        })

        Promise.all(filePromises).then((uploadedResults) => {
            return Promise.all(uploadedResults.map((uploadedResult, index) => {
                return uploadedResult.ref.getDownloadURL();
            }));

        }).then((urls) => {
            return Promise.all(urls.map((url, index) => {
                let fileField = files[index].id;
                let fileObject = {};
                fileObject[fileField] = url;

                return db.doc(result.id).update(fileObject);
            }));
        }).then((finalRes) => {
            Swal.fire("done");
        });

    });
}

// To post data to firebase with set

function firebaseSetData(collection, data, doc_id) {
    let db = firebase.firestore().collection(collection);



    db.doc(doc_id).set(data).then((result) => {
        Swal.fire("done")
    })
}

function firebaseSetDataAndUploadFile(collection, data, doc_id, imageExt, imageFile) {
    let db = firebase.firestore().collection(collection);
    let storage = firebase.storage();



    db.doc(doc_id).set(data).then((result) => {
        let imageRef = storage.ref().child("images/" + result.id + imageExt);
        imageRef.put(imageFile).then((imageRes) => {
            imageRes.ref.getDownloadURL().then((url) => {
                db.doc(result.id).update({
                    image: url
                }).then((final) => {
                    Swal.fire("done");
                })
            })
        })
    })
}

// To update data in firebase with doc_id

function firebaseUpdateData(collection, data, doc_id) {
    let db = firebase.firestore().collection(collection);

    db.doc(doc_id).update(data).then((result) => {
        Swal.fire("done")
    })
}


function firebaseUpdateDataAndUploadFile(collection, data, doc_id, files) {
    console.log(files)
    let db = firebase.firestore().collection(collection);
    let storage = firebase.storage();

    db.doc(doc_id).update(data).then((res) => {
        if (files.length > 0) {
            let filePromises = files.map((file, index) => {
                let date = new Date();

                let imageRef = storage.ref().child("images/" + (Math.round(date / 1000)).toString() + index + "." + file.extension);
                return imageRef.put(file.fileData);

            })

            Promise.all(filePromises).then((uploadedResults) => {
                return Promise.all(uploadedResults.map((uploadedResult, index) => {
                    return uploadedResult.ref.getDownloadURL();
                }));

            }).then((urls) => {
                return Promise.all(urls.map((url, index) => {
                    let fileField = files[index].id;
                    let fileObject = {};
                    fileObject[fileField] = url;

                    return db.doc(doc_id).update(fileObject);
                }));
            }).then((finalRes) => {
                Swal.fire("done");
            });
        }
        else {
            Swal.fire("done");

        }
    })




}

// To update data in firebase with where clauses


function firebaseUpdateDataWithWhereClause(collection, data, whereClauses) {

    let db = firebase.firestore().collection(collection);

    whereClauses.forEach((where) => {
        db = db.where(where.field, where.operator, where.data)
    })

    db.update(data).then((array) => {
        Swal.fire("done")
    });

}


// To build a design from scratch, modify it as needed, use with firebaseGetAllDataAndBuild

function makeContent(target, data) {
    let div = document.createElement("div");

    div.style.padding = "10px";
    div.style.color = "red";
    div.textContent = data.college;

    let targetTag = document.getElementById(target);

    targetTag.append(div);
}

function makeContentProfileEdit(target, data, collection, id) {
    let targetTag = document.getElementById(target);
    let db = firebase.firestore().collection(collection).doc(id);
    let objectKeys = Object.keys(data);
    objectKeys.push("password");

    

    let indexVal = objectKeys.indexOf("name");
    if(indexVal != -1){
        let temp = objectKeys[indexVal];
        objectKeys[indexVal] = objectKeys[0];
        objectKeys[0] = temp;
    
       
    }
    indexVal = objectKeys.indexOf("company_name");
    console.log(indexVal)

    if(indexVal != -1){
        let temp = objectKeys[indexVal];
        objectKeys[indexVal] = objectKeys[0];
        objectKeys[0] = temp;
    
       
    }

    
    

    objectKeys.forEach((key) => {
        let div = document.createElement("div");

        div.className = "d-flex justify-content-center align-items-center";

        let label = document.createElement("label");
        label.className = "my-2 mr-2 h3";
        label.textContent = key.toUpperCase().replace(/_/g, " ");

        let button = document.createElement("button");
        button.className = "btn btn-primary btn-sm";
        button.textContent = "Edit";

        let done = document.createElement("button");
        done.className = "btn btn-primary btn-sm";
        done.textContent = "Done";
        done.style.display = "none";



        let input = document.createElement("input");
        input.className = "form-control my-2";
        input.readOnly = true;
        input.id = "key";

        if (key == "password") {
            input.value = "";
            input.type = "password";

        }
        else if (key == "email") {
            input.value = data[key];
            input.type = "email";
        }
        else {
            input.value = data[key];
            input.type = "text";

        }

        button.addEventListener("click", (e) => {
            input.readOnly = false;
            done.style.display = "inline";
            button.style.display = "none";
        })

        done.addEventListener("click", async (e) => {
            input.readOnly = true;

            if (key == "email") {
                let auth = firebase.auth();

                const { value: formValues } = await Swal.fire({
                    title: 'Multiple inputs',
                    html:
                        '<input id="swal-input1" class="swal2-input" type="email" placeholder="Enter Current Email">' +
                        '<input id="swal-input2" class="swal2-input" type="password" placeholder="Enter Current Password">',
                    preConfirm: function () {
                        return [
                            document.getElementById('swal-input1').value,
                            document.getElementById('swal-input2').value
                        ];


                    }
                });
                auth.signInWithEmailAndPassword(formValues[0], formValues[1]).then((user) => {
                    console.log(input.value)

                    user.user.updateEmail(input.value).then((res) => {
                        let updateData = {};
                        updateData[key] = input.value;
                        db.update(updateData).then((res) => {
                            done.style.display = "none";
                            button.style.display = "inline";

                        }).catch((error) => {
                            Swal.fire({
                                icon: "error",
                                title: "Oops! An Error Occured",
                                text: error.message
                            }).then(() => {
                                location.reload();
                            })
                        })
                    }).catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops! An Error Occured",
                            text: error.message
                        }).then(() => {
                            location.reload();
                        })
                    })
                }).catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops! An Error Occured",
                        text: error.message
                    }).then(() => {
                        location.reload();
                    })
                })


            }
            else if (key == "password") {
                if (input.value != "") {

                    let auth = firebase.auth();

                    const { value: formValues } = await Swal.fire({
                        title: 'Multiple inputs',
                        html:
                            '<input id="swal-input1" class="swal2-input" type="email" placeholder="Enter Current Email">' +
                            '<input id="swal-input2" class="swal2-input" type="password" placeholder="Enter Current Password">',
                        preConfirm: function () {
                            return [
                                document.getElementById('swal-input1').value,
                                document.getElementById('swal-input2').value
                            ];


                        }
                    });
                    auth.signInWithEmailAndPassword(formValues[0], formValues[1]).then((user) => {
                        console.log(input.value)

                        user.user.updatePassword(input.value).then((res) => {
                            done.style.display = "none";
                            button.style.display = "inline";

                        }).catch((error) => {
                            Swal.fire({
                                icon: "error",
                                title: "Oops! An Error Occured",
                                text: error.message
                            }).then(() => {
                                input.value = "";
                            })
                        })
                    }).catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops! An Error Occured",
                            text: error.message
                        }).then(() => {
                            location.reload();
                        })
                    })



                }
                else {
                    done.style.display = "none";
                    button.style.display = "inline";

                }

            }
            else {
                let updateData = {};
                updateData[key] = input.value;
                db.update(updateData).then((res) => {
                    done.style.display = "none";
                    button.style.display = "inline";

                })
            }



        })

        div.append(label);
        div.append(button);
        div.append(done);

        targetTag.append(div);
        targetTag.append(input);

    })



}

// To build from an existing example, give the dataPoints the same name as the database fields, modify it as needed, use with firebaseGetAllDataAndBuild

function makeContentWithCopy(target, example, data, dataPoints) {
    let exampleTag = document.getElementById(example);
    console.log(example);
    let exampleClone = exampleTag.cloneNode(true);
    exampleClone.hidden = false;
    dataPoints.forEach((dataPoint) => {
        console.log(data)
        if (dataPoint == "date") {
            exampleClone.querySelector("." + dataPoint).textContent = "On " + data[dataPoint].toDate().toString().substring(0, 15);

        }
        else {
            exampleClone.querySelector("." + dataPoint).textContent = data[dataPoint];

        }

    })


    let targetTag = document.getElementById(target);

    targetTag.append(exampleClone);
}

function makeContentWithCopyWithDelete(target, example, data, dataPoints) {
    let exampleTag = document.getElementById(example);
    let id = data.id;

    data = data.data();
    console.log(example);
    let exampleClone = exampleTag.cloneNode(true);
    exampleClone.hidden = false;
    dataPoints.forEach((dataPoint) => {
        console.log(data)
        if (dataPoint == "date") {
            exampleClone.querySelector("." + dataPoint).textContent = "On " + data[dataPoint].toDate().toString().substring(0, 15);

        }
        else {
            exampleClone.querySelector("." + dataPoint).textContent = data[dataPoint];

        }

    })

    let deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-danger");

    deleteButton.addEventListener("click", (e) => {
        let db = firebase.firestore();
        let choice = confirm("Are you sure?");
        if (choice) {
            console.log(id)
            db.collection("recruitment").doc(id).delete().then((e) => {
                location.reload();
            })
        }

    })
    exampleClone.append(deleteButton);
    let targetTag = document.getElementById(target);

    targetTag.append(exampleClone);
}

function makeContentWithCopyWithDisable(target, example, data, dataPoints) {
    let exampleTag = document.getElementById(example);
    let id = data.id;

    data = data.data();
    console.log(example);
    let exampleClone = exampleTag.cloneNode(true);
    exampleClone.hidden = false;
    dataPoints.forEach((dataPoint) => {
        console.log(data)
        if (dataPoint == "date") {
            exampleClone.querySelector("." + dataPoint).textContent = "On " + data[dataPoint].toDate().toString().substring(0, 15);

        }
        else {
            exampleClone.querySelector("." + dataPoint).textContent = data[dataPoint];

        }

    })

    let deleteButton = document.createElement("button");

    deleteButton.textContent = "Disable";
    deleteButton.classList.add("btn", "btn-danger");

    deleteButton.addEventListener("click", (e) => {
        let db = firebase.firestore();
        let choice = confirm("Are you sure?");
        if (choice) {
            console.log(id)
            db.collection("company").doc(id).delete().then((e) => {
                location.reload();
            })
        }

    })
    exampleClone.append(deleteButton);
    let targetTag = document.getElementById(target);

    targetTag.append(exampleClone);
}

function makeContentWithCopyWithRegister(target, example, data, dataPoints) {
    let exampleTag = document.getElementById(example);
    let id = data.id;

    data = data.data();
    if (window.age <= data['maximum_age']) {
        console.log(example);
        let exampleClone = exampleTag.cloneNode(true);
        exampleClone.hidden = false;
        dataPoints.forEach((dataPoint) => {
            console.log(data)
            if (dataPoint == "date") {
                exampleClone.querySelector("." + dataPoint).textContent = "On " + data[dataPoint].toDate().toString().substring(0, 15);

            }
            else {
                exampleClone.querySelector("." + dataPoint).textContent = data[dataPoint];

            }

        })
        let targetTag = document.getElementById(target);

        let db = firebase.firestore();
        db.collection("recruitment_registered_users").doc(id).get().then((registered) => {
            if (registered.exists) {
                let registeredUsers = registered.data().registered;
                if (registeredUsers.includes(localStorage.uid)) {
                    let registerButton = document.createElement("button");

                    registerButton.textContent = "Registered";
                    registerButton.classList.add("btn", "btn-success");

                    registerButton.disabled = true;
                    exampleClone.append(registerButton);
                }
                else {
                    let registerButton = document.createElement("button");

                    registerButton.textContent = "Register";
                    registerButton.classList.add("btn", "btn-success");

                    registerButton.addEventListener("click", (e) => {
                        let db = firebase.firestore();
                        let choice = confirm("Are you sure?");
                        if (choice) {
                            console.log(id)
                            targetTag.hidden = true;
                            localStorage.recruitment_id = id;
                            setExam(id, data);
                        }

                    })
                    exampleClone.append(registerButton);
                }

            }
            else {
                let registerButton = document.createElement("button");

                registerButton.textContent = "Register";
                registerButton.classList.add("btn", "btn-success");

                registerButton.addEventListener("click", (e) => {
                    let db = firebase.firestore();
                    let choice = confirm("Are you sure?");
                    if (choice) {
                        console.log(id)
                        targetTag.hidden = true;
                        localStorage.recruitment_id = id;
                        setExam(id, data);
                    }

                })
                exampleClone.append(registerButton);
            }
        })


        targetTag.append(exampleClone);
    }

}


// To build a bootstrap table from a firebase collection

function makeContentTable(headTarget, bodyTarget, data, excluding = []) {

    let theadTag = document.getElementById(headTarget);



    if (theadTag.childElementCount == 0) {
        let trHead = document.createElement("tr");

        let noHead = document.createElement("th");
        noHead.textContent = "#";
        noHead.setAttribute("Scope", "col");
        noHead.classList.add("text-center");

        trHead.append(noHead);

        Object.keys(data).forEach((key) => {
            if (!excluding.includes(key)) {
                let th = document.createElement("th");
                th.setAttribute("Scope", "col");
                th.textContent = key.toUpperCase().replace(/_/g, " ");
                th.classList.add("text-center");
                trHead.append(th);
            }


        })

        theadTag.append(trHead);
    }



    let tbodyTag = document.getElementById(bodyTarget);


    let tr = document.createElement("tr");

    let no = document.createElement("th");
    no.textContent = tbodyTag.childElementCount + 1;
    no.setAttribute("Scope", "row");
    no.classList.add("text-center");

    tr.append(no);

    Object.keys(data).forEach((key) => {

        if (!excluding.includes(key)) {
            let td = document.createElement("td");
            td.textContent = data[key];
            td.classList.add("text-center");
            tr.append(td);
        }



    })



    tbodyTag.append(tr);
}


function makeContentTableWithOptions(headTarget, bodyTarget, data, excluding = []) {

    let theadTag = document.getElementById(headTarget);



    if (theadTag.childElementCount == 0) {
        let trHead = document.createElement("tr");

        let noHead = document.createElement("th");
        noHead.textContent = "#";
        noHead.setAttribute("Scope", "col");
        noHead.classList.add("text-center");

        trHead.append(noHead);

        Object.keys(data).forEach((key) => {
            if (!excluding.includes(key)) {
                let th = document.createElement("th");
                th.setAttribute("Scope", "col");
                th.textContent = key.toUpperCase().replace(/_/g, " ");
                th.classList.add("text-center");
                trHead.append(th);
            }


        })

        let options = document.createElement("th");
        options.textContent = "Options";
        options.setAttribute("Scope", "col");
        options.classList.add("text-center");
        trHead.append(options);

        theadTag.append(trHead);
    }



    let tbodyTag = document.getElementById(bodyTarget);


    let tr = document.createElement("tr");

    let no = document.createElement("th");
    no.textContent = tbodyTag.childElementCount + 1;
    no.setAttribute("Scope", "row");
    no.classList.add("text-center");

    tr.append(no);

    Object.keys(data).forEach((key) => {

        if (!excluding.includes(key)) {
            let td = document.createElement("td");
            td.textContent = data[key];
            td.classList.add("text-center");
            tr.append(td);
        }



    })

    let optionTd = document.createElement("td");
    optionTd.classList.add("d-flex", "justify-content-center");
    let editButton = document.createElement("button");
    editButton.classList.add("btn", "btn-primary", "mr-2");
    editButton.textContent = "Edit";

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Delete";


    optionTd.append(editButton, deleteButton);


    tr.append(optionTd);

    tbodyTag.append(tr);
}


function makeContentTableWithOptionsAccept(headTarget, bodyTarget, data, excluding = []) {

    let theadTag = document.getElementById(headTarget);
    let id = data.id;

    data = data.data();


    if (theadTag.childElementCount == 0) {
        let trHead = document.createElement("tr");

        let noHead = document.createElement("th");
        noHead.textContent = "#";
        noHead.setAttribute("Scope", "col");
        noHead.classList.add("text-center");

        trHead.append(noHead);

        Object.keys(data).forEach((key) => {
            if (!excluding.includes(key)) {
                let th = document.createElement("th");
                th.setAttribute("Scope", "col");
                th.textContent = key.toUpperCase().replace(/_/g, " ");
                th.classList.add("text-center");
                trHead.append(th);
            }


        })

        let options = document.createElement("th");
        options.textContent = "Options";
        options.setAttribute("Scope", "col");
        options.classList.add("text-center");
        trHead.append(options);

        theadTag.append(trHead);
    }



    let tbodyTag = document.getElementById(bodyTarget);


    let tr = document.createElement("tr");

    let no = document.createElement("th");
    no.textContent = tbodyTag.childElementCount + 1;
    no.setAttribute("Scope", "row");
    no.classList.add("text-center");

    tr.append(no);

    Object.keys(data).forEach((key) => {

        if (!excluding.includes(key)) {
            let td = document.createElement("td");
            td.textContent = data[key];
            td.classList.add("text-center");
            tr.append(td);
        }



    })

    let optionTd = document.createElement("td");
    optionTd.classList.add("d-flex", "justify-content-center");

    let db = firebase.firestore();

    db.collection("mails_sent").doc(data['recruitment_id']).get().then((result) => {
        if (result.exists) {
            let sent_array = result.data().sent;

            if (sent_array.includes(data['user_id'])) {
                let acceptButton = document.createElement("button");
                acceptButton.classList.add("btn", "btn-primary");
                acceptButton.textContent = "Mail Sent";
                acceptButton.disabled = true;
                optionTd.append(acceptButton);

            }
            else {
                let acceptButton = document.createElement("button");
                acceptButton.classList.add("btn", "btn-primary");
                acceptButton.textContent = "Accept";
                acceptButton.addEventListener("click", (e) => {

                    let db = firebase.firestore();

                    db.collection("mails_sent").doc(data['recruitment_id']).set({
                        sent: firebase.firestore.FieldValue.arrayUnion(data['user_id'])
                    }, {
                        merge: true
                    }).then((res) => {
                        let functions = firebase.app().functions("asia-east2");

                        let sendApprovalMail = functions.httpsCallable('sendApprovalMail');

                        sendApprovalMail({
                            name: data.applicant_name,
                            email: data.email,
                            place: data.joblocation,
                            position: data.name,
                            phone: data.phone
                        }).then((res) => {
                            alert("Mail Sent")
                            window.location.reload()
                        })
                    })



                })

                optionTd.append(acceptButton);

            }
        }
        else {
            let acceptButton = document.createElement("button");
            acceptButton.classList.add("btn", "btn-primary");
            acceptButton.textContent = "Accept";
            acceptButton.addEventListener("click", (e) => {

                let db = firebase.firestore();

                db.collection("mails_sent").doc(data['recruitment_id']).set({
                    sent: firebase.firestore.FieldValue.arrayUnion(data['user_id'])
                }, {
                    merge: true
                }).then((res) => {
                    let functions = firebase.app().functions("asia-east2");

                    let sendApprovalMail = functions.httpsCallable('sendApprovalMail');

                    sendApprovalMail({
                        name: data.applicant_name,
                        email: data.email,
                        place: data.joblocation,
                        position: data.name
                    }).then((res) => {
                        alert("Mail Sent")
                        window.location.reload()

                    })
                })



            })

            optionTd.append(acceptButton);
        }

    })



    tr.append(optionTd);

    tbodyTag.append(tr);
}



function makeContentTableWithOptionsDisable(headTarget, bodyTarget, data, excluding = []) {

    let theadTag = document.getElementById(headTarget);
    let id = data.id;

    data = data.data();


    if (theadTag.childElementCount == 0) {
        let trHead = document.createElement("tr");

        let noHead = document.createElement("th");
        noHead.textContent = "#";
        noHead.setAttribute("Scope", "col");
        noHead.classList.add("text-center");

        trHead.append(noHead);

        Object.keys(data).forEach((key) => {
            if (!excluding.includes(key)) {
                let th = document.createElement("th");
                th.setAttribute("Scope", "col");
                th.textContent = key.toUpperCase().replace(/_/g, " ");
                th.classList.add("text-center");
                trHead.append(th);
            }


        })

        let options = document.createElement("th");
        options.textContent = "Options";
        options.setAttribute("Scope", "col");
        options.classList.add("text-center");
        trHead.append(options);

        theadTag.append(trHead);
    }



    let tbodyTag = document.getElementById(bodyTarget);


    let tr = document.createElement("tr");

    let no = document.createElement("th");
    no.textContent = tbodyTag.childElementCount + 1;
    no.setAttribute("Scope", "row");
    no.classList.add("text-center");

    tr.append(no);

    Object.keys(data).forEach((key) => {

        if (!excluding.includes(key)) {
            let td = document.createElement("td");
            td.textContent = data[key];
            td.classList.add("text-center");
            tr.append(td);
        }



    })

    let optionTd = document.createElement("td");
    optionTd.classList.add("d-flex", "justify-content-center");

    let db = firebase.firestore();

    db.collection("company").doc(id).get().then((result) => {
        if (result.exists) {

            if (result.data().disabled) {
                let acceptButton = document.createElement("button");
                acceptButton.classList.add("btn", "btn-success");
                acceptButton.textContent = "Enable";
                acceptButton.addEventListener("click", (e) => {

                    let db = firebase.firestore();

                    db.collection("company").doc(id).update({
                        disabled: false,
                    }).then((res) => {
                        let functions = firebase.app().functions("asia-east2");

                        let enableUser = functions.httpsCallable('enableUser');

                        enableUser({
                            uid: id
                        }).then((res) => {
                            window.location.reload()
                        })
                    })



                })

                optionTd.append(acceptButton);

            }
            else {
                let acceptButton = document.createElement("button");
                acceptButton.classList.add("btn", "btn-danger");
                acceptButton.textContent = "Disable";
                acceptButton.addEventListener("click", (e) => {

                    let db = firebase.firestore();

                    db.collection("company").doc(id).update({
                        disabled: true,
                    }).then((res) => {
                        let functions = firebase.app().functions("asia-east2");

                        let disableUser = functions.httpsCallable('disableUser');

                        disableUser({
                            uid: id
                        }).then((res) => {
                            window.location.reload()
                        })
                    })



                })

                optionTd.append(acceptButton);

            }
        }
        else {
            let acceptButton = document.createElement("button");
            acceptButton.classList.add("btn", "btn-danger");
            acceptButton.textContent = "Disable";
            acceptButton.addEventListener("click", (e) => {

                let db = firebase.firestore();

                db.collection("company").doc(id).update({
                    disabled: true,
                }).then((res) => {
                    let functions = firebase.app().functions("asia-east2");

                    let disableUser = functions.httpsCallable('disableUser');

                    disableUser({
                        uid: id
                    }).then((res) => {
                        window.location.reload()
                    })
                })



            })

            optionTd.append(acceptButton);
        }

    })



    tr.append(optionTd);

    tbodyTag.append(tr);
}

function checkUserTypeAndRedirectOnLogin(userTypes, userID) {
    let userCollections = [];
    let db = firebase.firestore();

    userTypes.forEach((userType) => {
        userCollections.push(db.collection(userType.user).doc(userID).get());
    })

    Promise.all(userCollections).then((results) => {
        let inavlidUser = true;
        results.forEach((result, index) => {
            if (result.exists) {
                console.log("true")
                inavlidUser = false;
                localStorage.user = userTypes[index].user;
                location.href = userTypes[index].redirect;
            }

        })

        if (inavlidUser) {
            let auth = firebase.auth();

            auth.signOut().then(() => {
                Swal.fire({
                    icon: "error",
                    title: "Oops! An Error Occured",
                    text: "Not Authorised"
                }).then(() => {
                    location.reload();

                })
            });
        }


    })
}

function checkUser(userType, userId) {
    let db = firebase.firestore();
    db.collection(userType).doc(userId).get().then((res) => {
        if (!res.exists) {
            Swal.fire({
                icon: "error",
                title: "Oops! An Error Occured",
                text: "Not " + userType
            }).then(() => {
                location.href = "index.html";

            })
        }

    })
}

function checkUserAndRedirect(userType, userId) {
    let db = firebase.firestore();
    db.collection(userType).doc(userId).get().then((res) => {
        if (!res.exists) {

            firebase.auth().signOut().then((res) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops! An Error Occured",
                    text: "Not " + userType
                }).then(() => {
                    localStorage.clear();
                    location.href = "index.html";

                })
            })

        }
        else {
            location.href = "index.html";
        }

    })
}


function changeEmailAndPassword(target, data, collection, id) {
    let targetTag = document.getElementById(target);
    let db = firebase.firestore().collection(collection).doc(id);
    let objectKeys = ["password", "email"]

    
    

    // let indexVal = objectKeys.indexOf("name");
    // if(indexVal != -1){
    //     let temp = objectKeys[indexVal];
    //     objectKeys[indexVal] = objectKeys[0];
    //     objectKeys[0] = temp;
    
       
    // }
    // indexVal = objectKeys.indexOf("company_name");
    // console.log(indexVal)

    // if(indexVal != -1){
    //     let temp = objectKeys[indexVal];
    //     objectKeys[indexVal] = objectKeys[0];
    //     objectKeys[0] = temp;
    
       
    // }

    
    

    objectKeys.forEach((key) => {
        let div = document.createElement("div");

        div.className = "d-flex justify-content-center align-items-center mr-5";

        let label = document.createElement("label");
        label.className = "my-2 mr-2 h3";
        label.textContent = key.toUpperCase().replace(/_/g, " ");

        let button = document.createElement("button");
        button.className = "btn btn-primary btn-sm";
        button.textContent = "Edit";

        let done = document.createElement("button");
        done.className = "btn btn-primary btn-sm";
        done.textContent = "Done";
        done.style.display = "none";



        let input = document.createElement("input");
        input.className = "form-control my-2 max-width-10";
        input.readOnly = true;
        input.id = "key";

        if (key == "password") {
            input.value = "";
            input.type = "password";

        }
        else if (key == "email") {
            input.value = data[key];
            input.type = "email";
        }

        else {
            input.value = data[key];
            input.type = "text";

        }

        button.addEventListener("click", (e) => {
            input.readOnly = false;
            done.style.display = "inline";
            button.style.display = "none";
        })

        done.addEventListener("click", async (e) => {
            input.readOnly = true;

            if (key == "email") {
                let auth = firebase.auth();

                const { value: formValues } = await Swal.fire({
                    title: 'Current Email And Password',
                    html:
                        '<input id="swal-input1" class="swal2-input" type="email" placeholder="Enter Current Email" required>' +
                        '<input id="swal-input2" class="swal2-input" type="password" minlength="8" placeholder="Enter Current Password" required>',
                    preConfirm: function () {
                        return [
                            document.getElementById('swal-input1').value,
                            document.getElementById('swal-input2').value
                        ];


                    }
                });

                if (formValues) {
                    auth.signInWithEmailAndPassword(formValues[0], formValues[1]).then((user) => {
                        console.log(input.value)

                        user.user.updateEmail(input.value).then((res) => {
                            let updateData = {};
                            updateData[key] = input.value;
                            db.update(updateData).then((res) => {
                                done.hidden = true;
                                button.hidden = false;
                            }).catch((error) => {
                                Swal.fire({
                                    icon: "error",
                                    title: "Oops! An Error Occured",
                                    text: error.message
                                }).then(() => {
                                    location.reload();
                                })
                            })
                        }).catch((error) => {
                            Swal.fire({
                                icon: "error",
                                title: "Oops! An Error Occured",
                                text: error.message
                            }).then(() => {
                                location.reload();
                            })
                        })
                    }).catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops! An Error Occured",
                            text: error.message
                        }).then(() => {
                            location.reload();
                        })
                    })
                }
                else {
                    input.readOnly = false;

                }



            }
            else if (key == "password") {
                if (input.value != "" && input.value.length >= 8) {

                    let auth = firebase.auth();

                    const { value: formValues } = await Swal.fire({
                        title: 'Current Email And Password',
                        html:
                            '<input id="swal-input1" class="swal2-input" type="email" placeholder="Enter Current Email" required>' +
                            '<input id="swal-input2" class="swal2-input" type="password" minlength="8" placeholder="Enter Current Password" required>',
                        preConfirm: function () {
                            return [
                                document.getElementById('swal-input1').value,
                                document.getElementById('swal-input2').value
                            ];


                        }
                    });

                    if (formValues) {
                        auth.signInWithEmailAndPassword(formValues[0], formValues[1]).then((user) => {
                            console.log(input.value)

                            user.user.updatePassword(input.value).then((res) => {
                                done.hidden = true;
                                button.hidden = false;
                            }).catch((error) => {
                                Swal.fire({
                                    icon: "error",
                                    title: "Oops! An Error Occured",
                                    text: error.message
                                }).then(() => {
                                    input.value = "";
                                })
                            })
                        }).catch((error) => {
                            Swal.fire({
                                icon: "error",
                                title: "Oops! An Error Occured",
                                text: error.message
                            }).then(() => {
                                location.reload();
                            })
                        })
                    }
                    else {
                        input.readOnly = false;

                    }




                }
                else {
                    alert("Enter 8 Characters In Password")
                    done.hidden = true;
                    button.hidden = false;
                }

            }

        })

        div.append(label);
        div.append(button);
        div.append(done);

        targetTag.append(div);
        targetTag.append(input);

        targetTag.classList.add("p-20")

    })



}