<?php
// TEMPORARY — deleted in the commit immediately after this one.
//
// Apache's AuthUserFile needs the document root as an absolute filesystem
// path, and nothing we have access to reports it: konsoleH shows a relative
// folder tree, FTP speaks in its own rooted paths, and a wrong guess only
// surfaces as a 500 once someone tries to log in. Two guesses had already
// missed. PHP is the one thing running inside the directory in question, so
// it is the one thing that can answer without guessing.
//
// The token makes this undiscoverable in the window it exists: without it the
// file is indistinguishable from a page that was never deployed.
if (!hash_equals('e64948bf677d3889aeb546d2a4c0b616', $_GET['k'] ?? '')) {
    http_response_code(404);
    exit;
}

header('Content-Type: text/plain');
echo __DIR__;
