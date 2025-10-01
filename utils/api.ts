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
    apiRequest(`/orders/${classId}`, "POST", token);

export const initiatePayment = (token: string, orderId: string) =>
    apiRequest(`/payment/${orderId}`, "POST", token);



export const Userprofile = (token: string) =>
    apiRequest("/me", "GET", token);

// ---------------------- ADMIN CLASSES ----------------------

// Fetch all classes
export const fetchAllClasses = async (token: string) => {
    const response = await apiRequest("/admin/classes", "GET", token);
    return response;
};

// Create new class

export const createClass = async (
    token: string,
    data: ClassData
) => {
    const response = await apiRequest("/admin/classes", "POST", token, data);
    return response;
}

// Get single class details
export const getClassDetails = async (token: string, id: string) => {
    const response = await apiRequest(`/admin/classes/${id}`, "GET", token);
    return response;
};

// Update class
export const updateClass = async (
    token: string,
    id: string,
    data: ClassData
) => {
    const response = await apiRequest(`/admin/classes/${id}`, "PATCH", token, data);
    return response;
};



// Delete class
export const deleteClass = async (
    token: string,
    id: string,
) => {
    const response = await apiRequest(`/admin/classes/${id}`, "DELETE", token);
    return response;
};



// Handle image uploads to Cloudinary
export const uploadImageToCloudinary = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Image upload failed');
    }

    return response.json();
};

// Handle video uploads to Cloudinary with chunking and progress tracking
export const uploadVideoToCloudinary = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        console.log('Starting video upload:', { fileName: file.name, fileSize: file.size });

        const response = await fetch(`${API_BASE_URL}/upload/video`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await response.json();
        console.log('Video upload response:', result);

        if (!response.ok) {
            console.error('Video upload failed with status:', response.status);
            throw new Error(result.error || 'Video upload failed');
        }

        if (!result.secure_url) {
            console.error('Missing secure_url in response:', result);
            throw new Error('No secure URL received from video upload');
        }

        return {
            secure_url: result.secure_url,
            thumbnail_url: result.thumbnail_url || result.secure_url,
            duration: result.duration || 0
        };
    } catch (error) {
        console.error('Video upload error:', error);
        throw error;
    }
};


export const fetchAllOrders = (token: string) =>
    apiRequest("/admin/show-order", "GET", token);


