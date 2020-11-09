import { Prop, PropParsed } from './prop';

export interface PropGroupPointer {
  _id: string;
  items: Array<{
    props: Prop[];
  }>;
}
