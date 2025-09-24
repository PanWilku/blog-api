/* eslint-disable */
/* Note: disable ESLint for this file to avoid the parser requiring tsconfigRootDir.
   For a permanent fix, set parserOptions.tsconfigRootDir in your ESLint config. */

declare global {
  interface ImportMeta {
    readonly env: {
      VITE_API_URL: string;
      [key: string]: unknown;
    };
  }
}

export const API_URL = import.meta.env.VITE_API_URL as string;

export const api = {
  index: () => fetch(`${API_URL}/`).then((res) => res.json()),
};
