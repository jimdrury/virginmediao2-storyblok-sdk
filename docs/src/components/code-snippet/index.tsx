import type { FC } from 'react';
import type { IconType } from 'react-icons';
import {
  FaCss3Alt,
  FaHtml5,
  FaReact,
  FaRegFile,
  FaTerminal,
} from 'react-icons/fa6';
import { LuFileJson2 } from 'react-icons/lu';
import { SiYaml } from 'react-icons/si';
import { TbBrandJavascript, TbBrandTypescript } from 'react-icons/tb';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import cws from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';
import { CopyToClipboard } from '@/components/copy-to-clipboard';

export enum LANGUAGE {
  CSS = 'css',
  HTML = 'html',
  TSX = 'tsx',
  TYPESCRIPT = 'ts',
  JS = 'js',
  JSON = 'json',
  YAML = 'yml',
  SH = 'shell',
  UNKNOWN = 'unknown',
}

export interface CodeSnippet {
  code?: string;
  language?: LANGUAGE;
  title?: string;
}

const _icons: Record<LANGUAGE, IconType> = {
  [LANGUAGE.CSS]: FaCss3Alt,
  [LANGUAGE.HTML]: FaHtml5,
  [LANGUAGE.TSX]: FaReact,
  [LANGUAGE.TYPESCRIPT]: TbBrandTypescript,
  [LANGUAGE.JS]: TbBrandJavascript,
  [LANGUAGE.JSON]: LuFileJson2,
  [LANGUAGE.YAML]: SiYaml,
  [LANGUAGE.SH]: FaTerminal,
  [LANGUAGE.UNKNOWN]: FaRegFile,
};

export const CodeSnippet: FC<CodeSnippet> = ({
  code,
  title,
  language = LANGUAGE.UNKNOWN,
}) => {
  if (!code) {
    return <p>Please add code to create a snippet</p>;
  }

  const snippet = code.trim();

  const highlightedSnippet = (
    <SyntaxHighlighter
      language={language}
      style={cws}
      customStyle={{
        margin: 0,
        marginBottom: '0',
        paddingBlock: '4px 20px',
        paddingInline: '20px',
        borderRadius: 'var(--border-radius-s)',
        fontSize: '14px',
        background: 'transparent',
      }}
    >
      {snippet}
    </SyntaxHighlighter>
  );

  return (
    <div className="mockup-code w-full relative pb-0">
      <div className="mockup-code-action absolute top-[8px] right-[8px] scroll-none">
        <CopyToClipboard content={snippet} />
      </div>
      {title && (
        <pre className="text-white/70 text-sm absolute top-[15px] left-[86px] select-none">
          {title}
        </pre>
      )}
      {highlightedSnippet}
    </div>
  );

  // return (
  //   <div className="p-0.5 text-surface-fg bg-surface-bg-dim rounded-lg">
  //     <div className="grid grid-cols-[min-content_1fr_auto] gap-x-2 items-center mb-0">
  //       <div className="flex items-center pl-3">
  //         <Icon />
  //       </div>
  //       <div className="flex items-center pl-2">
  //         <h3 className="font-mono text-sm font-bold leading-5 text-surface-fg">
  //           {title}
  //         </h3>
  //       </div>
  //       <div className="flex items-center pb-0.5">
  //         <CopyToClipboard content={snippet} />
  //       </div>
  //     </div>
  //     <div>
  //       {snippetSize > 10 ? (
  //         <ClickToExpand>{highlightedSnippet}</ClickToExpand>
  //       ) : (
  //         highlightedSnippet
  //       )}
  //     </div>
  //   </div>
  // );
};
