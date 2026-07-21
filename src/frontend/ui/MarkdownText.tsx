import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, Platform, ScrollView } from 'react-native';
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

const PROCESSOR_JS = String.raw`
var c=document.getElementById('c');
var r=function(e,m){try{return katex.renderToString(e,{throwOnError:false,displayMode:m,output:'html'})}catch(x){return '<span class="katex-err">'+escapeHtml(e)+'</span>'}};
function escapeHtml(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
try{
var t=CONTENT_PLACEHOLDER;
t=t.replace(/\`\`\`([\s\S]*?)\`\`\`/g,'<pre><code>$1</code></pre>');
t=t.replace(/\$\$([\s\S]*?)\$\$/g,function(a,p){return '<div class="kb">'+r(p,true)+'</div>'});
t=t.replace(/\\\[([\s\S]*?)\\\]/g,function(a,p){return '<div class="kb">'+r(p,true)+'</div>'});
t=t.replace(/\\begin\{([\w*]+)\}([\s\S]*?)\\end\{\1\}/g,function(a,env,body){return '<div class="kb">'+r('\\begin{'+env+'}'+body+'\\end{'+env+'}',true)+'</div>'});
t=t.replace(/(?<!\$)\$(?!\$)((?:[^\$\n])+?)\$(?!\$)/g,function(a,p){return r(p,false)});
t=t.replace(/\\\(([\s\S]*?)\\\)/g,function(a,p){return r(p,false)});
t=t.replace(/\`([^\`]+)\`/g,'<code>$1</code>');
t=t.replace(/\*{2}([^*]+)\*{2}/g,'<strong>$1</strong>');
t=t.replace(/\*([^*]+)\*/g,'<em>$1</em>');
t=t.replace(/\n{2,}/g,'</p><p>');
t=t.replace(/\n/g,'<br>');
c.innerHTML='<p>'+t+'</p>';
}catch(e){c.innerHTML='<p style="color:red">Error rendering message</p>'}
setTimeout(function(){window.ReactNativeWebView.postMessage(String(document.body.scrollHeight))},100);
`;

function buildFullHtml(content: string, isDark: boolean): string {
  const encoded = btoa(unescape(encodeURIComponent(escapeHtml(content))));
  const js = PROCESSOR_JS.replace('CONTENT_PLACEHOLDER', `atob('${encoded}')`);
  const bg = isDark ? '#1a1a2e' : '#ffffff';
  const fg = isDark ? '#e0e0e0' : '#1a1a2e';
  const cb = isDark ? '#0d0d1a' : '#f0f0f5';
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:${bg};padding:2px 0;color:${fg};font-size:15px;line-height:1.6;font-family:-apple-system,Helvetica,sans-serif;overflow-x:hidden;word-wrap:break-word;min-width:300px}
p{margin:0 0 6px 0}
strong{font-weight:800}
em{font-style:italic}
code{background:rgba(128,128,128,0.15);padding:1px 4px;border-radius:4px;font-family:Menlo,monospace;font-size:13px}
pre{background:${cb};padding:12px;border-radius:8px;margin:8px 0;overflow-x:auto}
pre code{background:none;padding:0;font-size:13px}
.kb{display:block;text-align:center;margin:6px 0;padding:2px 0;overflow-x:auto}
.katex-err{color:${isDark?'#ef9a9a':'#c62828'}}
</style>
</head><body><div id="c"></div><script>${js}<\/script></body></html>`;
}

function parseInlineMarkdown(text: string): { type: 'text' | 'bold' | 'italic' | 'code'; content: string }[] {
  const segs: { type: 'text' | 'bold' | 'italic' | 'code'; content: string }[] = [];
  const matches: { index: number; length: number; content: string; type: 'text' | 'bold' | 'italic' | 'code' }[] = [];
  const patterns: { regex: RegExp; type: 'text' | 'bold' | 'italic' | 'code' }[] = [
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

export const MarkdownText = ({ content, textColor, fontSize = 15, lineHeight = 22 }: MarkdownTextProps) => {
  const { isDark } = useTheme();
  const color = textColor || (isDark ? '#e0e0e0' : '#1a1a2e');
  const [webViewHeight, setWebViewHeight] = useState<number | null>(null);

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

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      bounces={false}
      style={{ borderRadius: 8 }}
      contentContainerStyle={{ minHeight: webViewHeight || 28, minWidth: '100%' }}
    >
      <WebView
        source={{ html: buildFullHtml(content, isDark) }}
        style={{ width: 600, height: webViewHeight || 28, backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }}
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
    </ScrollView>
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
