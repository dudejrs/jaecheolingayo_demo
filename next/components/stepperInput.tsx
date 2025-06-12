
"use client";

import { useState, useId } from "react";

interface StepperInputProps {
  className?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export default function StepperInput({
  className="",
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label = "k",
}: StepperInputProps) {
  const inputId = useId();

  const increment = () => {
    if (value + step <= max) onChange(value + step);
  };

  const decrement = () => {
    if (value - step >= min) onChange(value - step);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.min(max, Math.max(min, newValue)));
    }
  };

  return (
    <div className={`flex flex-col space-y-1`}>
      <label htmlFor={inputId} className="text-sm font-medium" hidden>
        {label}
      </label>
      <div className={`flex justify-around items-center rounded-lg overflow-hidden ${className}`}>
        <button
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease"
          className="px-3 py-1 text-lg font-bold cursor-pointer opacity-30 disabled:opacity-0 hover:opacity-100"
        >
          −
        </button>
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={handleInputChange}
          className="text-center w-full outline-none"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
        <button
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase"
          className="px-3 py-1 text-lg font-bold cursor-pointer opacity-30 disabled:opacity-0 hover:opacity-100"
        >
          +
        </button>
      </div>
    </div>
  );
}
