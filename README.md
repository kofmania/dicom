# React + TypeScript + Vite + Cornerstone.js

- vite/react/ts
- tailwind css
- Cornerstone.js

  - viewport.setStack pending issue

    - https://www.cornerstonejs.org/docs/getting-started/vue-angular-react-etc#basic-setup

    ```
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

    export default defineConfig({
      plugins: [
        react(),
        // for dicom-parser
        viteCommonjs(),
      ],
      // seems like only required in dev mode
      optimizeDeps: {
        exclude: ['@cornerstonejs/dicom-image-loader'],
        include: ['dicom-parser'],
      },
      worker: {
        format: 'es',
      },
    });
    ```
