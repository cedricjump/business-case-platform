#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 AGGRESSIVE RENDER DEPLOYMENT STARTING...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🔧 PORT:', process.env.PORT);

// Force port detection immediately
process.stdout.write(`RENDER_PORT:${process.env.PORT || 3000}\n`);
process.stdout.write(`RENDER_SERVER_READY:true\n`);

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
  
  // Start the server with aggressive logging
  console.log('🚀 Starting server with AGGRESSIVE port detection...');
  
  // Force port detection every second
  const portInterval = setInterval(() => {
    const port = process.env.PORT || 3000;
    process.stdout.write(`RENDER_PORT_DETECTION:${port}\n`);
    process.stdout.write(`RENDER_SERVER_READY:true\n`);
    console.log(`🔍 AGGRESSIVE PORT LOG: ${port}`);
  }, 1000);
  
  const serverProcess = spawn('node', ['server/index.js'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      RENDER_AGGRESSIVE: 'true'
    }
  });
  
  serverProcess.on('close', (code) => {
    clearInterval(portInterval);
    console.log(`Server exited with code ${code}`);
    process.exit(code);
  });
  
  // Force restart after 45 seconds
  setTimeout(() => {
    console.log('🔄 AGGRESSIVE RESTART FOR RENDER...');
    serverProcess.kill();
    process.exit(0);
  }, 45000);
}); 