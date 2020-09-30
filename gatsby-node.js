const { BCMS } = require('@becomes/cms-ssgf');
const bcms = new BCMS();

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  console.log('>>> Creating pages <<<');
  await bcms.pageParser(createPage);
};
