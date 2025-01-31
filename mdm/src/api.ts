export async function fetchApiSecret(
  email: string,
  secretName: string,
  jwtToken: string
): Promise<string> {
  try {
    const response = await fetch('http://127.0.0.1:5000/get-secret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}` // Secure authentication
      },
      body: JSON.stringify({ email, secretName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch secret: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.secret) {
      throw new Error('Invalid response: Secret not found');
    }

    // Securely handle and sanitize the secret
    const sanitizedSecret = data.secret.replace(/[^a-zA-Z0-9-_]/g, '');

    return sanitizedSecret;
  } catch (error) {
    console.error('Error fetching secret:', error);
    throw new Error('Failed to fetch secret');
  }
}