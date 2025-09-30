import type { FC } from 'react';
import {
  MARK_ANCHOR,
  MARK_BOLD,
  MARK_CODE,
  MARK_HIGHLIGHT,
  MARK_ITALIC,
  MARK_LINK,
  MARK_STRIKE,
  MARK_STYLED,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_TEXT_STYLE,
  MARK_UNDERLINE,
  NODE_BR,
  NODE_CODEBLOCK,
  NODE_EMOJI,
  NODE_HEADING,
  NODE_HR,
  NODE_IMAGE,
  NODE_LI,
  NODE_OL,
  NODE_PARAGRAPH,
  NODE_QUOTE,
  NODE_TABLE,
  NODE_TABLE_CELL,
  NODE_TABLE_HEADER,
  NODE_TABLE_ROW,
  NODE_UL,
  type RenderOptions,
  render,
  type StoryblokRichtext,
} from 'storyblok-rich-text-react-renderer';

import {
  Anchor,
  Bold,
  Br,
  Codeblock,
  CodeMark,
  Emoji,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Highlight,
  Hr,
  Img,
  Italic,
  Li,
  Link,
  NextLink,
  Ol,
  Paragraph,
  Quote,
  Strike,
  Styled,
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TextStyle,
  Ul,
  Underline,
} from '../elements';

const options: RenderOptions = {
  nodeResolvers: {
    [NODE_HEADING]: (children, { level }) => {
      const HeadingComponent =
        { 1: H1, 2: H2, 3: H3, 4: H4, 5: H5, 6: H6 }[level] || H1;
      return <HeadingComponent>{children}</HeadingComponent>;
    },
    [NODE_CODEBLOCK]: (children, { class: className }) => (
      <Codeblock class={className}>{children}</Codeblock>
    ),
    [NODE_IMAGE]: (_children, { src, alt, title }) => (
      <Img src={src} alt={alt} title={title} />
    ),
    [NODE_EMOJI]: (children, { name, emoji, fallbackImage }) => (
      <Emoji name={name} emoji={emoji} fallbackImage={fallbackImage}>
        {children}
      </Emoji>
    ),
    [NODE_PARAGRAPH]: (children) => <Paragraph>{children}</Paragraph>,
    [NODE_QUOTE]: (children) => <Quote>{children}</Quote>,
    [NODE_OL]: (children) => <Ol>{children}</Ol>,
    [NODE_UL]: (children) => <Ul>{children}</Ul>,
    [NODE_LI]: (children) => <Li>{children}</Li>,
    [NODE_HR]: () => <Hr />,
    [NODE_BR]: () => <Br />,
    [NODE_TABLE]: (children) => <Table>{children}</Table>,
    [NODE_TABLE_ROW]: (children) => <TableRow>{children}</TableRow>,
    [NODE_TABLE_CELL]: (
      children,
      { colspan, rowspan, backgroundColor, colwidth },
    ) => (
      <TableCell
        colspan={colspan as number}
        rowspan={rowspan as number}
        backgroundColor={backgroundColor}
        colwidth={Array.isArray(colwidth) ? colwidth[0] : colwidth}
      >
        {children}
      </TableCell>
    ),
    [NODE_TABLE_HEADER]: (
      children,
      { colspan, rowspan, backgroundColor, colwidth },
    ) => (
      <TableHeader
        colspan={colspan as number}
        rowspan={rowspan as number}
        backgroundColor={backgroundColor}
        colwidth={Array.isArray(colwidth) ? colwidth[0] : colwidth}
      >
        {children}
      </TableHeader>
    ),
  },
  markResolvers: {
    [MARK_BOLD]: (children) => <Bold>{children}</Bold>,
    [MARK_ITALIC]: (children) => <Italic>{children}</Italic>,
    [MARK_STRIKE]: (children) => <Strike>{children}</Strike>,
    [MARK_UNDERLINE]: (children) => <Underline>{children}</Underline>,
    [MARK_CODE]: (children) => <CodeMark>{children}</CodeMark>,
    [MARK_STYLED]: (children, { class: className }) => (
      <Styled class={className}>{children}</Styled>
    ),
    [MARK_LINK]: (children, props) => {
      const { linktype, href, target } = props;
      if (linktype === 'email') {
        return (
          <Link href={`mailto:${href}`} target={target}>
            {children}
          </Link>
        );
      }

      if (!href) {
        return <em className="text-red-500">{children}</em>;
      }

      if (href?.match(/^(https?:)?\/\//)) {
        return (
          <Link href={href} target={target}>
            {children}
          </Link>
        );
      }
      return <NextLink href={href}>{children}</NextLink>;
    },
    [MARK_SUBSCRIPT]: (children) => <Subscript>{children}</Subscript>,
    [MARK_SUPERSCRIPT]: (children) => <Superscript>{children}</Superscript>,
    [MARK_HIGHLIGHT]: (children, { color }) => (
      <Highlight color={color}>{children}</Highlight>
    ),
    [MARK_TEXT_STYLE]: (children, { color }) => (
      <TextStyle color={color}>{children}</TextStyle>
    ),
    [MARK_ANCHOR]: (children, { id }) => <Anchor id={id}>{children}</Anchor>,
  },
};

interface RichTextProps {
  content: StoryblokRichtext;
}

export const RichText: FC<RichTextProps> = ({ content }) => (
  <>{render(content, options)}</>
);
