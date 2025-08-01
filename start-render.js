#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Business Case Platform for Render...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🔧 PORT:', process.env.PORT);

// Build the client first
console.log('🔨 Building client...');
const buildProcess = spawn('npm', ['run', 'build'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit'
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Build failed');
    process.exit(1);
  }
  
  console.log('✅ Build completed');
  
  // Start the server
  console.log('🚀 Starting server...');
  const serverProcess = spawn('node', ['server/index.js'], {
    stdio: 'inherit'
  });
  
  serverProcess.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
    process.exit(code);
  });
}); 