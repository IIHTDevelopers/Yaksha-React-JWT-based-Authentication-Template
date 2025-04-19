import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockBackendAuth } from '../../services/authService';
import LoginForm from '../../components/LoginForm';
import '@testing-library/jest-dom/extend-expect';

// Mock useAuth hook
const mockLogin = jest.fn();
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
    }),
}));

// Mock mockBackendAuth function
jest.mock('../../services/authService', () => ({
    mockBackendAuth: jest.fn(),
}));

describe('boundary', () => {
    test('LoginFormComponent boundary renders the login form', () => {
        render(<LoginForm history={createMemoryHistory()} />);
        expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    test('LoginFormComponent boundary updates input fields correctly', () => {
        render(<LoginForm history={createMemoryHistory()} />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password');
    });

    test('LoginFormComponent boundary calls handleLogin on form submission', () => {
        mockBackendAuth.mockReturnValue({ success: true, token: 'test-token', username: 'testuser' });
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <LoginForm history={history} />
            </Router>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });

        const loginButton = screen.getByRole('button', { name: 'Login' });
        fireEvent.click(loginButton);

        expect(mockBackendAuth).toHaveBeenCalledWith('testuser', 'password');
        expect(mockLogin).toHaveBeenCalledWith('test-token', 'testuser');
        expect(history.location.pathname).toBe('/dashboard');
    });

    test('LoginFormComponent boundary shows alert on unsuccessful login', () => {
        window.alert = jest.fn(); // Mock window.alert
        mockBackendAuth.mockReturnValue({ success: false });

        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <LoginForm history={history} />
            </Router>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

        const loginButton = screen.getByRole('button', { name: 'Login' });
        fireEvent.click(loginButton);

        expect(mockBackendAuth).toHaveBeenCalledWith('wronguser', 'wrongpassword');
        expect(mockLogin).not.toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
    });
});
