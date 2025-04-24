<?php
require './mariaDB.php';

header('Content-Type: application/json');

$response = [
    "code"     => 404,
    "profile"  => null,
    "locations"=> []
];

// Account löschen
if (
    isset($_GET['action'], $_GET['userId']) &&
    $_GET['action'] === 'delete' &&
    is_numeric($_GET['userId']) &&
    $_SERVER['REQUEST_METHOD'] === 'POST'
) {
    $delId = intval($_GET['userId']);

    $stmtDel = $conn->prepare("DELETE FROM Users WHERE id = ?");
    $stmtDel->bind_param("i", $delId);
    if ($stmtDel->execute()) {
        $response = [
            "code"    => 200,
            "message" => "Account deleted successfully"
        ];
    } else {
        $response = [
            "code"    => 500,
            "message" => "Error deleting account: " . $stmtDel->error
        ];
    }
    $stmtDel->close();
    echo json_encode($response);
    $conn->close();
    exit;
}

// Nutzerprofil per Username abrufen
if (isset($_GET['username']) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $uname = trim($_GET['username']);

    $stmtProf = $conn->prepare("SELECT * FROM Users WHERE username = ? LIMIT 1");
    $stmtProf->bind_param("s", $uname);
    $stmtProf->execute();
    $resProf = $stmtProf->get_result();

    if ($resProf && $resProf->num_rows > 0) {
        $user = $resProf->fetch_assoc();
        $response['profile'] = $user;
        $response['code']    = 200;

        $stmtLoc = $conn->prepare("SELECT * FROM Locations WHERE created_by = ?");
        $stmtLoc->bind_param("i", $user['id']);
        $stmtLoc->execute();
        $resLoc = $stmtLoc->get_result();
        while ($row = $resLoc->fetch_assoc()) {
            $response['locations'][] = $row;
        }
        $stmtLoc->close();
    } else {
        $response = [
            "code"    => 404,
            "message" => "User not found"
        ];
    }
    $stmtProf->close();
    echo json_encode($response);
    $conn->close();
    exit;
}

// Nutzerprofil per userId abrufen
if (isset($_GET['userId']) && is_numeric($_GET['userId']) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = intval($_GET['userId']);

    $stmtProf = $conn->prepare("SELECT * FROM Users WHERE id = ? LIMIT 1");
    $stmtProf->bind_param("i", $userId);
    $stmtProf->execute();
    $resProf = $stmtProf->get_result();

    if ($resProf && $resProf->num_rows > 0) {
        $response['profile'] = $resProf->fetch_assoc();
        $response['code']    = 200;
    }
    $stmtProf->close();

    $stmtLoc = $conn->prepare("SELECT * FROM Locations WHERE created_by = ?");
    $stmtLoc->bind_param("i", $userId);
    $stmtLoc->execute();
    $resLoc = $stmtLoc->get_result();
    while ($row = $resLoc->fetch_assoc()) {
        $response['locations'][] = $row;
        $response['code']        = 200;
    }
    $stmtLoc->close();

    echo json_encode($response);
    $conn->close();
    exit;
}

// Falls keine Bedingung passt
echo json_encode($response);
$conn->close();
exit;
?>
