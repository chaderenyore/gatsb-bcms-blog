const { BCMSMostBuilder } = require('@becomes/cms-most');

module.exports = BCMSMostBuilder({
  cms: {
    origin: process.env.BCMS_API_ORIGIN,
    key: {
      id: process.env.BCMS_API_KEY,
      secret: process.env.BCMS_API_SECRET,
    },
  },
  entries: [],
  functions: [],
  media: {
    output: '/static/media',
    sizeMap: [
      {
        width: 350,
      },
      {
        width: 600,
      },
      {
        width: 1200,
      },
      {
        width: 1920,
      },
    ],
  },
  parser: {
    gatsby: [],
  },
});
