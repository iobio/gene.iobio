# Overview

[gene.iobio](https://gene.iobio) is an interactive application for inspecting variants in real-time.  This application is free for academic use. For all commercial use, please contact admin@frameshift.io

 ![Screenshot of gene.iobio](./client/assets/images/github/screenshot.png)

 ![How it works](./client/assets/images/github/how-it-works.png)

 ![Features](./client/assets/images/github/features.png)

# Installation 

## Install the client application

### Install [nodejs](https://nodejs.org/en/download/)

### Create an env file 

[Sample env file](./.env.template)
```bash
cp ./env.template .env
```

### Start the app

```
npm install
npm start
```

### Launch the app in the web browser
Now open [http://localhost:3000](http://localhost:3000).


### Rebuild after client-side changes 
To watch for client-side file changes, open up a new terminal window and `npm run webpack`.

