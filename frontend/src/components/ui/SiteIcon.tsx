import React from 'react';
import {
  Award,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';

const ICON_MAP = {
  'shield-check': ShieldCheck,
  'package-check': PackageCheck,
  factory: Factory,
  boxes: Boxes,
  'check-circle': CheckCircle2,
  truck: Truck,
  'clipboard-check': ClipboardCheck,
  award: Award,
  wrench: Wrench,
} as const;

interface SiteIconProps {
  name?: string | null;
  className?: string;
}

export default function SiteIcon({ name, className = 'w-5 h-5' }: SiteIconProps) {
  const Icon = (name && name in ICON_MAP
    ? ICON_MAP[name as keyof typeof ICON_MAP]
    : ShieldCheck);

  return <Icon className={className} aria-hidden="true" />;
}
