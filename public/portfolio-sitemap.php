<?php
/**
 * Portfolio sitemap proxy.
 *
 * The portfolio is a dynamic, CMS-driven section: projects are published from
 * the Laravel admin (admin.uniquebuildingcontractors.com) long after this
 * static React build was deployed. This tiny proxy re-serves the always-fresh
 * sitemap the backend generates, but from THIS host so search engines accept it
 * as a same-site sitemap for www.uniquebuildingcontractors.com.
 *
 * Referenced from robots.txt as:
 *   https://www.uniquebuildingcontractors.com/portfolio-sitemap.php
 * For a prettier /portfolio-sitemap.xml URL, add this line to the server's
 * .htaccess (not tracked here, configured on Hostinger):
 *   RewriteRule ^portfolio-sitemap\.xml$ /portfolio-sitemap.php [L]
 *
 * Requires PHP on the host (Hostinger shared hosting serves it by default).
 */

// The /api/ route is stateless (no session cookies); the identical
// /portfolio-sitemap.xml web route also exists for direct GSC/Bing submission.
const UPSTREAM  = 'https://admin.uniquebuildingcontractors.com/api/showcase/sitemap.xml';
const CACHE_TTL = 900; // 15 minutes

define('CACHE_FILE', sys_get_temp_dir() . '/ubc-portfolio-sitemap.xml');

header('Content-Type: application/xml; charset=UTF-8');
header('X-Robots-Tag: noindex');

// 1. Serve a warm local cache if it's fresh.
if (is_readable(CACHE_FILE) && (time() - filemtime(CACHE_FILE)) < CACHE_TTL) {
    header('Cache-Control: public, max-age=900');
    readfile(CACHE_FILE);
    exit;
}

// 2. Fetch from the backend (cURL preferred; many shared hosts disable
//    allow_url_fopen but keep the cURL extension).
$xml = null;

if (function_exists('curl_init')) {
    $ch = curl_init(UPSTREAM);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_HTTPHEADER     => ['Accept: application/xml'],
    ]);
    $body = curl_exec($ch);
    $ok   = $body !== false && curl_getinfo($ch, CURLINFO_HTTP_CODE) === 200;
    curl_close($ch);
    if ($ok) {
        $xml = $body;
    }
}

if ($xml === null && filter_var(ini_get('allow_url_fopen'), FILTER_VALIDATE_BOOL)) {
    $xml = @file_get_contents(UPSTREAM, false, stream_context_create([
        'http' => ['timeout' => 8, 'header' => "Accept: application/xml\r\n"],
    ]));
}

$looksValid = is_string($xml) && str_contains($xml, '<urlset');

if ($looksValid) {
    @file_put_contents(CACHE_FILE, $xml, LOCK_EX);

    header('Cache-Control: public, max-age=900');
    echo $xml;
    exit;
}

// 3. Backend unreachable — fall back to the last good cache, then to an empty set.
if (is_readable(CACHE_FILE)) {
    header('Cache-Control: public, max-age=120');
    readfile(CACHE_FILE);
    exit;
}

http_response_code(503);
header('Cache-Control: no-store');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
    . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>' . "\n";
