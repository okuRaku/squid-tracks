# Development

If you're interested in contributing feel free to contact me or create a pull request.

## Submitting a pull request

These instructions are a bit rough.  Feel free to message me with questions.
1. [Fork the project](https://help.github.com/articles/fork-a-repo/)
2. Create a new branch off your fork from latest beta branch
3. Commit your changes to the new branch
4. When you're ready to submit your pull request, [Sync to beta branch](https://gist.github.com/ravibhure/a7e0918ff4937c9ea1c456698dcd58aa) and rebase your branch onto the
newest commit in the latest beta branch
5. [Submit your pull request](https://help.github.com/articles/about-pull-requests/)

## Running Development Mode
To run in development mode install [yarn](https://yarnpkg.com).
```
yarn
yarn run dev
```

## Building
if your platform is not supported you should be able to create an installer by
running in development mode or by building it by calling:
```
yarn run build
```  
The installer will be created in `/dist`.

Official builds are currently built locally on windows and on travis for the Mac and Linux binaries.

## Development Notes
Note: Render Process is using babel, but the backend process is not, so allowed syntax between the two is different right now.

## Translations
translations are located in `scr/locales/<locale code>.json`

### Adding a translation language
In `src/messages.js`,
1. add translation package from `react-intl`
    ```js
    import szLocaleData from 'react-intl/locale-data/zz';
    ```
2. add package to addLocaleData
    ```js
    addLocaleData([...jaLocaleData, ...zzLocaleData]);
    ```
3. import messages and add to export
    ```js
    import sz from './locales/zz';
    export default {
        ja,
        zz,
    };
    ```
In `translationRunner.js`
```js
manageTranslations({
    ...
    languages: ['ja', 'zz'],
});
```

### Updating the translation keys
If there are new strings in the program or new langauges added, run these commands.
```
yarn run dev
yarn run manage:translations
```
