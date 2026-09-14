'use client';

import { Activity, ImageIcon, Shield, Users } from 'lucide-react';

export function LoginHero() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-savannah-purple p-8 text-white lg:p-12">
      {/* Purple gradient overlay for when image is added */}
      <div className="absolute inset-0 bg-gradient-to-br from-savannah-purple/95 via-savannah-purple/85 to-savannah-purple/75" />

      {/* Placeholder for clinic image - positioned behind overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-savannah-purple-light/30">
        <div className="flex flex-col items-center gap-4 text-white/40">
          <ImageIcon className="h-24 w-24" aria-hidden="true" />
          <p className="text-sm font-medium">Clinic Image Placeholder</p>
        </div>
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-savannah-lime" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">SAVANNAH</h2>
            <p className="text-xs tracking-widest text-white/80">Informatics</p>
          </div>
        </div>
      </div>

      {/* Middle section - Tagline */}
      <div className="relative z-10 space-y-6">
        <div>
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
            We are Making
            <br />
            Healthcare <span className="text-savannah-lime">Simple</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/80">
            We deliver interoperable, connected software solutions for healthcare service providers
            and consumers.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-savannah-lime/20">
              <Users className="h-5 w-5 text-savannah-lime" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold">20M+</p>
              <p className="text-xs text-white/70">Customers Served</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-savannah-lime/20">
              <Activity className="h-5 w-5 text-savannah-lime" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold">13K+</p>
              <p className="text-xs text-white/70">Providers Empowered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="relative z-10">
        <p className="text-sm text-white/60">StockCare Management Console</p>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-savannah-lime/10 blur-3xl" />
      <div className="absolute -top-20 right-1/4 h-48 w-48 rounded-full bg-savannah-lime/5 blur-3xl" />
    </div>
  );
}
