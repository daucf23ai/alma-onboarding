import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders a starter heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /get started/i })).toBeVisible()
  })

  it('increments the counter', () => {
    render(<App />)
    const [button] = screen.getAllByRole('button', { name: /count is 0/i })
    fireEvent.click(button)
    expect(screen.getAllByRole('button', { name: /count is 1/i }).length).toBeGreaterThan(0)
  })
})
