import type { Accessory, CatLook } from '../services/types';

export const GUEST_LOOK: CatLook = {
  fur: '#4e5058',
  belly: '#dbdee1',
  accent: '#6d6f78',
  accessory: 'none',
  mood: 'smile',
};

export const FUR_CHOICES = [
  { id: 'slate', label: 'Slate', fur: '#4e5058', belly: '#dbdee1' },
  { id: 'violet', label: 'Violet', fur: '#8b5cf6', belly: '#ece9fe' },
  { id: 'cream', label: 'Mist', fur: '#c9cdd4', belly: '#f2f3f5' },
  { id: 'void', label: 'Void', fur: '#2b2d31', belly: '#b5bac1' },
] as const;

export const ACCESSORIES: { id: Accessory; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'shades', label: 'Shades' },
  { id: 'beanie', label: 'Beanie' },
  { id: 'cap', label: 'Cap' },
  { id: 'crown', label: 'Crown' },
];

export function lookFrom(furId: string, accessory: Accessory): CatLook {
  const fur = FUR_CHOICES.find((choice) => choice.id === furId) ?? FUR_CHOICES[0];
  const accent =
    accessory === 'beanie' ? '#1fa595' : accessory === 'cap' ? '#8b5cf6' : '#5865f2';
  return {
    fur: fur.fur,
    belly: fur.belly,
    accent,
    accessory,
    mood: 'smile',
  };
}
