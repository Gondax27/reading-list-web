import { useState } from 'react';

const useSidebar = () => {
  const [show, setShow] = useState(false);
  const [sidebarType, setSidebarType] = useState('');

  return {
    show,
    sidebarType,
    setShow,
    setSidebarType
  };
};

export default useSidebar;
