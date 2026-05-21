import { Link, useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getHref = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-white/10">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="246 268 531 480"
              className="h-8 w-auto text-accent hover:opacity-80 transition-smooth"
            >
              <path
                d="M 629.0 495.0 L 643.0 495.0 L 652.0 497.0 L 655.0 498.0 L 663.0 502.0 L 669.0 506.0 L 681.0 518.0 L 683.0 521.0 L 684.0 524.0 L 686.0 526.0 L 687.0 528.0 L 687.0 530.0 L 689.0 533.0 L 691.0 539.0 L 692.0 545.0 L 692.0 564.0 L 691.0 569.0 L 689.0 575.0 L 683.0 587.0 L 680.0 591.0 L 669.0 602.0 L 663.0 606.0 L 655.0 610.0 L 649.0 612.0 L 643.0 613.0 L 628.0 613.0 L 619.0 611.0 L 616.0 609.0 L 614.0 609.0 L 608.0 606.0 L 601.0 601.0 L 592.0 592.0 L 587.0 585.0 L 582.0 575.0 L 580.0 569.0 L 579.0 564.0 L 579.0 544.0 L 581.0 536.0 L 582.0 533.0 L 587.0 523.0 L 591.0 517.0 L 602.0 506.0 L 605.0 504.0 L 608.0 503.0 L 610.0 501.0 L 614.0 499.0 L 623.0 496.0 Z M 741.0 501.0 L 727.0 479.0 L 709.0 461.0 L 692.0 450.0 L 670.0 441.0 L 645.0 437.0 L 624.0 438.0 L 604.0 443.0 L 580.0 454.0 L 580.0 397.0 L 574.0 368.0 L 568.0 354.0 L 554.0 333.0 L 541.0 320.0 L 526.0 309.0 L 500.0 297.0 L 473.0 292.0 L 447.0 293.0 L 420.0 301.0 L 391.0 319.0 L 377.0 333.0 L 364.0 352.0 L 356.0 370.0 L 352.0 386.0 L 349.0 441.0 L 278.0 441.0 L 277.0 443.0 L 278.0 495.0 L 350.0 497.0 L 350.0 575.0 L 345.0 608.0 L 340.0 623.0 L 331.0 639.0 L 319.0 651.0 L 305.0 659.0 L 291.0 663.0 L 270.0 665.0 L 271.0 724.0 L 304.0 722.0 L 329.0 715.0 L 345.0 707.0 L 359.0 697.0 L 370.0 687.0 L 386.0 667.0 L 399.0 642.0 L 410.0 600.0 L 412.0 583.0 L 412.0 497.0 L 456.0 495.0 L 478.0 496.0 L 482.0 494.0 L 481.0 441.0 L 414.0 441.0 L 412.0 439.0 L 412.0 405.0 L 416.0 385.0 L 422.0 374.0 L 429.0 366.0 L 448.0 354.0 L 466.0 351.0 L 485.0 355.0 L 496.0 361.0 L 508.0 373.0 L 513.0 381.0 L 517.0 394.0 L 518.0 416.0 L 517.0 556.0 L 521.0 584.0 L 529.0 606.0 L 543.0 628.0 L 562.0 647.0 L 580.0 659.0 L 607.0 669.0 L 627.0 672.0 L 644.0 672.0 L 664.0 669.0 L 677.0 665.0 L 696.0 656.0 L 710.0 646.0 L 726.0 630.0 L 736.0 616.0 L 744.0 600.0 L 751.0 577.0 L 753.0 563.0 L 752.0 536.0 L 748.0 519.0 Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-sm text-white/50">
            © {new Date().getFullYear()} Florian Beermann
          </div>
        </div>
        <div className="flex gap-6 text-sm text-white/70 flex-wrap justify-center">
          <a href={getHref("#about")} className="hover:text-accent-glow transition-smooth">About</a>
          <a href={getHref("#services")} className="hover:text-accent-glow transition-smooth">Services</a>
          <a href={getHref("#contact")} className="hover:text-accent-glow transition-smooth">Contact</a>
          <Link to="/imprint" className="hover:text-accent-glow transition-smooth">Imprint</Link>
        </div>
      </div>
    </footer>
  );
};

