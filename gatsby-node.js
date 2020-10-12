const { BCMSMost } = require('@becomes/cms-most');
const bcmsMost = BCMSMost();

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  console.log('>>> Creating pages <<<');
  await bcmsMost.parser.gatsby(createPage);
};
