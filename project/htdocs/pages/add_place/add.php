<?php
require_once '../../api/session.php';

// Prüfe, ob der Benutzer eingeloggt ist, sonst weiterleiten
if (!is_logged_in()) {
    header('Location: ../../pages/login_register/login.html?redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit;
}

// Wenn das Formular abgeschickt wurde (POST), verarbeite die Daten
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    require_once '../../api/mariaDB.php';

    try {
        // Debug: Log alle POST und FILES Daten
        error_log("POST Data: " . print_r($_POST, true));
        error_log("FILES Data: " . print_r($_FILES, true));

        // Felder auslesen
        $name = $_POST['name'] ?? '';
        $latitude = $_POST['latitude'] ?? '';
        $longitude = $_POST['longitude'] ?? '';
        $address = $_POST['address'] ?? '';
        $description = $_POST['description'] ?? '';
        $category = $_POST['category'] ?? '';
        $opening_hours = $_POST['opening_hours'] ?? '';
        $season = $_POST['season'] ?? '';
        $price_range = $_POST['price_range'] ?? '';
        
        // Accessibility als Integer behandeln (0 als Default)
        $accessibility = !empty($_POST['accessibility']) ? intval($_POST['accessibility']) : 0;
        
        $website_url = $_POST['website_url'] ?? '';
        $special_features = $_POST['special_features'] ?? '';
        $comments = isset($_POST['comments']) ? 1 : 0;
        $created_by = $_SESSION['user_id'] ?? null;

        if (!$created_by) {
            echo json_encode(["code" => 401, "message" => "User not logged in"]);
            exit;
        }

        // Validierung der Pflichtfelder
        if (empty($name) || empty($latitude) || empty($longitude)) {
            echo json_encode(["code" => 400, "message" => "Name, Latitude und Longitude sind Pflichtfelder"]);
            exit;
        }

        // Bild-Upload prüfen
        if (!isset($_FILES['fileToUpload']) || $_FILES['fileToUpload']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(["code" => 400, "message" => "Bild ist erforderlich. Upload-Fehler: " . ($_FILES['fileToUpload']['error'] ?? 'Keine Datei')]);
            exit;
        }

        $file = $_FILES['fileToUpload'];
        $targetDir = "../../uploads/";
        
        // Erstelle Upload-Verzeichnis falls nicht vorhanden
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        
        $uniqueName = uniqid() . "_" . basename($file["name"]);
        $targetFile = $targetDir . $uniqueName;
        
        if (!move_uploaded_file($file["tmp_name"], $targetFile)) {
            echo json_encode(["code" => 500, "message" => "Fehler beim Speichern des Bildes"]);
            exit;
        }
        
        $image_url = "uploads/" . $uniqueName;

        // Kategorie-ID ermitteln
        $category_name = $category;
        $cat_stmt = $conn->prepare("SELECT id FROM Categories WHERE name = ?");
        $cat_stmt->bind_param("s", $category_name);
        $cat_stmt->execute();

        $category_id = null;
        $cat_stmt->bind_result($category_id);
        $cat_stmt->fetch();
        $cat_stmt->close();

        if (!$category_id) {
            // Cleanup: Lösche das hochgeladene Bild
            if (file_exists($targetFile)) {
                unlink($targetFile);
            }
            echo json_encode(["code" => 400, "message" => "Ungültige Kategorie: " . $category_name]);
            exit;
        }

        // Location speichern
        $stmt = $conn->prepare("INSERT INTO Locations (name, latitude, longitude, address, description, category_id, opening_hours, season, price_range, accessibility, website_url, special_features, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sddsssississi", $name, $latitude, $longitude, $address, $description, $category_id, $opening_hours, $season, $price_range, $accessibility, $website_url, $special_features, $created_by);
        
        if ($stmt->execute()) {
            $locationId = $conn->insert_id;
            $stmt->close();

            // Bildpfad in Images-Tabelle speichern
            $stmtImg = $conn->prepare("INSERT INTO Images (location_id, image_url, description) VALUES (?, ?, ?)");
            $imgDesc = "Main image";
            $stmtImg->bind_param("iss", $locationId, $image_url, $imgDesc);
            
            if ($stmtImg->execute()) {
                $stmtImg->close();
                echo json_encode(["code" => 200, "message" => "Location und Bild erfolgreich gespeichert", "location_id" => $locationId]);
            } else {
                // Rollback: Lösche Location und Bild
                $conn->prepare("DELETE FROM Locations WHERE id = ?")->bind_param("i", $locationId)->execute();
                if (file_exists($targetFile)) {
                    unlink($targetFile);
                }
                echo json_encode(["code" => 500, "message" => "Fehler beim Speichern des Bildes in der Datenbank: " . $stmtImg->error]);
            }
        } else {
            // Cleanup: Lösche das hochgeladene Bild
            if (file_exists($targetFile)) {
                unlink($targetFile);
            }
            echo json_encode(["code" => 500, "message" => "Fehler beim Speichern der Location: " . $stmt->error]);
        }
        
    } catch (Exception $e) {
        echo json_encode(["code" => 500, "message" => "Unerwarteter Fehler: " . $e->getMessage()]);
    }
    
    $conn->close();
    exit;
}

// Für GET-Requests: HTML anzeigen
include 'add.html';
?>
