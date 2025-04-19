export const mockBackendAuth = (username, password) => {
    // Mock validation of credentials (username/password)
    if (username === 'user' && password === 'password123') {
        // Mock JWT token (in real scenarios, this would be a signed token)
        const token = `JWT-${username}-sample-token`;
        return {
            success: true,
            token,
            username
        };
    } else {
        return { success: false, message: "Invalid credentials" };
    }
};
