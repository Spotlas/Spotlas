<?php
require './mariaDB.php';

header('Content-Type: application/json');

$response = ["code" => 400, "message" => "Invalid request"];

if (isset($_GET['name']) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $categoryName = trim($_GET['name']);

    $stmt = $conn->prepare("SELECT id FROM Categories WHERE name = ? LIMIT 1");
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
else if (isset($_GET['id']) && is_numeric($_GET['id']) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $categoryId = intval($_GET['id']);

    $stmt = $conn->prepare("SELECT name FROM Categories WHERE id = ? LIMIT 1");
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
