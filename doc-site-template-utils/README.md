# README.md for /doc-site-template/js/make_offline_webpage.js

## Prerequisites:
Before using the `make_offline_webpage.js` script and cloning the `doc-site-template` repository, ensure that you have the following pre-requisites set up:

1. **Git:** Make sure you have Git installed on your system. You can download it from the official website: [Git Downloads](https://git-scm.com/downloads).

2. **doc-site-template** Clone Defense Unicorn's [doc-site-template](https://github.com/defenseunicorns/doc-site-template) to the root of your project.

3. **Node.js and npm:** The `make_offline_webpage.js` script uses Node.js and npm to manage dependencies and execute scripts. Ensure you have both Node.js and npm installed. You can download them from the official website: [Node.js Downloads](https://nodejs.org/en/download/).


## Overview:
The `/doc-site-template/js/make_offline_webpage.js` script is an essential part of the process that enables the creation of an offline webpage. The webpage is generated using the Defense Unicorns hugo theme, which takes the content from your project's `README.md` and converts it into an offline-friendly html format.

## Setup:
Before using this script, ensure you have cloned the 'doc-site-template' repository from 'https://github.com/defenseunicorns/doc-site-template.git'. This directory structure should look like:

```arduino
Copy code
your_project/
    │
    ├── docs/
    │   ├── doc-site-template-utils/
    │   │   ├── js/
    │   │   │   ├── make_offline_webpage.js
    │   ├── your_docs.md
    |   ├── your_other_docs.md
    |   ├── your_other_other_docs_and_so_on.md
    ├── doc-site-template git clone
    |   ├── content/
    |   |   ├── en/
    |   |   |   ├── docs/
    |   |   |   |   ├── your_docs.md
    |   |   |   |   ├── your_other_docs.md
    ├── ... (other files of your project)
```

## Functionality:
The `make_offline_webpage.js` script performs the following tasks to build the offline webpage:

1. Modifies `package.json`: The script updates the 'scripts' section in the 'package.json' file of the 'doc-site-template' project. Specifically, it adds a new script named 'build-D' that runs `hugo -D` to construct the `public` webpage directory without starting a web server.

2. Modifies `hugo.toml`: The script makes necessary changes to the 'hugo.toml' configuration file of the 'doc-site-template' project. Namely it ensures that `uglyURLs` and `relativeURLs` are set to `true`.  This is what instructs hugo to make the webpage work offline.

## Usage:
To use the `make_offline_webpage.js` script effectively, follow these steps:

1. Navigate to the `doc-site-template` git cloned directory in your project.

2. Run the script using Node.js:
```bash
node ../docs/doc-site-template-utils/js/make_offline_webpage.js
```

3. Once the script completes its execution, you can generate the offline webpage by running the following command:
```bash
npm run build-D
```

This will invoke the Hugo webpage builder, which will take the content from your project's `README.md`, apply the configurations from 'hugo.toml', and produce an offline webpage.

## Additional Notes:
- It is essential to review the modifications made to 'package.json' and 'hugo.toml' by the script to ensure they align with your project requirements.

- The generated offline webpage will be available in the 'public' directory inside the 'doc-site-template' folder. You can view the offline webpage by opening the 'index.html' file in a web browser.

- You can further customize the appearance and behavior of the offline webpage by adjusting the configurations in 'hugo.toml', or by using Hugo themes and templates.