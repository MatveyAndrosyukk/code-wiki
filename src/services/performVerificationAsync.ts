import API_BASE_URL from "../config/api-config";

export async function performVerificationAsync(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`, {
        method: 'GET',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || 'Registration failed';
        throw new Error(message);
    }
}