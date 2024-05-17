import type { SVGProps } from 'react';

const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='1'
    viewBox='0 0 24 24'
    {...props}
  >
    <path stroke='none' d='M0 0h24v24H0z' />
    <path d='M4 6h16M4 12h16M4 18h16' />
  </svg>
);

export default MenuIcon;
