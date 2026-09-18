export function getAdjacentGalleryIndex(currentIndex, direction, itemCount) {
  if (!Number.isInteger(itemCount) || itemCount <= 0) return 0
  return (currentIndex + direction + itemCount) % itemCount
}

export function getLockedBodyStyles(scrollY, scrollbarWidth) {
  return {
    position: 'fixed',
    top: `-${Math.max(0, scrollY)}px`,
    left: '0',
    right: '0',
    width: '100%',
    paddingRight: `${Math.max(0, scrollbarWidth)}px`,
    overflow: 'hidden',
  }
}

export function createGallerySession(triggerIndex, openedAtScrollY) {
  return {
    activeIndex: triggerIndex,
    triggerIndex,
    openedAtScrollY,
  }
}

export function moveGallerySession(session, direction, itemCount) {
  return {
    ...session,
    activeIndex: getAdjacentGalleryIndex(session.activeIndex, direction, itemCount),
  }
}
