import React, { useEffect, useState } from 'react';

export interface CounterProps {
    description: string;
    defaultCount: number;
}

export function Counter({ description, defaultCount }: CounterProps) {
    const [count, setCount] = useState(defaultCount);
    const [incrementor, setIncrementor] = useState(1);
    const [bigEnough, setBigEnough] = useState(defaultCount >= 10);
    useEffect(() => {
        let id: NodeJS.Timeout;
        if (count >= 5) {
            id = setTimeout(() => setBigEnough(true), 300);
        }
        return () => clearTimeout(id);
    });
    return (
        <div>
            <h2>
                DESC: {description} - DC: {defaultCount}
            </h2>
            <label>
                Incrementor:
                <input
                    value={incrementor}
                    onChange={(evt) => {
                        setIncrementor(parseInt(evt.target.value) || 1)
                    }}
                    type="number"
                />
            </label>
            <button
                aria-label="Subtract from Counter"
                onClick={() => setCount(count - incrementor)}
            >
                -
            </button>
            Current Count: {count}
            <button
                aria-label="Add to Counter"
                onClick={() => setTimeout(() => setCount(count + incrementor), 200)}
            >
                +
            </button>
            {bigEnough ? null : <div>I am too small</div>}
        </div>
    );
}