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
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$address = isset($_POST['address']) ? trim($_POST['address']) : '';
$city = isset($_POST['city']) ? trim($_POST['city']) : '';
$postalCode = isset($_POST['postalCode']) ? trim($_POST['postalCode']) : '';
$notes = isset($_POST['notes']) ? trim($_POST['notes']) : '';
$cartData = isset($_POST['cartData']) ? $_POST['cartData'] : '';

// Validate required fields
$requiredFields = [$firstName, $lastName, $email, $phone, $address, $city, $postalCode];
foreach ($requiredFields as $field) {
    if (empty($field)) {
        http_response_code(400);
        echo json_encode(['error' => 'All required fields must be filled']);
        exit;
    }
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Validate cart data
$cart = json_decode($cartData, true);
if (!$cart || empty($cart)) {
    http_response_code(400);
    echo json_encode(['error' => 'Cart is empty']);
    exit;
}

// Sanitize data
$firstName = htmlspecialchars($firstName);
$lastName = htmlspecialchars($lastName);
$email = htmlspecialchars($email);
$phone = htmlspecialchars($phone);
$address = htmlspecialchars($address);
$city = htmlspecialchars($city);
$postalCode = htmlspecialchars($postalCode);
$notes = htmlspecialchars($notes);

// Generate order ID
$orderId = 'ORD-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));

// Calculate totals
$subtotal = 0;
$orderItems = '';

foreach ($cart as $item) {
    $itemPrice = isset($item['discountPrice']) ? $item['discountPrice'] : $item['price'];
    $itemTotal = $itemPrice * $item['quantity'];
    $subtotal += $itemTotal;
    
    $orderItems .= "
        <tr>
            <td>{$item['title']}</td>
            <td>{$item['quantity']}</td>
            <td>{$itemPrice} DH</td>
            <td>{$itemTotal} DH</td>
        </tr>
    ";
}

$tax = $subtotal * 0.1;
$total = $subtotal + $tax;

// Email configuration
$to = 'spprtidrissi@gmail.com';
$customerEmail = $email;
$subject = 'New Order: ' . $orderId;

// Admin email
$adminHeaders = [
    'From: noreply@idrissi.com',
    'Reply-To: ' . $customerEmail,
    'Content-Type: text/html; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
];

$adminEmailBody = "
<html>
<head>
    <title>New Order Received</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { background-color: #c1ff72; color: #000; padding: 20px; text-align: center; }
        .info { background-color: #f9f9f9; padding: 15px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class='header'>
        <h1>New Order Received</h1>
        <h2>Order ID: {$orderId}</h2>
    </div>
    
    <div class='info'>
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> {$firstName} {$lastName}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Address:</strong> {$address}, {$city}, {$postalCode}</p>
        " . (!empty($notes) ? "<p><strong>Notes:</strong> {$notes}</p>" : "") . "
    </div>
    
    <h3>Order Items</h3>
    <table>
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
        </tr>
        {$orderItems}
        <tr>
            <td colspan='3'><strong>Subtotal</strong></td>
            <td><strong>{$subtotal} DH</strong></td>
        </tr>
        <tr>
            <td colspan='3'><strong>Tax (10%)</strong></td>
            <td><strong>{$tax} DH</strong></td>
        </tr>
        <tr style='background-color: #c1ff72;'>
            <td colspan='3'><strong>Total</strong></td>
            <td><strong>{$total} DH</strong></td>
        </tr>
    </table>
    
    <div class='info'>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
        <p><strong>Order Date:</strong> " . date('Y-m-d H:i:s') . "</p>
    </div>
</body>
</html>
";

// Customer confirmation email
$customerHeaders = [
    'From: spprtidrissi@gmail.com',
    'Reply-To: spprtidrissi@gmail.com',
    'Content-Type: text/html; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
];

$customerEmailBody = "
<html>
<head>
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { background-color: #c1ff72; color: #000; padding: 20px; text-align: center; }
        .info { background-color: #f9f9f9; padding: 15px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class='header'>
        <h1>Order Confirmation</h1>
        <h2>Thank you for your order!</h2>
    </div>
    
    <p>Dear {$firstName} {$lastName},</p>
    <p>Thank you for your order. We have received your order and will contact you soon to confirm the details.</p>
    
    <div class='info'>
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> {$orderId}</p>
        <p><strong>Order Date:</strong> " . date('Y-m-d H:i:s') . "</p>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
    </div>
    
    <h3>Order Items</h3>
    <table>
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
        </tr>
        {$orderItems}
        <tr>
            <td colspan='3'><strong>Subtotal</strong></td>
            <td><strong>{$subtotal} DH</strong></td>
        </tr>
        <tr>
            <td colspan='3'><strong>Tax (10%)</strong></td>
            <td><strong>{$tax} DH</strong></td>
        </tr>
        <tr style='background-color: #c1ff72;'>
            <td colspan='3'><strong>Total</strong></td>
            <td><strong>{$total} DH</strong></td>
        </tr>
    </table>
    
    <div class='info'>
        <h3>Shipping Address</h3>
        <p>{$firstName} {$lastName}</p>
        <p>{$address}</p>
        <p>{$city}, {$postalCode}</p>
        <p>Phone: {$phone}</p>
    </div>
    
    <div class='info'>
        <h3>What happens next?</h3>
        <ul>
            <li>We'll call you within 24 hours to confirm your order</li>
            <li>Your order will be prepared and packaged</li>
            <li>We'll deliver to your address within 2-3 business days</li>
            <li>Pay cash when you receive your order</li>
        </ul>
    </div>
    
    <p>If you have any questions, please contact us at +212 770 264 606 or spprtidrissi@gmail.com</p>
    
    <p>Best regards,<br>Idrissi Team</p>
</body>
</html>
";

// Send emails
$adminEmailSent = mail($to, $subject, $adminEmailBody, implode("\r\n", $adminHeaders));
$customerEmailSent = mail($customerEmail, 'Order Confirmation - ' . $orderId, $customerEmailBody, implode("\r\n", $customerHeaders));

// Save order to file (you can replace this with database storage)
$orderData = [
    'orderId' => $orderId,
    'customer' => [
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
        'phone' => $phone,
        'address' => $address,
        'city' => $city,
        'postalCode' => $postalCode,
        'notes' => $notes
    ],
    'items' => $cart,
    'totals' => [
        'subtotal' => $subtotal,
        'tax' => $tax,
        'total' => $total
    ],
    'paymentMethod' => 'Cash on Delivery',
    'status' => 'pending',
    'orderDate' => date('Y-m-d H:i:s')
];

$orderJson = json_encode($orderData, JSON_PRETTY_PRINT);
file_put_contents('orders/' . $orderId . '.json', $orderJson);

// Log the order
$logEntry = date('Y-m-d H:i:s') . " - New order: {$orderId} from {$firstName} {$lastName} ({$email}) - Total: {$total} DH\n";
file_put_contents('order_log.txt', $logEntry, FILE_APPEND | LOCK_EX);

if ($adminEmailSent) {
    echo json_encode([
        'success' => true, 
        'message' => 'Order placed successfully',
        'orderId' => $orderId,
        'customerEmailSent' => $customerEmailSent
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to process order. Please try again later.']);
}
?>