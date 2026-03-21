/**
 * Shared typography for chapter HTML in the studio editor and the public reader.
 * Matches backend sanitize allowlist in `backend/src/utils/rich-text.ts`.
 */
export const chapterProseTailwindClassName = [
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic",
  "[&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:leading-tight",
  "[&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:leading-tight",
  "[&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:leading-snug",
  "[&_h4]:mt-5 [&_h4]:text-lg [&_h4]:font-bold",
  "[&_h5]:mt-4 [&_h5]:text-base [&_h5]:font-bold",
  "[&_h6]:mt-4 [&_h6]:text-sm [&_h6]:font-bold [&_h6]:uppercase [&_h6]:tracking-wide",
  "[&_li]:my-1",
  "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
  "[&_p]:my-4",
  "[&_strong]:font-black",
  "[&_em]:italic",
  "[&_u]:underline [&_u]:underline-offset-2",
  "[&_s]:line-through [&_del]:line-through [&_strike]:line-through",
  "[&_code]:rounded-md [&_code]:bg-primary/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:[font-variant-ligatures:none]",
  "[&_pre]:my-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-primary/15 [&_pre]:bg-primary/5 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm",
  "[&_pre_code]:rounded-none [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[0.95em]",
  "[&_hr]:my-10 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-primary/25",
].join(" ");
