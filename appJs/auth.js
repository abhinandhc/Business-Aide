let auth = firebase.auth();

auth.onAuthStateChanged((user) => {
    if(user){
        sessionStorage.logged = true;
        localStorage.uid = user.uid;
        let logout = document.getElementById("logout-button");
        if(logout){
            logout.addEventListener("click", (e) => {
                console.log("clicked")
                auth.signOut().then((res) => {
                    sessionStorage.clear();
                    localStorage.user = "";
                    localStorage.uid = "";
                    window.location.reload();
                });

            })


            if(localStorage.user != "admin"){
                let changeEmailAndPassword = logout.parentNode.cloneNode(true);
                changeEmailAndPassword.querySelector("a").id = "";
                changeEmailAndPassword.querySelector("a").textContent = "Email/Password";
                changeEmailAndPassword.querySelector("a").addEventListener("click", (e) => {
                    window.location.href = localStorage.user+"-change-email-and-password.html";
                })
    
                logout.parentNode.before(changeEmailAndPassword);
            }
            
            
        }
    }
    else{
        window.location.href="index.html"
    }
})