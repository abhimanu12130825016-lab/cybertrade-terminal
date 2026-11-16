import React from 'react';

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Dark Clean Canvas */}
      <div className="absolute inset-0 bg-[#090B12]" />

      {/* Subtle Grid */}
      <div className="subtle-grid-bg absolute inset-0 opacity-60" />

      {/* Very soft ambient gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent blur-3xl pointer-events-none" />
    </div>
  );
}
