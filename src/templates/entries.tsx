import { Link, PageProps } from 'gatsby';
import React, { FC } from 'react';
import { Layout } from '../layout';

interface Ctx {
  entries: Array<{
    uri: string;
    title: string;
  }>;
}

const Entries: FC<PageProps<unknown, Ctx>> = (props) => {
  const ctx = props.pageContext;

  return (
    <Layout>
      <div>
        <ul>
          {ctx.entries.map((entry, idx) => {
            return (
              <li key={idx}>
                <Link to={entry.uri}>{entry.title} Entry</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export default Entries;
