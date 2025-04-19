import React from 'react';
import { MemoryRouter, Route, Redirect } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { useAuth } from '../../context/AuthContext';
import PrivateRoute from '../../components/PrivateRoute';
import '@testing-library/jest-dom/extend-expect';

// Mock the useAuth hook
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        authState: {
            isAuthenticated: true,
            token: 'test-token',
            username: 'test-user',
        },
    }),
}));

const TestComponent = () => <div>Private Component</div>;

describe('boundary', () => {
    test('PrivateRouteComponent boundary renders component when user is authenticated', () => {
        render(
            <MemoryRouter initialEntries={['/private']}>
                <PrivateRoute path="/private" component={TestComponent} />
            </MemoryRouter>
        );

        expect(screen.getByText('Private Component')).toBeInTheDocument();
    });

    test('PrivateRouteComponent boundary redirects to login when user is not authenticated', () => {
        // Mock the useAuth hook for unauthenticated state
        jest.mock('../../context/AuthContext', () => ({
            useAuth: () => ({
                authState: {
                    isAuthenticated: false,
                    token: null,
                    username: null,
                },
            }),
        }));

        render(
            <MemoryRouter initialEntries={['/private']}>
                <PrivateRoute path="/private" component={TestComponent} />
                <Route path="/" render={() => <div>Login Page</div>} />
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
});
