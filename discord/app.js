let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// THEME
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
}

window.onload = () => {
  let theme = localStorage.getItem("theme");
  if (theme === "light") document.body.classList.add("light");
};

// SAVE
function save() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

// REGISTER
function register() {
  users.push({
    username: username.value,
    password: password.value,
    friends: [],
    messages: {},
    servers: []
  });
  save();
  alert("Kayıt başarılı");
}

// LOGIN
function login() {
  let user = users.find(u => u.username === username.value && u.password === password.value);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    location.href = "app.html";
  } else {
    alert("Hatalı giriş");
  }
}

if (currentUser) {
  let el = document.getElementById("usernameDisplay");
  if (el) el.innerText = currentUser.username;
}

// APP LOAD
if (currentUser && document.getElementById("welcome")) {
  welcome.innerText = "Hoş geldin " + currentUser.username;
}

// FRIEND
function addFriend() {
  currentUser.friends.push(friendName.value);
  update();
}

// SERVER
function createServer() {
  let name = prompt("Sunucu adı");
  if (name) currentUser.servers.push(name);
  update();
}

// MESSAGE
function sendMessage() {
  let f = currentUser.friends[0];
  if (!f) return;

  if (!currentUser.messages[f]) currentUser.messages[f] = [];
  currentUser.messages[f].push(message.value);

  update();
}

// UPDATE UI
function update() {
  save();

  if (friends) {
    friends.innerHTML = currentUser.friends.map(f => `<p>${f}</p>`).join("");
  }

  if (servers) {
    servers.innerHTML = currentUser.servers.map(s => `<p>${s}</p>`).join("");
  }

  let f = currentUser.friends[0];
  if (chat && f && currentUser.messages[f]) {
    chat.innerHTML = currentUser.messages[f].map(m => `<p>${m}</p>`).join("");
  }
}

update();


