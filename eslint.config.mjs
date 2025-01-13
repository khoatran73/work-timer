import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const eslintConfig = [
    ...compat.config({
        extends: ['next/core-web-vitals'],
        rules: {
            '@typescript-eslint/no-empty-object-type': 'off',
            'react-hooks/exhaustive-deps': 'off',
        },
    }),
];

export default eslintConfig;
