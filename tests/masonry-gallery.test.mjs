import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createGallerySession,
  getAdjacentGalleryIndex,
  getLockedBodyStyles,
  moveGallerySession,
} from '../lib/masonry-gallery.mjs'

test('gallery navigation wraps at both ends', () => {
  assert.equal(getAdjacentGalleryIndex(0, -1, 5), 4)
  assert.equal(getAdjacentGalleryIndex(4, 1, 5), 0)
  assert.equal(getAdjacentGalleryIndex(2, 1, 5), 3)
})

test('body lock preserves the current scroll position and scrollbar width', () => {
  assert.deepEqual(getLockedBodyStyles(640, 17), {
    position: 'fixed',
    top: '-640px',
    left: '0',
    right: '0',
    width: '100%',
    paddingRight: '17px',
    overflow: 'hidden',
  })
})

test('image navigation preserves the opening trigger and scroll position', () => {
  const opened = createGallerySession(5, 2343.2)
  const moved = moveGallerySession(opened, 1, 80)

  assert.deepEqual(moved, {
    activeIndex: 6,
    triggerIndex: 5,
    openedAtScrollY: 2343.2,
  })
})
