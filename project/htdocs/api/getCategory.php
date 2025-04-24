<?php
require './mariaDB.php';

header('Content-Type: application/json');

$response = ["code" => 400, "message" => "Invalid request"];

// Name -> ID
if (isset($_GET['name']) && !empty($_GET['name'])) {
    $categoryName = $conn->real_escape_string($_GET['name']);
    $sql = "SELECT id FROM Categories WHERE name = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $categoryName);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response = ["code" => 200, "category_id" => $row['id']];
    } else {
        $response = ["code" => 404, "message" => "Category not found by name"];
    }
    $stmt->close();
}
// ID -> Name
else if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $categoryId = intval($_GET['id']);
    $sql = "SELECT name FROM Categories WHERE id = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $categoryId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response = ["code" => 200, "name" => $row['name']];
    } else {
        $response = ["code" => 404, "message" => "Category not found by ID"];
    }
    $stmt->close();
}

echo json_encode($response);
$conn->close();
?>
