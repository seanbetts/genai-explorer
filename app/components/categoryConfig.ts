import type { CompanyCategory } from './types';

// Configuration for how each AI category should be rendered
export interface CategoryConfigEntry {
  key: CompanyCategory;
  title: string;
  layout: 'full-width' | 'half-width' | 'quarter-width';
  columns?: number;
  showModelCount?: number;
  rowType: 'single' | 'double' | 'quad';
}

export const categoryConfig: CategoryConfigEntry[] = [
  {
    key: 'frontier',
    title: 'Frontier Models',
    layout: 'full-width',
    columns: 5,
    rowType: 'single',
  },
  {
    key: 'open',
    title: 'Open Models',
    layout: 'half-width',
    columns: 4,
    rowType: 'double',
  },
  {
    key: 'enterprise',
    title: 'Enterprise AI Platforms',
    layout: 'quarter-width',
    rowType: 'double',
  },
  {
    key: 'image',
    title: 'Image Generation',
    layout: 'quarter-width',
    showModelCount: 0,
    rowType: 'quad',
  },
  {
    key: 'video',
    title: 'Video Generation',
    layout: 'quarter-width',
    showModelCount: 0,
    rowType: 'quad',
  },
  {
    key: 'audio',
    title: 'Audio Generation',
    layout: 'quarter-width',
    showModelCount: 0,
    rowType: 'quad',
  },
  {
    key: 'other',
    title: 'Specialised AI Platforms',
    layout: 'quarter-width',
    showModelCount: 0,
    rowType: 'quad',
  },
];