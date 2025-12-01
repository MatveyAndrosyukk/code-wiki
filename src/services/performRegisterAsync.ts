import API_BASE_URL from "../config/api-config";

interface RegisterResponse {
    token: string;
}

export async function performRegisterAsync(email: string, password: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || 'Registration failed';
        throw new Error(message);
    }

    return response.json();
}