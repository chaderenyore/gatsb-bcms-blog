import * as path from 'path';
import { CreatePagesArgs } from 'gatsby';
import { getBcmsMost } from 'gatsby-source-bcms';

export const createPages = async (args: CreatePagesArgs) => {
  const {
    actions: { createPage },
  } = args;
  const most = getBcmsMost();

  const homePageComp = path.join(process.cwd(), 'src', 'templates', 'home.tsx');
  const entriesPageComp = path.join(
    process.cwd(),
    'src',
    'templates',
    'entries.tsx',
  );
  const entryPageComp = path.join(
    process.cwd(),
    'src',
    'templates',
    'entry.tsx',
  );

  const templates = await most.template.find(async template => template);
  createPage({
    component: homePageComp,
    path: '/',
    context: {
      data: templates.map(
        (template) => template.name,
      ),
    },
  });
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    const entries = await most.content.entry.find(template.name, async entry => entry)
    createPage({
      component: entriesPageComp,
      path: `/${template.name}`,
      context: {
        entries: entries.map(entry => {
          return {
            uri: `/${template.name}/${entry.meta.en.slug}`,
            title: entry.meta.en.title,
          }
        })
      }
    })
    for (let j = 0; j < entries.length; j++) {
      const entry = entries[j];
      createPage({
        component: entryPageComp,
        path: `/${template.name}/${entry.meta.en.slug}`,
        context: {
          entry,
          backUri: `/${template.name}`
        }
      })
    }
  }
};
