import API_BASE_URL from "../config/api-config";

export async function unbanUserByReasonAsync(email: string) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/users/unban`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({email}),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message
        throw new Error(message);
    }

    return;
}