#!/usr/bin/env python3
"""
AnLibrary Build Script
Automates the Next.js 14 standalone build process and organizes files correctly.
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path
from datetime import datetime

class BuildScript:
    def __init__(self):
        self.project_root = Path.cwd()
        self.build_dir = self.project_root / "build"
        self.standalone_dir = self.project_root / ".next" / "standalone"
        self.next_static_dir = self.project_root / ".next" / "static"
        self.public_dir = self.project_root / "public"
        self.database_file = self.project_root / "database.db"
        
    def log(self, message: str, level: str = "INFO"):
        """Log messages with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] [{level}] {message}")
    
    def check_dependencies(self):
        """Check if Node.js and npm are available"""
        self.log("Checking dependencies...")
        
        try:
            subprocess.run(["node", "--version"], check=True, capture_output=True, shell=True)
            self.log("✓ Node.js is available")
        except (subprocess.CalledProcessError, FileNotFoundError):
            self.log("✗ Node.js is not available or not in PATH", "ERROR")
            return False
            
        try:
            subprocess.run(["npm", "--version"], check=True, capture_output=True, shell=True)
            self.log("✓ npm is available")
        except (subprocess.CalledProcessError, FileNotFoundError):
            self.log("✗ npm is not available or not in PATH", "ERROR")
            return False
            
        return True

    
    def clean_build_directory(self):
        """Clean the build directory"""
        if self.build_dir.exists():
            self.log(f"Cleaning existing build directory: {self.build_dir}")
            shutil.rmtree(self.build_dir)
        
        self.build_dir.mkdir(exist_ok=True)
        self.log(f"Created clean build directory: {self.build_dir}")

    
    def run_next_build(self):
        """Run Next.js build"""
        self.log("Running Next.js build...")
        try:
            result = subprocess.run(
                ["npm", "run", "build"], 
                cwd=self.project_root,
                check=True,
                capture_output=True,
                text=True,
                shell=True
            )
            self.log("✓ Next.js build completed successfully")
        except subprocess.CalledProcessError as e:
            self.log(f"✗ Next.js build failed: {e.stderr}", "ERROR")
            return False
        return True
    
    def copy_standalone_files(self):
        """Copy standalone build files"""
        if not self.standalone_dir.exists():
            self.log("✗ Standalone build directory not found", "ERROR")
            return False
        
        self.log("Copying standalone build files...")
        
        # Copy all files from standalone directory
        for item in self.standalone_dir.rglob("*"):
            if item.is_file():
                relative_path = item.relative_to(self.standalone_dir)
                dest_path = self.build_dir / relative_path
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(item, dest_path)
        
        self.log("✓ Standalone files copied")
        return True
    
    def copy_static_files(self):
        """Copy Next.js static files"""
        if not self.next_static_dir.exists():
            self.log("✗ Next.js static directory not found", "ERROR")
            return False
        
        self.log("Copying static files...")
        
        # Create .next/static directory in build
        build_static_dir = self.build_dir / ".next" / "static"
        build_static_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy static files
        for item in self.next_static_dir.rglob("*"):
            if item.is_file():
                relative_path = item.relative_to(self.next_static_dir)
                dest_path = build_static_dir / relative_path
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(item, dest_path)
        
        self.log("✓ Static files copied")
        return True
    
    def copy_public_files(self):
        """Copy public directory"""
        if not self.public_dir.exists():
            self.log("⚠ Public directory not found", "WARNING")
            return True
        
        self.log("Copying public files...")
        
        # Copy public directory to build/public
        build_public_dir = self.build_dir / "public"
        shutil.copytree(self.public_dir, build_public_dir, dirs_exist_ok=True)
        
        self.log("✓ Public files copied")
        return True
    
    def copy_database(self):
        """Copy database file if it exists"""
        if self.database_file.exists():
            self.log("Copying database file...")
            shutil.copy2(self.database_file, self.build_dir / "database.db")
            self.log("✓ Database file copied")
        else:
            self.log("⚠ Database file not found, skipping", "WARNING")
        return True
    
    def create_start_script(self):
        """Create start scripts for different platforms"""
        self.log("Creating start scripts...")
        
        # Windows batch script
        windows_script = self.build_dir / "start.bat"
        windows_script.write_text("""@echo off
echo Starting AnLibrary...
node server.js
""")
        
        # Unix shell script
        unix_script = self.build_dir / "start.sh"
        unix_script.write_text("""#!/bin/bash
echo "Starting AnLibrary..."
node server.js
""")
        
        # Make Unix script executable
        try:
            os.chmod(unix_script, 0o755)
        except:
            pass  # Ignore on Windows
        
        # Package.json for the build
        package_json = {
            "name": "anlibrary-production",
            "version": "1.0.0",
            "description": "AnLibrary production build",
            "main": "server.js",
            "scripts": {
                "start": "node server.js"
            },
            "dependencies": {}
        }
        
        import json
        with open(self.build_dir / "package.json", "w") as f:
            json.dump(package_json, f, indent=2)
        
        self.log("✓ Start scripts created")
        return True
    
    def create_readme(self):
        """Create README for the build"""
        readme_content = """# AnLibrary Production Build

This directory contains the production build of AnLibrary.

## Running the Application

### Windows
```cmd
start.bat
```

### Linux/Mac
```bash
./start.sh
```

### Manual
```bash
node server.js
```

## Requirements
- Node.js 18+ 
- The application will run on port 3000 by default
- Make sure the database file (database.db) is in the same directory

## Environment Variables
Set these environment variables if needed:
- `PORT` - Port number (default: 3000)
- `NODE_ENV` - Set to "production"

## Files Structure
- `server.js` - Main application server
- `public/` - Static assets (images, logos, etc.)
- `.next/` - Next.js build artifacts
- `database.db` - SQLite database
- `package.json` - Package configuration for production

Generated on: {timestamp}
""".format(timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        
        readme_path = self.build_dir / "README.md"
        readme_path.write_text(readme_content)
        
        self.log("✓ README.md created")
        return True
    
    def build(self):
        """Main build process"""
        self.log("=== Starting AnLibrary Build Process ===")
        
        # Check dependencies
        if not self.check_dependencies():
            self.log("Build failed: Missing dependencies", "ERROR")
            return False
        
        # Clean build directory
        self.clean_build_directory()
        
        
        # Run Next.js build
        if not self.run_next_build():
            self.log("Build failed: Next.js build error", "ERROR")
            return False
        
        # Copy all necessary files
        if not self.copy_standalone_files():
            self.log("Build failed: Could not copy standalone files", "ERROR")
            return False
        
        if not self.copy_static_files():
            self.log("Build failed: Could not copy static files", "ERROR")
            return False
        
        if not self.copy_public_files():
            self.log("Build failed: Could not copy public files", "ERROR")
            return False
        
        if not self.copy_database():
            self.log("Build failed: Could not copy database", "ERROR")
            return False
        
        # Create helper files
        if not self.create_start_script():
            self.log("Build failed: Could not create start scripts", "ERROR")
            return False
        
        if not self.create_readme():
            self.log("Build failed: Could not create README", "ERROR")
            return False
        
        self.log("=== Build Process Completed Successfully ===")
        self.log(f"Production build is ready in: {self.build_dir.absolute()}")
        self.log("You can now deploy the contents of the build directory.")
        
        return True

def main():
    """Main entry point"""
    if len(sys.argv) > 1 and sys.argv[1] in ["-h", "--help"]:
        print("""AnLibrary Build Script

Usage: python build.py [options]

Options:
  -h, --help    Show this help message

This script will:
1. Clean the build directory
2. Install npm dependencies
3. Run Next.js build
4. Copy standalone build files
5. Copy static assets
6. Copy public files
7. Copy database
8. Create start scripts and documentation

The resulting build will be in the './build' directory.
""")
        return
    
    builder = BuildScript()
    success = builder.build()
    
    if success:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()