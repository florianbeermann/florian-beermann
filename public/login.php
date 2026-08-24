<?php
/**
 * The pre-launch gate's front door.
 *
 * Apache serves this as the 403 document for every request that arrives
 * without a valid access cookie, so it stands in for the whole site until
 * someone signs in. That means it has to render on its own: the app's CSS is
 * behind the same gate, and a stylesheet that 403s would leave a visitor
 * looking at unstyled text. The shell is therefore restated here, matching
 * 401.html and the site's own field and button idiom.
 *
 * `gate-secrets.php` is written by .github/workflows/deploy.yml and is not in
 * the repository: it carries the password hash and the access token, and this
 * repository is public. It is required rather than substituted into this file
 * so that neither value ever passes through a `sed` that could mangle a bcrypt
 * hash's `$` and `/` characters.
 */

require __DIR__ . '/gate-secrets.php';

const COOKIE_NAME = 'fb_access';
const COOKIE_LIFETIME = 60 * 60 * 24 * 30;

/**
 * Only same-origin absolute paths, so the login form cannot be turned into an
 * open redirect. `//evil.com` and `/\evil.com` are both browser-legal ways to
 * leave the origin, which is why a leading slash alone is not the test.
 */
function safe_path(?string $path): string
{
    if (!is_string($path) || $path === '' || !preg_match('#^/[^/\\\\]#', $path)) {
        return '/';
    }

    return $path;
}

function signed_in(): bool
{
    return isset($_COOKIE[COOKIE_NAME])
        && hash_equals(FB_ACCESS_TOKEN, (string) $_COOKIE[COOKIE_NAME]);
}

// Nothing here is cacheable, and an intermediary holding a copy of the login
// page in place of the real site would be its own kind of outage.
header('Cache-Control: no-store, max-age=0');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Arriving with a good cookie means the gate let this request through to the
// login page rather than to the site — a stale link, or a manual visit.
if (signed_in() && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /');
    exit;
}

