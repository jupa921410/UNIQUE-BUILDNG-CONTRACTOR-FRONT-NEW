<?php
// Match the deployed, prerendered portfolio. Rebuild after CMS changes.
header('Content-Type: application/xml; charset=UTF-8');
header('X-Robots-Tag: noindex');
$file = __DIR__ . '/sitemap.xml';
if (!is_readable($file)) { http_response_code(503); exit; }
$xml = file_get_contents($file);
preg_match_all('~<url>\s*<loc>https://www\.uniquebuildingcontractors\.com/portfolio/[^<]+</loc>.*?</url>~s', $xml, $matches);
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . implode("\n", $matches[0]) . '</urlset>';
