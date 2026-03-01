'use client'

import { BlockPrimitive } from "@/app/primitives/Block.primitive"
import { SectionPrimitive } from "@/app/primitives/Section.primitive"

export function PublicRootScreenAddsWidget() {
  return (
    <SectionPrimitive variant="centered">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdSlot variant="promote" />
        <AdSlot variant="grow" />
      </div>
    </SectionPrimitive>
  )
}

function AdSlot({ variant }: { variant: 'promote' | 'grow' }) {
  return (
    <div className="relative w-full aspect-[5/2]">
      {variant === 'promote' ? <PromoteSVG /> : <GrowSVG />}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 ">
        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-semibold tracking-widest text-white/70 uppercase select-none">
          Ad
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white drop-shadow-sm">
            Reklamınız burada ola bilər
          </p>
          <p className="text-xs text-white/60 mt-1">
            Your ad can be here
          </p>
        </div>
      </div>
    </div>
  )
}

function PromoteSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full rounded-app"
      viewBox="0 0 600 180"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="promoBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5B23FF" />
          <stop offset="100%" stopColor="#3A12CC" />
        </linearGradient>
      </defs>
      <rect width="600" height="180" fill="url(#promoBg)" />

      {/* Floating circles */}
      <circle cx="520" cy="30" r="100" fill="#4EFFB8" opacity="0.08">
        <animate attributeName="cx" values="520;540;520" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cy" values="30;50;30" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="550" cy="140" r="60" fill="#4EFFB8" opacity="0.06">
        <animate attributeName="r" values="60;70;60" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="150" r="80" fill="white" opacity="0.04">
        <animate attributeName="cx" values="60;80;60" dur="7s" repeatCount="indefinite" />
        <animate attributeName="r" values="80;90;80" dur="9s" repeatCount="indefinite" />
      </circle>

      {/* Animated waves */}
      <path fill="#4EFFB8" opacity="0.08">
        <animate
          attributeName="d"
          values="M0 130C80 100 160 150 240 120C320 90 400 140 480 110C540 90 580 100 600 105V180H0Z;M0 140C80 120 160 140 240 110C320 100 400 130 480 120C540 100 580 110 600 115V180H0Z;M0 130C80 100 160 150 240 120C320 90 400 140 480 110C540 90 580 100 600 105V180H0Z"
          dur="6s" repeatCount="indefinite"
        />
      </path>
      <path fill="#4EFFB8" opacity="0.06">
        <animate
          attributeName="d"
          values="M0 150C100 130 180 160 280 140C380 120 460 155 600 135V180H0Z;M0 155C100 140 180 150 280 135C380 125 460 150 600 140V180H0Z;M0 150C100 130 180 160 280 140C380 120 460 155 600 135V180H0Z"
          dur="5s" repeatCount="indefinite"
        />
      </path>

      {/* Pulsing sparkle dots */}
      <circle cx="80" cy="40" r="3" fill="white" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.25;0.12" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="35" r="4" fill="#4EFFB8" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.3;0.15" dur="4s" repeatCount="indefinite" />
        <animate attributeName="r" values="4;5;4" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="50" r="3" fill="white" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.22;0.1" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="450" cy="30" r="2.5" fill="#4EFFB8" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.28;0.12" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="60" r="2" fill="white" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.2;0.08" dur="4.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="500" cy="70" r="3" fill="white" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.18;0.08" dur="3s" repeatCount="indefinite" begin="1s" />
      </circle>

      {/* Rotating geometric accent */}
      <rect x="30" y="20" width="40" height="40" rx="10" fill="white" opacity="0.05">
        <animateTransform attributeName="transform" type="rotate" values="15 50 40;25 50 40;15 50 40" dur="10s" repeatCount="indefinite" />
      </rect>
      <rect x="480" y="100" width="30" height="30" rx="8" fill="#4EFFB8" opacity="0.08">
        <animateTransform attributeName="transform" type="rotate" values="-10 495 115;5 495 115;-10 495 115" dur="8s" repeatCount="indefinite" />
      </rect>

      {/* Diagonal lines */}
      <line x1="0" y1="0" x2="100" y2="180" stroke="white" strokeWidth="0.5" opacity="0.06" />
      <line x1="200" y1="0" x2="300" y2="180" stroke="#4EFFB8" strokeWidth="0.5" opacity="0.08" />
      <line x1="400" y1="0" x2="500" y2="180" stroke="white" strokeWidth="0.5" opacity="0.05" />
    </svg>
  )
}

function GrowSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full rounded-app"
      viewBox="0 0 600 180"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="growBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#362F4F" />
          <stop offset="100%" stopColor="#1E1832" />
        </linearGradient>
        <radialGradient id="growGlow" cx="0.7" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#5B23FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#5B23FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="180" fill="url(#growBg)" />
      <rect width="600" height="180" fill="url(#growGlow)" />

      {/* Floating glow blobs */}
      <circle cx="480" cy="50" r="120" fill="#5B23FF" opacity="0.1">
        <animate attributeName="cx" values="480;500;480" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" values="50;70;50" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="140" r="90" fill="#4EFFB8" opacity="0.06">
        <animate attributeName="cx" values="100;120;100" dur="8s" repeatCount="indefinite" />
        <animate attributeName="r" values="90;100;90" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="300" cy="20" r="70" fill="#5B23FF" opacity="0.07">
        <animate attributeName="cy" values="20;40;20" dur="7s" repeatCount="indefinite" />
        <animate attributeName="r" values="70;80;70" dur="10s" repeatCount="indefinite" />
      </circle>

      {/* Animated mountain waves */}
      <path fill="#5B23FF" opacity="0.12">
        <animate
          attributeName="d"
          values="M0 140C60 100 120 130 200 110C280 90 340 120 420 100C500 80 560 110 600 95V180H0Z;M0 135C60 110 120 120 200 115C280 100 340 130 420 105C500 90 560 100 600 100V180H0Z;M0 140C60 100 120 130 200 110C280 90 340 120 420 100C500 80 560 110 600 95V180H0Z"
          dur="7s" repeatCount="indefinite"
        />
      </path>
      <path fill="#4EFFB8" opacity="0.07">
        <animate
          attributeName="d"
          values="M0 160C80 140 180 165 260 145C340 125 440 155 520 140C570 130 590 140 600 145V180H0Z;M0 155C80 145 180 155 260 150C340 130 440 150 520 145C570 135 590 145 600 148V180H0Z;M0 160C80 140 180 165 260 145C340 125 440 155 520 140C570 130 590 140 600 145V180H0Z"
          dur="5.5s" repeatCount="indefinite"
        />
      </path>

      {/* Twinkling sparkles */}
      <circle cx="100" cy="45" r="2.5" fill="#4EFFB8" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2s" repeatCount="indefinite" />
        <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="30" r="1.5" fill="white" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <circle cx="300" cy="55" r="3" fill="#5B23FF" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="420" cy="25" r="2" fill="#4EFFB8" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.45;0.2" dur="2.5s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="r" values="2;3;2" dur="2.5s" repeatCount="indefinite" begin="1s" />
      </circle>
      <circle cx="500" cy="45" r="1.5" fill="white" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.3;0.12" dur="3.5s" repeatCount="indefinite" begin="0.3s" />
      </circle>
      <circle cx="150" cy="80" r="2" fill="#4EFFB8" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" begin="1.5s" />
      </circle>
      <circle cx="530" cy="90" r="3" fill="#4EFFB8" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="4s" repeatCount="indefinite" begin="2s" />
      </circle>

      {/* Slowly rotating diamonds */}
      <rect x="50" y="60" width="20" height="20" rx="4" fill="#4EFFB8" opacity="0.06">
        <animateTransform attributeName="transform" type="rotate" values="45 60 70;90 60 70;45 60 70" dur="12s" repeatCount="indefinite" />
      </rect>
      <rect x="450" y="80" width="25" height="25" rx="5" fill="#5B23FF" opacity="0.1">
        <animateTransform attributeName="transform" type="rotate" values="30 462 92;60 462 92;30 462 92" dur="10s" repeatCount="indefinite" />
      </rect>
      <rect x="250" y="120" width="15" height="15" rx="3" fill="#4EFFB8" opacity="0.05">
        <animateTransform attributeName="transform" type="rotate" values="20 257 127;50 257 127;20 257 127" dur="14s" repeatCount="indefinite" />
      </rect>

      {/* Diagonal lines */}
      <line x1="50" y1="0" x2="150" y2="180" stroke="#5B23FF" strokeWidth="0.5" opacity="0.1" />
      <line x1="300" y1="0" x2="400" y2="180" stroke="#4EFFB8" strokeWidth="0.5" opacity="0.08" />
      <line x1="500" y1="0" x2="600" y2="180" stroke="white" strokeWidth="0.5" opacity="0.05" />
    </svg>
  )
}