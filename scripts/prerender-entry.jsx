import Financing from '../src/pages/FinancingPage/FinancingPage.jsx';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SeoRenderContext } from '../src/components/SEO/SEO.jsx';
import { PHASE1_CITIES } from '../src/data/serviceAreasData.js';
import About from '../src/pages/AboutUsPage/AboutUsPage.jsx';
import Areas from '../src/pages/ServiceAreasPage/ServiceAreasPage.jsx';
import City from '../src/pages/CityPage/CityPage.jsx';
import Specialized from '../src/pages/SpecializedPage/SpecializedPage.jsx';
import Resources from '../src/pages/ResourcesPage/ResourcesPage.jsx';
import Legal from '../src/pages/LegalPage/LegalPage.jsx';
import NotFound from '../src/pages/NotFoundPage/NotFoundPage.jsx';

export function renderPages() {
  const pages = [
    ['/financing', Financing],
    ['/aboutus', About], ['/service-areas', Areas], ['/specialized', Specialized],
    ['/resources', Resources], ['/privacy', Legal, { type: 'privacy' }],
    ['/terms', Legal, { type: 'terms' }], ['/404', NotFound],
    ...PHASE1_CITIES.map(({ slug }) => [`/service-areas/${slug}`, City]),
  ];
  return pages.map(([path, Component, props = {}]) => {
    let metadata;
    const html = renderToStaticMarkup(createElement(SeoRenderContext.Provider, { value: value => { metadata = value; } },
      createElement(MemoryRouter, { initialEntries: [path] },
        createElement(Routes, null, createElement(Route, {
          path: Component === City ? '/service-areas/:citySlug' : path,
          element: createElement(Component, props),
        })))));
    if (!metadata) throw new Error(`Missing SEO metadata: ${path}`);
    // Framer Motion's entrance states must not hide crawlable HTML before JS runs.
    const content = html.replace(/style="[^"]*"/g, value => value.replace(/opacity:0(?:;|(?="))/g, 'opacity:1;').replace(/transform:[^;"]*/g, 'transform:none'));
    return { path, content, ...metadata };
  });
}
