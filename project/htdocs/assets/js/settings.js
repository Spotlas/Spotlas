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
  
  document.getElementById("outp").innerHTML = `
        <div id="profilBearbeiten">
            <label style="font-size: 30px;" for="profilbild">Edit Profile</label> 
            <p style="font-size: 13px; color: grey;">
                Information you add here will be visible to all users who can view your profile.
            </p>

            <div>
                <label style="font-size: 20px;" for="profilbild">Profile Picture</label><br><br>
                <input type="file" id="fileInput" style="display: none;" accept="image/*" onchange="previewProfilePicture(event)">
                <img id="profilPic" src="../../assets/images/profilPicture_test.png" alt="Profile Picture" 
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
                <p style="font-size: 13px; color: grey;" id="info">I am passionately creative and love to share inspiration! On my Pinterest, you'll find everything from DIY projects to interior ideas, fashion, and life hacks. I'm always on the lookout for new ideas and excited to share my discoveries with others. Let my pins inspire you!</p>
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

function showKontoVerwaltung() {
  document.getElementById("editp").querySelector(".underlineEffect")?.remove();
  applyUnderlineEffect("kontov");

  let password = "1234password";
  let maskedPassword = "*".repeat(password.length);
  
  // Get current user data
  const user = getCurrentUser();

  document.getElementById("outp").innerHTML = `
    <div id="profilBearbeiten">
              <label style="font-size: 30px;" for="profilbild">Account Management</label> 
              <p style="font-size: 13px; color: grey;">Make changes to your personal data or account type.</p>
              <div> 
                  <br><br>
                  <label style="font-size: 20px;" for="email">Email</label>
                  <p id="email">viki.v@gmail.com</p>
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
