import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App'

describe('App', () => {
  afterEach(() => cleanup())

  it('renders the Flow 1 heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /create → configure → publish/i })).toBeVisible()
  })

  it('can preview from configure step', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /next: configure/i }))
    fireEvent.click(screen.getByRole('button', { name: /preview/i }))

    expect(openSpy).toHaveBeenCalledOnce()
    expect(String(openSpy.mock.calls[0]?.[0] ?? '')).toMatch(/\?p=/)
  })

  it('can publish and shows a live URL', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /next: configure/i }))
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'My draft' } })
    fireEvent.click(screen.getByRole('button', { name: /publish/i }))

    expect(screen.getByRole('heading', { name: /published/i })).toBeVisible()
    const urlInput = screen.getByLabelText(/live url/i) as HTMLInputElement
    expect(urlInput.value).toMatch(/\?p=/)
  })

  it('can open a published URL and edit it in the wizard', () => {
    const state = { v: 1, templateId: 'landing' as const, name: 'Acme', accent: 'emerald' as const }
    const raw = btoa(unescape(encodeURIComponent(JSON.stringify(state))))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll('=', '')
    window.history.replaceState({}, '', `/?p=${raw}`)

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /edit & republish/i }))

    expect(screen.getByRole('heading', { level: 2, name: 'Configure' })).toBeVisible()
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    expect(nameInput.value).toBe('Acme')
    expect((screen.getByLabelText(/accent/i) as HTMLSelectElement).value).toBe('emerald')
  })

  it('renders the landing template when opened from a publish URL', () => {
    const state = { v: 1, templateId: 'landing' as const, name: 'Acme', accent: 'indigo' as const }
    const raw = btoa(unescape(encodeURIComponent(JSON.stringify(state))))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll('=', '')
    window.history.replaceState({}, '', `/?p=${raw}`)

    render(<App />)
    expect(screen.getByRole('heading', { name: /ship a live product experience in minutes/i })).toBeVisible()
    expect(screen.getByText(/acme/i)).toBeVisible()
  })

  it('can capture feedback on a published URL', () => {
    const state = { v: 1, templateId: 'landing' as const, name: 'Acme', accent: 'indigo' as const }
    const raw = btoa(unescape(encodeURIComponent(JSON.stringify(state))))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll('=', '')
    window.history.replaceState({}, '', `/?p=${raw}`)

    render(<App />)
    fireEvent.change(screen.getByLabelText(/your feedback/i), { target: { value: 'Make the CTA clearer' } })
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }))

    expect(screen.getByText(/1 received/i)).toBeVisible()
    expect(screen.getByText(/make the cta clearer/i)).toBeVisible()
  })
})
