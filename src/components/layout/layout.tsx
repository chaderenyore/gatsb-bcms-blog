import * as React from 'react';
import Footer from './footer';
import HeadMeta from './head-meta';
import Header from './header';

import '../../styles/main.scss';

interface Props {
  title?: string;
  className?: string;
  description?: string;
  meta?: Array<{
    name: string;
    content: string;
  }>;
  children?: React.ReactNode | React.ReactNodeArray;
  OGImageUri?: string;
}

const Layout: React.FunctionComponent<Props> = ({
  title,
  OGImageUri,
  description,
  meta,
  children,
  className,
}: Props) => {
  return (
    <div className={`layout ${className ? className : ''}`}>
      <HeadMeta
        title={title ? title : ''}
        description={description ? description : ''}
        lang="en"
        meta={meta ? meta : []}
        OGImageUri={OGImageUri}
      />
      <Header />
      <main className="layout--main">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
