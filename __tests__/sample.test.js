import { render, screen } from '@testing-library/react'

// Sample test to verify Jest setup
describe('Jest Setup', () => {
  test('renders a simple div', () => {
    render(<div data-testid="test-div">Hello Jest!</div>)
    const element = screen.getByTestId('test-div')
    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent('Hello Jest!')
  })

  test('basic math works', () => {
    expect(2 + 2).toBe(4)
  })
})
