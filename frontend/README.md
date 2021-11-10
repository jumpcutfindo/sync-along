# frontend

This hosts the frontend app of Sync-along. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), with Yarn as the package manager of choice.

## Setting up

To set up the app:

1. Clone the repo
2. Switch to the `/frontend/` app
3. Run `yarn` to install dependencies
4. Add a `.env` file to the `/frontend` folder, with the following configurations:

```
BACKEND_ENV_URL= # include backend env url here
```

5. Run `yarn start` to start the frontend app. Note that this depends on the backend app (also in this repository) to work.

## File Structure

Most of the code lives in the `src` folder and looks like this:

```
src
+-- api               # hosts base level API configurations that can be used by all pages in the app
|
+-- assets            # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application
|
+-- pages             # individual pages seen by users of the app
|
+-- hooks             # hooks shared across the entire app
|
+-- router             # routes used in the app
|
+-- services             # APIs and Redux middleware for handling socket connections
|
+-- stores             # Redux stores
```

Most of the code is kept inside the `pages` folder, which hosts a folder for each page. Each folder should contain domain specific code for a given page. For example, if we wanted to have a Login page, then we would hae a folder at `src/pages/Login`, which can host the React component, logic and styles for login-related functionality.

Each subfolder can have the following structure:

```
src/pages/[feature]
|
+-- api         # exported API request declarations and api hooks related to a specific feature
|
+-- assets      # assets folder can contain all the static files for a specific feature
|
+-- components  # components scoped to a specific feature
|
+-- hooks       # hooks scoped to a specific feature
|
+-- utils       # utility functions for a specific feature
|
+-- index.ts    # entry point for the feature, it should serve as the public API of the given feature and exports everything that should be used outside the feature
```

Everything from a feature should be exported from the `index.ts` file.

## Minor details

Absolute path resolution has been set up, so instead of having to traverse the directory all the way to where a file is located, we can specify the absolute path starting from the `src`.

For example, to import a page, we could do the following:

```
import Dashboard from 'src/pages/Dashboard';
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\

### `yarn lint`

Runs the code through the linter and shows any linting/formatting errors.
This command does not change any files.

### `yarn format`

Formats code and changes files.

<!--### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

-->
