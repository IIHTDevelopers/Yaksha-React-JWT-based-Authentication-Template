import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import '@testing-library/jest-dom/extend-expect';

describe('boundary', () => {
    const TestComponent = () => {
        const { authState, login, logout } = useAuth();
        return (
            <div>
                <div data-testid="auth-state">{JSON.stringify(authState)}</div>
                <button onClick={() => login('test-token', 'test-user')}>Login</button>
                <button onClick={logout}>Logout</button>
            </div>
        );
    };

    test('AuthProviderComponent boundary Initial authentication state is correct', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const authState = screen.getByTestId('auth-state');
        expect(authState).toHaveTextContent('{"isAuthenticated":false,"token":null,"username":null}');
    });

    test('AuthProviderComponent boundary Authentication state updates on login', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const loginButton = screen.getByText('Login');
        loginButton.click();

        const authState = screen.getByTestId('auth-state');
        expect(authState).toHaveTextContent('{"isAuthenticated":true,"token":"test-token","username":"test-user"}');
    });

    test('AuthProviderComponent boundary Authentication state updates on logout', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const loginButton = screen.getByText('Login');
        loginButton.click();

        const logoutButton = screen.getByText('Logout');
        logoutButton.click();

        const authState = screen.getByTestId('auth-state');
        expect(authState).toHaveTextContent('{"isAuthenticated":false,"token":null,"username":null}');
    });

    test('AuthProviderComponent boundary Authentication state updates based on token in localStorage', async () => {
        localStorage.setItem('token', 'test-token');

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const authState = await waitFor(() => screen.getByTestId('auth-state'));
        expect(authState).toHaveTextContent('{"isAuthenticated":true,"token":"test-token","username":"user"}');

        // Clean up
        localStorage.removeItem('token');
    });
});
