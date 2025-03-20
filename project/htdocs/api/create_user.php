<?php
require './mariaDB.php';  // Verbindung zur Datenbank

header('Content-Type: application/json');

$response = ["code" => 400, "message" => "Invalid request"];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        isset($data["full_name"]) &&
        isset($data["username"]) &&
        isset($data["password"]) &&
        isset($data["profile_picture"]) &&
        isset($data["phone_number"]) &&
        isset($data["description"])
    ) {
        $full_name = $conn->real_escape_string($data["full_name"]);
        $username = $conn->real_escape_string($data["username"]);
        $password = password_hash($conn->real_escape_string($data["password"]), PASSWORD_BCRYPT);
        $profile_picture = $conn->real_escape_string($data["profile_picture"]);
        $phone_number = $conn->real_escape_string($data["phone_number"]);
        $description = $conn->real_escape_string($data["description"]);

        $sql = "INSERT INTO Users (full_name, username, password_hash, profile_picture_url, phone_number, description) 
                VALUES (?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssss", $full_name, $username, $password, $profile_picture, $phone_number, $description);

        if ($stmt->execute()) {
            $response["code"] = 200;
            $response["message"] = "User created successfully";
            $response["user_id"] = $stmt->insert_id;
            $response["full_name"] = $full_name;
            $response["username"] = $username;
        } else {
            $response["code"] = 500;
            $response["message"] = "Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        $response["message"] = "Missing required fields";
    }
}

echo json_encode($response);
$conn->close();
?>
