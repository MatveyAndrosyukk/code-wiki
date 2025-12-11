import API_BASE_URL from "../config/api-config";

export async function performGoogleLoginAsync(code: string) {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({code}),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || 'Google login failed';

        if (message.includes('banned')) {
            throw new Error('This email address is banned');
        }

        throw new Error(message);
    }

    return response.json();
}