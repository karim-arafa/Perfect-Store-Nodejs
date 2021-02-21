function toShop() {

    var data = {};
    data.notes = document.getElementById("notes").value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/checkOut.html", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
        }
    };
    xhttp.send(JSON.stringify(data));
    window.location.href = '/shop.html';

}

function close() {

    window.location.href = '/home.html';

}