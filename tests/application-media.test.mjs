import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const files = [
  new URL("../components/home/applications-preview.tsx", import.meta.url),
  new URL("../app/applications/page.tsx", import.meta.url),
]

const cleanedMedia = {
  unicorn:
    "https://pub-c7a22068052144a5805830c30d280128.r2.dev/site-assets/suseaindustry/products/ai-watermark-cleaned/6c36e88e00b8049e-3.jpg",
  character:
    "https://pub-c7a22068052144a5805830c30d280128.r2.dev/site-assets/suseaindustry/products/ai-watermark-cleaned/3d0d7cab9fc5daed-18.jpg",
}

test("application cards use the immutable cleaned R2 photographs", async () => {
  const sources = await Promise.all(files.map((file) => readFile(file, "utf8")))

  for (const source of sources) {
    assert.doesNotMatch(source, /\/images\/print-sample-(?:unicorn|hellokitty)\.jpg/)
    assert.match(source, new RegExp(cleanedMedia.unicorn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
    assert.match(source, new RegExp(cleanedMedia.character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
  }
})
