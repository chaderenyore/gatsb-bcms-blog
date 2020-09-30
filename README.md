# Website for _______

This is a Gatsby project with a typescript, made to work with Becomes CMS. There are 2 packages which allow this, first is `@becomes/cms-client` used for communication with BCMS and other is `@becomes/cms-ssgf` used for bootstrapping the project. Since version of the BCMS used in this project is an early access version, for all issues and information contact [office@becomes.co](mailto:office@becomes.co).

## Table of content

- [Getting started](#getting-started)
- [Structure](#structure)
- [Usage](#usage)
  - [Creating a view](#usage-view)
  - [Creating a template](#usage-template)
  - [Adding a template to the page parser](#usage-page-parser)
  - [Working with images](#usage-image)
  - [Summary](#usage-summary)

## Getting started

<div id="getting-started"></div>

- Install modules: `npm i`,
- Create `.env` file with required environment variables (see `.env.example`),
- Pull CMS content: `npm run bcmsd:pull-content`,
- Pull CMS media: `npm run bcmsd:pull-media`,
- Call CMS functions: `npm tun bcmsd:call-functions`
- Start development: `npm run dev`.
- Site will be available on `localhost:8000`

## Structure

<div id="structure"></div>

To keep the project organized given structure should be followed and typescript should not be bypassed (it is recommended to avoid using `any` type unless absolutely necessary). Also make sure to follow the index pattern to make importing files clean.

- `src/templates` - is a directory which holds template components for all the pages on the website. This components do not handle UI logic and this rule should be followed to minimize confusion. Each template component is initializing required services and returning a view component. Example of this can be seen in Usage section.
- `src/views` - is a directory which holds view components for all the pages on the website. They are holding a UI logic for a specific page and one view component should never import another view component. If there is some shared part for multiple views, that should be handled via `components directory`. View components are mounted by a template components.
- `src/components` - is a directory which holds general purpose components used on the website. Unlike views and templates, components in the components directory can be imported by each other and extended.
- `src/types` - is a directory which holds all types used in the project. Naming of the types should be clear to indicate where it is used and what its purpose is.
- `src/util` - is a directory which holds general purpose logic used by a components. This is only for program logic and should not be used for UI components.
- `src/styles` - is a directory which holds global styles for the website. `main.scss` is imported by the `Layout` component. Also have in mind that tailwind is used in the project so when ever possible, user it.
- `src/services` - is a directory which holds services used by a components. Difference between services and utilities is in that services have a persistance in them and they are storing some state.
- `page-parser` - is a directory which holds handlers for the BCMS Page Parser. They are not written in typescript because they are used by a `bcms.config.js` and `gatsby-node.js` where currently typescript is not supported. This will be explored in the Usage section.

## Usage

<div id="usage"></div>

This project uses specific logic and structure to clear confusion and make developer experience better which includes spending less time finding things and more time writing clean code. To make this possible now and in the future, this guide should be followed. At the beginning it might seem unnecessary but at a long run it will prove much better if some simple rules are followed, therefore this usage guide should help you to not brake this simple rules and make project pleasing to work with for everyone.

### Creating a view

<div id="usage-view"></div>

As explained, views are react component with a specific purpose of rendering a UI for a specific website page. Because of this, views should not be shared between each other since this will disturb the logic and create confusion.

Inside of `src/views` a new file will be created call `test.tsx`. This view will accept `message` property and display it on the screen.

```tsx
// ---> src/views/test.tsx

import * as React from 'react';
import { Layout } from '../components';

interface Props {
  message: string;
}

export default function TestView({ message }: Props) {
  return (
    <Layout title="Test" lng="en">
      <h1>{message}</h1>
    </Layout>
  );
}
```

By following the index pattern, test view will be added to its `index.ts` file.

```ts
// ---> src/views/index.ts

export { default as TestView } from './test';
```

If development server is started at this point, view will not be available on the site because template for it needs to be created and added to the page parser, therefore next step will be to create a template for the test view.

### Creating a template

<div id="usage-template"></div>

Templates are react components with a specific purpose of being consumed by the page parser and mounting a view. In addition to this, templates are also in charge of initializing service and making sure that data passed to a view is correct. Templates can be think of as an interface which connects "backend" and UI creating a clear split between them.

Templates are consumed by the page parser in such a way that it is passed to the `createPage` gatsby hook and required properties are injected into its context. It is only natural here for a question to arise, why are views directly consumed a `createPage` hook, since this is possible? Answer to this question is to create a split between the page parser and UI logic. This solution makes debugging data passed by the page parser much simpler since a template components are very small and easy to work with. In addition to this, they do not handle any UI logic, therefore to fix problems with a data parsing, one does not need to understand the UI but should know only what inputs and outputs of a template should be.

Continuing with an example started in a previous section, inside of `src/templates` a new file will be created called `test.tsx`. Name of the file indicates that this is a template for the Test View.

```tsx
// ---> src/templates/test.tsx

import * as React from 'react';
import {
  FooterCompetitionPrototype,
  FooterService,
  LanguageService,
  PathService,
} from '../services';
import { LanguageCode } from '../types';
import { TestView } from '../views';

export default function Test(props: {
  location: {
    pathname: string;
    search: string;
  };
  pageContext: {
    lng: LanguageCode;
    message: string;
    competitionLinkForFooter: FooterCompetitionPrototype[];
  };
}) {
  PathService.set(props.location.pathname + props.location.search);
  LanguageService.setActive(props.pageContext.lng);
  FooterService.init(props.pageContext.competitionLinkForFooter);
  React.useEffect(() => {
    PathService.set(props.location.pathname + props.location.search);
    LanguageService.setActive(props.pageContext.lng);
  }, [props.pageContext.lng, props.location.pathname, props.location.search]);
  return <TestView message={props.pageContext.message} />;
}
```

As it can be seen, template is getting some inputs from the context and passing some outputs to the view. Service initialization is done for a language switch and footer competition items. At this point if development server is started, like before, test view will not be available on the site because there is one more step left and that is to add test template to the page parser.

### Adding template to the page parser

<div id="usage-page-parser"></div>

Page parser is a process for creating a website pages using `createPage` gatsby hook. This abstraction is provided by `@becomes/cms-ssgf` package and its configuration is located in the `bcms.config.js` file under `pageParser.gatsby.*` property. Process of parsing the pages is started by the `gatsby-node.js` file in `createPages` function. One `bcms.pageParser` method is called looping over the page parser array will occur and each handler will be executed in order.

To keep `bcms.config.js` file from heaving thousands of lines, the page parser handlers are moved to separate file, with appropriate names, inside the `page-parser` directory. This is only for organization purposes only.

Continuing with an example from the last section, test template will be added to the page parser array in `bcms.config.js`.

```js
// ---> bcms.config.js

const {
  Test,
  // ...
} = require('../page-parser');

pageParser: {
  gatsby: [
    {
      page: '/templates/test.tsx',
      handler: Test,
    },
    // ...
  ];
}
```

Now that this is done, only thing left is to create the test handler in `page-parser` directory and expose it.

```js
// ---> page-parser/test.js

const languages = require('./_languages');
const { CompetitionConverter } = require('./data-conversion');

module.exports = (createPage, component, bcms) => {
  const message = {
    en: 'This is a message.',
    de: 'Dies ist eine Nachricht.',
  };
  languages.forEach(lng => {
    createPage({
      path: `/${lng !== 'en' ? lng + '/' : ''}test`,
      component,
      context: {
        lng,
        message: message[lng],
        competitionLinkForFooter: CompetitionConverter.footerLinks(
          bcms.competitions,
        ),
      },
    });
  });
};
```

```js
// ---> page-parser/index.js

exports.Test = require('./test');
```

It is important to note that after making changes to `bcms.config.js` or any file imported by it, development server needs to be restarted.

With this done, if development server is started, `localhost:8000/test` will display the test view and if language is change, URI will be changed to `/de/test` and message on the screen will also change.

### Working with images

<div id="usage-image"></div>

Images are uploaded to the CMS and because of this they are usually very large to make them fit many use cases. Because of this, if original images are used on the website they will have major performance impact. This is covered by `@becomes/cms-ssgf` package and when `npm run bcmsd:pull-media` is called, it will save original image and 4 additional versions of it. This can be inspected in directory `static/media/*`. This directory is reserved for BCMS and should not be used since it is inside of the `.gitignore` file. Have in mind to **always use CMS images inside of an Image component**.

