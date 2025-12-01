import API_BASE_URL from "../config/api-config";

export async function sendResetPasswordLinkAsync(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
    })

    if (!response.ok) {
        throw new Error('Email address doesn\'t exist');
    }

    return response.json();
}