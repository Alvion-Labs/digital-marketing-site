'use client';

import { useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

type ToolbarButtonProps = {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
};

function ToolbarButton({ active = false, onClick, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold transition-all ${active ? 'border-accent-from bg-accent-from text-white shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      {children}
    </button>
  );
}

const textColors = [
  '#111827',
  '#1d4ed8',
  '#9333ea',
  '#dc2626',
  '#ea580c',
  '#16a34a',
  '#0f766e',
  '#c026d3',
];

const highlightColors = [
  '#fef08a',
  '#fde68a',
  '#fca5a5',
  '#a7f3d0',
  '#bfdbfe',
  '#e9d5ff',
];

export default function RichTextEditor({ value, onChange, placeholder = 'Write your blog post here...', className = '' }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        blockquote: {
          HTMLAttributes: {
            class: 'not-prose',
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class:
          'min-h-[28rem] cursor-text px-5 py-4 text-[15px] leading-7 text-gray-800 outline-none focus:outline-none',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  const toolbar = useMemo(() => {
    if (!editor) return null;

    const applyImage = () => {
      const imageUrl = window.prompt('Image URL');
      if (!imageUrl) return;
      editor.chain().focus().setImage({ src: imageUrl }).run();
    };

    const applyLink = () => {
      const previousUrl = editor.getAttributes('link').href as string | undefined;
      const url = window.prompt('Link URL', previousUrl || 'https://');
      if (url === null) return;
      if (!url.trim()) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
    };

    return (
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 p-3">
        <div className="flex flex-wrap gap-2">
          <ToolbarButton active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()} title="Paragraph">
            P
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
            H1
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
            H2
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
            H3
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
            Quote
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
            • List
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
            1. List
          </ToolbarButton>
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex flex-wrap gap-2">
          <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
            B
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
            I
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
            U
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strike">
            S
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight">
            Highlight
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code">
            {'</>'}
          </ToolbarButton>
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex flex-wrap gap-2">
          <ToolbarButton active={editor.isActive({ textAlign: 'left' } as any)} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align left">
            Left
          </ToolbarButton>
          <ToolbarButton active={editor.isActive({ textAlign: 'center' } as any)} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align center">
            Center
          </ToolbarButton>
          <ToolbarButton active={editor.isActive({ textAlign: 'right' } as any)} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align right">
            Right
          </ToolbarButton>
          <ToolbarButton active={editor.isActive({ textAlign: 'justify' } as any)} onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="Justify">
            Justify
          </ToolbarButton>
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={applyLink} className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900" title="Add link">
            Link
          </button>
          <button type="button" onClick={applyImage} className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900" title="Insert image">
            Image
          </button>
          <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900" title="Clear formatting">
            Clear
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Text</span>
          {textColors.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => editor.chain().focus().setColor(color).run()}
              className="h-8 w-8 rounded-full border border-gray-200 shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Highlight</span>
          {highlightColors.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
              className="h-8 w-8 rounded-full border border-gray-200 shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    );
  }, [editor]);

  if (!editor) {
    return <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">Loading editor…</div>;
  }

  return (
    <div className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {toolbar}
      <EditorContent editor={editor} />
    </div>
  );
}
