const { ConfigBuilder } = require('@becomes/cms-ssgf');

module.exports = ConfigBuilder.build({
  entries: [],
  functions: [],
  pageParser: {
    gatsby: [],
  },
  media: {
    ppc: 2,
    output: '/static/media',
    sizeMap: [
      {
        width: 350,
        quality: 70,
      },
      {
        width: 600,
        quality: 70,
      },
      {
        width: 1200,
        quality: 70,
      },
      {
        width: 1920,
        quality: 70,
      },
    ],
    process: true,
  },
});
