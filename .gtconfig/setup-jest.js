#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Setting up Jest...');

// Ensure src directory exists
if (!fs.existsSync('src')) {
    fs.mkdirSync('src');
    console.log('✅ Created src directory');
}

// Clean up Mocha files
try {
    if (fs.existsSync('.mocharc.json')) {
        fs.unlinkSync('.mocharc.json');
        console.log('✅ Removed .mocharc.json');
    }
} catch (error) {
    console.log('⚠️  Could not remove .mocharc.json:', error.message);
}

// Uninstall Mocha dependencies
console.log('📦 Uninstalling Mocha dependencies...');
try {
    execSync('npm uninstall chai mocha', { stdio: 'inherit' });
    console.log('✅ Mocha dependencies uninstalled');
} catch (error) {
    console.log('⚠️  Some Mocha dependencies may not have been installed');
}

// Install Jest dependencies
console.log('📦 Installing Jest dependencies...');
try {
    execSync('npm install --save-dev jest', { stdio: 'inherit' });
    console.log('✅ Jest dependencies installed');
} catch (error) {
    console.error('❌ Failed to install Jest dependencies:', error.message);
    process.exit(1);
}

// Create Jest config
try {
    const jestConfig = `module.exports = {
    testEnvironment: "node",
};`;
    fs.writeFileSync('jest.config.js', jestConfig);
    console.log('✅ Created jest.config.js');
} catch (error) {
    console.error('❌ Failed to setup Jest config:', error.message);
    process.exit(1);
}

// Create Jest test example
try {
    const jestTest = `// This is a sample test written for Jest.
// 
// If you prefer using Mocha+Chai instead, run \`npm run init:mocha\` in the terminal to setup Mocha dependencies.
// This will switch your project to use Mocha as the test runner with Chai for assertions.

const assert = require("assert");

describe('Jest Test suite', function () {
    it('should expect to add', function () {
        assert.equal(2 + 3, 5);
    });
});`;
    fs.writeFileSync('src/index.test.js', jestTest);
    console.log('✅ Created Jest test example in src/index.test.js');
} catch (error) {
    console.error('❌ Failed to setup Jest test:', error.message);
    process.exit(1);
}

// Update package.json test script
try {
    const packageJsonPath = 'package.json';
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts.test = 'jest';
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('✅ Updated package.json test script');
    }
} catch (error) {
    console.error('❌ Failed to update package.json:', error.message);
}

console.log('🎉 Jest setup complete! Reloading window now ...');


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
    settings["jest.enable"] = true;
    settings["jest.runMode"] = "on-demand”;

    // Write updated settings
    console.log(`🔄 Reloading workspace (counter: ${currentCounter + 1})`);
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
} catch (error) {
    console.log('⚠️  Could not reload workspace:', error.message);
    console.log('Please reload the window manually...');
}

console.log('✅ Reloaded workspace');
console.log('🎉 Workspace setup complete! Run "npm test" to run tests.');
