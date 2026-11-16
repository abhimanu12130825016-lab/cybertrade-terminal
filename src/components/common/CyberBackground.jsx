import React from 'react';

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dark Void Gradient */}
      <div className="absolute inset-0 bg-[#050508] opacity-95" />

      {/* Cyber Grid */}
      <div className="cyber-grid-bg absolute inset-0 opacity-40" />

      {/* Ambient Neon Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#B829EA]/10 rounded-full blur-[140px]" />
      <div className="absolute -bottom-32 left-1/3 w-[500px] h-[400px] bg-[#00FF9D]/05 rounded-full blur-[160px]" />

      {/* Subtle Horizontal Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 50%, transparent 50%)',
          backgroundSize: '100% 4px'
        }}
      />
    </div>
  );
}
