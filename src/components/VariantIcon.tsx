"use client";

import React from 'react';
import {
  Citrus,
  TreePine,
  Snowflake,
  Moon,
  Leaf,
  Zap,
  Waves,
  Wind,
  Sprout,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RefillVariant } from '@/lib/device-context';

const ICON_MAP: Record<RefillVariant['iconName'], React.ElementType> = {
  citrus: Citrus,
  trees: TreePine,
  snowflake: Snowflake,
  moon: Moon,
  leaf: Leaf,
  zap: Zap,
  waves: Waves,
  wind: Wind,
  sprout: Sprout,
};

interface VariantIconProps {
  iconName: RefillVariant['iconName'];
  className?: string;
}

export function VariantIcon({ iconName, className }: VariantIconProps) {
  const Icon = ICON_MAP[iconName];
  return <Icon className={cn("w-5 h-5", className)} />;
}
