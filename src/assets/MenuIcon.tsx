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
    <path d='M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6v13M12 6v13M21 6v13' />
  </svg>
);

export default MenuIcon;
