function showEditProfil() {
    document.getElementById("outp").innerHTML = `
          <div id="profilBearbeiten">
              <label style=" font-size: 30px;" for="profilbild">Profil bearbeiten</label> 
              <p style=" font-size: 13px; color: grey;">Informationen, die du hier hinzufügst, sind für alle Nutzer sichtbar, die dein Profil ansehen können.</p>
              <div>
                  <label style=" font-size: 20px;" for="profilbild">Profilbild</label> <br><br>
                  <img id="profilPic" src="../../assets/images/profilPicture_test.png" alt="Profilbild"/>
              </div>
              <div> 
                  <br> 
                  <br>
                  <label  style=" font-size: 20px;" for="benutzername">Benutzername</label>
                  <p id="username">@viktoria.explorer69</p>
                  <button class="buttons" onclick="changeUserName()">Ändern</button>

              </div>
          </div>
          
      `;
  }

  function showKontoVerwaltung() {
    document.getElementById("outp").innerHTML = `
    hello
    `
    
  }
  
  showEditProfil();
  

  function changeUserName() {
    document.getElementById("usernameOverlay").style.display = "flex"; // Zeigt das Overlay an
}

function closeOverlay() {
    document.getElementById("usernameOverlay").style.display = "none"; // Versteckt das Overlay
}

function saveUserName() {
    let newUserName = document.getElementById("newUserName").value;
    if (newUserName.trim() !== "") {
        document.getElementById("username").textContent = "@" + newUserName;
    }
    closeOverlay(); // Overlay schließen nach dem Speichern
}