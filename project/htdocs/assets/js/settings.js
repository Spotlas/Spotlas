/* **********************************+ Profil bearbeiten ********************************************** */

function showEditProfil() {
    const textElement = document.getElementById("kontov");
    textElement.setAttribute("style", "text-decoration: none;");
    const textElement2 = document.getElementById("editp");
    textElement2.setAttribute("style", "text-decoration: underline;");
    document.getElementById("outp").innerHTML = `
        <div id="profilBearbeiten">
            <label style="font-size: 30px;" for="profilbild">Profil bearbeiten</label> 
            <p style="font-size: 13px; color: grey;">
                Informationen, die du hier hinzufügst, sind für alle Nutzer sichtbar, die dein Profil ansehen können.
            </p>

            <div>
                <label style="font-size: 20px;" for="profilbild">Profilbild</label><br><br>
                <input type="file" id="fileInput" style="display: none;" accept="image/*" onchange="previewProfilePicture(event)">
                <img id="profilPic" src="../../assets/images/profilPicture_test.png" alt="Profilbild" 
                     width="100" height="100" style="cursor: pointer; border-radius: 50%;" 
                     onclick="document.getElementById('fileInput').click();"/>
            </div>

            <div>
                <br><br>
                <label style="font-size: 20px;" for="vorname">Vorname</label>
                <label style="font-size: 20px;" for="nachname">Nachname</label>
                <p id="vorname">Viki</p>
                <button class="buttons" onclick="changeUserName('vorname')">Ändern</button>
                <p id="nachname">V</p>
                <button class="buttons" onclick="changeUserName('nachname')">Ändern</button>
            </div>

            <div>
                <br><br>
                <label style="font-size: 20px;" for="benutzername">Benutzername</label>
                <p id="username">@viktoria.explorer69</p>
                <button class="buttons" onclick="changeUserName('username')">Ändern</button>
            </div>

            <div>
                <br><br>
                <label style="font-size: 20px;" for="benutzername">Kurzinfo</label>
                <p style="font-size: 13px; color: grey;" id="info">Ich bin leidenschaftlich kreativ und liebe es, Inspiration zu teilen! Auf meinem Pinterest findest du alles von DIY-Projekten über Interieur-Ideen bis hin zu Fashion und Lifehacks. Ich bin immer auf der Suche nach neuen Ideen und freue mich, meine Entdeckungen mit anderen zu teilen. Lass dich von meinen Pins inspirieren!</p>
                <button class="buttons" onclick="changeUserName('info')">Ändern</button>
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
        reader.onload = function(e) {
            document.getElementById("profilPic").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

/* **********************************+ Kontoverwaltung ********************************************** */

showKontoVerwaltung();

function showKontoVerwaltung() {
    const textElement = document.getElementById("editp");
    textElement.setAttribute("style", "text-decoration: none;");
    const textElement2 = document.getElementById("kontov");
    textElement2.setAttribute("style", "text-decoration: underline;");
    document.getElementById("outp").innerHTML = `
    <div id="profilBearbeiten">
              <label style="font-size: 30px;" for="profilbild">Kontoverwaltung</label> 
              <p style="font-size: 13px; color: grey;">Nimm Änderungen an deinen persönlichen Daten oder deinem Kontotyp vor.</p>
              <div> 
                  <br><br>
                  <label style="font-size: 20px;" for="email">E-Mail</label>
                  <p id="email">viki.v@gmail.com</p>
                  <button class="buttons" onclick="changeUserName('email')">Ändern</button>
                  <br><br>
                  <label style="font-size: 20px;" for="password">Passwort</label>
                  <p id="password">1234password</p>
                  <button class="buttons" onclick="changeUserName('password')">Ändern</button>
              </div>
              <br>
              <br>
              <div>
              <label style="font-size: 20px;" for="gesch">Geschlecht</label>
                <form>
                    <input type="radio" id="weiblich" name="geschlecht" value="Weiblich">
                    <label for="weiblich">Weiblich</label>
                    <input type="radio" id="männlich" name="geschlecht" value="männlich">
                    <label for="männlich">Männlich</label>
                    <input type="radio" id="divers" name="geschlecht" value="divers">
                    <label for="divers">Divers</label>
                </form>
              </div>

              <div>
                  <br><br>
                  <label style="font-size: 20px;" for="land">Land</label>
                  <p id="land">Österreich</p>
                  <button class="buttons" onclick="changeUserName('land')">Ändern</button>
              </div>
          </div>
    `;
}

