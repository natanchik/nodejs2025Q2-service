export class Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export const artists: { [id: string]: Artist } = {};
