# How to Start the Development Server

## Issue
PowerShell execution policy is preventing scripts from running.

## Solution Options

### Option 1: Run in Command Prompt (Recommended)
1. Open **Command Prompt** (cmd.exe) instead of PowerShell
2. Navigate to the project directory:
   ```cmd
   cd "e:\DEPI\DEPI Graduation Project\Ali.Physical.Module"
   ```
3. Start the server:
   ```cmd
   ng serve
   ```

### Option 2: Change PowerShell Execution Policy (Admin Required)
1. Open PowerShell as Administrator
2. Run this command:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Confirm with `Y`
4. Then navigate to the project and run:
   ```powershell
   ng serve
   ```

### Option 3: Bypass for Current Session
In your current PowerShell window, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
cd "e:\DEPI\DEPI Graduation Project\Ali.Physical.Module"
ng serve
```

## After Server Starts
1. Open browser to `http://localhost:4200`
2. Login to your account
3. Click the **Challenging** button (🏆) in the navbar
4. Start using the module!

## Alternative - Use npm directly
```bash
npm run start
```

This should work without execution policy issues.
