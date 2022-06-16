import { Link, PageProps } from 'gatsby';
import React, { FC } from 'react';
import { Layout } from '../layout';

const Home: FC<PageProps<unknown, { data: string[] }>> = (props) => {
  const ctx = props.pageContext;

  return (
    <Layout>
      <ul>
        {ctx.data.map((template, idx) => {
          return (
            <li key={idx}>
              <Link to={`/${template}`}>{template} entries</Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export default Home;
