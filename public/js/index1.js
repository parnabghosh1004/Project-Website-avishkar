// function myFunction() {
//     var x = document.getElementById("sidebarCollapse");
//     if (x.style.display === "none") {
//       x.style.display = "block";
//     } else {
//       x.style.display = "none";
//     }
//   }
function toggleHide(){
    let btn = document.getElementById('sidebarCollapse');
    let para = document.getElementById('sidebar');
    if(para.style.display!= 'none'){
        para.style.display = 'none';
    }
    else {
        para.style.display = 'block';
    }
}
function changeLanguage(language) {
    var element = document.getElementById("url");
    element.value = language;
    element.innerHTML = language;
}




function showDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}