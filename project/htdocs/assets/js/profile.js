function backHome() {
  window.location.href = "../../index.html"; // Zurück zur Startseite
}

function showLine(clickedPTag) {
  document.querySelectorAll("p").forEach((p) => p.classList.remove("active"));
  clickedPTag.classList.add("active");
}

loadErstellteBilder();

function loadErstellteBilder() {
  document.getElementById("bilder").innerHTML = `
  <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">3 ❤</p></div>
  </div>
    <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">23 ❤</p></div>
  </div>
  <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">4 ❤</p></div>
  </div>
  <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">1 ❤</p></div>
  </div>
    <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">456 ❤</p></div>
  </div>
  <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">3 ❤</p></div>
  </div>
  <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">4 ❤</p></div>
  </div>
    <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">4 ❤</p></div>
  </div>
  <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">5 ❤</p></div>
  </div>
  <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">6 ❤</p></div>
  </div>
    <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">1 ❤</p></div>
  </div>
  <div class="image-wrapper"><img class="images" src="../../assets/images/testPic/1.png" alt="test" />
    <div class="overlay"><h2 class="header">Lake</h2><p class="like">0 ❤</p></div>
  </div>`;
}

function loadErstellte(clickedPTag) {
  showLine(clickedPTag);
  loadErstellteBilder();
}

function loadFavouriten(clickedPTag) {
  showLine(clickedPTag);
  document.getElementById("bilder").innerHTML = `
    <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
    </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
      </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
    </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
      </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
    </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
      </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
    </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
      </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
    </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
      </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
    </div>
      <div class="image-wrapper"><img class="images_fav" src="../../assets/images/testPic/2.png" alt="test" />
      </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const erstelltSwitch = document.getElementById("switches_erstellt");
  if (erstelltSwitch) {
    loadErstellte(erstelltSwitch); // ← jetzt wird es korrekt aufgerufen
  }
});
