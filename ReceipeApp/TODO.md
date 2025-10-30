# TODO List for Adding Animation and Alert on 5-Star Rating

- [x] Import necessary modules (Alert, Animated from react-native-reanimated) in app/recipe/[id].tsx
- [x] Add state for animation (e.g., animated value for scale or opacity)
- [x] Modify handleRatingCompleted function to check if rating is 5, trigger animation, and show confirmation alert
- [x] Add animated view or modify existing rating component to include animation effect
- [x] Add shared value for animation (scale) using useSharedValue in app/recipe/[id].tsx
- [x] Wrap the Rating component in an Animated.View with animated style for scale
- [x] Modify handleRatingCompleted: If value === 5, trigger animation (scale up to 1.2 then back to 1), show Alert with confirmation message
- [x] Update TODO.md to mark tasks as done after implementation
- [ ] Test the changes to ensure animation and alert work correctly
