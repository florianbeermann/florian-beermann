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
    <meta name="theme-color" content="#F1F2F3" />

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
        --paper: #f1f2f3;
        --ink: #181d26;
        --blue: #0047ff;
        --on-blue: #f1f2f3;
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

      /* Sized by height, with the mark's own 1021x524 aspect doing the width.
         The wordmark beside it is the scarce axis here, and it is set in ems of
         the row, so the pair scales as one object. */
      .gate-mark {
        /* 1.05em, which is the measure the hero's loader uses: its mark clamps
           to 2.35rem against a 2.25rem wordmark. Matched rather than eyeballed
           so the pair is the same object here as it is on the site. */
        height: 1.05em;
        width: auto;
        aspect-ratio: 1021.1 / 524;
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
        --line: rgba(241, 242, 243, 0.32);
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
          viewBox="115.9 379 1021.1 524"
          role="img"
          aria-label="Florian Beermann &amp; Partners"
        >
          <g transform="translate(0,1254) scale(0.1,-0.1)" fill="currentColor">
            <path d="M7680 8739 c-976 -3 -1949 -7 -2162 -8 l-388 -1 0 -120 0 -120 -487 -2 -488 -3 -3 -106 -3 -106 -352 -6 c-194 -4 -725 -8 -1182 -8 -456 -1 -971 -4 -1143 -8 l-313 -6 87 -110 c125 -157 499 -527 674 -667 655 -522 1340 -864 1969 -982 212 -40 314 -46 798 -46 l473 0 194 -181 193 -180 62 -157 c33 -86 70 -183 81 -215 l20 -59 -124 -141 c-68 -78 -170 -197 -227 -265 -102 -121 -107 -125 -271 -230 -159 -101 -426 -273 -818 -526 l-175 -113 -3 -430 -2 -430 650 3 651 3 37 29 c213 166 472 291 747 361 171 43 304 61 510 68 409 13 780 -63 1153 -238 104 -49 156 -78 313 -175 l86 -54 647 0 646 0 0 443 0 442 -73 47 c-39 25 -236 151 -437 278 -201 128 -425 271 -499 319 l-134 86 -206 244 c-113 134 -212 251 -219 262 -15 20 6 66 151 333 l64 118 470 477 470 476 134 59 c248 108 1130 497 1624 716 l490 216 3 362 2 362 -957 -2 c-527 -1 -1757 -5 -2733 -9z m3558 -381 l-3 -233 -2985 0 -2985 0 -3 233 -2 232 2990 0 2990 0 -2 -232z m-6130 -895 l2 -883 -410 0 -410 0 0 885 0 885 408 -2 407 -3 3 -882z m-958 -109 l0 -776 -27 6 c-16 3 -64 10 -108 16 -121 17 -384 83 -531 134 -438 150 -906 406 -1339 729 -231 173 -401 325 -588 525 l-118 127 153 5 c84 3 694 7 1356 8 l1202 2 0 -776z m6758 620 c-7 -6 -230 -108 -393 -179 -223 -97 -786 -346 -1315 -581 l-145 -65 -463 -462 -462 -462 -1265 -3 -1265 -4 -32 27 c-18 15 -97 88 -175 162 l-143 135 0 719 0 719 2832 0 c1557 0 2829 -3 2826 -6z m-2890 -1897 c-2 -7 -50 -101 -108 -210 l-105 -197 -980 0 -980 0 -75 202 c-41 110 -76 205 -78 209 -2 5 509 9 1163 9 941 0 1166 -2 1163 -13z m71 -801 l216 -257 275 -177 c151 -98 359 -231 463 -296 103 -65 187 -122 187 -126 0 -5 -211 -9 -469 -9 l-469 0 -297 189 -298 190 -875 0 -874 0 -302 -189 -301 -190 -360 0 c-198 -1 -406 2 -462 5 l-101 7 56 37 c31 20 185 119 342 220 157 100 338 217 404 259 118 75 119 77 320 310 110 129 211 246 222 260 l22 26 1042 -1 1042 -1 217 -257z m-162 -789 l272 -172 1 -307 c0 -170 -4 -308 -8 -308 -4 0 -12 4 -18 9 -21 22 -248 142 -350 187 -262 114 -482 171 -764 199 -559 56 -1114 -63 -1556 -331 -40 -24 -75 -44 -78 -44 -3 0 -6 130 -6 289 l0 289 188 118 c103 65 232 146 287 181 l100 63 830 0 830 0 272 -173z m-2639 -525 l2 -312 -532 2 -533 3 -3 300 c-1 165 0 305 3 312 3 11 113 13 532 11 l528 -3 3 -313z m4107 3 l0 -310 -527 -3 -528 -2 0 315 0 315 528 -2 527 -3 0 -310z" />
          </g>
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
