// ==========================================
// 1. DATABASE CONFIGURATION
// ==========================================
function getUsers() {
    const stored = localStorage.getItem('libraryUsers');
    if (stored) return JSON.parse(stored);

    // Default Data
    const defaults = [{
            id: '20250001',
            name: 'Alex Morgan',
            email: 'alex@gmail.com',
            password: '123',
            role: 'user',
            phone: '+91 98765 43210',
            address: 'Ahmedabad, Gujarat',
            language: 'English',
            bio: 'Student & Reader',
            fines: 150.00,
            avatarUrl: '',
            borrowedBooks: []
        },
        {
            id: '20248812',
            name: 'Sarah Jenkins',
            email: 'admin@library.com',
            password: '123',
            role: 'admin',
            phone: '+1 555 0199',
            language: 'English',
            avatarUrl: ''
        }
    ];
    localStorage.setItem('libraryUsers', JSON.stringify(defaults));
    return defaults;
}

function getBooks() {
    const stored = localStorage.getItem('libraryBooks');
    if (stored && JSON.parse(stored).length > 2) return JSON.parse(stored);

    const defaults = [
        { title: "Intro to Algorithms", author: "Thomas Cormen", price: 950, rent: 100, cover: "https://covers.openlibrary.org/b/id/8381864-M.jpg" },
        { title: "Clean Code", author: "Robert Martin", price: 1200, rent: 150, cover: "https://covers.openlibrary.org/b/id/12556534-L.jpg" },
        { title: "God of Small Things", author: "Arundhati Roy", price: 499, rent: 50, cover: "https://covers.openlibrary.org/b/id/8259443-M.jpg" },
        { title: "Times of India", author: "Daily News", price: 5, rent: 0, cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/The_Times_of_India_Logo_2.svg/1200px-The_Times_of_India_Logo_2.svg.png" }
    ];
    localStorage.setItem('libraryBooks', JSON.stringify(defaults));
    return defaults;
}

// ==========================================
// 2. AUTHENTICATION & LOGOUT
// ==========================================
let loginRole = 'user';

function switchLoginRole(role) {
    loginRole = role;
    const btnUser = document.getElementById('btn-login-user');
    const btnAdmin = document.getElementById('btn-login-admin');
    if (btnUser && btnAdmin) {
        if (role === 'user') {
            btnUser.classList.add('active');
            btnAdmin.classList.remove('active');
        } else {
            btnAdmin.classList.add('active');
            btnUser.classList.remove('active');
        }
    }
}

function handleLogin() {
    const emailIn = document.getElementById('login-email').value.toLowerCase().trim();
    const passIn = document.getElementById('login-password').value.trim();
    const allUsers = getUsers();
    const account = allUsers.find(u => u.email === emailIn && u.password === passIn);

    if (account) {
        if (loginRole === 'admin' && account.role !== 'admin') {
            alert("Error: Only Admins can login here. Switch to User.");
            return;
        }
        localStorage.setItem('currentUser', JSON.stringify(account));
        window.location.href = loginRole === 'user' ? 'user_home.html' : 'admin_home.html';
    } else {
        alert("Invalid Email or Password");
    }
}

function handleRegister() { alert("Account created! Please Log In.");
    showLogin(); }

function showRegister() { document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden'); }

function showLogin() { document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden'); }

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// ==========================================
// 3. PROFILE LOGIC (LANGUAGE FIXED HERE)
// ==========================================
function openProfileModal() {
    const modal = document.getElementById('profile-modal');
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (modal && user) {
        // Pre-fill inputs
        document.getElementById('edit-name').value = user.name || "";
        document.getElementById('edit-phone').value = user.phone || "";
        document.getElementById('edit-address').value = user.address || "";
        // Check if bio field exists (User page only)
        if (document.getElementById('edit-bio')) document.getElementById('edit-bio').value = user.bio || "";

        // --- LANGUAGE FIX ---
        // Agar user.language set nahi hai to default English dikhaye
        document.getElementById('edit-lang').value = user.language || "English";

        modal.classList.remove('hidden');
    }
}

function closeProfileModal() {
    document.getElementById('profile-modal').classList.add('hidden');
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview-avatar').src = e.target.result;
            document.getElementById('preview-avatar').dataset.newUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// SAVE CHANGES
function saveProfileChanges() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let allUsers = getUsers();

    const index = allUsers.findIndex(u => u.email === currentUser.email);

    if (index !== -1) {
        // 1. Get Values
        const newName = document.getElementById('edit-name').value;
        const newPhone = document.getElementById('edit-phone').value;
        const newAddress = document.getElementById('edit-address').value;
        const newLang = document.getElementById('edit-lang').value; // Get Language

        // 2. Update Database Object
        allUsers[index].name = newName;
        allUsers[index].phone = newPhone;
        allUsers[index].address = newAddress;
        allUsers[index].language = newLang; // Save Language

        if (document.getElementById('edit-bio')) {
            allUsers[index].bio = document.getElementById('edit-bio').value;
        }

        const imgPreview = document.getElementById('preview-avatar');
        if (imgPreview && imgPreview.dataset.newUrl) {
            allUsers[index].avatarUrl = imgPreview.dataset.newUrl;
        }

        // 3. Save to Storage
        localStorage.setItem('libraryUsers', JSON.stringify(allUsers));
        localStorage.setItem('currentUser', JSON.stringify(allUsers[index]));

        alert("Profile Updated Successfully!");
        closeProfileModal();
        location.reload();
    } else {
        alert("Error: User not found in database.");
    }
}

function loadUserData() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    // Fill Text
    if (document.getElementById('profile-name')) document.getElementById('profile-name').innerText = user.name;
    if (document.getElementById('profile-email')) document.getElementById('profile-email').innerText = user.email;
    if (document.getElementById('profile-phone')) document.getElementById('profile-phone').innerText = user.phone || "Not set";
    if (document.getElementById('profile-address')) document.getElementById('profile-address').innerText = user.address || "Not set";
    if (document.getElementById('profile-bio')) document.getElementById('profile-bio').innerText = user.bio || "Student";
    if (document.getElementById('home-name')) document.getElementById('home-name').innerText = user.name;
    if (document.getElementById('admin-name-display')) document.getElementById('admin-name-display').innerText = user.name;

    // --- LANGUAGE DISPLAY FIX ---
    if (document.getElementById('profile-lang')) {
        document.getElementById('profile-lang').innerText = user.language || "English";
    }

    // Fill Avatar
    if (user.avatarUrl && user.avatarUrl.length > 10) {
        document.querySelectorAll('.user-avatar').forEach(el => {
            el.innerHTML = `<img src="${user.avatarUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
            el.style.background = 'transparent';
        });
    }
}

// ==========================================
// 4. PAYMENT & STORE LOGIC
// ==========================================
function loadSearchPage() {
    const container = document.getElementById('book-results');
    if (!container) return;
    const books = getBooks();
    container.innerHTML = '';
    books.forEach(book => {
        const imgStyle = book.title.includes("Times") ? "object-fit: contain; padding: 5px;" : "object-fit: cover;";
        container.innerHTML += `
        <div class="card" style="display:flex; gap: 15px;">
            <img src="${book.cover}" style="width: 70px; height: 100px; ${imgStyle} border-radius: 8px; border:1px solid #eee;">
            <div style="flex:1">
                <h4 style="margin-bottom:2px;">${book.title}</h4>
                <p style="color:gray; font-size:0.9rem;">${book.author}</p>
                <div style="margin-top:10px; display:flex; gap:10px;">
                    <button class="btn btn-outline" style="padding:6px 10px; font-size:0.8rem;" onclick="initiateTransaction('${book.title}', ${book.rent}, 'Rent')">Rent ₹${book.rent}</button>
                    <button class="btn btn-primary" style="padding:6px 10px; font-size:0.8rem;" onclick="initiateTransaction('${book.title}', ${book.price}, 'Buy')">Buy ₹${book.price}</button>
                </div>
            </div>
        </div>`;
    });
}

function initiateTransaction(title, price, type) {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        document.getElementById('pay-amount').innerText = "₹" + price;
        document.getElementById('pay-reason').innerText = type + ": " + title;
        modal.classList.remove('hidden');
    }
}

function closePaymentModal() { document.getElementById('payment-modal').classList.add('hidden'); }

function selectMethod(method) {
    document.querySelectorAll('.pay-method').forEach(el => el.classList.remove('selected'));
    document.getElementById('method-' + method).classList.add('selected');
    ['card', 'upi', 'netbanking'].forEach(m => document.getElementById('input-' + m).classList.add('hidden'));
    document.getElementById('input-' + method).classList.remove('hidden');
}

function processPayment() {
    const btn = document.getElementById('btn-pay-confirm');
    btn.innerText = "Processing...";
    setTimeout(() => {
        alert("Payment Successful!");
        closePaymentModal();
        location.reload();
    }, 1500);
}

// Global Init
window.addEventListener('load', () => {
    if (document.body.id !== 'login-page-body' && !localStorage.getItem('currentUser')) {
        window.location.href = 'login.html';
    }
    loadSearchPage();
    loadUserData();
});