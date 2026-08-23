/* The mark. A twelve-point star drawn as a single path, inlined rather than
   linked so it takes its colour from `currentColor` — on the photograph that
   resolves to the light ink, and in the reduced-transparency fallback it stays
   correct without a second asset to keep in sync.

   The source artwork is drawn in a flipped coordinate space at ten times
   scale, which is what the transform on the group undoes. Left as authored:
   re-tracing the path to normalise it would risk moving points, and there is
   nothing to gain from it. */
export function StarMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1254 1254"
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      <g transform="translate(0,1254) scale(0.1,-0.1)" fill="currentColor" stroke="none">
        <path d="M6271 11426 c-1 -10 -55 -605 -102 -1131 -38 -431 -122 -1322 -199 -2120 -33 -341 -64 -664 -69 -718 -4 -54 -11 -100 -14 -103 -6 -6 -194 151 -452 376 -67 58 -219 191 -339 295 -121 105 -385 335 -588 513 -203 177 -371 322 -374 322 -8 0 42 -69 397 -546 925 -1241 934 -1253 927 -1259 -3 -3 -250 -26 -818 -75 -184 -16 -670 -58 -1080 -94 -410 -36 -934 -81 -1165 -101 -566 -48 -848 -74 -854 -80 -2 -3 2 -5 10 -5 20 0 580 -60 1399 -150 1872 -207 2539 -286 2556 -303 2 -2 -155 -215 -349 -474 -508 -680 -1001 -1343 -1011 -1362 -5 -9 4 -4 20 10 94 84 702 613 879 765 397 340 630 540 727 622 l96 81 6 -62 c4 -34 24 -255 46 -492 22 -236 56 -594 75 -795 62 -647 116 -1243 220 -2424 30 -341 57 -622 60 -624 3 -3 5 1 5 9 0 14 52 589 130 1449 23 245 75 801 116 1235 40 435 92 984 114 1220 22 237 44 442 48 457 7 25 23 13 457 -360 248 -212 631 -542 853 -733 221 -192 402 -346 402 -343 0 3 -73 105 -163 227 -90 122 -282 386 -427 587 -145 201 -320 444 -390 540 -298 410 -341 472 -338 474 12 9 149 30 363 55 426 51 2881 323 3450 383 104 11 115 13 80 20 -36 7 -306 31 -1965 173 -289 25 -628 54 -755 65 -126 11 -439 38 -694 60 -255 22 -465 41 -467 43 -1 1 59 85 134 187 74 102 278 379 452 615 174 237 404 549 511 695 200 272 213 290 206 290 -5 0 -296 -253 -953 -826 -208 -181 -469 -408 -579 -502 l-200 -173 -7 48 c-4 26 -21 194 -38 373 -17 179 -51 537 -76 795 -98 1017 -140 1466 -204 2180 -47 526 -66 712 -69 691z" />
      </g>
    </svg>
  );
}
