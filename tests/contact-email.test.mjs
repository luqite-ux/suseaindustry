import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const contactPage = readFileSync(new URL("../app/contact/page.tsx", import.meta.url), "utf8")
const footer = readFileSync(new URL("../components/site-footer.tsx", import.meta.url), "utf8")

test("contact page renders the tenant contact email as a mail link", () => {
  assert.match(contactPage, /getSite\("en"\)/)
  assert.match(contactPage, /mailto:\$\{site\.email\}/)
})

test("site footer renders the same tenant contact email", () => {
  assert.match(footer, /getSite\("en"\)/)
  assert.match(footer, /mailto:\$\{site\.email\}/)
})
