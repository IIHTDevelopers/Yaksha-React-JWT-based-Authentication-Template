import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../../components/LogoutButton';
import '@testing-library/jest-dom/extend-expect';

// Mock useAuth hook
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        logout: jest.fn(),
    }),
}));

// Mock useHistory hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(),
}));

describe('boundary', () => {
    test('LogoutButtonComponent boundary renders the logout button', () => {
        render(<LogoutButton />);
        const button = screen.getByText('Logout');
        expect(button).toBeInTheDocument();
    });

    test('LogoutButtonComponent boundary redirects to login page on click', () => {
        const mockPush = jest.fn();
        useHistory.mockReturnValue({ push: mockPush });

        render(<LogoutButton />);
        const button = screen.getByText('Logout');
        fireEvent.click(button);
        expect(mockPush).toHaveBeenCalledWith('/');
    });
});
