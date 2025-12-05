"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Type, Image as ImageIcon, List, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'image' | 'list';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}

interface BlockEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function BlockEditor({ value, onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parse markdown content into blocks
    if (value) {
      const parsed = parseMarkdownToBlocks(value);
      setBlocks(parsed);
    } else {
      setBlocks([{ id: '1', type: 'paragraph', content: '' }]);
    }
  }, []);

  useEffect(() => {
    // Convert blocks back to markdown
    if (blocks.length > 0) {
      const markdown = blocksToMarkdown(blocks);
      onChange(markdown);
    }
  }, [blocks]);

  const parseMarkdownToBlocks = (markdown: string): Block[] => {
    const lines = markdown.split('\n');
    const result: Block[] = [];
    let id = 1;

    for (const line of lines) {
      if (line.startsWith('# ')) {
        result.push({ id: String(id++), type: 'h1', content: line.substring(2) });
      } else if (line.startsWith('## ')) {
        result.push({ id: String(id++), type: 'h2', content: line.substring(3) });
      } else if (line.startsWith('### ')) {
        result.push({ id: String(id++), type: 'h3', content: line.substring(4) });
      } else if (line.startsWith('![')) {
        const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (match) {
          result.push({ id: String(id++), type: 'image', content: match[2] });
        }
      } else if (line.trim()) {
        result.push({ id: String(id++), type: 'paragraph', content: line });
      } else {
        result.push({ id: String(id++), type: 'paragraph', content: '' });
      }
    }

    return result.length > 0 ? result : [{ id: '1', type: 'paragraph', content: '' }];
  };

  const blocksToMarkdown = (blocks: Block[]): string => {
    return blocks.map(block => {
      switch (block.type) {
        case 'h1':
          return `# ${block.content}`;
        case 'h2':
          return `## ${block.content}`;
        case 'h3':
          return `### ${block.content}`;
        case 'image':
          return `![Image](${block.content})`;
        case 'paragraph':
          return block.content;
        default:
          return block.content;
      }
    }).join('\n');
  };

  const addBlock = (index: number, type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'image' ? '' : '',
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setShowMenu(null);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id));
    }
  };

  const changeBlockType = (id: string, type: BlockType) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, type, content: block.content.replace(/^#+\s*/, '') } : block
    ));
    setShowMenu(null);
  };

  const handleImageSubmit = (id: string) => {
    if (imageUrl.trim()) {
      updateBlock(id, imageUrl.trim());
      setImageUrl("");
      setShowMenu(null);
    }
  };

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {blocks.map((block, index) => (
        <div key={block.id} className="group flex items-start gap-3 md:gap-4">
          {/* Plus button */}
          <button
            type="button"
            onClick={() => setShowMenu(showMenu === block.id ? null : block.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 md:mt-3 p-2 md:p-3 hover:bg-muted rounded"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
          </button>

          {/* Block content */}
          <div className="flex-1">
            {block.type === 'h1' && (
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Heading 1"
                className="text-3xl md:text-4xl lg:text-5xl font-heading font-normal w-full bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
              />
            )}
            {block.type === 'h2' && (
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Heading 2"
                className="text-2xl md:text-3xl lg:text-4xl font-heading font-normal w-full bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
              />
            )}
            {block.type === 'h3' && (
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Heading 3"
                className="text-xl md:text-2xl lg:text-3xl font-heading font-normal w-full bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
              />
            )}
            {block.type === 'paragraph' && (
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Type '/' for commands"
                className="text-base md:text-lg lg:text-xl font-base w-full bg-transparent border-0 focus:outline-none focus:ring-0 p-0 resize-none min-h-[28px] md:min-h-[32px] lg:min-h-[36px]"
                rows={block.content.split('\n').length || 1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addBlock(index, 'paragraph');
                  }
                }}
              />
            )}
            {block.type === 'image' && (
              <div className="space-y-3 md:space-y-4">
                {block.content ? (
                  <div className="relative group/image">
                    <img 
                      src={block.content} 
                      alt="Uploaded" 
                      className="rounded-xl max-w-full h-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => updateBlock(block.id, '')}
                      className="absolute top-3 md:top-4 right-3 md:right-4 opacity-0 group-hover/image:opacity-100 bg-background/80 p-2 md:p-3 rounded"
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 md:gap-4">
                    <Input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL"
                      className="flex-1 h-12 md:h-14 text-base md:text-lg px-4 md:px-6"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleImageSubmit(block.id);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => handleImageSubmit(block.id)}
                      className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg"
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Delete button */}
          {blocks.length > 1 && (
            <button
              type="button"
              onClick={() => deleteBlock(block.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 md:mt-3 p-2 md:p-3 hover:bg-destructive/10 rounded text-destructive"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}

          {/* Block menu */}
          {showMenu === block.id && (
            <div 
              ref={menuRef}
              className="absolute z-50 mt-10 md:mt-12 ml-10 md:ml-12 bg-card border border-border rounded-lg shadow-lg p-2 md:p-3 min-w-[220px] md:min-w-[260px] lg:min-w-[300px]"
            >
              <div className="space-y-1 md:space-y-2">
                <button
                  type="button"
                  onClick={() => changeBlockType(block.id, 'h1')}
                  className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 hover:bg-muted rounded text-left text-sm md:text-base"
                >
                  <Type className="w-5 h-5 md:w-6 md:h-6" />
                  Heading 1
                </button>
                <button
                  type="button"
                  onClick={() => changeBlockType(block.id, 'h2')}
                  className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 hover:bg-muted rounded text-left text-sm md:text-base"
                >
                  <Type className="w-5 h-5 md:w-6 md:h-6" />
                  Heading 2
                </button>
                <button
                  type="button"
                  onClick={() => changeBlockType(block.id, 'h3')}
                  className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 hover:bg-muted rounded text-left text-sm md:text-base"
                >
                  <Type className="w-5 h-5 md:w-6 md:h-6" />
                  Heading 3
                </button>
                <button
                  type="button"
                  onClick={() => addBlock(index, 'image')}
                  className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 hover:bg-muted rounded text-left text-sm md:text-base"
                >
                  <ImageIcon className="w-5 h-5 md:w-6 md:h-6" />
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => changeBlockType(block.id, 'paragraph')}
                  className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 hover:bg-muted rounded text-left text-sm md:text-base"
                >
                  <Type className="w-5 h-5 md:w-6 md:h-6" />
                  Text
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

