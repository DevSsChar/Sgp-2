import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Sample component for testing
const Button = ({ onClick, children }) => (
  <button onClick={onClick} data-testid="test-button">
    {children}
  </button>
)

const Counter = () => {
  const [count, setCount] = React.useState(0)
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(count + 1)} data-testid="increment">
        Increment
      </button>
    </div>
  )
}

describe('Component Testing Examples', () => {
  test('renders button with correct text', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByTestId('test-button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })

  test('button click handler is called', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    const button = screen.getByTestId('test-button')
    
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('counter increments when button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<Counter />)
    const countDisplay = screen.getByTestId('count')
    const incrementButton = screen.getByTestId('increment')
    
    expect(countDisplay).toHaveTextContent('0')
    
    await user.click(incrementButton)
    expect(countDisplay).toHaveTextContent('1')
    
    await user.click(incrementButton)
    expect(countDisplay).toHaveTextContent('2')
  })
})
