import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import App from '../App';
import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../components/Dashboard';
import LoginForm from '../components/LoginForm';
import '@testing-library/jest-dom/extend-expect';

// Mock components to test PrivateRoute and Dashboard
jest.mock('../components/PrivateRoute', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/LoginForm', () => () => <div>LoginForm Component</div>);
jest.mock('../components/Dashboard', () => () => <div>Dashboard Component</div>);

describe('boundary', () => {

  test('AppComponent boundary Links for login and dashboard are present', () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const loginLinks = screen.getAllByText(/Login/i);
    const dashboardLink = screen.getByText(/Dashboard/i);

    expect(loginLinks.length).toBeGreaterThan(0);
    expect(dashboardLink).toBeInTheDocument();
  });

  test('AppComponent boundary Route /dashboard is wrapped in PrivateRoute', () => {
    render(
      <Router>
        <App />
      </Router>
    );

    // Simulate navigation to /dashboard
    render(
      <Router>
        <PrivateRoute path="/dashboard" component={Dashboard} />
      </Router>
    );

    const dashboardComponent = screen.getByText(/Dashboard/i);
    expect(dashboardComponent).toBeInTheDocument();
  });

  test('AppComponent boundary Routes for / and /dashboard are present', () => {
    render(<App />);

    const loginComponent = screen.getByText(/LoginForm/i);
    expect(loginComponent).toBeInTheDocument();

    // Manually mock navigation to /dashboard
    const dashboardComponent = screen.getByText(/Dashboard/i);
    expect(dashboardComponent).toBeInTheDocument();
  });

  test('AppComponent boundary Links for login and dashboard are present', () => {
    const testRenderer = TestRenderer.create(<App />);
    const testInstance = testRenderer.root;

    const loginLinks = testInstance.findAllByType('a').filter(node => node.children.includes('Login'));
    const dashboardLink = testInstance.findAllByType('a').filter(node => node.children.includes('Dashboard'));

    expect(loginLinks.length).toBeGreaterThan(0);
    expect(dashboardLink.length).toBeGreaterThan(0);
  });
});
