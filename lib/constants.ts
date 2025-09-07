// lib/constants.ts

export const NOTE_TAGS = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export type NoteTag = (typeof NOTE_TAGS)[number];
export const TAGS = ["All", ...NOTE_TAGS] as const;
export type TagWithAll = (typeof TAGS)[number];
