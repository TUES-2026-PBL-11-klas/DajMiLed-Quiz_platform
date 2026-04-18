import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should render primary variant by default', () => {
    const { container } = render(<Button>Primary</Button>)

    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-gradient-to-br')
  })

  it('should render secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)

    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-secondary-container')
  })

  it('should render tertiary variant', () => {
    const { container } = render(<Button variant="tertiary">Tertiary</Button>)

    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-transparent')
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    const button = screen.getByText('Click')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should show loading spinner when isLoading is true', () => {
    const { container } = render(<Button isLoading={true}>Loading</Button>)

    const spinner = container.querySelector('[class*="animate-spin"]')
    expect(spinner).toBeInTheDocument()
  })

  it('should disable button when isLoading is true', () => {
    render(<Button isLoading={true}>Loading</Button>)

    const button = screen.getByText('Loading')
    expect(button).toBeDisabled()
  })

  it('should disable button when disabled prop is true', () => {
    render(<Button disabled={true}>Disabled</Button>)

    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
  })

  it('should not be disabled by default', () => {
    render(<Button>Enabled</Button>)

    const button = screen.getByText('Enabled')
    expect(button).not.toBeDisabled()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Button className="custom-class">Custom</Button>
    )

    const button = container.querySelector('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should accept HTML button attributes', () => {
    render(
      <Button type="submit" name="submit-btn">
        Submit
      </Button>
    )

    const button = screen.getByText('Submit')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('name', 'submit-btn')
  })

  it('should forward ref', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref Button</Button>)

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('should have correct displayName', () => {
    expect(Button.displayName).toBe('Button')
  })

  it('should show loading text with spinner', () => {
    render(<Button isLoading={true}>Loading</Button>)

    expect(screen.getByText('Loading')).toBeInTheDocument()
    const spinner = screen.getByText('Loading').parentElement?.querySelector('[class*="animate-spin"]')
    expect(spinner).toBeInTheDocument()
  })

  it('should not trigger click when disabled', () => {
    const handleClick = jest.fn()
    render(
      <Button disabled={true} onClick={handleClick}>
        Disabled
      </Button>
    )

    const button = screen.getByText('Disabled')
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should support children as ReactNode', () => {
    render(
      <Button>
        <span>Icon</span> Text
      </Button>
    )

    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })

  it('should apply opacity when disabled', () => {
    const { container } = render(<Button disabled={true}>Disabled</Button>)

    const button = container.querySelector('button')
    expect(button).toHaveClass('disabled:opacity-50')
  })

  it('should apply cursor-not-allowed when disabled', () => {
    const { container } = render(<Button disabled={true}>Disabled</Button>)

    const button = container.querySelector('button')
    expect(button).toHaveClass('disabled:cursor-not-allowed')
  })

  it('should have inline-flex display', () => {
    const { container } = render(<Button>Flex Button</Button>)

    const button = container.querySelector('button')
    expect(button).toHaveClass('inline-flex')
  })

  it('should be centered with justify-center', () => {
    const { container } = render(<Button>Centered</Button>)

    const button = container.querySelector('button')
    expect(button).toHaveClass('justify-center')
  })
})
