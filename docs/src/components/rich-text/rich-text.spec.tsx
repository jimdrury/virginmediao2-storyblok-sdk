import { render, screen } from '@testing-library/react';
import type { StoryblokRichtext } from 'storyblok-rich-text-react-renderer';
import { describe, expect, it } from 'vitest';
import { RichText } from './rich-text';

describe('RichText', () => {
  it('renders paragraph with text', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    };
    render(<RichText content={content} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders bold text', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Bold text', marks: [{ type: 'bold' }] },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const text = screen.getByText('Bold text');
    expect(text.tagName).toBe('STRONG');
  });

  it('renders italic text', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Italic text', marks: [{ type: 'italic' }] },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const text = screen.getByText('Italic text');
    expect(text.tagName).toBe('EM');
  });

  it('renders headings', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Heading 1' }],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Heading 2' }],
        },
      ],
    };
    render(<RichText content={content} />);
    const h1 = screen.getByText('Heading 1');
    const h2 = screen.getByText('Heading 2');
    expect(h1.tagName).toBe('H1');
    expect(h2.tagName).toBe('H2');
  });

  it('renders links with external URL', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'External link',
              marks: [
                {
                  type: 'link',
                  attrs: { href: 'https://example.com', linktype: 'url' },
                },
              ],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const link = screen.getByText('External link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders email links', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Email',
              marks: [
                {
                  type: 'link',
                  attrs: { href: 'test@example.com', linktype: 'email' },
                },
              ],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const link = screen.getByText('Email');
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('renders error for link without href', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Broken link',
              marks: [{ type: 'link', attrs: { linktype: 'url' } }],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const text = screen.getByText('Broken link');
    expect(text.tagName).toBe('EM');
    expect(text).toHaveClass('text-red-500');
  });

  it('renders ordered list', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'ordered_list',
          content: [
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Item 1' }],
                },
              ],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders horizontal rule', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [{ type: 'horizontal_rule' }],
    };
    const { container } = render(<RichText content={content} />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders internal links with NextLink', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Internal link',
              marks: [
                {
                  type: 'link',
                  attrs: { href: '/about', linktype: 'story' },
                },
              ],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const link = screen.getByText('Internal link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders styled text with custom class', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Styled text',
              marks: [{ type: 'styled', attrs: { class: 'custom-class' } }],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const text = screen.getByText('Styled text');
    expect(text).toHaveClass('custom-class');
  });

  it('renders highlighted text with color', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Highlighted text',
              marks: [{ type: 'highlight', attrs: { color: 'yellow' } }],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    expect(screen.getByText('Highlighted text')).toBeInTheDocument();
  });

  it('renders text with custom color style', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Colored text',
              marks: [{ type: 'textStyle', attrs: { color: '#ff0000' } }],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    expect(screen.getByText('Colored text')).toBeInTheDocument();
  });

  it('renders strikethrough text', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Strike text', marks: [{ type: 'strike' }] },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const text = screen.getByText('Strike text');
    expect(text.tagName).toBe('DEL');
  });

  it('renders underlined text', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Underline text',
              marks: [{ type: 'underline' }],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const text = screen.getByText('Underline text');
    expect(text.tagName).toBe('U');
  });

  it('renders code text', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'code text', marks: [{ type: 'code' }] },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const text = screen.getByText('code text');
    expect(text.tagName).toBe('CODE');
  });

  it('renders subscript text', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'H2O', marks: [{ type: 'subscript' }] },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const text = screen.getByText('H2O');
    expect(text.tagName).toBe('SUB');
  });

  it('renders superscript text', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'x2', marks: [{ type: 'superscript' }] },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const text = screen.getByText('x2');
    expect(text.tagName).toBe('SUP');
  });

  it('renders anchor text with id', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Anchor text',
              marks: [{ type: 'anchor', attrs: { id: 'section-1' } }],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    const text = screen.getByText('Anchor text');
    expect(text).toHaveAttribute('id', 'section-1');
  });

  it('renders blockquote', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Quote text' }],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    expect(screen.getByText('Quote text')).toBeInTheDocument();
  });

  it('renders unordered list', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'bullet_list',
          content: [
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Bullet item' }],
                },
              ],
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    expect(screen.getByText('Bullet item')).toBeInTheDocument();
  });

  it('renders codeblock', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'code_block',
          attrs: { class: 'language-js' },
          content: [{ type: 'text', text: 'const x = 1;' }],
        },
      ],
    };
    render(<RichText content={content} />);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });

  it('renders image', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'image',
          attrs: { src: '/image.jpg', alt: 'Test image', title: 'Test' },
        },
      ],
    };
    render(<RichText content={content} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/image.jpg');
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('renders emoji with unicode', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'emoji',
              attrs: { name: 'smile', emoji: '😀' },
            },
          ],
        },
      ],
    };
    render(<RichText content={content} />);
    expect(screen.getByText('😀')).toBeInTheDocument();
  });

  it('renders line break', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Line 1' },
            { type: 'hard_break' },
            { type: 'text', text: 'Line 2' },
          ],
        },
      ],
    };
    const { container } = render(<RichText content={content} />);
    expect(container.textContent).toContain('Line 1');
    expect(container.textContent).toContain('Line 2');
    expect(container.querySelector('br')).toBeInTheDocument();
  });

  it('renders table structure', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'table',
          content: [
            {
              type: 'table_row',
              content: [
                {
                  type: 'table_header',
                  attrs: { colspan: 1, rowspan: 1 },
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Header' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const { container } = render(<RichText content={content} />);
    // Just verify table elements are rendered
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('renders all heading levels', () => {
    const content: StoryblokRichtext = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Heading 3' }],
        },
        {
          type: 'heading',
          attrs: { level: 4 },
          content: [{ type: 'text', text: 'Heading 4' }],
        },
        {
          type: 'heading',
          attrs: { level: 5 },
          content: [{ type: 'text', text: 'Heading 5' }],
        },
        {
          type: 'heading',
          attrs: { level: 6 },
          content: [{ type: 'text', text: 'Heading 6' }],
        },
      ],
    };
    render(<RichText content={content} />);
    expect(screen.getByText('Heading 3').tagName).toBe('H3');
    expect(screen.getByText('Heading 4').tagName).toBe('H4');
    expect(screen.getByText('Heading 5').tagName).toBe('H5');
    expect(screen.getByText('Heading 6').tagName).toBe('H6');
  });
});
