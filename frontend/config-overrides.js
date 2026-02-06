const { override, babelInclude } = require('customize-cra');
const path = require('path');

// Exclude node_modules from source-map-loader to avoid "Failed to parse source map" warnings
// from packages with missing or broken source maps (@mrblenny/react-flow-chart, etc.)
function excludeNodeModulesFromSourceMapLoader(config) {
  const rules = config.module.rules;
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (rule.loader && String(rule.loader).includes('source-map-loader')) {
      const prev = rule.exclude;
      rule.exclude = Array.isArray(prev) ? [...prev, /node_modules/] : [prev, /node_modules/].filter(Boolean);
      break;
    }
  }
  return config;
}

module.exports = override(
  excludeNodeModulesFromSourceMapLoader,
  // Include fast-png, jspdf, framer-motion, and their dependencies in Babel transpilation
  babelInclude([
    path.resolve('src'),
    path.resolve('node_modules/fast-png'),
    path.resolve('node_modules/jspdf'),
    path.resolve('node_modules/iobuffer'),
    path.resolve('node_modules/framer-motion'),
  ])
);

