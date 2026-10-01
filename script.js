let products = JSON.parse(localStorage.getItem('products')) || [];

document.getElementById('pic').onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => document.getElementById('preview').src = reader.result;
    reader.readAsDataURL(file);
    document.getElementById('preview').style.display = 'block';
}

function addProduct() {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const pic = document.getElementById('preview').src;

    if (!name) return alert("Nam den");

    products.push({
        id: Date.now(),
        name,
        price,
        stock,
        pic
    });
    localStorage.setItem('products', JSON.stringify(products));
    alert("Product Save hoise");
    showProducts();
}

function showProducts() {
    document.getElementById('total').innerText = products.length;
    document.getElementById('low').innerText = products.filter(p => p.stock < 5).length;

    let html = '';
    products.forEach(p => {
        html += `<div class="card product-item">
      <img src="${p.pic}">
      <div>
        <b>${p.name}</b> - ${p.price} Tk <br>
        Stock: ${p.stock} <br>
        <button onclick="del(${p.id})">Delete</button>
      </div>
    </div>`
    });
    document.getElementById('list').innerHTML = html;
}

function del(id) {
    products = products.filter(p => p.id != id);
    localStorage.setItem('products', JSON.stringify(products));
    showProducts();
}

showProducts();