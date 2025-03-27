function backHome() {
  window.location.href = "../../index.html"; // Zurück zur Startseite
}

function showLine(clickedPTag) {
  document.querySelectorAll("p").forEach((p) => p.classList.remove("active"));
  clickedPTag.classList.add("active");
}

function loadErstellte(clickedPTag) {
    showLine(clickedPTag);
  document.getElementById("bilder").innerHTML = `
    <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/1.png" alt="test" /></div>`;
}

function loadFavouriten(clickedPTag) {
    showLine(clickedPTag);
  document.getElementById("bilder").innerHTML = `
    <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>
      <div><img class="images" src="../../assets/images/testPic/2.png" alt="test" /></div>`;
}
