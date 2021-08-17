# Purpose 
[gene.iobio](https://gene.iobio) is a real-time, intuitive and interactive variant interrogation and prioritization web application. gene.iobio enables secure, clinically-driven variant prioritization, bringing clinical care providers’ intimate knowledge of the patient’s disease and phenotype closer to their genetics.  gene.iobio is publicly available at [gene.iobio.io](https://gene.iobio) - where users can try it out with demo data (NA12878 trio) or input their own data (via publicly accessible URLS or local files) using the file input dialog. 

### Usage
gene.iobio is free for academic use only. For all other uses, including commercial use, please contact iobioproject@gmail.com 

### Disclaimer
The University of Utah makes no claims that iobio applications, including gene.iobio are approved for clinical use. All users of iobio applications including gene.iobio understand and accept that any information gained by using these applications, whether the information comes from visualization, processing, internal or external databases, or analysis, may not in any way be used for clinical purposes. The University of Utah makes no representation that iobio or gene.iobio is either safe or effective for any intended use for which research may currently be performed. iobio, or any iobio applications ARE TO BE USED FOR RESEARCH PURPOSES ONLY. USE FOR CLINICAL PURPOSES IS EXPRESSLY FORBIDDEN. Approval of iobio applications for clinical use has neither been applied for, nor received, in any country, including the United States of America.


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
Now open [http://localhost:4026](http://localhost:4026).


### Rebuild after client-side changes 
To watch for client-side file changes, open up a new terminal window and `npm run webpack`.

## Install the server application

If you want to do a local install, please contact iobioproject@gmail.com

