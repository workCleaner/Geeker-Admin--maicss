// @see https://unocss.dev/guide/config-file

import {
  defineConfig,
  presetWind4,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: 'var(--el-color-primary)',
      primary_dark: 'var(--el-color-primary-light-5)',
    },
  },
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetAttributify(),

    presetIcons({
      // 额外属性
      extraProperties: {
        display: 'inline-block',
        width: '1em',
        height: '1em',
      },
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  safelist: [],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
