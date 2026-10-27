import type { Accessory, CatLook } from '../services/types';

export const GUEST_LOOK: CatLook = {
  fur: '#e7b3c7',
  belly: '#fff0f6',
  accent: '#f0d36a',
  accessory: 'crown',
  mood: 'smile',
};

export const FUR_CHOICES = [
  { id: 'gold', label: 'Gold', fur: '#e2c25a', belly: '#fff4c8' },
  { id: 'ginger', label: 'Ginger', fur: '#e8963a', belly: '#ffe0c2' },
  { id: 'cream', label: 'Cream', fur: '#f6edd4', belly: '#fffaf0' },
  { id: 'void', label: 'Void', fur: '#3f3a34', belly: '#d9cbb3' },
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
    accessory === 'beanie' ? '#2ba59a' : accessory === 'cap' ? '#8b5cf6' : '#f0d36a';
  return {
    fur: fur.fur,
    belly: fur.belly,
    accent,
    accessory,
    mood: 'smile',
  };
}
