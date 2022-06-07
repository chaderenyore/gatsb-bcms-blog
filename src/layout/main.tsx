import { BCMSImageConfig } from 'gatsby-source-bcms/components';
import React, { FC, PropsWithChildren } from 'react';
import { HeaderEntry } from '../../bcms/types-ts';
import Header from './header';

BCMSImageConfig.cmsOrigin = process.env.GATSBY_BCMS_API_ORIGIN || ''
BCMSImageConfig.publicApiKeyId = process.env.GATSBY_BCMS_API_PUBLIC_KEY || ''

interface Props {
  header: {
    bcms: HeaderEntry;
  };
}

const Layout: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <div className="layout">
      <Header items={props.header.bcms.meta.en.items} />
      <main className="layout--content">{props.children}</main>
    </div>
  );
};

export default Layout;
