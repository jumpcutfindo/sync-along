# Backend App

## Setting up the app locally

1. Clone this repository and move to the `/backend` folder
2. Run `npm install` to install the app
3. Install the following as pre-requisites and start these services
   1. Redis
   2. MongoDB
4. (Optional) Include the following application secrets in an `.env` file, at the `/backend` folder:

```
MONGODB_CONNECTION_URL= # mongodb connection URI
FRONTEND_URL= # URL to the frontend app
REDIS_HOST= # host of the local Redis instance
REDIS_PORT= # port of local Redis instance
YOUTUBE_API_KEY= # Youtube API key
```

5. Finally, run `npm run dev` to start a development server. By default, it will start the server at `http://localhost:4001`

## File Structure of the app

The following illustrates the general file structure of the app:

```
src
+-- connections               # Classes that manage connections to infrastructures used (eg databases)
|
+-- constants            # Constants such as URLs to managed database clusters
|
+-- controllers        # Controllers, separating each service
|
+-- dao             # Data access objects of various services
+-- services             # Hosts entry points to various services, with each folder representing each service.
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
