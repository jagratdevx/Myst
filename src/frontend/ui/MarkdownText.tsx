import React, { useState } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../hooks/useTheme';

interface MarkdownTextProps {
  content: string;
  textColor?: string;
  fontSize?: number;
  lineHeight?: number;
}

function hasMath(text: string): boolean {
  const inlineMath = /(?<!\$)\$(?!\$)(?:[^$\n])+?\$(?!\$)/g;
  let m;
  while ((m = inlineMath.exec(text)) !== null) {
    const inner = m[0].slice(1, -1);
    if (/[a-zA-Z\\={}()+\-*/^_]/.test(inner)) return true;
  }
  if (/\$\$[\s\S]*?\$\$/.test(text)) return true;
  if (/\\\([\s\S]*?\\\)/.test(text)) return true;
  if (/\\\[[\s\S]*?\\\]/.test(text)) return true;
  if (/\\begin\{[\w*]+\}[\s\S]*?\\end\{[\w*]+\}/.test(text)) return true;
  return false;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function katexHtml(latex: string, isBlock: boolean, isDark: boolean): string {
  const encoded = btoa(unescape(encodeURIComponent(escapeHtml(latex))));
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:${isDark?'#1a1a2e':'#ffffff'};display:flex;align-items:center;justify-content:${isBlock?'center':'flex-start'};min-height:100%;overflow:hidden}
.k{color:${isDark?'#e0e0e0':'#1a1a2e'}}
</style>
</head><body><div class="k" id="m"></div>
<script>
var m=document.getElementById('m');
try{
  var t=atob('${encoded}');
  m.innerHTML=katex.renderToString(t,{throwOnError:false,displayMode:${isBlock},output:'html'});
}catch(e){m.textContent='${encodeURIComponent(latex)}'}
window.ReactNativeWebView.postMessage(String(document.body.scrollHeight));
<\/script>
</body></html>`;
}

interface Segment {
  type: 'text' | 'bold' | 'italic' | 'code' | 'mathBlock' | 'mathInline' | 'codeBlock';
  content: string;
}

function parseContent(text: string): Segment[] {
  const segments: Segment[] = [];
  const patterns: { regex: RegExp; type: Segment['type'] }[] = [
    { regex: /```([\s\S]*?)```/g, type: 'codeBlock' },
    { regex: /\$\$([\s\S]*?)\$\$/g, type: 'mathBlock' },
    { regex: /\\\[([\s\S]*?)\\\]/g, type: 'mathBlock' },
    { regex: /\\begin\{([\w*]+)\}[\s\S]*?\\end\{\1\}/g, type: 'mathBlock' },
    { regex: /`([^`]+)`/g, type: 'code' },
    { regex: /\\\(([\s\S]*?)\\\)/g, type: 'mathInline' },
    { regex: /(?<!\$)\$(?!\$)((?:[^$\n])+?)\$(?!\$)/g, type: 'mathInline' },
    { regex: /\*\*([^*]+)\*\*/g, type: 'bold' },
    { regex: /\*([^*]+)\*/g, type: 'italic' },
  ];

  const allMatches: { index: number; length: number; content: string; type: Segment['type']; full?: string }[] = [];

  for (const { regex, type } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (type === 'mathBlock' && match[0].startsWith('\\begin')) {
        allMatches.push({ index: match.index, length: match[0].length, content: match[0], type, full: match[0] });
      } else {
        allMatches.push({ index: match.index, length: match[0].length, content: match[1] || match[0], type });
      }
    }
  }

  allMatches.sort((a, b) => a.index - b.index);

  let lastIndex = 0;
  for (const match of allMatches) {
    if (match.index < lastIndex) continue;
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      segments.push(...parseInlineMarkdown(plain));
    }
    segments.push({ type: match.type, content: match.content });
    lastIndex = match.index + match.length;
  }
  if (lastIndex < text.length) {
    segments.push(...parseInlineMarkdown(text.slice(lastIndex)));
  }
  return segments;
}

