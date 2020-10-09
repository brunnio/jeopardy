import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import JeopardyGame from './App';

describe('Jeopardy', () => {
  test('renders Loading', () => {
    render(<JeopardyGame />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
})

// TODO: ADD MORE TESTS