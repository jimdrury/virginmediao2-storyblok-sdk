import z from 'zod/v4';

const storyblokSchema = z
  .object({
    STORYBLOK_ACCESS_TOKEN: z.string(),
  })
  .transform(({ STORYBLOK_ACCESS_TOKEN }) => ({
    ACCESS_TOKEN: STORYBLOK_ACCESS_TOKEN,
  }));

export const STORYBLOK = storyblokSchema.parse(process.env);
