# TODO: Update UI Slideshow in index.tsx

## Tasks
- [x] Import PanGestureHandler and State from react-native-gesture-handler for swipe gestures
- [x] Add state management for current slide index (featuredIndex)
- [x] Implement swipe left/right to manually navigate slides
- [x] Add dot indicators below the featured image to show current slide
- [x] Reduce auto-change interval from 12 seconds to 5 seconds
- [x] Update the featured image section to include gesture handler and indicators
- [x] Test the slideshow functionality (swipe, auto-change, indicators)

## Notes
- Ensure react-native-gesture-handler is installed (common in Expo apps)
- Use PanGestureHandler for swipe detection
- Dots should be touchable to jump to specific slides
- Maintain fade animation on auto-change and manual swipe
