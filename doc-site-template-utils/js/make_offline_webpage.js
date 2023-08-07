const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const docSiteTemplatePath = 'doc-site-template';
const packageJsonPath = docSiteTemplatePath + '/package.json';
const hugoTomlPath = docSiteTemplatePath + '/hugo.toml';
const exampleDocsPath = docSiteTemplatePath + '/content/en/docs';
// const markdownDocsPath = 'docs/*.md';

let toml, tomlify, glob;

// Function to check if a package is installed
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (error) {
    return false;
  }
}

// Function to create a temporary directory
function createTempDir() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'npm-temp-'));
  console.log('Created temporary directory:', tempDir);
  return tempDir;
}

// Function to remove a directory and its contents recursively
function removeDirRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        removeDirRecursive(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(dir);
  }
}

// Function to install missing dependencies in a temporary directory
function installMissingDependencies() {
  const modulesToInstall = ['toml', 'glob', 'tomlify-j0.4', 'yargs'];
  const tempDir = createTempDir();
  let originalNodePath; // Define the variable outside of the try block

  try {
    // Modify the NODE_PATH to include the temporary directory
    originalNodePath = process.env.NODE_PATH; // Assign the current NODE_PATH to the variable
    process.env.NODE_PATH = path.join(tempDir, 'node_modules');
    require('module').Module._initPaths(); // Refresh module paths

    for (const module of modulesToInstall) {
      // Use the --prefix flag to specify the temporary directory for installation
      console.log(`Installing '${module}' package to temp directory...`);
      execSync(`npm install --prefix ${tempDir} ${module}`);
      console.log(`'${module}' package installed successfully.`);
    }

    // Call main()
    main();

  } catch (error) {
    console.error('Error installing dependencies:', error.message);
  } finally {
    // Restore the original NODE_PATH
    process.env.NODE_PATH = originalNodePath;
    require('module').Module._initPaths(); // Refresh module paths

    // Remove the temporary directory and its contents after the script is done
    removeDirRecursive(tempDir);
    console.log('Removed temporary directory:', tempDir);
  }
}

// Function to to modify git cloned doc-site-template/package.json
function modifyPackageJson() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.scripts['build-D'] = "hugo -D";
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("Modified 'scripts' in package.json with 'build-D: 'hugo -D'");
}

// Function to modify git cloned doc-site-template/hugo.toml
function modifyHugoToml() {
  const tomlify = require('tomlify-j0.4');
  const toml = require('toml');
  const content = fs.readFileSync(hugoTomlPath, 'utf8');

  // Parse the TOML content into a JavaScript object
  const parsedToml = toml.parse(content);

  // Modify the 'uglyURLs' and 'relativeURLs' properties
  parsedToml.uglyURLs = true;
  parsedToml.relativeURLs = true;

  // Convert the modified object to TOML format
  const modifiedContent = tomlify.toToml(parsedToml);

  if (modifiedContent === content) {
      console.log("'uglyURLs' and 'relativeURLs' are already set to true.");
  } else {
      fs.writeFileSync(hugoTomlPath, modifiedContent);
      console.log("Modified 'uglyURLs' and 'relativeURLs' in hugo.toml");
  }
}

// Function to remove example docs and copy your markdown docs
function updateDocs(markdownDocsPath) {
  const glob = require('glob');
  try {
    // Get a list of all files in the exampleDocsPath directory
    const filesInExampleDocs = glob.sync(path.join(exampleDocsPath, '*'));
    console.log('Found example markdown files:\n' + filesInExampleDocs.join('\n'));
    // Filter out the files you want to keep (e.g., _index.md)
    const filesToKeep = filesInExampleDocs.filter(file => path.basename(file) === '_index.md');

    // Remove all other files
    for (const file of filesInExampleDocs) {
      if (!filesToKeep.includes(file)) {
        fs.unlinkSync(file);
        console.log('Removed: ' + file);
      }
    }

    // Copy your markdown docs
    console.log('Trying to get markdown files from: ' + markdownDocsPath);
    const markdownFiles = glob.sync(markdownDocsPath);
    console.log('Found markdown files:\n' + markdownFiles.join('\n'));
    for (const file of markdownFiles) {
      const baseFileName = path.basename(file);
      if (baseFileName !== '_index.md') {
        const fileExtension = path.extname(file);
        const newFileName = path.join(exampleDocsPath, baseFileName);
        fs.copyFileSync(file, newFileName);
        console.log('Copied: ' + file);
      } else {
        console.log('Skipped: ' + file + ' (file with name "_index.md" ignored)');
      }
    }
  } catch (error) {
    console.error('Error updating docs:', error.message);
  }
}

// Main function to execute all modifications
function main() {
  // Initialize the argument parser (using 'yargs' in this example)
  const argv = require('yargs')
    .option('md-path', {
      alias: 'm',
      describe: 'Path to the markdown documentation files',
      demandOption: true, // Mark the argument as required
      type: 'string', // Set the type of the argument (in this case, a string)
      normalize: true, // Normalize the path to remove trailing slashes, etc.
    })
    .argv;

  // Get the markdownDocsPath from the parsed arguments
  let markdownDocsPath = argv['md-path'];

  // Append the wildcard pattern to the markdownDocsPath
  markdownDocsPath = path.join(markdownDocsPath, '*.md');

  // installMissingDependencies();
  modifyPackageJson();
  modifyHugoToml();
  updateDocs(markdownDocsPath);
}

// main() is called within because this creates a temp dir to install missing node modules then deletes them
installMissingDependencies();
// main();