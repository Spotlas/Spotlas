<?php
require './mariaDB.php';  // Verbindung zur Datenbank

header('Content-Type: application/json');

$response = ["code" => 400, "message" => "Invalid request"];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["username"]) && isset($data["password"])) {
        $username = $conn->real_escape_string(trim($data["username"]));
        $password = trim($data["password"]);

        $sql = "SELECT id, password_hash FROM Users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($user_id, $password_hash);
            $stmt->fetch();

            if (password_verify($password, $password_hash)) {
                $response["code"] = 200;
                $response["message"] = "Login successful";
                $response["user_id"] = $user_id;
            } else {
                $response["code"] = 401;
                $response["message"] = "Invalid password";
            }
        } else {
            $response["code"] = 404;
            $response["message"] = "User not found";
        }

        $stmt->close();
    } else {
        $response["message"] = "Missing required fields";
    }
}

echo json_encode($response);
$conn->close();
?>
