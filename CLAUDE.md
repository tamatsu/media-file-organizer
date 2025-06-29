# Media File Organizer - Electron App

## Project Overview
Electronでローカルのメディアファイルを整理するアプリケーション

## Development Commands
- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build the application
- `npm run lint` - Run linting
- `npm run typecheck` - Run type checking

## Building for Windows (WSL Environment)
WSL環境でWindows向けのexeをビルドする方法：

```bash
# プロジェクトをWindows側にコピー
cp -r . /mnt/c/temp/media-organizer

# Windows側でビルド実行
cmd.exe /c "cd C:\temp\media-organizer && npm install && npm run build:win"

# ビルド結果をプロジェクトにコピー
cp /mnt/c/temp/media-organizer/dist/*.exe ./
```

ビルド成果物：
- `Media File Organizer Setup 1.0.0.exe` - Windows用インストーラー

## Project Structure
- `main.js` - Main Electron process
- `renderer/` - Renderer process files
- `package.json` - Project dependencies and scripts

## Features (Planned)
- Browse local media files
- Organize files by categories
- Preview media files
- File management operations