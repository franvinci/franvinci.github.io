<?php
// Get the form fields
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

// Create the email content
$email_content = "Name: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Subject: $subject\n";
$email_content .= "Message:\n$message\n";

// Send the email
$to = 'fvinci@math.unipd.it'; // Change this to your email address
$subject = 'New Contact Form Submission';
$headers = "From: $email\n";
$headers .= "Reply-To: $email\n";
mail($to, $subject, $email_content, $headers);

// Return success response
echo 'OK';
?>
