"""Build outlined Inter identity assets; requires fontTools with WOFF2 support."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
import html
root=Path(__file__).resolve().parents[2]
out=root/'public/brand'
font=TTFont(root/'public/fonts/inter-latin.woff2')
font=instantiateVariableFont(font,{'wght':750},inplace=False)
glyphs=font.getGlyphSet(); cmap=font.getBestCmap();upm=font['head'].unitsPerEm

def lettering(value,size,tracking=0,weight=None):
    f=font if weight is None else instantiateVariableFont(TTFont(root/'public/fonts/inter-latin.woff2'),{'wght':weight},inplace=False)
    gs=f.getGlyphSet();parts=[];cursor=0
    for char in value:
        name=cmap[ord(char)];pen=SVGPathPen(gs);gs[name].draw(pen)
        if pen.getCommands():parts.append(f'<path transform="translate({cursor:.3f} 0)" d="{pen.getCommands()}"/>')
        cursor+=gs[name].width+tracking*upm/size
    return f'<g transform="scale({size/upm:.6f} {-size/upm:.6f})">'+''.join(parts)+'</g>',cursor*size/upm-tracking

# Equal panel thickness; declining span, common slope, and shared vertical axis.
panels=['M8 34 88 4v22L8 56Z','M8 64 76 38v22L8 86Z','M8 94 54 76v22L8 116Z']
def mark(a,b):return ''.join(f'<path fill="{b if i==1 else a}" d="{p}"/>' for i,p in enumerate(panels))
def svg(view,body,title):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" role="img"><title>{html.escape(title)}</title>{body}</svg>\n'
for name,a,b in [('fad-mark','#a1e5cf','#f5f4ed'),('fad-mark-dark','#193a32','#398780'),('fad-mark-mono','#193a32','#193a32')]:
    (out/f'{name}.svg').write_text(svg('0 0 96 120',mark(a,b),'FAD — ascending development panels'))
word,width=lettering('FAD',91,3)
for name,color in [('fad-wordmark','#193a32'),('fad-wordmark-reverse','#f5f4ed')]:
    (out/f'{name}.svg').write_text(svg(f'0 0 {width:.2f} 72',f'<g fill="{color}" transform="translate(0 69)">{word}</g>','FAD'))
subtitle,_=lettering('AFFORDABLE DEVELOPMENT',9.2,2,550)
for name,a,b,c in [('fad-logo','#193a32','#398780','#193a32'),('fad-logo-reverse','#a1e5cf','#f5f4ed','#f5f4ed'),('fad-logo-mono','#193a32','#193a32','#193a32')]:
    body=mark(a,b)+f'<g fill="{c}" transform="translate(119 87)">{word}</g><g fill="{c}" transform="translate(121 111)">{subtitle}</g>'
    (out/f'{name}.svg').write_text(svg('0 0 340 120',body,'FAD — Affordable Development'))
(root/'public/favicon.svg').write_text(svg('0 0 128 128','<rect width="128" height="128" rx="24" fill="#193a32"/><g transform="translate(24 14) scale(.83)">'+mark('#a1e5cf','#f5f4ed')+'</g>','FAD'))
# A shareable vector presentation of the finished identity.
board='<rect width="1200" height="780" fill="#f5f4ed"/>'
boardlabel,_=lettering('FJÄLL AFFORDABLE DEVELOPMENT / IDENTITY',10,2,500)
board+=f'<g transform="translate(72 70)" fill="#398780">{boardlabel}</g>'
board+='<g transform="translate(270 155) scale(2)">'+mark('#193a32','#398780')+f'<g fill="#193a32" transform="translate(119 87)">{word}</g><g fill="#193a32" transform="translate(121 111)">{subtitle}</g></g>'
board+='<rect y="470" width="1200" height="310" fill="#193a32"/>'
board+='<g transform="translate(72 542) scale(1.1)">'+mark('#a1e5cf','#f5f4ed')+f'<g fill="#f5f4ed" transform="translate(119 87)">{word}</g><g fill="#f5f4ed" transform="translate(121 111)">{subtitle}</g></g>'
board+='<g transform="translate(810 538) scale(1.3)">'+mark('#a1e5cf','#f5f4ed')+'</g>'
(out/'fad-identity-board.svg').write_text(svg('0 0 1200 780',board,'FAD visual identity — scalable development'))
