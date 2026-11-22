export interface MediaAssetEntry {
  readonly file: string;
  readonly enabled: boolean;
  readonly alt: string;
}

export const MEDIA_CONFIG: Record<string, MediaAssetEntry> = {
  wallpaper: {
    file: "media/wallpaper.jpg",
    enabled: false,
    alt: "Botanical dew leaf editorial wallpaper",
  },
  whyGardenHero: {
    file: "media/why-garden-hero.jpg",
    enabled: false,
    alt: "Fresh vegetables and food supply chain",
  },
  benefitsHero: {
    file: "media/benefits-hero.jpg",
    enabled: false,
    alt: "Warm sunlit home harvest",
  },
  startSmallHero: {
    file: "media/start-small-hero.jpg",
    enabled: false,
    alt: "Small balcony container garden",
  },
  finalGarden: {
    file: "media/final-garden.jpg",
    enabled: false,
    alt: "Lush living home garden",
  },
};
