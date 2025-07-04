/* **********************************+ Underline Effekt ********************************************** */

function applyUnderlineEffect(elementId) {
  const element = document.getElementById(elementId);
  
  // Entferne alle vorhandenen Underlines im aktuellen Element
  const existingUnderlines = element.getElementsByClassName("underlineEffect");
  while(existingUnderlines[0]) {
    existingUnderlines[0].parentNode.removeChild(existingUnderlines[0]);
  }

  // Style das Hauptelement
  element.style.position = "relative";
  element.style.display = "inline-block";
  element.style.textDecoration = "none";

  // Erstelle das Underline-Element
  let underline = document.createElement("span");
  underline.style.position = "absolute";
  underline.style.left = "0";
  underline.style.bottom = "-2px";
  underline.style.width = "100%";
  underline.style.height = "2px";
  underline.style.backgroundColor = "black";
  underline.style.transform = "scaleX(0)";
  underline.style.transition = "transform 0.2s ease-in-out";
  underline.classList.add("underlineEffect");

  // Füge den Underline hinzu
  element.appendChild(underline);

  // Trigger die Animation
  setTimeout(() => {
    underline.style.transform = "scaleX(1)";
  }, 10);
}

// User data for settings
let userData = null;

// Initialize settings page
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  getCurrentUser()
    .then(user => {
      if (!user) {
        window.location.href = '../login_register/login.html';
        return;
      }
      
      userData = user;
      console.log('User data loaded:', userData);
      
      // Show Edit Profile by default
      showEditProfil();
    })
    .catch(error => {
      console.error('Error loading user data:', error);
      showError('Failed to load settings. Please try again later.');
    });
});

