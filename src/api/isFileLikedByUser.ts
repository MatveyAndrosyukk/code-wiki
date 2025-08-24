import API_BASE_URL from "../config/api-config";

interface IsFileLikedPayload {
    id: number;
    email: string;
}

export async function isFileLikedByUser(dto: IsFileLikedPayload): Promise<boolean> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/files/isLiked?id=${dto.id}&email=${dto.email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
}