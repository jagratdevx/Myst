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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const buildMathHtml = (rawContent: string, isDark: boolean): string => {
  const content = escapeHtml(rawContent);
  return `
<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:${isDark ? '#1a1a2e' : '#ffffff'};padding:12px;color:${isDark ? '#e0e0e0' : '#1a1a2e'};font-size:15px;line-height:1.6;font-family:-apple-system,Helvetica,sans-serif;overflow-x:hidden;word-wrap:break-word}
  strong{font-weight:800}
  em{font-style:italic}
  code{background:rgba(128,128,128,0.15);padding:1px 4px;border-radius:4px;font-family:Menlo,monospace;font-size:13px}
  pre{background:${isDark ? '#0d0d1a' : '#f0f0f5'};padding:12px;border-radius:8px;margin:8px 0;overflow-x:auto}
  pre code{background:none;padding:0;font-size:13px}
  .math-block{display:block;text-align:center;margin:8px 0;padding:4px 0}
</style></head><body><div id="c">${content}</div>
<script>
function r(e,d){try{return katex.renderToString(e,{throwOnError:false,displayMode:d,output:'html'})}catch(x){return e}}
var c=document.getElementById('c'),m=c.innerHTML;
m=m.replace(/\`\`\`([\s\S]*?)\`\`\`/g,'<pre><code>$1</code></pre>');
m=m.replace(/\$\$([\s\S]*?)\$\$/g,function(_,p){return '<div class="math-block">'+r(p,true)+'</div>'});
m=m.replace(/\$([^$\n]+?)\$/g,function(_,p){return r(p,false)});
m=m.replace(/\`([^\`]+)\`/g,'<code>$1</code>');
m=m.replace(/\*{2}([^*]+)\*{2}/g,'<strong>$1</strong>');
m=m.replace(/\*([^*]+)\*/g,'<em>$1</em>');
c.innerHTML=m;
setTimeout(function(){window.ReactNativeWebView.postMessage(String(document.body.scrollHeight))},100);
<\/script>
</body></html>`;
};

function hasMath(text: string): boolean {
  return /\$\$[\s\S]*?\$\$/.test(text) || /(?<!\$)\$(?!\$)(?:[^$\n])+?\$(?!\$)/.test(text);
}

interface SimpleSegment {
  type: 'text' | 'bold' | 'italic' | 'code';
  content: string;
}

function parseSimpleMarkdown(text: string): SimpleSegment[] {
  const allMatches: { index: number; length: number; content: string; type: SimpleSegment['type'] }[] = [];
  const patterns: { regex: RegExp; type: SimpleSegment['type'] }[] = [
    { regex: /`([^`]+)`/g, type: 'code' },
    { regex: /\*\*([^*]+)\*\*/g, type: 'bold' },
    { regex: /\*([^*]+)\*/g, type: 'italic' },
  ];

  for (const { regex, type } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      allMatches.push({ index: match.index, length: match[0].length, content: match[1], type });
    }
  }

  allMatches.sort((a, b) => a.index - b.index);

  const segments: SimpleSegment[] = [];
  let lastIndex = 0;
  for (const match of allMatches) {
    if (match.index < lastIndex) continue;
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      if (plain) segments.push({ type: 'text', content: plain });
    }
    segments.push({ type: match.type, content: match.content });
    lastIndex = match.index + match.length;
  }
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) segments.push({ type: 'text', content: remaining });
  }
  return segments;
}

export const MarkdownText = ({ content, textColor, fontSize = 15, lineHeight = 22 }: MarkdownTextProps) => {
  const { isDark } = useTheme();
  const color = textColor || (isDark ? '#e0e0e0' : '#1a1a2e');
  const [webViewHeight, setWebViewHeight] = useState(100);

  if (hasMath(content)) {
    return (
      <View style={{ height: webViewHeight, borderRadius: 8, overflow: 'hidden' }}>
        <WebView
          source={{ html: buildMathHtml(content, isDark) }}
          style={{ flex: 1, backgroundColor: 'transparent' }}
          scrollEnabled={false}
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          androidLayerType="software"
          onMessage={(e) => {
            const h = parseInt(e.nativeEvent.data, 10);
            if (h > 0) setWebViewHeight(h);
          }}
        />
      </View>
    );
  }

  const segments = parseSimpleMarkdown(content);

  return (
    <Text style={{ color, fontSize, lineHeight }}>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'bold':
            return <Text key={i} style={{ fontWeight: '800', color, fontSize, lineHeight }}>{seg.content}</Text>;
          case 'italic':
            return <Text key={i} style={{ fontStyle: 'italic', color, fontSize, lineHeight }}>{seg.content}</Text>;
          case 'code':
            return <Text key={i} style={[styles.codeText, { color, fontSize, lineHeight }]}>{seg.content}</Text>;
          default:
            return <Text key={i} style={{ color, fontSize, lineHeight }}>{seg.content}</Text>;
        }
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
});
