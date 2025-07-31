#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Setting up Mocha...');

// Ensure src directory exists
if (!fs.existsSync('src')) {
    fs.mkdirSync('src');
    console.log('✅ Created src directory');
}

// Clean up Jest files
try {
    if (fs.existsSync('jest.config.js')) {
        fs.unlinkSync('jest.config.js');
        console.log('✅ Removed jest.config.js');
    }
} catch (error) {
    console.log('⚠️  Could not remove jest.config.js:', error.message);
}

// Uninstall Jest dependencies
console.log('📦 Uninstalling Jest dependencies...');
try {
    execSync('npm uninstall jest', { stdio: 'inherit' });
    console.log('✅ Jest dependencies uninstalled');
} catch (error) {
    console.log('⚠️  Some Jest dependencies may not have been installed');
}

// Install Mocha dependencies
console.log('📦 Installing Mocha dependencies...');
try {
    execSync('npm install --save-dev chai mocha', { stdio: 'inherit' });
    console.log('✅ Mocha dependencies installed');
} catch (error) {
    console.error('❌ Failed to install Mocha dependencies:', error.message);
    process.exit(1);
}

// Create Mocha config
try {
    const mochaConfig = `{
    "extension": [
        "js"
    ],
    "spec": "src/**/*.test.js"
}`;
    fs.writeFileSync('.mocharc.json', mochaConfig);
    console.log('✅ Created .mocharc.json');
} catch (error) {
    console.error('❌ Failed to setup Mocha config:', error.message);
    process.exit(1);
}

// Create Mocha test example
try {
    const mochaTest = `// We support Mocha + Chai for unit testing by default.
// 
// If you prefer using Jest instead, run \`npm run init:jest\` in the terminal to setup Jest dependencies.
// This will switch your project to use Jest which includes built-in assertions and mocking capabilities.

const { assert } = require("chai");

describe('Mocha Test suite', function () {
    it('should expect to add', function () {
        assert.equal(2 + 3, 5);
    });
});`;
    fs.writeFileSync('src/index.test.js', mochaTest);
    console.log('✅ Created Mocha test example in src/index.test.js');
} catch (error) {
    console.error('❌ Failed to setup Mocha test:', error.message);
    process.exit(1);
}

// Update package.json test script
try {
    const packageJsonPath = 'package.json';
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts.test = 'mocha';
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('✅ Updated package.json test script');
    }
} catch (error) {
    console.error('❌ Failed to update package.json:', error.message);
}

console.log('🎉 Mocha setup complete! Reloading window now ...');

try {
    const vscodeDir = '.vscode';
    const settingsFile = path.join(vscodeDir, 'settings.json');

    if (!fs.existsSync(vscodeDir)) {
        fs.mkdirSync(vscodeDir);
    }

    let settings = {};
    if (fs.existsSync(settingsFile)) {
        try {
            const settingsContent = fs.readFileSync(settingsFile, 'utf8');
            settings = JSON.parse(settingsContent);
        } catch (error) {
            console.log('⚠️  Could not parse existing settings.json, creating new one');
            settings = {};
        }
    }

    // Increment reload trigger counter
    const currentCounter = settings["live-interview-companion.reloadTriggerCounter"] || 0;
    settings["live-interview-companion.reloadTriggerCounter"] = currentCounter + 1;
    settings["jest.enable"] = false;

    // Write updated settings
    console.log(`🔄 Reloading workspace (counter: ${currentCounter + 1})`);
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
} catch (error) {
    console.log('⚠️  Could not reload workspace:', error.message);
    console.log('Please reload the window manually...');
}

console.log('✅ Reloaded workspace');
console.log('🎉 Workspace setup complete! Run "npm test" to run tests.');