// Get current user data
async function getCurrentUser() {
  try {
    const response = await fetch('../../api/session.php?action=get_user');
    const data = await response.json();
    
    if (data.code === 200 && data.logged_in) {
      return data.user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Check login status on page load
document.addEventListener("DOMContentLoaded", async function() {
  // Check if user is logged in
  if (!await requireLogin()) {
    return; // The requireLogin function will handle the redirect
  }
  
  showEditProfil();
});

/* **********************************+ Profil bearbeiten ********************************************** */

async function showEditProfil() {
  document.getElementById("kontov").querySelector(".underlineEffect")?.remove();
  applyUnderlineEffect("editp");

  // Get current user data from PHP session
  const user = await getCurrentUser();
  if (!user) return; // Safety check
  
  const fullNameParts = user.full_name ? user.full_name.split(' ') : ['', ''];
  const firstName = fullNameParts[0] || '';
  const lastName = fullNameParts.slice(1).join(' ') || '';

  console.log(user); // Debugging
  
  
  document.getElementById("outp").innerHTML = `
        <div id="profilBearbeiten">
            <label style="font-size: 30px;" for="profilbild">Edit Profile</label> 
            <p style="font-size: 13px; color: grey;">
                Information you add here will be visible to all users who can view your profile.
            </p>

            <div>
                <label style="font-size: 20px;" for="profilbild">Profile Picture</label><br><br>
                <input type="file" id="fileInput" style="display: none;" accept="image/*" onchange="previewProfilePicture(event)">
                <img id="profilPic" src="../../assets/images/${user.profile_picture_url}" alt="Profile Picture" 
                     width="100" height="100" style="cursor: pointer; border-radius: 50%;" 
                     onclick="document.getElementById('fileInput').click();"/>
            </div>

            <div>
               
            <div id="names">
                <div id="input_vorname"> 
                  <label for="vorname">First Name</label>
                  <input type="text" name="Vorname" id="vorname" placeholder="First name e.g. Emma" value="${firstName}">
                </div>

                <div id="input_nachname">
                  <label for="nachname">Last Name</label>
                  <input type="text" name="Nachname" id="nachname" placeholder="Last name e.g. Mustermann" value="${lastName}">
                </div>
              </div>
            </div>

            <div>
                <br><br>
                <label style="font-size: 20px;" for="benutzername">Username</label>
                <p id="username">@${user.username}</p>
                <button class="buttons" onclick="changeUserName('username')">Change</button>
            </div>

            <div>
                <br><br>
                <label style="font-size: 20px;" for="benutzername">Short Info</label>
                <p style="font-size: 13px; color: grey;" id="info">${user.description}</p>
                <button class="buttons" onclick="changeUserName('info')">Change</button>
            </div>
            
        </div>
    `;
}

let currentField = ""; // Speichert das aktuelle Feld, das geändert wird

function changeUserName(field) {
  currentField = field;
  const input = document.getElementById("newUserName");
  const title = document.getElementById("overlayTitle");
  const error = document.getElementById("inputError");

  // Reset previous states
  error.style.display = "none";
  input.classList.remove("invalid");
  input.value = "";

  if (field === 'email') {
    input.type = 'email';
    input.placeholder = 'Enter new email';
    title.textContent = 'Change Email';
  } else if (field === 'password') {
    input.type = 'password';
    input.placeholder = 'Enter new password';
    title.textContent = 'Change Password';
  } else if (field === 'username') {
    input.type = 'text';
    input.placeholder = '@username';
    title.textContent = 'Change Username';
    // Aktuellen Benutzernamen vorausfüllen
    input.value = document.getElementById('username').textContent;
  } else {
    input.type = 'text';
    input.placeholder = 'Enter new value';
    title.textContent = 'Change';
  }

  document.getElementById("usernameOverlay").style.display = "flex";
}

function saveUserName() {
  const newValue = document.getElementById("newUserName").value.trim();
  const errorElement = document.getElementById("inputError");
  const inputElement = document.getElementById("newUserName");
  let errors = [];

  // Zurücksetzen der Fehleranzeige
  errorElement.style.display = "none";
  inputElement.classList.remove("invalid");

  switch (currentField) {
    case 'username':
      if (!newValue.startsWith('@')) {
        errors.push("Username muss mit @ beginnen");
      }
      if (newValue.length < 2 || newValue.length > 21) {
        errors.push("1-20 Zeichen nach dem @ erforderlich");
      }
      if (/[^a-zA-Z0-9._]/.test(newValue.slice(1))) {
        errors.push("Nur Buchstaben, Zahlen, . und _ erlaubt");
      }
      break;

    case 'password':
      const specialChars = "!@#$%^&*()_+-=[]{}|;:',.<>?/";
      
      // GEÄNDERT: Mindestens 8 Zeichen statt genau 8
      if (newValue.length < 8) {
        errors.push("Mindestens 8 Zeichen erforderlich");
      }
      if (!/[A-Z]/.test(newValue)) {
        errors.push("Mindestens ein Großbuchstabe (A-Z)");
      }
      if (![...specialChars].some(c => newValue.includes(c))) {
        errors.push("Mindestens ein Sonderzeichen");
      }
      break;

    case 'email':
      const [localPart, domainPart] = newValue.split('@');
      if (!localPart || !domainPart || !domainPart.includes('.')) {
        errors.push("Ungültiges E-Mail-Format");
      }
      break;
  }

  if (errors.length === 0) {
    const targetElement = document.getElementById(currentField);
    
    if (currentField === 'password') {
      // Immer 8 Sterne anzeigen, egal wie lang das Passwort ist
      targetElement.textContent = '********'; // 8 Sterne
    } else if (currentField === 'username') {
      targetElement.textContent = newValue;
      
      // Update the stored username in localStorage
      updateUserData({ username: newValue.replace('@', '') });
    } else {
      targetElement.textContent = newValue;
    }
  }

  closeOverlay();
}

function closeOverlay() {
  document.getElementById("usernameOverlay").style.display = "none";
  document.getElementById("newUserName").value = "";
  document.getElementById("inputError").style.display = "none";
  document.getElementById("newUserName").classList.remove("invalid");
}

/* **********************************+ Kontoverwaltung ********************************************** */

showKontoVerwaltung();

async function showKontoVerwaltung() {
  document.getElementById("editp").querySelector(".underlineEffect")?.remove();
  applyUnderlineEffect("kontov");

  let password = "1234password";
  let maskedPassword = "*".repeat(password.length);
  
  // Get current user data
  const user = await getCurrentUser();

  document.getElementById("outp").innerHTML = `
    <div id="profilBearbeiten">
              <label style="font-size: 30px;" for="profilbild">Account Management</label> 
              <p style="font-size: 13px; color: grey;">Make changes to your personal data or account type.</p>
              <div> 
                  <br><br>
                  <label style="font-size: 20px;" for="email">Email</label>
                  <p id="email">${user.email}</p>
                  <button class="buttons" onclick="changeUserName('email')">Change</button>
                  <br><br>
                  <label style="font-size: 20px;" for="password">Password</label>
                  <p id="password">${maskedPassword}</p>
                  <button class="buttons" onclick="changeUserName('password')">Change</button>
              </div>
              <br>
              <br>
              <div>
                 <form>
                    <div id="geschlecht_container">
                      <label for="geschlecht">Gender:</label>
                      <select id="geschlecht" name="geschlecht">
                        <option value="weiblich">Female</option>
                        <option value="männlich">Male</option>
                        <option value="divers">Diverse</option>
                      </select>
                    </div>
                </form>
              </div>

              <div id="choose_country">
                  <br>
                  <label for="land">Choose a Country:</label>
                  <select id="land" name="land">
                    <option value="austria">Austria</option>
                    <option value="germany">Germany</option>
                    <option value="switzerland">Switzerland</option>
                    <option value="france">France</option>
                    <option value="usa">USA</option>
                    <option value="moldova">Moldova</option>
                    <option value="romania">Romania</option>
                    <option value="bulgaria">Bulgaria</option>
                      <option value="italy">Italy</option>
                     <option value="spain">Spain</option>
                     <option value="portugal">Portugal</option>
                     <option value="sweden">Sweden</option>
                     <option value="norway">Norway</option>
                     <option value="denmark">Denmark</option>
                     <option value="netherlands">Netherlands</option>
                     <option value="belgium">Belgium</option>
                     <option value="luxembourg">Luxembourg</option>
                     <option value="poland">Poland</option>
                     <option value="czech_republic">Czech Republic</option>
                     <option value="hungary">Hungary</option>
                     <option value="slovakia">Slovakia</option>
                     <option value="slovenia">Slovenia</option>
                     <option value="croatia">Croatia</option>
                     <option value="bosnia">Bosnia</option>
                     <option value="serbia">Serbia</option>
                     <option value="montenegro">Montenegro</option>
                     <option value="albania">Albania</option>
                     <option value="north_macedonia">North Macedonia</option>
                     <option value="greece">Greece</option>
                     <option value="turkey">Turkey</option>
                     <option value="cyprus">Cyprus</option>
                     <option value="malta">Malta</option>
                     <option value="iceland">Iceland</option>
                     <option value="ireland">Ireland</option>
                     <option value="united_kingdom">United Kingdom</option>
                     <option value="finland">Finland</option>
                     <option value="estonia">Estonia</option>
                     <option value="latvia">Latvia</option>
                     <option value="lithuania">Lithuania</option>
                     <option value="belarus">Belarus</option>
                     <option value="ukraine">Ukraine</option>
                  </select>
              </div>
              <br>
              <div>
                <button class="buttons" onclick="confirmDeleteAccount()">Delete Account</button>
                <button class="buttons" onclick="logoutUser()">Logout</button>
              </div>
          </div>
    `;
}

async function confirmDeleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    const userId = await getCurrentUserId();
    if (userId) {
      fetch(`../../api/profile.php?action=delete&userId=${userId}`, {
        method: 'POST'
      })
      .then(response => response.json())
      .then(data => {
        if (data.code === 200) {
          alert('Your account has been successfully deleted.');
          // Logout using the PHP session method
          logoutUser();
        } else {
          alert('Error deleting account: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while trying to delete your account.');
      });
    }
  }
}

// Set active menu item
function setActiveMenuItem(id) {
  // Remove active class from all menu items
  document.querySelectorAll('.controlers').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to the selected item
  document.getElementById(id).classList.add('active');
}

// Show change username overlay
function showChangeUsername() {
  const overlay = document.getElementById('usernameOverlay');
  const inputField = document.getElementById('newUserName');
  const overlayTitle = document.getElementById('overlayTitle');
  
  overlayTitle.textContent = 'Change Username';
  inputField.placeholder = 'Enter new username';
  inputField.value = userData.username || '';
  
  // Reset error message
  document.getElementById('inputError').style.display = 'none';
  
  overlay.style.display = 'flex';
  
  // Focus on input field after animation completes
  setTimeout(() => {
    inputField.focus();
  }, 100);
}

// Save new username
function saveUserName() {
  const newUsername = document.getElementById('newUserName').value.trim();
  const inputError = document.getElementById('inputError');
  
  // Simple validation
  if (!newUsername) {
    inputError.textContent = 'Username cannot be empty';
    inputError.style.display = 'block';
    document.getElementById('newUserName').classList.add('invalid');
    return;
  }
  
  if (newUsername.length < 3) {
    inputError.textContent = 'Username must be at least 3 characters long';
    inputError.style.display = 'block';
    document.getElementById('newUserName').classList.add('invalid');
    return;
  }
  
  // Reset error state
  document.getElementById('newUserName').classList.remove('invalid');
  
  // Save username (API call would go here)
  console.log('Saving new username:', newUsername);
  
  // Update user data
  userData.username = newUsername;
  
  // Close overlay
  closeOverlay();
  
  // Show success message
  alert('Username updated successfully!');
  
  // Refresh current view
  if (document.getElementById('editp').classList.contains('active')) {
    showEditProfil();
  } else {
    showKontoVerwaltung();
  }
}

// Close overlay
function closeOverlay() {
  document.getElementById('usernameOverlay').style.display = 'none';
}

// Navigate back to home
function backHome() {
  window.location.href = "../../index.html";
}

// Show error message
function showError(message) {
  const outputDiv = document.getElementById('outp');
  outputDiv.innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #e53e3e; margin-bottom: 20px;"></i>
      <h3>Error</h3>
      <p>${message}</p>
      <button class="buttons" onclick="location.reload()">Retry</button>
    </div>
  `;
}

// Handle profile picture change
function changeProfilePicture() {
  // This would typically open a file picker
  alert('Profile picture change functionality would be implemented here.');
}

// Save profile changes
function saveProfileChanges() {
  const firstName = document.getElementById('firstname').value.trim();
  const lastName = document.getElementById('lastname').value.trim();
  const country = document.getElementById('land').value;
  const gender = document.getElementById('geschlecht').value;
  
  // Update user data
  userData.first_name = firstName;
  userData.last_name = lastName;
  userData.country = country;
  userData.gender = gender;
  
  // Save changes (API call would go here)
  console.log('Saving profile changes:', {firstName, lastName, country, gender});
  
  // Show success message
  alert('Profile updated successfully!');
}

// Confirm account deletion
function confirmDeleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    // Delete account (API call would go here)
    console.log('Deleting account');
    
    // Redirect to login page
    window.location.href = '../login_register/login.html';
  }
}

// Show change password overlay
function showChangePassword() {
  const overlay = document.getElementById('usernameOverlay');
  const inputField = document.getElementById('newUserName');
  const overlayTitle = document.getElementById('overlayTitle');
  
  overlayTitle.textContent = 'Change Password';
  inputField.placeholder = 'Enter new password';
  inputField.value = '';
  inputField.type = 'password';
  
  // Reset error message
  document.getElementById('inputError').style.display = 'none';
  
  overlay.style.display = 'flex';
}

// Show change email overlay
function showChangeEmail() {
  const overlay = document.getElementById('usernameOverlay');
  const inputField = document.getElementById('newUserName');
  const overlayTitle = document.getElementById('overlayTitle');
  
  overlayTitle.textContent = 'Change Email';
  inputField.placeholder = 'Enter new email';
  inputField.value = userData.email || '';
  inputField.type = 'email';
  
  // Reset error message
  document.getElementById('inputError').style.display = 'none';
  
  overlay.style.display = 'flex';
}

// Handle responsiveness for menu on small screens
window.addEventListener('resize', checkScreenSize);

function checkScreenSize() {
  const menuParent = document.getElementById('settings_Menu_parent');
  const menuChild = document.getElementById('settings_Menu_child');
  
  if (window.innerWidth <= 768) {
    // Mobile: menu items in a row
    menuChild.style.flexDirection = 'row';
  } else {
    // Desktop: menu items in a column
    menuChild.style.flexDirection = 'column';
  }
}

// Call once on page load
document.addEventListener('DOMContentLoaded', checkScreenSize);
