<?php
// mariaDB DATABASE
$servername = "mariadb";  // Der Containername der MariaDB-Datenbank, wie im docker-compose.yml definiert
$port = 3306;              // Port, der von Docker nach außen weitergeleitet wird

// Auslesen der Umgebungsvariablen
$username = getenv('MYSQL_USER'); // Benutzername aus der .env-Datei
$password = getenv('MYSQL_PASSWORD'); // Passwort aus der .env-Datei
$dbname = getenv('MYSQL_DATABASE'); // Datenbankname aus der .env-Datei

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//*************************************************************************************** */
echo "Connected successfully";  
// !! NUR ZUM PROBIEREN OB DIE VERBINDUNG FUNKTIONIERT !! 
// WENN MAN ARBEITET MIT API (JS, PHP) AUSKOMMENTIEREN SONST KOMMT ES ZU FEHLERN. 
// ZU 100% WENN MAN MIT JS AUF PHP FETCHT. 
// ZUM API ROUTEN SCHREIBEN UND TESTEN SOLLTE ES GEHEN.
//*************************************************************************************** */


?>
