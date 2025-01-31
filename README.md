# Online Pizza Delivery Application

## Git Setup

```Markdown
git init

git remote add origin <remote git repository URL>

git status

git add .

git commit -m "Initial commit"

git push origin main

```

## NVM Setup

```Markdown

install nvm

.nvmrc

nvm install v22.10.0

nvm list

nvm use

```

## Typescript Setup

```Markdown

npm install -D typescript

npx tsc --init (to generate the tsconfig.json file)

npx tsc (to compile typescript code to javascript)

npm install -D @types/node

```

## Prettier Setup

```Markdown

npm install --save-dev --save-exact prettier

node --eval "fs.writeFileSync('.prettierrc','{}\n')"

node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"

npx prettier . --check

npx prettier . --write

```

## Eslint Setup

```Markdown

npm install --save-dev eslint @eslint/js typescript-eslint

npx eslint .

```
