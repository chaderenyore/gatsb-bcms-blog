import React from 'react';
import { Layout } from '../components';

interface Props {
  name: string;
}

const HomeView: React.FunctionComponent<Props> = ({ name }: Props) => {
  return (
    <Layout>
      <h1>{name}</h1>
    </Layout>
  );
};

export default HomeView;
