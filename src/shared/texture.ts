/* c8 ignore start */
export interface TextureEditOptions {
  rotate?: number;
  hue?: number;
  grayscale?: boolean;
  saturation?: number;
  brightness?: number;
  crop?: { x: number; y: number; width: number; height: number };
  resize?: { width: number; height: number };
  flip?: 'horizontal' | 'vertical';
  overlay?: string; // PNG data URL to draw over the texture
}
/* c8 ignore end */
