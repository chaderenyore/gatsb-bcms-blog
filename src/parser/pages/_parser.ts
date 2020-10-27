import { BCMSCache, BCMSFunctionCache, GatsbyCreatePage } from '../../types';

export function BCMSParserFunction<ContextData>(
  handler: (
    createPage: GatsbyCreatePage<ContextData>,
    component: string,
    cache: BCMSCache,
    functionCache: BCMSFunctionCache,
  ) => Promise<void>,
): (
  createPage: GatsbyCreatePage<ContextData>,
  component: string,
  cache: BCMSCache,
  functionCache: BCMSFunctionCache,
) => Promise<void> {
  return handler;
}
