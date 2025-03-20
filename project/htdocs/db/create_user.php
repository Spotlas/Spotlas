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
        $full_name = $conn->real_escape_string(trim($data["full_name"]));
        $username = $conn->real_escape_string(trim($data["username"]));
        $password = password_hash(trim($data["password"]), PASSWORD_BCRYPT);
        $profile_picture = $conn->real_escape_string(trim($data["profile_picture"]));
        $phone_number = $conn->real_escape_string(trim($data["phone_number"]));
        $description = $conn->real_escape_string(trim($data["description"]));

        // Check if username already exists
        $check_sql = "SELECT id FROM Users WHERE username = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param("s", $username);
        $check_stmt->execute();
        $check_stmt->store_result();

        if ($check_stmt->num_rows > 0) {
            $response["code"] = 409;
            $response["message"] = "Username already exists";
        } else {
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
        }

        $check_stmt->close();
    } else {
        $response["message"] = "Missing required fields";
    }
}

echo json_encode($response);
$conn->close();
?>
