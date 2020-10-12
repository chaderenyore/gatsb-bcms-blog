import React from 'react';
import { Layout } from '../components';

interface Props {
  name: string;
}

const HomeView: React.FunctionComponent<Props> = ({ name }: Props) => {
  return (
    <Layout>
      <div>{name}</div>
    </Layout>
  );
};

export default HomeView;
