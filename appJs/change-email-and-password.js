console.log(localStorage.user)

if(localStorage.user == "wholesaler"){
    firebaseGetDataAndBuild("wholesellers", "profile", changeEmailAndPassword, localStorage.uid)
console.log("here")
}
else if(localStorage.user == "retailer"){
    firebaseGetDataAndBuild("retailers", "profile", changeEmailAndPassword, localStorage.uid)
    
}
else{
    firebaseGetDataAndBuild("admin", "profile", changeEmailAndPassword, localStorage.uid)
}