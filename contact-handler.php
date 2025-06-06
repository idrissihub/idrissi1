<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get form data
$firstName = isset($_POST['firstName']) ? trim($_POST['firstName']) : '';
$lastName = isset($_POST['lastName']) ? trim($_POST['lastName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate required fields
if (empty($firstName) || empty($lastName) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Sanitize data
$firstName = htmlspecialchars($firstName);
$lastName = htmlspecialchars($lastName);
$email = htmlspecialchars($email);
$subject = htmlspecialchars($subject);
$message = htmlspecialchars($message);

// Email configuration
$to = 'spprtidrissi@gmail.com';
$emailSubject = 'Contact Form: ' . $subject;
$headers = [
    'From: ' . $email,
    'Reply-To: ' . $email,
    'Content-Type: text/html; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
];

// Email body
$emailBody = "
<html>
<head>
    <title>Contact Form Submission</title>
</head>
<body>
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {$firstName} {$lastName}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Subject:</strong> {$subject}</p>
    <p><strong>Message:</strong></p>
    <p>{$message}</p>
    <hr>
    <p><small>Sent from Idrissi E-commerce website</small></p>
</body>
</html>
";

// Send email
if (mail($to, $emailSubject, $emailBody, implode("\r\n", $headers))) {
    // Log the contact form submission (optional)
    $logEntry = date('Y-m-d H:i:s') . " - Contact form submission from: {$firstName} {$lastName} ({$email})\n";
    file_put_contents('contact_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
    
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send message. Please try again later.']);
}
?>