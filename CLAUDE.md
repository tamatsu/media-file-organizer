# Media File Organizer - Electron App

## Project Overview

Electronでローカルのメディアファイルを整理するアプリケーション

## Development Commands

- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run build` - Build the application
- `npm run lint` - Run ESLint code analysis
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Code Quality Rules

t-wadaの推奨する進め方に従ってください。下記のツールも併用してください

- validate

### ESLint/Prettier設定

- **ESLint**: Electron向けルール、メイン・レンダラープロセス別設定
- **Prettier**: 一貫したコードフォーマット、ESLintと統合済み
- **設定ファイル**: `eslint.config.js`, `.prettierrc`

## Git Workflow Rules

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
- `index.html` - Renderer process UI
- `tests/` - Jest unit and integration tests
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier formatting rules
- `jest.config.js` - Test configuration
- `package.json` - Project dependencies and scripts

## Features (Implemented)

- **ローカルメディアファイル閲覧**: フォルダ選択と再帰的ファイル検索
- **ディレクトリベース組織化**: フォルダ階層からアーティスト・アルバム情報抽出
- **階層表示**: アーティスト→アルバム→ファイルの3階層グルーピング
- **メディアプレビュー**: 画像・動画・音声ファイルのプレビュー表示
- **検索・フィルタ**: ファイル名・アーティスト・アルバム名での検索
- **大容量ファイル対応**: file://プロトコルで2GB以上のファイル対応
- **包括的エラーハンドリング**: 詳細なログ出力とデバッグ支援

## Quality Assurance

- **単体テスト**: Jest 24テスト（main/renderer分離）
- **静的解析**: ESLint v9（Electron特化ルール）
- **コードフォーマット**: Prettier（一貫性保証）
- **テストカバレッジ**: core関数100%カバー
