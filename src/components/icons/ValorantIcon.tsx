import React from 'react';

export function ValorantIcon({ size = 24, color = 'text-white' }) {
  return (
    <svg
      className={`${color}`}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M3.118 4.236 12.29 15.89c.035.044.004.109-.051.109H7.72a.065.065 0 0 1-.051-.025l-4.654-5.846A.068.068 0 0 1 3 10.087v-5.81c0-.063.079-.09.118-.041Zm7.761 7.684 6.004-7.617c.039-.05.117-.022.117.042v5.775c0 .016-.005.03-.015.043l-1.484 1.841a.066.066 0 0 1-.051.025h-4.52c-.055 0-.086-.066-.051-.11Z"
      ></path>
    </svg>
  );
}
