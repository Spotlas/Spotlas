/* **********************************+ Underline Effekt ********************************************** */

function applyUnderlineEffect(elementId) {
  const element = document.getElementById(elementId);
  element.style.position = "relative";
  element.style.display = "inline-block";
  element.style.textDecoration = "none";

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

  element.appendChild(underline);

  setTimeout(() => {
    underline.style.transform = "scaleX(1)";
  }, 10);
}

document.addEventListener("DOMContentLoaded", showEditProfil);

/* **********************************+ Profil bearbeiten ********************************************** */

function showEditProfil() {
  document.getElementById("kontov").querySelector(".underlineEffect")?.remove();
  applyUnderlineEffect("editp");
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
                  <input type="text" name="Vorname" id="vorname" placeholder="First name e.g. Emma">
                </div>

                <div id="input_nachname">
                  <label for="nachname">Last Name</label>
                  <input type="text" name="Nachname" id="nachname" placeholder="Last name e.g. Mustermann">
                </div>
              </div>
            </div>

            <div>
                <br><br>
                <label style="font-size: 20px;" for="benutzername">Username</label>
                <p id="username">@viktoria.explorer69</p>
                <button class="buttons" onclick="changeUserName('username')">Change</button>
            </div>

            <div>
               
                <label style="font-size: 20px;" for="benutzername">Short Info</label>
                <p style="font-size: 13px; color: grey;" id="info">I am passionately creative and love to share inspiration! On my Pinterest, you'll find everything from DIY projects to interior ideas, fashion, and life hacks. I'm always on the lookout for new ideas and excited to share my discoveries with others. Let my pins inspire you!</p>
                <button class="buttons" onclick="changeUserName('info')">Change</button>
            </div>
            
        </div>
    `;
}

//showEditProfil();

let currentField = ""; // Speichert das aktuelle Feld, das geändert wird

function changeUserName(field) {
  currentField = field; // Speichert, welches Feld geändert wird
  document.getElementById("usernameOverlay").style.display = "flex"; // Zeigt das Overlay an
}

function closeOverlay() {
  document.getElementById("usernameOverlay").style.display = "none"; // Versteckt das Overlay
}

function saveUserName() {
  let newValue = document.getElementById("newUserName").value;
  if (newValue.trim() !== "") {
    document.getElementById(currentField).textContent = newValue; // Setzt den neuen Wert an der richtigen Stelle
  }
  closeOverlay(); // Overlay schließen nach dem Speichern
}

function previewProfilePicture(event) {
  let file = event.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profilPic").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

/* **********************************+ Kontoverwaltung ********************************************** */

showKontoVerwaltung();

function showKontoVerwaltung() {
  document.getElementById("editp").querySelector(".underlineEffect")?.remove();
  applyUnderlineEffect("kontov");

  let password = "1234password";
  let maskedPassword = "*".repeat(password.length);

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
                    <option value="moldova">Moldova</option>
                    <option value="romania">Romania</option>
                    <option value="bulgaria">Bulgaria</option>
                  </select>
              </div>
              <br>
              <div>
                <a class="buttons" href="../../pages/login_register/login.html">Delete Account</a>
              </div>
          </div>
    `;
}


// <button class="buttons" onclick="changeUserName('land')">Ändern</button>
