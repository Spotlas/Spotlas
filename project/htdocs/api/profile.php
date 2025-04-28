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
    
    // Begin transaction for atomicity
    $conn->begin_transaction();
    
    try {
        // 1. Delete user's comments
        $stmtDelComments = $conn->prepare("DELETE FROM Comments WHERE user_id = ?");
        $stmtDelComments->bind_param("i", $delId);
        $stmtDelComments->execute();
        $stmtDelComments->close();
        
        // 2. Delete user's ratings
        $stmtDelRatings = $conn->prepare("DELETE FROM Ratings WHERE user_id = ?");
        $stmtDelRatings->bind_param("i", $delId);
        $stmtDelRatings->execute();
        $stmtDelRatings->close();
        
        // 3. Delete user's favorites
        $stmtDelFavorites = $conn->prepare("DELETE FROM Favorites WHERE user_id = ?");
        $stmtDelFavorites->bind_param("i", $delId);
        $stmtDelFavorites->execute();
        $stmtDelFavorites->close();
        
        // 4. For locations: DON'T delete them, but update status or mark as anonymous
        $stmtUpdateLocations = $conn->prepare("UPDATE Locations SET created_by = NULL WHERE created_by = ?");
        $stmtUpdateLocations->bind_param("i", $delId);
        $stmtUpdateLocations->execute();
        $stmtUpdateLocations->close();
        
        // 5. Finally, delete the user
        $stmtDelUser = $conn->prepare("DELETE FROM Users WHERE id = ?");
        $stmtDelUser->bind_param("i", $delId);
        $stmtDelUser->execute();
        
        // Check if user was actually deleted
        if ($stmtDelUser->affected_rows > 0) {
            // Commit transaction
            $conn->commit();
            
            // Clear session if the deleted user is the current user
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            if (isset($_SESSION['user_id']) && $_SESSION['user_id'] === $delId) {
                // Clear session
                $_SESSION = [];
                session_destroy();
            }
            
            $response = [
                "code"    => 200,
                "message" => "Account and related data deleted successfully. Locations have been preserved."
            ];
        } else {
            // Rollback if user wasn't found
            $conn->rollback();
            $response = [
                "code"    => 404,
                "message" => "User account not found"
            ];
        }
        
        $stmtDelUser->close();
    } catch (Exception $e) {
        // Rollback on any error
        $conn->rollback();
        $response = [
            "code"    => 500,
            "message" => "Error deleting account: " . $e->getMessage()
        ];
    }
    
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
