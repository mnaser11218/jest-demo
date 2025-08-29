import { Counter } from "./Counter";
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import user from "@testing-library/user-event";
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
            fireEvent.click(screen.getByRole('button', { name: 'Add to Counter' }));
        })
        it("test increment button", async () => {
            await waitFor(() => expect(screen.getByText("Current Count: 1")).toBeInTheDocument());
        });
    })

    describe("Counter Decrement Button", () => {
        beforeEach(() => {
            fireEvent.click(screen.getByLabelText("Subtract from Counter"));
        })
        it("test decrement button", () => {
            expect(screen.getByText("Current Count: -1")).toBeInTheDocument();
        });
    })

    describe("Counter Incrementor Input By 7", () => {
        beforeEach(async () => {
            user.clear(screen.getByLabelText(/incrementor/i));
            user.type(screen.getByLabelText(/incrementor/i), "7");
            user.click(screen.getByRole('button', { name: 'Add to Counter' }))
            await waitFor(() => screen.getByText("Current Count: 7"))
        })
        it("test incrementor input", () => {
            expect(screen.getByText("Current Count: 7")).toBeInTheDocument()
        });

    })

    describe("Counter Incrementor Input By 5", () => {
        beforeEach(async () => {
            user.clear(screen.getByLabelText(/incrementor/i));
            user.type(screen.getByLabelText(/incrementor/i), "5");
            user.click(screen.getByRole('button', { name: 'Add to Counter' }))

            await waitFor(() => screen.getByText("Current Count: 5"))
        })
        it("test incrementor input", () => {
            expect(screen.getByText("Current Count: 5")).toBeInTheDocument()
        })

        it("test 'i am too small' removed", async () => {
            await waitForElementToBeRemoved(() => screen.queryByText(/I am too small/i));
        })
        it("test incrementor click", async () => {
            user.click(screen.getByRole('button', { name: 'Add to Counter' }))
            await waitFor(() => expect(screen.getByText("Current Count: 10")).toBeInTheDocument())
        })
    })


});
