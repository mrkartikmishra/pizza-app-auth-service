import { Config } from './config';

console.log('Welcome to online Pizza delivery application!!');

function getName(name: string) {
    console.log('PORT=', Config.PORT);
    return 'Hello ' + name;
}

getName('Kartik');
