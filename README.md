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

"eslint:check": "eslint ."

"eslint:fix": "eslint . --fix"

```

## GIT hooks husky Setup

```Markdown

npm install --save-dev husky

npx husky init

npm install --save-dev lint-staged

in package.json:
----------------

    "lint-staged": {
        "*.js": [
            "npm run format:fix",
            "npm run lint:fix"
        ]
    }

in pre-commit file
------------------
npx lint-staged

```

## Expree Server Setup

```Markdown

npm install nodemon

npm install ts-node

npm install express @types/express

in package.json
---------------

script: {
    "dev": "nodemon src/server.ts" //(nodemon internally use ts-node to compile and run .ts files)
}

npm run dev

```

## Logger Setup

```Markdown

npm install winston


import Winston from 'winston';
import { Config } from '.';

const logger = Winston.createLogger({
    level: 'info',
    defaultMeta: {
        ServiceName: 'Auth-Service',
    },
    transports: [
        new Winston.transports.Console({
        level: 'info',
        format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.json(),
        ),
        silent: Config.NODE_ENV === 'test',
        }),
    ],
});

export default logger;

```

## Error Handler Setup

```Markdown

npm install http-errors

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                status: statusCode,
                path: '',
                location: '',
            },
        ],
    });
});

```
