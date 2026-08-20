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
    <meta name="theme-color" content="#503D42" />

    <!--
      Self-contained for the reason given at the top of this file. Everything it
      loads is on the exemption list in .htaccess; adding an asset here means
      adding it there too, or it will be refused and silently vanish. The test
      in src/test/gate.test.ts enforces that, because the failure is invisible
      locally — a dev server has no gate, so this page always looks right there.
    -->
    <style>
      @font-face {
        font-family: "Outfit Variable";
        src: url("/fonts/outfit-latin-variable.woff2") format("woff2-variations");
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
      }

      :root {
        --safe-right: env(safe-area-inset-right, 0px);
        --safe-bottom: env(safe-area-inset-bottom, 0px);
        --safe-left: env(safe-area-inset-left, 0px);
        --paper: #503d42;
        --ink: #f5fbef;
        --on-ink: #503d42;
        --muted: rgba(245, 251, 239, 0.84);
        --line: rgba(245, 251, 239, 0.32);
        --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
          "Liberation Mono", monospace;
        --grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 .05 .05 .05 0 -.02'/%3E%3C/filter%3E%3Cfilter id='b'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' seed='19'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .05 .05 .05 0 -.02'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23a)'/%3E%3Crect width='180' height='180' filter='url(%23b)'/%3E%3C/svg%3E");
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
        background-image: var(--grain);
        color: var(--ink);
        font-family: "Outfit Variable", "Helvetica Neue", Arial, sans-serif;
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

      .gate-brand {
        display: flex;
        align-items: center;
        min-height: 44px;
        flex-shrink: 0;
        /* Width, not height, is what rations this mark. The wordmark is
           11.81:1, so a height clamp that floors at 41px asks for 484px of
           width and simply takes it: `flex-shrink: 0` means nothing can pull it
           back, and the gate overflowed by 110px at 390px and 215px at 280px.

           The site's own header only needs its width-driven treatment below
           900px, because above that the mark shares a row with the nav and
           height is the scarce axis. This header has no nav, so the mark can
           take the row at every width and derive its height from it. 519px is
           the 44px ceiling expressed in the other axis (44 x 11.81), so the
           name never renders larger here than it does in the site proper.

           The width sits on this wrapper rather than on the img because the
           percentage has to resolve against something definite: the wrapper is
           a flex item with `width: auto`, so an img asking for `100%` of it
           would be resolving against a box that is itself sized by that img. */
        width: min(100%, 519px);
      }

      .gate-brand img {
        width: 100%;
        height: auto;
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

      .gate-code {
        display: block;
        padding-top: 0.7rem;
        color: var(--ink);
        font-size: 0.94rem;
        font-weight: 680;
      }

      .gate-body h1 {
        font-family: "Outfit Variable", sans-serif;
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
        background: var(--ink);
        padding: 0 1.5rem;
        color: var(--on-ink);
        cursor: pointer;
        font: inherit;
        font-size: 0.94rem;
        font-weight: 650;
        /* An inset rule rather than a border, so the box is identical in both
           states and the hover inversion costs no layout. */
        box-shadow: inset 0 0 0 1px var(--ink);
      }

      .gate-form button:hover,
      .gate-form button:focus-visible {
        background: var(--paper);
        color: var(--ink);
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
        /* The light band, matching `.site-footer` on the site: the tokens flip
           inside it so the rule stays a rule instead of an ivory hairline on an
           ivory ground. */
        --line: #92ad94;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        border-top: 1px solid var(--line);
        padding: 2.4rem 4vw;
        background-color: #f5fbef;
        background-image: none;
        color: #503d42;
        font-family: var(--mono);
        font-size: 0.6875rem;
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
        <!-- ?v=2 must match the three references in the React shell; see the
             note in src/pages/Home.tsx. The .htaccess allow-list matches on
             filename, so the query does not affect this page's access. -->
        <img
          src="/logo-wordmark.svg?v=2"
          alt="Florian Beermann &amp; Partners"
          width="2335"
          height="198"
        />
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
