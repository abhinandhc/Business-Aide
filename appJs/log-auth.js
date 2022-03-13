if(sessionStorage.logged){
    history.forward();
}

let cc_slider = document.getElementById("cc-slider");

if(cc_slider){
    cc_slider.addEventListener("click", (e) => {
        window.location.href = "retailerLogin.html";

    })
}