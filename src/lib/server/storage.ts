import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { defaultContent, type SiteContent } from '$lib/content';

const DATA_PATH = join(process.cwd(), 'data', 'content.json');

export function readContent(): SiteContent {
  try {
    if (!existsSync(DATA_PATH)) {
      writeContent(defaultContent);
      return structuredClone(defaultContent);
    }
    const raw = readFileSync(DATA_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    // Migration: if old format (no sections array), reset to default
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      writeContent(defaultContent);
      return structuredClone(defaultContent);
    }
    return parsed as SiteContent;
  } catch {
    return structuredClone(defaultContent);
  }
}

export function writeContent(content: SiteContent): SiteContent {
  const dir = dirname(DATA_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(DATA_PATH, JSON.stringify(content, null, 2), 'utf-8');
  return content;
}
