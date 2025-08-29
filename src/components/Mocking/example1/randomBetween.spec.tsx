import { randomBetween } from './randomBetween';

// Here we tell Jest to "spy" on Math.random.
// That means we can control what value it returns and also check how many times it was called.
const randomSpy = jest.spyOn(Math, 'random');

describe('randomBetween', () => {
    describe('when Math.random() returns 0', () => {
        beforeEach(() => {
            // setting Math.random() to 0 ensures the very bottom of the range is chosen, which is always equal to min.
            randomSpy.mockClear().mockReturnValue(0);
        });

        it('called with min=3 and max=5 returns 3', () => {
            expect(randomBetween(3, 5)).toBe(3);
            expect(Math.random).toHaveBeenCalledTimes(1);
        });
    });

    describe('when Math.random() returns 0.5', () => {
        beforeEach(() => {
            randomSpy.mockClear().mockReturnValue(0.5);
        });

        it('called with min=3 and max=5 returns 4', () => {
            expect(randomBetween(3, 5)).toBe(4);
            expect(Math.random).toHaveBeenCalledTimes(1);
        });
    });

    describe('when Math.random() returns 0.999999', () => {
        beforeEach(() => {
            randomSpy.mockClear().mockImplementation(() => 0.999999);
        });

        it('called with min=3 and max=5 returns 5', () => {
            expect(randomBetween(3, 5)).toBe(5);
            expect(Math.random).toHaveBeenCalledTimes(1);
        });
    });
});
