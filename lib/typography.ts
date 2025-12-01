import { getTypographySettings, TypographySettings } from './firebase';

// Default typography settings (fallback)
const defaultTypography: TypographySettings = {
  heading1: {
    fontSize: { desktop: '3rem', mobile: '2rem' },
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1.2',
  },
  heading2: {
    fontSize: { desktop: '2.25rem', mobile: '1.75rem' },
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: '1.3',
  },
  heading3: {
    fontSize: { desktop: '1.5rem', mobile: '1.25rem' },
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: '1.4',
  },
  body: {
    fontSize: { desktop: '1rem', mobile: '0.875rem' },
    fontWeight: '400',
    color: '#e5e7eb',
    lineHeight: '1.6',
  },
  caption: {
    fontSize: { desktop: '0.875rem', mobile: '0.75rem' },
    fontWeight: '400',
    color: '#9ca3af',
    lineHeight: '1.5',
  },
};

let cachedSettings: TypographySettings | null = null;

export const getTypography = async (): Promise<TypographySettings> => {
  if (cachedSettings) {
    return cachedSettings;
  }
  
  const settings = await getTypographySettings();
  if (settings) {
    cachedSettings = settings;
    return settings;
  }
  
  return defaultTypography;
};

export const clearTypographyCache = () => {
  cachedSettings = null;
};

// Generate CSS classes for typography
export const getTypographyStyles = (settings: TypographySettings) => {
  return {
    heading1: {
      fontSize: { 
        base: settings.heading1.fontSize.mobile,
        md: settings.heading1.fontSize.desktop 
      },
      fontWeight: settings.heading1.fontWeight,
      color: settings.heading1.color,
      lineHeight: settings.heading1.lineHeight,
    },
    heading2: {
      fontSize: { 
        base: settings.heading2.fontSize.mobile,
        md: settings.heading2.fontSize.desktop 
      },
      fontWeight: settings.heading2.fontWeight,
      color: settings.heading2.color,
      lineHeight: settings.heading2.lineHeight,
    },
    heading3: {
      fontSize: { 
        base: settings.heading3.fontSize.mobile,
        md: settings.heading3.fontSize.desktop 
      },
      fontWeight: settings.heading3.fontWeight,
      color: settings.heading3.color,
      lineHeight: settings.heading3.lineHeight,
    },
    body: {
      fontSize: { 
        base: settings.body.fontSize.mobile,
        md: settings.body.fontSize.desktop 
      },
      fontWeight: settings.body.fontWeight,
      color: settings.body.color,
      lineHeight: settings.body.lineHeight,
    },
    caption: {
      fontSize: { 
        base: settings.caption.fontSize.mobile,
        md: settings.caption.fontSize.desktop 
      },
      fontWeight: settings.caption.fontWeight,
      color: settings.caption.color,
      lineHeight: settings.caption.lineHeight,
    },
  };
};

