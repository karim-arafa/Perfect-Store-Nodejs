var product = {
    name: document.getElementById("name").value,
    desc: document.getElementById("desc").value,
    price: document.getElementById("price").value,
    date: document.getElementById("date").value,
    status: document.getElementById("status").value,
    quantity: document.getElementById("Quantity").value
}

function allProducts() {
    sessionStorage.setItem("product", JSON.stringify(product));
    window.location("/addproduct.html/#test?product");

}

