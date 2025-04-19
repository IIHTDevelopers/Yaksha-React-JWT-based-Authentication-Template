import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAuth } from '../../context/AuthContext';
import Dashboard from '../../components/Dashboard';
import '@testing-library/jest-dom/extend-expect';

// Mock useAuth hook
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        authState: {
            username: 'testuser',
        },
    }),
}));

describe('boundary', () => {
    test('DashboardComponent boundary renders the dashboard correctly', () => {
        render(<Dashboard />);
        expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('DashboardComponent boundary displays the correct username', () => {
        render(<Dashboard />);
        expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument();
    });

    test('DashboardComponent boundary renders the LogoutButton component', () => {
        render(<Dashboard />);
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });
});
