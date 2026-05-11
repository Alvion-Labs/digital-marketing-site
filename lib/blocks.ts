// Lightweight placeholder implementations for block types used across the repo.

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'quote'
  | 'cta'
  | 'list'
  | 'divider';

export type AnyBlock = {
  id: string;
  type: BlockType;
  data: Record<string, any>;
};

export const generateBlockId = (): string => Math.random().toString(36).slice(2, 9);

export const createEmptyBlock = (type: BlockType): AnyBlock => {
  const id = generateBlockId();
  switch (type) {
    case 'paragraph':
      return { id, type, data: { text: '' } };
    case 'heading':
      return { id, type, data: { text: '', level: 2 } };
    case 'image':
      return { id, type, data: { src: '', alt: '' } };
    case 'quote':
      return { id, type, data: { text: '', author: '' } };
    case 'cta':
      return { id, type, data: { title: '', buttonText: 'Learn more', buttonUrl: '' } };
    case 'list':
      return { id, type, data: { ordered: false, items: [''] } };
    case 'divider':
      return { id, type, data: { style: 'solid' } };
    default:
      return { id, type: 'paragraph', data: { text: '' } };
  }
};

export const DEFAULT_PARAGRAPH_BLOCK = () => createEmptyBlock('paragraph');

export default null;
