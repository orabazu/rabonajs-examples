import './Header.scss';

import { PageHeader } from 'antd';
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const Header = () => {
  return (
    <>
      <div className="Header">
        <PageHeader
          ghost={false}
          avatar={{
            src: () => '⚽️',
          }}
          title={
            <>
              <NavLink to="/" className="heading">
                RabonaJS ⚽️
              </NavLink>
              <NavLink to="/pass-networks" className="menuItem">
                Pass Networks
              </NavLink>
              <NavLink to="/kmeans" className="menuItem">
                Pass Clustering
              </NavLink>
            </>
          }
        ></PageHeader>
      </div>
      <Outlet />
    </>
  );
};
