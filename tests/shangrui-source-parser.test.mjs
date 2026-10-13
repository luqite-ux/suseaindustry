import assert from 'node:assert/strict'
import test from 'node:test'

import {
  parseProductDetail,
  parseProductIndex,
} from '../scripts/shangrui-source-parser.mjs'

test('product index discovers every unique source product link', () => {
  const html = `
    <a href="/pro_100.html"><img src="a.jpg"></a>
    <a href="/pro_100.html">SEBS YH-502T</a>
    <a href='/pro_101.html'>TPE YS-01</a>
    <a href="/pro_28526730_8320901_0_1.html">category</a>
  `

  assert.deepEqual(parseProductIndex(html), [
    { sourceId: '100', sourceUrl: 'http://www.shangrui-chemical.com/pro_100.html', name: 'SEBS YH-502T' },
    { sourceId: '101', sourceUrl: 'http://www.shangrui-chemical.com/pro_101.html', name: 'TPE YS-01' },
  ])
})

test('product detail preserves breadcrumb category, facts, specs and ordered gallery images', () => {
  const html = `
    <title>SEBS YH-502T_yushunchemical</title>
    <span class="ContainerCrumbs">
      <b><a href="/">首页</a></b><em>&gt;&gt;</em>
      <b><a href="/pro_28526730_0_0_1.html">产品中心</a></b><em>&gt;&gt;</em>
      <b><a href="/pro_28526730_8320901_0_1.html">聚合物改性</a></b><em>&gt;&gt;</em>
      <b>SEBS YH-502T</b>
    </span>
    <img bsrc="https://img.example.com/main.jpg" id="big_pic_guige">
    <img data-imgsrc="https://img.example.com/main.jpg">
    <img data-imgsrc="https://img.example.com/second.jpg">
    <div class="show-details-article editor_content_air">
      <ul class="pro-itemspecifics-list"><li><p><label>应用：</label><span>塑料改性</span></p></li><li><p><label>制造商：</label><span>中国石化</span></p></li></ul>
      <p>SEBS YH-502T 是白色粉末或颗粒。</p>
      <table><tbody><tr><td>Structure</td><td>Linear</td></tr><tr><td>Volatile Matter(%)</td><td>&lt;=1.0</td></tr></tbody></table>
    </div>
  `

  assert.deepEqual(parseProductDetail(html, 'http://www.shangrui-chemical.com/pro_100.html'), {
    sourceId: '100',
    sourceUrl: 'http://www.shangrui-chemical.com/pro_100.html',
    name: 'SEBS YH-502T',
    category: '聚合物改性',
    summary: 'SEBS YH-502T 是白色粉末或颗粒。',
    facts: { '应用': '塑料改性', '制造商': '中国石化' },
    specifications: { Structure: 'Linear', 'Volatile Matter(%)': '<=1.0' },
    images: ['https://img.example.com/main.jpg', 'https://img.example.com/second.jpg'],
  })
})

test('challenge-only HTML is rejected instead of being treated as an empty catalog', () => {
  const challenge = '<script>document.cookie="js_clearance=abc"</script>'
  assert.throws(() => parseProductIndex(challenge), /clearance challenge/i)
  assert.throws(() => parseProductDetail(challenge, 'http://www.shangrui-chemical.com/pro_100.html'), /clearance challenge/i)
})
