import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

// Get version info
const getVersionInfo = () => {
  try {
    const gitHash = execSync('git rev-parse --short HEAD').toString().trim()
    const packageVersion = process.env.npm_package_version || '1.0.0'
    return {
      version: packageVersion,
      gitHash: gitHash,
      buildTime: new Date().toISOString(),
    }
  } catch {
    return {
      version: '1.0.0',
      gitHash: 'unknown',
      buildTime: new Date().toISOString(),
    }
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    __VERSION_INFO__: JSON.stringify(getVersionInfo()),
  },
})
