<?php
header('Content-Type: application/json; charset=utf-8');
require("./mysql.php");
session_start();

// Default
$answer = [
  "code"     => 404,
  "uploaded" => false,
  "message"  => "Upload fehlgeschlagen"
];

// Configuration
$targetDir = "uploads/";
$allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
$maxFileSize = 5 * 1024 * 1024; // 5MB

// Create uploads directory if it doesn't exist
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Process upload if a form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["uploadFile"])) {
    $file = $_FILES["uploadFile"];
    
    // Check for upload errors
    if ($file["error"] !== UPLOAD_ERR_OK) {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => "The uploaded file exceeds the upload_max_filesize directive in php.ini",
            UPLOAD_ERR_FORM_SIZE => "The uploaded file exceeds the MAX_FILE_SIZE directive in the HTML form",
            UPLOAD_ERR_PARTIAL => "The uploaded file was only partially uploaded",
            UPLOAD_ERR_NO_FILE => "No file was uploaded",
            UPLOAD_ERR_NO_TMP_DIR => "Missing a temporary folder",
            UPLOAD_ERR_CANT_WRITE => "Failed to write file to disk",
            UPLOAD_ERR_EXTENSION => "A PHP extension stopped the file upload"
        ];
        
        $errorMessage = isset($errorMessages[$file["error"]]) 
            ? $errorMessages[$file["error"]] 
            : "Unknown upload error";
            
        $answer["message"] = $errorMessage;
        die(json_encode($answer));
    }
    
    // Validate file size
    if ($file["size"] > $maxFileSize) {
        $answer["message"] = "File is too large. Maximum file size is " . ($maxFileSize / 1024 / 1024) . "MB";
        die(json_encode($answer));
    }
    
    // Validate file type
    if (!in_array($file["type"], $allowedTypes)) {
        $answer["message"] = "Invalid file type. Allowed types: " . implode(", ", $allowedTypes);
        die(json_encode($answer));
    }
    
    // Generate a safe, unique filename
    $filename = basename($file["name"]);
    $fileExtension = pathinfo($filename, PATHINFO_EXTENSION);
    $uniqueName = uniqid() . "." . $fileExtension;
    $targetFile = $targetDir . $uniqueName;
    
    // Save the file
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        // Get parameters for database insertion
        $locationId = isset($_POST['location_id']) ? $_POST['location_id'] : null;
        $description = isset($_POST['description']) ? $_POST['description'] : '';
        $statusId = isset($_POST['status_id']) ? $_POST['status_id'] : 1; // Default status_id if not provided
        
        // Validate required fields
        if (!$locationId) {
            $answer["message"] = "Location ID is required";
            // Delete the uploaded file if database insertion fails
            if (file_exists($targetFile)) {
                unlink($targetFile);
            }
            die(json_encode($answer));
        }
        
        try {
            // Insert image record into database
            $stmt = $mysql->prepare("INSERT INTO images (location_id, image_url, description, creation_date, status_id) VALUES (?, ?, ?, NOW(), ?)");
            $imageUrl = $targetFile; // Store the path to the image
            
            $stmt->bind_param("issi", $locationId, $imageUrl, $description, $statusId);
            
            if ($stmt->execute()) {
                $imageId = $mysql->insert_id;
                
                $answer = [
                    "code"     => 200,
                    "uploaded" => true,
                    "message"  => "Bild erfolgreich hochgeladen",
                    "image_id" => $imageId,
                    "filename" => $uniqueName,
                    "path"     => $targetFile
                ];
            } else {
                // Delete the uploaded file if database insertion fails
                if (file_exists($targetFile)) {
                    unlink($targetFile);
                }
                $answer["message"] = "Fehler bei der Speicherung in der Datenbank: " . $stmt->error;
            }
            
            $stmt->close();
        } catch (Exception $e) {
            // Delete the uploaded file if database insertion fails
            if (file_exists($targetFile)) {
                unlink($targetFile);
            }
            $answer["message"] = "Datenbankfehler: " . $e->getMessage();
        }
    } else {
        $answer["message"] = "Fehler beim Speichern der Datei";
    }
} else {
    $answer["message"] = "Keine Datei übermittelt";
}

echo json_encode($answer);
?>
