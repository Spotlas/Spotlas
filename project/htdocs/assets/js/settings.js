function showEditProfil() {
    document.getElementById("outp").innerHTML = `
          <div id="profilBearbeiten">
              <h2>Profil bearbeiten</h2>
              <p>Informationen, die du hier hinzufügst, sind für alle Nutzer sichtbar, die dein Profil ansehen können.</p>
              <div>
                  <label for="profilbild">Profilbild</label> <br><br>
                  <img src="../../assets/images/profilPicture_test.png" alt="Profilbild" id="profilbild"/>
                  <button id="change_button" onclick="changeProfilePic()">Ändern</button>
              </div>
              <div> 
                  <br> 
                  <br>
                  <label for="benutzername">Benutzername</label>
                  <p>@viktoria.explorer69</p>
                  <button onclick="changeProfilePic()">Ändern</button>

              </div>
          </div>
          <style>
              #profilbild {
                  width: 100px;
                  height: 100px;
                  border-radius: 50%;
                  object-fit: cover;
              }
          </style>
      `;
  }

  function showKontoVerwaltung() {
    document.getElementById("outp").innerHTML = `
    hello
    `
    
  }
  
  showEditProfil();
  