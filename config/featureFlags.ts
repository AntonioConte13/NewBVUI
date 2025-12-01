
export const FEATURE_FLAGS = {
  // Core Features (Always On)
  CERTIFICATION_PATHWAY: true,
  DRILL_ARMORY: true,
  QUIZ_SYSTEM: true,
  
  // Coming Soon Features (MVP Off)
  GAMES: true,
  SQUAD_MANAGEMENT: false,
  SOCIAL_FEED: true,
  VIDEO_ANALYSIS: false,
  INTEL_BOOKMARKS: false,
  OVERWATCH_ADMIN: false,
  LEADERBOARDS: true
}

export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS) => {
  return FEATURE_FLAGS[feature]
}
