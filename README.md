# Rocketseat - Ignite Call

Rocketseat - Ignite 2023 - ReactJS - Projeto 06

- ReactJs
- NextJs
- ESlint
- Typescript


## Início

Criando o projeto NextJs

```bash
npx create-next-app@latest --use-npm
```

Responder as perguntas para criar o projeto.


### Lint
[Lint](https://medium.com/weekly-webtips/how-to-sort-imports-like-a-pro-in-typescript-4ee8afd7258a)

```bash
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-import eslint-import-resolver-typescript
```


#### Arquivo `.eslintrc.js`
  - rules

```javascript
'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true,
      },
    ],
'import/order': [
         'error',
         {
           groups: [
             'builtin', // Built-in imports (come from NodeJS native) go first
             'external', // <- External imports
             'internal', // <- Absolute imports
             ['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
             'index', // <- index imports
             'unknown', // <- unknown
           ],
           'newlines-between': 'always',
           alphabetize: {
             /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
             order: 'asc',
             /* ignore case. Options: [true, false] */
             caseInsensitive: true,
           },
         },
       ],
```



  - extends
```javascript
...
  'plugin:import/recommended',
  'plugin:import/typescript',
```


  - settings
  ```javascript
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  ```



#### Arquivo `.prettierrc.js`

```javascript
module.exports = {
  "trailingComma": "all",
  "useTabs": false,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "printWidth": 90,
  "arrowParens": "always",
  "endOfLine": "lf",
  "editorconfig": true,
  "singleAttributePerLine": true,
  // "importOrder": [
  //   "^react$",
  //   "^react-native$",
  //   "^@react-navigation$",
  //   "^@storage/(.*)$",
  //   "^@screens/(.*)$",
  //   "^@components/(.*)$",
  //   "^@assets/(.*)$",
  //   "^[./]"
  // ],
  // "importOrderSeparation": true,
  // "importOrderSortSpecifiers": true
}
```




### Design System

[Design System Ignite Call]
```bash
npm i @ignite-ui/react@latest
```



## Pacotes

### Front-end
- [Phosphor-Icons](https://phosphoricons.com/)

```bash
npm i phosphor-react
```



-[Formulário](https://react-hook-form.com/)

```bash
npm i react-hook-form @hookform/resolvers zod
```




### Back-end

- [Prisma](https://www.prisma.io/)

```bash
npm i prisma -D
npm i @prisma/client

npx prisma init --datasource-provider SQLite
```
Vou mudar o banco para PostgreSQL depois.




- [Axios](https://axios-http.com/)

```bash
npm i axios
```



- [Cookies - nookies](https://www.npmjs.com/package/nookies)

```bash
npm i nookies
npm i -D @types/cookie
```
