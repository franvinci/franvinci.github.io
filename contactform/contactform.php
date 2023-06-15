<?php
  $name = $_POST['name'];
  $email = $_POST['email'];
  $subject = $_POST['subject'];
  $message = $_POST['message'];

  // Set up the email
  $to = 'vincifrancesco101@gmail.com';
  $headers = "From: $email\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "Content-Type: text/html\r\n";
  $body = "Name: $name<br>Email: $email<br>Subject: $subject<br>Message: $message";

  // Send the email
  $success = mail($to, $subject, $body, $headers);

  if ($success) {
    echo 'OK'; // Sending successful
  } else {
    echo 'Error sending email.'; // Sending failed
  }
?>
