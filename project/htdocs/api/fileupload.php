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

// 1) Login & Parameter prüfen
if (!isset($_SESSION['loggedin'], $_SESSION['user_id']) || $_SESSION['loggedin'] !== true) {
  $answer['message'] = "Nicht eingeloggt.";
  echo json_encode($answer);
  exit;
}
if (empty($_POST['brick_set_id']) || !isset($_FILES['fileToUpload'])) {
  $answer['message'] = "Keine Set-ID oder Datei.";
  echo json_encode($answer);
  exit;
}

$brickSetId = intval($_POST['brick_set_id']);

// 2) Ownership prüfen
$stmt = $conn->prepare("SELECT id FROM brick_sets WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $brickSetId, $_SESSION['user_id']);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows === 0) {
  echo json_encode(["code"=>403,"message"=>"Kein Zugriff auf dieses Set.","uploaded"=>false]);
  exit;
}
$stmt->close();

// 3) Datei validieren & verschieben
$uploaddir = __DIR__ . '/uploads/';
@mkdir($uploaddir,0755,true);

$file = $_FILES['fileToUpload'];
$ext  = strtolower(pathinfo($file['name'],PATHINFO_EXTENSION));
$allowed = ['jpg','jpeg','png','gif'];
if (!in_array($ext,$allowed) || $file['error']!==UPLOAD_ERR_OK || $file['size']>8*1024*1024) {
  $answer['message']="Ungültige Datei.";
  echo json_encode($answer);
  exit;
}

$filename   = uniqid('img_').'.'.$ext;
$targetFile = $uploaddir.$filename;

if (!move_uploaded_file($file['tmp_name'],$targetFile)) {
  $answer['message']="Speichern fehlgeschlagen.";
  echo json_encode($answer);
  exit;
}

// 4) In DB eintragen
$stmt = $conn->prepare("
  INSERT INTO images (brick_set_id, image_path, uploaded_at)
  VALUES (?, ?, NOW())
");
$stmt->bind_param("is", $brickSetId, $filename);
if ($stmt->execute()) {
  $answer = ["code"=>200,"uploaded"=>true,"message"=>"Bild hochgeladen"];
} else {
  unlink($targetFile);
  $answer = ["code"=>500,"uploaded"=>false,"message"=>"DB-Fehler"];
}
$stmt->close();

echo json_encode($answer);
