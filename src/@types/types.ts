/** Props do componente NextImage (src/components/ui/NextImage.tsx) — nunca tinha
 * um arquivo de tipos de verdade, so o import quebrado. Shape derivado direto do
 * destructure/uso do proprio componente (nenhum outro arquivo consome NextImage
 * ainda). */
export interface NextImageType {
  /** `alt` da imagem. */
  altImage: string;
  /** `aria-label`/`title` opcional do wrapper. */
  ariaLabel?: string;
  /** URL da imagem (modo claro / padrão). */
  imageUrl: string;
  /** URL alternativa pro modo escuro. */
  imageDarkUrl?: string;
  className?: string;
  extraClassName?: string;
  fill?: boolean;
  draggable?: boolean;
  sizes?: string;
}
