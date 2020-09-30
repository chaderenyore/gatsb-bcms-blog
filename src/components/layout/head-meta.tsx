import * as React from 'react';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import { useLocation } from '@reach/router';

interface Props {
  description: string;
  lang: string;
  meta: Array<{
    name: string;
    content: string;
  }>;
  title: string;
  OGImageUri?: string;
}

const HeadMeta: React.FunctionComponent<Props> = ({
  description,
  OGImageUri,
  lang,
  meta,
  title,
}: Props) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `,
  );
  const metaDescription = description || site.siteMetadata.description;
  const { pathname } = useLocation();

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      bodyAttributes={{
        class: `body-${title ? title.toLowerCase().replace(' ', '') : ''}`,
      }}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: OGImageUri ? `/${OGImageUri}` : undefined,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          property: `og:url`,
          content: `${site.siteMetadata.origin}${pathname}/`,
        },
      ].concat(meta)}
      link={[
        {
          rel: `canonical`,
          href: `${site.siteMetadata.origin}${pathname}/`,
        },
      ]}
    ></Helmet>
  );
};

export default HeadMeta;
