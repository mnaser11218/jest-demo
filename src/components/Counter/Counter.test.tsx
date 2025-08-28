import { Counter } from "./Counter";
import { render, screen } from "@testing-library/react";

describe("Counter Component", () => {
    beforeEach(() => {
        render(<Counter description="Counter 1" defaultCount={0} />);
    });


    it("renders description and default count", () => {
        expect(screen.getByText(/counter 1/i)).toBeInTheDocument();
        expect(screen.getByText("Current Count: 0")).toBeInTheDocument();
    });

    describe("Counter Increment Button", () => {
        beforeEach(() => {
            const incrementButton = screen.getByLabelText("Add to Counter");
            incrementButton.click();
        })
        it("test increment button", () => {
            expect(screen.getByText("Current Count: 1")).toBeInTheDocument();
        });
    })

    describe("Counter Decrement Button", () => {
        beforeEach(() => {
            const decrementButton = screen.getByLabelText("Subtract from Counter");
            decrementButton.click();
        })
        it("test decrement button", () => {
            expect(screen.getByText("Current Count: -1")).toBeInTheDocument();
        });

    })
})