$failed = false;
$next = safe_path($_SERVER['REDIRECT_URL'] ?? null);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $next = safe_path($_POST['next'] ?? null);

    // A browser's own password dialog is rate-limited by the browser; a form is
    // not. This is not real throttling — a static host gives us nowhere to keep
    // state — but it puts a floor under the cost of a guess, which is the
    // difference between a feasible online attack and an impractical one.
    usleep(400000);

    if (password_verify((string) ($_POST['password'] ?? ''), FB_PASSWORD_HASH)) {
        setcookie(COOKIE_NAME, FB_ACCESS_TOKEN, [
            'expires' => time() + COOKIE_LIFETIME,
            'path' => '/',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        header('Location: ' . $next);
        exit;
    }

    $failed = true;
    // A wrong password is a 401 rather than a 200: the request was refused, and
    // saying so keeps the status honest for anything reading it but a browser.
    http_response_code(401);
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    />
    <!-- The only page a crawler can reach while the gate is up, and it says
         nothing worth indexing. -->
    <meta name="robots" content="noindex, nofollow" />
    <title>Private site | Florian Beermann &amp; Partners</title>
    <meta
      name="description"
      content="florianbeermann.com is not published yet and is available to invited visitors only."
    />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#E8EDF5" />

    <!--
      Self-contained for the reason given at the top of this file. Everything it
      loads is on the exemption list in .htaccess; adding an asset here means
      adding it there too, or it will be refused and silently vanish. The test
      in src/test/gate.test.ts enforces that, because the failure is invisible
      locally — a dev server has no gate, so this page always looks right there.
    -->
    <style>
      /* The site's three faces, loaded here too. This page cannot share a
         stylesheet with the app — see the note at the top of the file — so the
         declarations are repeated rather than imported, and the .woff2
         exemption in .htaccess is what lets them through the gate. */
      @font-face {
        font-family: "Switzer";
        src: url("/fonts/Switzer-Variable.woff2") format("woff2-variations");
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
      }

      @font-face {
        font-family: "Nippo";
        src: url("/fonts/Nippo-Variable.woff2") format("woff2-variations");
        font-style: normal;
        font-weight: 200 700;
        font-display: swap;
      }

      @font-face {
        font-family: "Fragment Mono";
        src: url("/fonts/FragmentMono-Regular.woff2") format("woff2");
        font-style: normal;
        font-weight: 400;
        font-display: swap;
      }

      :root {
        --safe-right: env(safe-area-inset-right, 0px);
        --safe-bottom: env(safe-area-inset-bottom, 0px);
        --safe-left: env(safe-area-inset-left, 0px);

        /* Electric on Slate, the same three values src/styles/palettes.css
           holds. This is a light ground, where the app's own light sections
           are, rather than the dark plum this page used to be: the gate is the
           first thing an invited visitor sees and it should look like the site
           it is standing in front of. */
        --paper: #e8edf5;
        --ink: #181d26;
        --blue: #0047ff;
        --on-blue: #e8edf5;
        --muted: rgba(24, 29, 38, 0.72);
        --line: rgba(24, 29, 38, 0.28);
        --mono: "Fragment Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo,
          Consolas, "Liberation Mono", monospace;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      html {
        overscroll-behavior-y: none;
      }

      body {
        display: flex;
        min-height: 100svh;
        flex-direction: column;
        margin: 0;
        padding: 0 var(--safe-right) var(--safe-bottom) var(--safe-left);
        background-color: var(--paper);
        color: var(--ink);
        font-family: "Switzer", "Helvetica Neue", Arial, sans-serif;
        font-weight: 400;
        text-align: left;
      }

      h1,
      p {
        margin: 0;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .gate-header {
        display: flex;
        align-items: center;
        min-height: 76px;
        border-bottom: 1px solid var(--line);
        padding: 0 4vw;
      }

      /* The lockup: mark and wordmark, the same pairing the site's masthead
         carries. Set in the signal blue rather than the ink, because on this
         page it is the only thing standing for the brand and the gate should
         read as the site's own front door.

         Sized by its own type rather than by a width cap. The old wordmark here
         was a single 11.81:1 image, so it had to be rationed by width or it
         took 484px and overflowed a phone; this is two elements in a row and
         the wordmark clamps on font-size, so it shrinks on its own. */
      .gate-brand {
        display: flex;
        align-items: center;
        gap: clamp(0.55rem, 1.1vw, 0.85rem);
        min-height: 44px;
        min-width: 0;
        color: var(--blue);
      }

      /* Sized by height, with the mark's own 1402x1122 aspect doing the width.
         The wordmark beside it is the scarce axis here, and it is set in ems of
         the row, so the pair scales as one object. */
      .gate-mark {
        /* 1.6em, which is the ratio the hero's lockup uses: its mark clamps to
           3.6rem against a 2.25rem wordmark. Matched rather than eyeballed so
           the pair is the same object here as it is on the site. */
        height: 1.6em;
        width: auto;
        aspect-ratio: 1402 / 1122;
        flex: none;
      }

      .gate-wordmark {
        font-family: "Nippo", "Switzer", sans-serif;
        font-size: clamp(1.1rem, 2.1vw, 1.6rem);
        font-weight: 400;
        letter-spacing: 0.01em;
        line-height: 1;
        white-space: nowrap;
      }

      .gate-main {
        display: flex;
        width: min(100% - 8vw, 1240px);
        flex: 1;
        align-items: center;
        margin: 0 auto;
        padding: clamp(4rem, 10vw, 9rem) 0;
      }

      /* The 404 and 401 pages' proportions: a narrow marginal column, then the
         body. A visitor who meets more than one of these pages should not be
         able to tell they were built at different times. */
      .gate-inner {
        display: grid;
        width: 100%;
        grid-template-columns: 0.32fr 1.12fr;
        gap: clamp(2.5rem, 6vw, 7rem);
        align-items: start;
      }

      /* The marginal marker. Blue, and in the mono voice: on the site this
         register — labels, legal, position readouts — is Fragment Mono in
         tracked caps, and this is the same kind of thing. */
      .gate-code {
        display: block;
        padding-top: 0.55rem;
        color: var(--blue);
        font-family: var(--mono);
        font-size: 0.6875rem;
        font-weight: 400;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .gate-body h1 {
        font-family: "Switzer", sans-serif;
        font-size: clamp(3rem, 6.5vw, 5.6rem);
        font-weight: 520;
        letter-spacing: -0.03em;
        line-height: 0.88;
      }

      .gate-body > p {
        max-width: 46ch;
        margin-top: 1.8rem;
        color: var(--muted);
        font-size: clamp(1.09rem, 1.31vw, 1.22rem);
        line-height: 1.65;
      }

      /* The site's own field idiom, restated: a mono label above a rule the
         text sits on, and no box. Deliberately no rule above the form — the
         field already draws one, and two hairlines with a label floating
         between them read as an empty field above the real one. The contact
         form separates itself with space for the same reason. */
      .gate-form {
        max-width: 420px;
        margin-top: 3rem;
      }

      .gate-form label {
        display: block;
        margin-bottom: 0.55rem;
        color: var(--ink);
        font-family: var(--mono);
        font-size: 0.6875rem;
        font-weight: 500;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .gate-form input {
        width: 100%;
        min-height: 48px;
        border: 0;
        border-bottom: 1px solid var(--line);
        border-radius: 0;
        outline: none;
        background: transparent;
        padding: 0.65rem 0;
        color: var(--ink);
        font: inherit;
        font-size: 1.05rem;
      }

      .gate-form input:focus-visible {
        border-color: var(--ink);
        box-shadow: 0 1px 0 var(--ink);
      }

      /* Chrome paints its own fill on a recognised password field, which lands
         as a lit box in a palette that never chose that colour. The background
         is drawn outside the cascade, so flooding the field with an inset
         shadow is the only way to cover it. */
      .gate-form input:-webkit-autofill,
      .gate-form input:-webkit-autofill:hover,
      .gate-form input:-webkit-autofill:focus {
        box-shadow: inset 0 0 0 1000px var(--paper);
        -webkit-text-fill-color: var(--ink);
        transition: background-color 100000s ease 0s;
      }

      .gate-form button {
        display: inline-flex;
        min-height: 48px;
        align-items: center;
        margin-top: 1.6rem;
        border: 0;
        border-radius: 0;
        background: var(--blue);
        padding: 0 1.5rem;
        color: var(--on-blue);
        cursor: pointer;
        font: inherit;
        font-size: 0.94rem;
        font-weight: 650;
        /* An inset rule rather than a border, so the box is identical in both
           states and the hover inversion costs no layout. */
        box-shadow: inset 0 0 0 1px var(--blue);
      }

      .gate-form button:hover,
      .gate-form button:focus-visible {
        background: var(--paper);
        color: var(--blue);
      }

      /* The palette has one colour, so an error cannot be red without inventing
         a second one. It is set in the mono register instead: the page speaks
         in annotation, and a refusal is an annotation. */
      .gate-error {
        margin-top: 1.2rem;
        color: var(--ink);
        font-family: var(--mono);
        font-size: 0.6875rem;
        font-weight: 500;
        letter-spacing: 0.16em;
        line-height: 1.5;
        text-transform: uppercase;
      }

      .gate-footer {
        /* The blue closing panel, matching `.site-closing` on the site. The
           tokens flip inside it so a rule stays a rule rather than becoming an
           ink hairline on a blue ground. */
        --line: rgba(232, 237, 245, 0.32);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        padding: 2.4rem 4vw;
        background-color: var(--blue);
        color: var(--on-blue);
        font-family: var(--mono);
        font-size: 0.6875rem;
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .gate-footer a {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        border-bottom: 1px solid transparent;
      }

      .gate-footer a:hover,
      .gate-footer a:focus-visible {
        border-bottom-color: currentColor;
      }

      @media (max-width: 768px) {
        .gate-inner {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .gate-code {
          padding-top: 0;
        }
      }

      /* The shell stacks its footer at 680px, not 768px, and this page follows
         the rule it is copying rather than rounding the two together. */
      @media (max-width: 680px) {
        .gate-footer {
          align-items: flex-start;
          flex-direction: column;
          gap: 0.4rem;
          padding: 2.4rem 1.35rem;
        }
      }
    </style>
  </head>

  <body>
    <header class="gate-header">
      <span class="gate-brand">
        <!-- The mark is inlined rather than linked. Every file this page loads
             has to be named in the .htaccess allow-list, and a path that is in
             the markup but not the list vanishes silently behind the gate — so
             the fewer files, the fewer ways this can be wrong. It also means the
             lockup cannot arrive after the text it belongs beside. -->
        <svg
          class="gate-mark"
          viewBox="0 0 1402 1122"
          role="img"
          aria-label="Florian Beermann &amp; Partners"
        >
          <path fill="currentColor" d="M627 50c16 24 19 29 25 45q12 38 0 75c-11 30-37 56-67 66q-34 11-69 0-26-10-38-24A3946 3946 0 0 0 315 49l6 9c25 34 33 75 20 111a108 108 0 0 1-157 59l-8-5 12 12 71 72c63 64 65 67 75 87 22 46 15 96-18 132a115 115 0 0 1-99 33 154 154 0 0 1-41-14l69 71 76 79q18 26 23 57a114 114 0 0 1-163 118c-9-6-15-11 56 61l54 55c20 21 30 29 49 37 15 7 25 8 47 8a117 117 0 0 0 83-32q44-42 30-100c-3-11-5-15-11-26l-3-7 72 74 71 71c24 17 57 25 89 21 46-7 85-40 96-80 2-7 2-11 2-24 0-15 0-17-2-26q-4-16-13-29l-4-8 71 71c38 39 73 73 77 76 9 7 26 15 38 18 10 2 12 3 31 3s21-1 30-3q35-9 56-31 34-31 32-75-1-30-21-56c-6-9-10-13-51-55L951 694c9 5 25 12 37 15a119 119 0 0 0 140-72q6-19 4-38-3-28-17-48c-7-11-11-15-45-50l-64-67-60-63 7 4 15 8c45 21 97 11 134-23q21-21 30-50c2-10 2-38 0-48l-12-29c-9-14-10-16-124-131l-50-46q36 54 20 109c-6 22-23 45-43 58a104 104 0 0 1-59 18c-22 0-38-4-58-16q-10-6-15-13A5108 5108 0 0 0 629 50l-3-2zm-70 244c70 71 76 78 85 94 12 22 19 50 16 73-2 18-10 39-19 52-6 8-22 23-29 28-32 21-71 24-106 9-14-6-21-11-31-23a1385 1385 0 0 0-80-84l-66-70a115 115 0 0 0 109 9c17-8 38-25 49-41a107 107 0 0 0 2-116l-1-3zm285-27 103 106c7 10 18 30 20 40q12 39 1 73c-9 27-32 51-59 63-22 10-50 13-73 7-19-5-37-14-44-22-4-5-81-86-117-122l-31-32-10-11 7 5c22 14 52 20 78 17 17-2 37-10 52-21 15-10 30-28 37-43 14-30 13-67-3-97l-4-7 9 9zM581 639c51 52 57 59 67 82q16 39 7 77a111 111 0 0 1-157 72c-12-6-15-8-25-19l-29-31-121-129q37 23 79 18c38-4 76-32 92-67 13-27 11-60-3-89l-6-11 26 26zm301-12c63 64 65 66 76 90a117 117 0 0 1 2 104 112 112 0 0 1-157 46q-9-5-13-11L638 693a119 119 0 0 0 167-42c17-30 15-71-4-102l-3-6 13 13z" />
        </svg>
        <span class="gate-wordmark" aria-hidden="true"
          >Florian Beermann &amp; Partners</span
        >
      </span>
    </header>

    <main class="gate-main">
      <div class="gate-inner">
        <p class="gate-code">Private</p>
        <div class="gate-body">
          <h1>This site is not public yet.</h1>
          <p>
            florianbeermann.com is behind a password while it is being built. If
            you have been given one, enter it below. If you have not, there is
            nothing here to read yet — but there will be.
          </p>

          <form class="gate-form" method="post" action="/login.php">
            <input
              type="hidden"
              name="next"
              value="<?= htmlspecialchars($next, ENT_QUOTES, 'UTF-8') ?>"
            />
            <label for="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              autofocus
              required
              <?= $failed ? 'aria-describedby="gate-error" aria-invalid="true"' : '' ?>
            />
            <?php if ($failed): ?>
              <!-- `role="alert"` so the refusal is announced rather than only
                   drawn: the field is re-focused on load and a sighted visitor
                   sees the message, but nothing else would tell a screen reader
                   the page changed. -->
              <p class="gate-error" id="gate-error" role="alert">
                That password was not recognised. Try again.
              </p>
            <?php endif; ?>
            <button type="submit">Enter site</button>
          </form>
        </div>
      </div>
    </main>

    <footer class="gate-footer">
      <span
        >Florian Beermann &amp; Partners · © <?= date('Y') ?></span
      >
      <a href="mailto:hello@florianbeermann.com">Request access</a>
    </footer>
  </body>
</html>
