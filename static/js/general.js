
// Selected item on side menu
const currentPage = location.href;
const allAs = document.querySelectorAll('a');
const allAsLength = allAs.length;


for (let i = 0; i < allAsLength; i++) {
  if ( allAs[i].href === currentPage ) {
    allAs[i].className = "active-sidepanel";
  }
}



function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return true;
  }





// Dark/light mode pages 
const body = document.querySelector('body'),
sidebar = body.querySelector('nav'),
toggle = body.querySelector(".toggle"),
searchBtn = body.querySelector(".search-box"),
modeSwitch = body.querySelector(".toggle-switch"),
modeText = body.querySelector(".mode-text");
imageLogo = body.querySelector(".mode-text");

toggle.addEventListener("click" , () =>{
    sidebar.classList.toggle("close");
})

modeSwitch.addEventListener("click" , () =>{
body.classList.toggle("dark");
            
if(body.classList.contains("dark")){
    modeText.innerText = "Light mode";
    setCookie('mode', false, 1000);
}else{
     modeText.innerText = "Dark mode";
     setCookie('mode', true, 1000);           
    }
});



// Dark/light mode save
$(document).ready(function() {
    light_mode = JSON.parse(getCookie('mode'));

    if(light_mode == true){
        body.classList.remove('dark');
        modeText.innerText = "Dark mode";
    } else{
        body.classList.add('dark');
        modeText.innerText = "Light mode";
    }
});