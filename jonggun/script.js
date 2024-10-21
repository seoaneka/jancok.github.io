var modalDaftar = document.getElementById('modalForm');
var btnDaftar = document.getElementById('daftarBtn');
var spanDaftar = document.getElementsByClassName('close')[0];

btnDaftar.onclick = function() {
    modalDaftar.style.display = 'block';
}

spanDaftar.onclick = function() {
    modalDaftar.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modalDaftar || event.target == spanDaftar) {
        modalDaftar.style.display = 'none';
    }
}

var modalMasuk = document.getElementById('modalMasuk');
var btnMasuk = document.getElementById('masukBtn');
var spanMasuk = document.getElementsByClassName('close')[1];

btnMasuk.onclick = function() {
    modalMasuk.style.display = 'block';
}

spanMasuk.onclick = function() {
    modalMasuk.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modalMasuk || event.target == spanMasuk) {
        modalMasuk.style.display = 'none';
    }
}

let cart = [];
let paymentCompleted = false; // Tambahkan variabel untuk melacak status pembayaran
let isLoggedIn = false; // Variabel untuk melacak status login
let userData = {}; // Variabel untuk menyimpan data user

function loginUser(email, password) {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        if (storedUser.email === email && storedUser.password === password) {
            isLoggedIn = true;
            userData = storedUser;
            localStorage.setItem('isLoggedIn', true); // Simpan status login
            alert('Login berhasil!');
            modalMasuk.style.display = 'none';
        } else {
            alert('Email atau kata sandi salah!');
        }
    } else {
        alert('Email tidak ditemukan!');
    }
}

function registerUser(user) {
    // Logika untuk menyimpan data user
    localStorage.setItem('user', JSON.stringify(user));
    alert('Pendaftaran berhasil! Silakan login.');
    modalDaftar.style.display = 'none';
}

function addToCart(product) {
    cart.push(product);
    document.getElementById('cartCount').innerText = cart.length;
    alert(`${product.name} telah ditambahkan ke keranjang!`);
}

function showCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    let total = 0; // Variabel untuk menyimpan total harga

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price}</span>
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
            <button class="unique-delete-btn" onclick="removeFromCart(${index})">Hapus</button>
        `;
        cartItems.appendChild(cartItem);

        // Tambahkan harga item ke total
        total += parseFloat(item.price.replace(/[^0-9.-]+/g,""));
    });

    // Tampilkan total harga di keranjang
    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.innerHTML = `<strong>Total: Rp ${total.toFixed(2)}</strong>`;
    cartItems.appendChild(totalElement);

    cartModal.style.display = 'block';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    document.getElementById('cartCount').innerText = cart.length;
    showCart();
}

document.getElementById('cartBtn').addEventListener('click', showCart);
document.getElementById('checkoutBtn').addEventListener('click', () => {
    showBankTransferModal();
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        closeBtn.parentElement.parentElement.style.display = 'none';
    }
});

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productItem = this.parentElement;
        const productName = productItem.querySelector('h3').innerText;
        const productPrice = productItem.querySelector('p').innerText;
        const productImage = productItem.querySelector('img').src;
        const product = {
            name: productName,
            price: productPrice,
            image: productImage
        };
        addToCart(product);
    });
});

function showBankTransferModal() {
    let bankTransferModal = document.getElementById('bankTransferModal');
    if (!bankTransferModal) {
        bankTransferModal = document.createElement('div');
        bankTransferModal.className = 'modal';
        bankTransferModal.id = 'bankTransferModal';
        bankTransferModal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="document.getElementById('bankTransferModal').style.display='none'">&times;</span>
                <h2>Metode Pembayaran: Transfer Bank</h2>
                <p>Silakan transfer total belanja Anda ke rekening berikut:</p>
                <p><strong>Bank: BCA</strong></p>
                <p><strong>Nomor Rekening: 0021-6448-20</strong></p>
                <p><strong>Atas Nama: YUTA OKKOTSU</strong></p>
                <p>Setelah melakukan transfer, harap konfirmasi pembayaran dengan mengirimkan bukti transfer ke email kami di <strong>yutaokkotsu@gmail.com</strong>.</p>
                <button class="close-modal-btn">Tutup</button>
                <button id="completePaymentBtn" style="float: right;">Selesaikan Pembayaran</button>
                <button id="continueShoppingBtn" style="float: right; margin-right: 10px;">Lanjut Berbelanja</button>
            </div>
        `;
        document.body.appendChild(bankTransferModal);
    }

    bankTransferModal.style.display = 'block';

    document.getElementById('completePaymentBtn').addEventListener('click', () => {
        if (!paymentCompleted) { // Cek apakah pembayaran sudah selesai sebelumnya
            alert('Pembayaran Anda telah selesai!');
            paymentCompleted = true; // Set status pembayaran menjadi selesai
        }
        cart = [];
        document.getElementById('cartCount').innerText = cart.length;
        bankTransferModal.style.display = 'none';
        window.location.href = 'index.html'; // Arahkan ke halaman utama
    });

    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
        bankTransferModal.style.display = 'none';
    });

    document.querySelectorAll('.close-modal-btn').forEach(button => {
        button.addEventListener('click', () => {
            bankTransferModal.style.display = 'none';
        });
    });
}

// Tambahkan tombol daftar dan pertanyaan di modalMasuk
const modalMasukContent = document.querySelector('#modalMasuk .modal-content');
const daftarLink = document.createElement('p');
daftarLink.innerHTML = 'Belum memiliki akun? <a href="javascript:void(0)" id="daftarLink">Daftar disini</a>';
modalMasukContent.appendChild(daftarLink);

document.getElementById('daftarLink').addEventListener('click', () => {
    modalMasuk.style.display = 'none';
    modalDaftar.style.display = 'block';
});

// Tambahkan event listener untuk form pendaftaran
document.querySelector('#modalForm form').addEventListener('submit', function(event) {
    event.preventDefault();
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const newUser = {
        fname: fname,
        lname: lname,
        email: email,
        password: password
    };

    registerUser(newUser);
});

// Periksa status login saat halaman dimuat
window.onload = function() {
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        userData = JSON.parse(localStorage.getItem('user'));
    }
};