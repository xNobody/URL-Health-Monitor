import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

describe('Dashboard Component Snapshot', () => {
  test('matches the snapshot', () => {
    const { asFragment } = render(<Dashboard />);
    expect(asFragment()).toMatchSnapshot();
  });
});