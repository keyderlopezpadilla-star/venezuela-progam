{
  "$schema": "https://json.schemastore.org/tsconfig.json",
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noEmit": true,
    "jsx": "preserve",
    "allowJs": true,
    "isolatedModules": true,
    "types": ["@types/node"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}