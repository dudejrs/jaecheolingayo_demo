'use client';

import React, { useState } from 'react';

interface ToggleProps {
  className : string
  callback? : () => void
}

export default function Toggle({
  className= '',
  callback = () => {}
} : ToggleProps){

  const [isOn, setIsOn] = useState<boolean>(false);

  const handleToggle = () => {
    setIsOn(prev => !prev);
    callback()
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-4 py-2 rounded-full cursor-pointer transition duration-300 ${
        isOn ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
      } ${className}`}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
};

