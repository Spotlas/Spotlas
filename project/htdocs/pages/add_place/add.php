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
        $imageCount = intval($_POST['imageCount'] ?? 0);

        if (!$created_by) {
            echo json_encode(["code" => 401, "message" => "User not logged in"]);
            exit;
        }

        // Validierung der Pflichtfelder
        if (empty($name) || empty($latitude) || empty($longitude)) {
            echo json_encode(["code" => 400, "message" => "Name, Latitude und Longitude sind Pflichtfelder"]);
            exit;
        }

        // Prüfen, ob mindestens ein Bild vorhanden ist
        if ($imageCount === 0) {
            echo json_encode(["code" => 400, "message" => "Mindestens ein Bild ist erforderlich"]);
            exit;
        }

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
            echo json_encode(["code" => 400, "message" => "Ungültige Kategorie: " . $category_name]);
            exit;
        }

        // Location speichern
        $stmt = $conn->prepare("INSERT INTO Locations (name, latitude, longitude, address, description, category_id, opening_hours, season, price_range, accessibility, website_url, special_features, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sddssississsi", $name, $latitude, $longitude, $address, $description, $category_id, $opening_hours, $season, $price_range, $accessibility, $website_url, $special_features, $created_by);
        
        if ($stmt->execute()) {
            $locationId = $conn->insert_id;
            $stmt->close();
            
            $uploadedImages = [];
            $uploadErrors = [];
            
            // Alle hochgeladenen Bilder verarbeiten
            for ($i = 0; $i < $imageCount; $i++) {
                $fileKey = "fileToUpload_" . $i;
                
                if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
                    $file = $_FILES[$fileKey];
                    $targetDir = "../../uploads/";
                    
                    // Erstelle Upload-Verzeichnis falls nicht vorhanden
                    if (!file_exists($targetDir)) {
                        mkdir($targetDir, 0777, true);
                    }
                    
                    $uniqueName = uniqid() . "_" . basename($file["name"]);
                    $targetFile = $targetDir . $uniqueName;
                    
                    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
                        $image_url = "uploads/" . $uniqueName;
                        
                        // Bildpfad in Images-Tabelle speichern
                        $stmtImg = $conn->prepare("INSERT INTO Images (location_id, image_url, description) VALUES (?, ?, ?)");
                        $imgDesc = $i === 0 ? "Main image" : "Additional image " . $i;
                        $stmtImg->bind_param("iss", $locationId, $image_url, $imgDesc);
                        
                        if ($stmtImg->execute()) {
                            $uploadedImages[] = [
                                "image_id" => $conn->insert_id,
                                "url" => $image_url
                            ];
                        } else {
                            $uploadErrors[] = "Fehler beim Speichern des Bildes " . $i . " in der Datenbank: " . $stmtImg->error;
                        }
                        $stmtImg->close();
                    } else {
                        $uploadErrors[] = "Fehler beim Speichern des Bildes " . $i . " auf dem Server";
                    }
                } else {
                    $errorCode = $_FILES[$fileKey]['error'] ?? 'Unbekannt';
                    $uploadErrors[] = "Fehler beim Hochladen des Bildes " . $i . " (Code: " . $errorCode . ")";
                }
            }
            
            // Rückmeldung zum Client
            if (count($uploadedImages) > 0) {
                $response = [
                    "code" => 200,
                    "message" => "Location erfolgreich gespeichert mit " . count($uploadedImages) . " Bild(ern)",
                    "location_id" => $locationId,
                    "images" => $uploadedImages
                ];
                
                if (count($uploadErrors) > 0) {
                    $response["warnings"] = $uploadErrors;
                }
                
                echo json_encode($response);
            } else {
                // Wenn gar keine Bilder hochgeladen wurden, Location wieder löschen
                $stmt = $conn->prepare("DELETE FROM Locations WHERE id = ?");
                $stmt->bind_param("i", $locationId);
                $stmt->execute();
                echo json_encode([
                    "code" => 500, 
                    "message" => "Location wurde erstellt, aber keine Bilder konnten hochgeladen werden", 
                    "errors" => $uploadErrors
                ]);
            }
            
        } else {
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
