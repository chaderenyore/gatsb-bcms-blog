import React from 'react';

interface Props {
  name: string;
}

const HomeView: React.FunctionComponent<Props> = ({ name }: Props) => {
  return <div>{name}</div>;
};

export default HomeView;
