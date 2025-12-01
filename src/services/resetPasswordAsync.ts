import API_BASE_URL from "../config/api-config";

export async function resetPasswordAsync(token: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token, newPassword}),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message
        throw new Error(message);
    }

    return response.json();
}