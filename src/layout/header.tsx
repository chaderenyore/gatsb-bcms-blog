import { Link } from 'gatsby';
import React, { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="header">
      <ul>
        <li><Link to="/">Home</Link></li>
      </ul>
    </header>
  );
};

export default Header;
