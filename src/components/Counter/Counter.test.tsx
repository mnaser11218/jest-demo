import { Counter } from "./Counter";
import { render, screen } from "@testing-library/react";
it("renders correctly", () => {
    render(<Counter description="Counter 1" defaultCount={0} />);
    expect(screen.getByText("Current Count: 0")).toBeInTheDocument();
    expect(screen.getByText(/my counter/i)).toBeInTheDocument();
});
it("test increment button", () => {
    render(<Counter description="Counter 1" defaultCount={0} />);
    expect(screen.getByText("DESC: Counter 1 - DC: 0")).toBeInTheDocument();
    expect(screen.getByText("Current Count: 0")).toBeInTheDocument();

    const incrementButton = screen.getByLabelText("Add to Counter");
    incrementButton.click();

    expect(screen.getByText("Current Count: 1")).toBeInTheDocument();
});

it("test decrement button", () => {
    render(<Counter description="Counter 1" defaultCount={0} />);
    expect(screen.getByText("DESC: Counter 1 - DC: 0")).toBeInTheDocument();
    expect(screen.getByText("Current Count: 0")).toBeInTheDocument();

    const decrementButton = screen.getByLabelText("Subtract from Counter");
    decrementButton.click();

    expect(screen.getByText("Current Count: -1")).toBeInTheDocument();
});