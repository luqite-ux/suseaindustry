export type GallerySession = { activeIndex: number; triggerIndex: number; openedAtScrollY: number }
export function getAdjacentGalleryIndex(currentIndex: number, direction: number, itemCount: number): number
export function getLockedBodyStyles(scrollY: number, scrollbarWidth: number): {
  position: string
  top: string
  left: string
  right: string
  width: string
  paddingRight: string
  overflow: string
}
export function createGallerySession(triggerIndex: number, openedAtScrollY: number): GallerySession
export function moveGallerySession(session: GallerySession, direction: number, itemCount: number): GallerySession
