import { PageHeader } from 'antd';
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import styles from './styles.module.scss';

export const Header = () => {
  return (
    <>
      <div className={styles.Header}>
        <PageHeader
          ghost={false}
          title={
            <>
              <NavLink to="/" className="heading">
                RabonaJS ⚽️
              </NavLink>
              <NavLink to="/pass-networks" className="menuItem">
                Pass Networks
              </NavLink>
              {/* <NavLink to="/kmeans" className="menuItem">
                Pass Clustering
              </NavLink> */}
            </>
          }
        ></PageHeader>
      </div>
      <Outlet />
    </>
  );
};
