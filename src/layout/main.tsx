import {BCMSImageConfig} from '@becomes/cms-most/frontend'
import React, { FC, PropsWithChildren } from 'react';
import Header from './header';

BCMSImageConfig.cmsOrigin =
  process.env.GATSBY_BCMS_API_ORIGIN ||
  'https://becomes-starter-projects.yourbcms.com';
BCMSImageConfig.publicApiKeyId =
  process.env.GATSBY_BCMS_API_PUBLIC_KEY || '629dcd4dbcf5017354af6fe8';

const Layout: FC<PropsWithChildren<unknown>> = (props) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout--content">{props.children}</main>
    </div>
  );
};

export default Layout;
