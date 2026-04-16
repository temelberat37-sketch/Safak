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

// USERNAME
if (currentUser) {
  let el = document.getElementById("usernameDisplay");
  if (el) el.innerText = currentUser.username;
}

// FRIEND
function addFriend() {
  currentUser.friends.push(prompt("Arkadaş adı"));
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
  let friend = currentUser.friends[0];
  if (!friend) return;

  if (!currentUser.messages[friend]) currentUser.messages[friend] = [];
  currentUser.messages[friend].push(message.value);

  update();
}

// UPDATE
function update() {
  save();

  if (friends) {
    friends.innerHTML = currentUser.friends.map(f => `<p>${f}</p>`).join("");
  }

  let friend = currentUser.friends[0];
  if (chat && friend && currentUser.messages[friend]) {
    chat.innerHTML = currentUser.messages[friend].map(m => `<div class="msg">${m}</div>`).join("");
  }
}

update();
