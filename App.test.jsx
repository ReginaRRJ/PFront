// src/__tests__/App.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mocks para Login y Dashboard, para aislar test
jest.mock('../pages/login.jsx', () => () => <div>Login Page</div>);
jest.mock('../pages/dashboard.jsx', () => () => <div>Dashboard Page</div>);

describe('App component routing', () => {
  test('renders Login component on default "/" route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  test('renders Dashboard component on "/dashboard" route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Dashboard Page/i)).toBeInTheDocument();
  });

  test('redirect unknown routes to "/"', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });
});
