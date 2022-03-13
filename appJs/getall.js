let  auth = firebase.auth()
auth.onAuthStateChanged((user)=>{
    let db=firebase.firestore()
    db.collection("items").get().then((items)=>{
        items.forEach((item)=>{
            alert(item.data().name)
        })
    })
})