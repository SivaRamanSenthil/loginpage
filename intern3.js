const users = JSON.parse(localStorage.getItem("users")) || {};

// Elements
const authContainer = document.getElementById("auth-container");
const protectedContent = document.getElementById("protected-content");
const authForm = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-link");
const authButton = document.getElementById("auth-btn");
const logoutButton = document.getElementById("logout-btn");
let isLoginMode = true;

// Utility: Hash Password (Simple SHA-256 for demonstration)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Toggle Login/Register
toggleLink.addEventListener("click", () => {
  isLoginMode = !isLoginMode;
  document.getElementById("form-title").textContent = isLoginMode
    ? "Login"
    : "Register";
  authButton.textContent = isLoginMode ? "Login" : "Register";
  toggleLink.innerHTML = isLoginMode
    ? "Don't have an account? <a href='#'>Register</a>"
    : "Already have an account? <a href='#'>Login</a>";
});

// Handle Login/Register
authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const hashedPassword = await hashPassword(password);

  if (isLoginMode) {
    // Login
    if (users[username] && users[username] === hashedPassword) {
      localStorage.setItem("authenticatedUser", username);
      showProtectedContent();
    } else {
      alert("Invalid username or password.");
    }
  } else {
    // Register
    if (users[username]) {
      alert("User already exists.");
    } else {
      users[username] = hashedPassword;
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful! Please log in.");
      isLoginMode = true;
      toggleLink.click();
    }
  }
});

// Show Protected Content
function showProtectedContent() {
  authContainer.classList.add("hidden");
  protectedContent.classList.remove("hidden");
}

// Logout
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("authenticatedUser");
  protectedContent.classList.add("hidden");
  authContainer.classList.remove("hidden");
});

// Auto-login if already authenticated
if (localStorage.getItem("authenticatedUser")) {
  showProtectedContent();
}
