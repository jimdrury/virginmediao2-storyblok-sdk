import type { FC } from 'react';

export interface StoryblokLogoProps {
  className?: string;
}

export const StoryblokLogo: FC<StoryblokLogoProps> = ({ className }) => (
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 45 53"
    style={{ enableBackground: 'new 0 0 45 53' } as React.CSSProperties}
    className={className}
    xmlSpace="preserve"
    role="img"
    aria-label="Storyblok Logo"
  >
    <style type="text/css">
      {`
        .st0{clip-path:url(#SVGID_2_);fill:#FFFFFF;}
        .st1{clip-path:url(#SVGID_4_);fill:currentColor;}
        .st2{clip-path:url(#SVGID_6_);fill:currentColor;}
      `}
    </style>
    <g>
      <g>
        <defs>
          <rect id="SVGID_1_" x="6" y="6" width="33" height="33" />
        </defs>
        <clipPath id="SVGID_2_">
          <use href="#SVGID_1_" style={{ overflow: 'visible' }} />
        </clipPath>
        <rect x="5" y="5" className="st0" width="35" height="35" />
      </g>
      <g>
        <defs>
          <path
            id="SVGID_3_"
            d="M26.5,18.5c0.4-0.3,0.6-0.9,0.6-1.8c0-0.7-0.2-1.3-0.5-1.6c-0.3-0.3-0.8-0.5-1.3-0.5h-9.5v4.4h9.3
            C25.6,19.1,26.1,18.8,26.5,18.5z M26.1,24.4H15.8v4.9h10.1c0.6,0,1.1-0.2,1.6-0.6c0.4-0.4,0.6-1,0.6-1.7c0-0.6-0.2-1.2-0.5-1.8
            C27.2,24.7,26.7,24.4,26.1,24.4z"
          />
        </defs>
        <clipPath id="SVGID_4_">
          <use xlinkHref="#SVGID_3_" style={{ overflow: 'visible' }} />
        </clipPath>
        <rect x="14.8" y="13.7" className="st1" width="14.4" height="16.7" />
      </g>
      <g>
        <defs>
          <path
            id="SVGID_5_"
            d="M36.2,32.9c-0.5,0.9-1.3,1.7-2.2,2.3c-1,0.6-2.1,1.2-3.3,1.4c-1.2,0.3-2.6,0.6-4,0.6H8.3V8.3h20.8
            c1,0,1.9,0.2,2.7,0.7c0.8,0.4,1.5,1,2.1,1.7c1.2,1.4,1.8,3.2,1.8,5c0,1.3-0.4,2.6-1,3.9c-0.7,1.2-1.8,2.2-3.1,2.8
            c1.7,0.5,3,1.3,3.9,2.5c0.9,1.2,1.4,2.8,1.4,4.9C36.9,30.9,36.6,32,36.2,32.9L36.2,32.9z M43,0H2.3C1,0,0,1,0,2.3v40.6
            c0,1.2,1,2,2.3,2h6V53l7.5-8.1H43c1.2,0,2-0.8,2-2.1V2.3C45,1.1,44.2,0.1,43,0L43,0z"
          />
        </defs>
        <clipPath id="SVGID_6_">
          <use xlinkHref="#SVGID_5_" style={{ overflow: 'visible' }} />
        </clipPath>
        <rect x="-1" y="-1" className="st2" width="47" height="55" />
      </g>
    </g>
  </svg>
);
