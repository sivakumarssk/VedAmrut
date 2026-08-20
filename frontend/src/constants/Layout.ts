export const TAB_BAR_HEIGHT = 72;
export const TAB_BAR_BOTTOM_MARGIN = 16;

// Minimum bottom padding a scrollable screen needs so its last item
// clears the floating tab bar. Screens should add safe-area inset on top
// of this where relevant (this value assumes the tab bar's own bottom
// offset already accounts for the safe area).
export const SCREEN_BOTTOM_PADDING = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_MARGIN + 24;
