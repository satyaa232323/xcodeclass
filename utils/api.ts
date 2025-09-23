
const API_BASE_URL = "http://localhost:3000/api";

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: "USER" | "ADMIN";
    }
    message: string;
}

async function apiRequest(
    endpoint: string,
    method: string,
    token?: string,
    body?: any
) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error ${res.status}: ${errorText}`);
    }

    return res.json();
}


// ---------------------- AUTH ----------------------
export const login = (email: string, password: string): Promise<AuthResponse> =>
    apiRequest("/auth/login", "POST", undefined, { email, password });

export const register = (name: string, email: string, password: string): Promise<AuthResponse> =>
    apiRequest("/auth/register", "POST", undefined, { name, email, password });

export const logout = () =>
    apiRequest("/auth/logout", "POST");

export const requestPasswordReset = (email: string) =>
    apiRequest("/auth/forgot-password/request-reset", "POST", undefined, { email });

export const resetPassword = (token: string, email: string, newPassword: string) =>
    apiRequest("/auth/forgot-password", "POST", undefined, { token, email, newPassword });

// ---------------------- CLASSES ----------------------
export const fetchClasses = () => apiRequest("/classes", "GET");

export const fetchClassDetails = (id: string) =>
    apiRequest(`/classes/${id}`, "GET");

export const myClasses = (token: string) =>
    apiRequest("/my-classes", "GET", token);

export const fetchMyClassVideos = (token: string, classId: string) =>
    apiRequest(`/my-classes/videos/${classId}`, "GET", token);

// ---------------------- ORDERS & PAYMENTS ----------------------
export const fetchOrders = (token: string) =>
    apiRequest("/orders", "GET", token);

export const createOrder = (token: string, classId: string) =>
    apiRequest("/orders", "POST", token, { classId });

export const initiatePayment = (token: string, orderId: string) =>
    apiRequest(`/payment/${orderId}`, "POST", token);


export const Userprofile = (token: string) =>
    apiRequest("/me", "GET", token); 

// ---------------------- ADMIN CLASSES ----------------------
export const fetchAllClasses = (token: string) =>
    apiRequest("/admin/classes", "GET", token);

export const createClass = (
    token: string,
    title: string,
    description: string,
    price: number,
    thumbnailUrl: string,
    mentor: string,
    videos: []
) =>
    apiRequest("/admin/classes", "POST", token, {
        title,
        description,
        price,
        thumbnailUrl,
        mentor,
        videos,
    });

export const editClass = (
    token: string,
    id: string,
    title: string,
    description: string,
    price: number,
    thumbnailUrl: string,
    mentor: string,
    videos: []
) =>
    apiRequest(`/admin/classes/${id}`, "PUT", token, {
        title,
        description,
        price,
        thumbnailUrl,
        mentor,
        videos,
    });

export const deleteClass = (token: string, id: string) =>
    apiRequest(`/admin/classes/${id}`, "DELETE", token);

// ---------------------- VIDEOS ----------------------
export const addVideoToClass = (
    token: string,
    classId: string,
    title: string,
    videoUrl: string,
    duration: number
) =>
    apiRequest(`/admin/classes/${classId}/videos`, "POST", token, {
        title,
        videoUrl,
        duration,
    });

export const editVideo = (
    token: string,
    classId: string,
    videoId: string,
    title: string,
    videoUrl: string,
    duration: number
) =>
    apiRequest(`/admin/classes/${classId}/video/${videoId}`, "PUT", token, {
        title,
        videoUrl,
        duration,
    });

export const deleteVideo = (
    token: string,
    classId: string,
    videoId: string
) => apiRequest(`/admin/classes/${classId}/video/${videoId}`, "DELETE", token);