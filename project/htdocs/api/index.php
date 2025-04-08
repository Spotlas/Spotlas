<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spotlas</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Welcome to Spotlas</h1>
    </header>

    <?php
    // Mariadb DATABASE
    require 'mariadb.php';

    // ****************************************   //
    // API ROUTEN TESTEN AM BESTEN MIT POSTMAN   //
    // **************************************** //

    
    // test route
    $sql = "SELECT * FROM Users";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            echo "<div class='card'>";
            echo "<h2>" . $row["full_name"] . "</h2>";
            echo "<p>" . $row["email"] . "</p>";
            echo "<p>" . $row["phone_number"] . "</p>";
            echo "</div>";
        }
    } else {
        echo "0 results";
    }
    

    ?>
</body>
</html>