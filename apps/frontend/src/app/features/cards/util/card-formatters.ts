export const formatCardValue = (value: number | string | null): string => {
  if (value === null) {
    return 'N/A';
  }

  if (typeof value === 'number') {
    return value > 0 ? `+${value}` : `${value}`;
  }

  return value;
};

export const formatOwnedStatus = (value: boolean | null): string => {
  if (value === null) {
    return 'Unknown';
  }

  return value ? 'Owned' : 'Missing';
};

export const rarityTone = (
  rarity: string
): 'neutral' | 'accent' | 'success' | 'warning' | 'danger' => {
  const normalized = rarity.toLowerCase();

  if (normalized.includes('légendaire')) {
    return 'success';
  }

  if (normalized.includes('secr')) {
    return 'warning';
  }

  if (normalized.includes('rare')) {
    return 'accent';
  }

  return 'neutral';
};
