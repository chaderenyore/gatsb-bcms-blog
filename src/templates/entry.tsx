import { BCMSEntryParsed, BCMSMediaParsed } from '@becomes/cms-client/types';
import { Link, PageProps } from 'gatsby';
import { BCMSImage } from 'gatsby-source-bcms/components';
import React, { FC } from 'react';
import { Layout } from '../layout';

interface Ctx {
  entry: BCMSEntryParsed;
  backUri: string;
}

const Entry: FC<PageProps<undefined, Ctx>> = (props) => {
  const ctx = props.pageContext;

  return (
    <Layout>
      <div>
        <Link to={ctx.backUri}>Back</Link>
        {ctx.entry.meta.en.cover_image ? (
          <BCMSImage
            media={ctx.entry.meta.en.cover_image as BCMSMediaParsed}
            options={{
              position: 'cover',
              sizes: {
                exec: [
                  {
                    width: 350,
                    height: 300,
                  },
                  {
                    width: 600,
                    height: 300,
                  },
                  {
                    width: 900,
                    height: 300,
                  },
                  {
                    width: 1200,
                    height: 300,
                  },
                  {
                    width: 1500,
                    height: 300,
                  },
                  {
                    width: 1920,
                    height: 300,
                  },
                ],
              },
            }}
          />
        ) : (
          ''
        )}
        <pre>
          <code>{JSON.stringify(ctx.entry, null, '  ')}</code>
        </pre>
      </div>
    </Layout>
  );
};

export default Entry;
