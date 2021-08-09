# Overview

[gene.iobio](https://gene.iobio) is an interact application for inspecting variants in real-time.

 ![Screenshot of gene.iobio](./client/assets/images/github/screenshot.png)

 ![How it works](./client/assets/images/github/how-it-works.png)

 ![Features](./client/assets/images/github/features.png)

# Installation 

## Install the client application
### Create .env file

```bash
# replace iobio-backend with the url of the gru backend service.
# replace iobio-backend-mosaic with the url of the gru backend service when launching from mosaic

echo "IOBIO_BACKEND=iobio-backend-mosaic" > .env
echo "IOBIO_BACKEND_MOSAIC=iobio-backend-mosaic" >> .env
echo "USE_SSL=true" >> .env
```

[Sample env file](./.env.template)

### Starting App

Using node version 8.5.x

```
npm install
npm start
```

Now open [http://localhost:3000](http://localhost:3000).

To watch for client-side file changes, open up a new terminal window and `npm run webpack`.

### Running Client-side Tests

`npm test`