function parseInlineMarkdown(text: string): Segment[] {
  const segs: Segment[] = [];
  const matches: { index: number; length: number; content: string; type: Segment['type'] }[] = [];
  const patterns: { regex: RegExp; type: Segment['type'] }[] = [
    { regex: /`([^`]+)`/g, type: 'code' },
    { regex: /\*\*([^*]+)\*\*/g, type: 'bold' },
    { regex: /\*([^*]+)\*/g, type: 'italic' },
  ];
  for (const { regex, type } of patterns) {
    let m;
    while ((m = regex.exec(text)) !== null) {
      matches.push({ index: m.index, length: m[0].length, content: m[1], type });
    }
  }
  matches.sort((a, b) => a.index - b.index);
  let last = 0;
  for (const m of matches) {
    if (m.index < last) continue;
    if (m.index > last) segs.push({ type: 'text', content: text.slice(last, m.index) });
    segs.push({ type: m.type, content: m.content });
    last = m.index + m.length;
  }
  if (last < text.length) segs.push({ type: 'text', content: text.slice(last) });
  return segs;
}

const MathView = ({ latex, isBlock, isDark, onHeight }: { latex: string; isBlock: boolean; isDark: boolean; onHeight: (h: number) => void }) => {
  const [height, setHeight] = useState(isBlock ? 60 : 28);
  return (
    <View style={{ height: isBlock ? height + 16 : height, borderRadius: 4, overflow: 'hidden', marginVertical: isBlock ? 4 : 0 }}>
      <WebView
        source={{ html: katexHtml(latex, isBlock, isDark) }}
        style={{ flex: 1, backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        androidLayerType="software"
        onMessage={(e) => {
          const h = parseInt(e.nativeEvent.data, 10);
          if (h > 0) { setHeight(h); onHeight(h); }
        }}
      />
    </View>
  );
};

export const MarkdownText = ({ content, textColor, fontSize = 15, lineHeight = 22 }: MarkdownTextProps) => {
  const { isDark } = useTheme();
  const color = textColor || (isDark ? '#e0e0e0' : '#1a1a2e');

  if (!hasMath(content)) {
    const segs = parseInlineMarkdown(content);
    return (
      <Text style={{ color, fontSize, lineHeight }}>
        {segs.map((seg, i) => {
          switch (seg.type) {
            case 'bold': return <Text key={i} style={{ fontWeight: '800', color, fontSize, lineHeight }}>{seg.content}</Text>;
            case 'italic': return <Text key={i} style={{ fontStyle: 'italic', color, fontSize, lineHeight }}>{seg.content}</Text>;
            case 'code': return <Text key={i} style={[styles.codeText, { color, fontSize, lineHeight }]}>{seg.content}</Text>;
            default: return <Text key={i} style={{ color, fontSize, lineHeight }}>{seg.content}</Text>;
          }
        })}
      </Text>
    );
  }

  const segments = parseContent(content);

  return (
    <View>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'bold':
            return <Text key={i} style={{ fontWeight: '800', color, fontSize, lineHeight }}>{seg.content}</Text>;
          case 'italic':
            return <Text key={i} style={{ fontStyle: 'italic', color, fontSize, lineHeight }}>{seg.content}</Text>;
          case 'code':
            return <Text key={i} style={[styles.codeText, { color, fontSize, lineHeight }]}>{seg.content}</Text>;
          case 'codeBlock':
            return (
              <View key={i} style={[styles.codeBlock, { backgroundColor: isDark ? '#0d0d1a' : '#f0f0f5' }]}>
                <Text style={{ color: isDark ? '#e0e0e0' : '#1a1a2e', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 13, lineHeight: 20 }}>{seg.content}</Text>
              </View>
            );
          case 'mathBlock':
            return <MathView key={i} latex={seg.content} isBlock isDark={isDark} onHeight={() => {}} />;
          case 'mathInline':
            return <MathView key={i} latex={seg.content} isBlock={false} isDark={isDark} onHeight={() => {}} />;
          default:
            return <Text key={i} style={{ color, fontSize, lineHeight }}>{seg.content}</Text>;
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
});
