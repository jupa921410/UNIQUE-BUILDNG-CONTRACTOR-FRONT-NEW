import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatProjectLocation, normalizeProject } from '../src/data/portfolioRoutes.js';

test('projects with a null location normalize without blocking the portfolio list', () => {
  const project = { id: 12, slug: 'residential-project', title: 'Residential Project', location: null };

  assert.equal(formatProjectLocation(null), '');
  assert.deepEqual(normalizeProject(project), { ...project, location: '' });
});
