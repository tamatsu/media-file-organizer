# Media File Organizer

> **⚠️ 注意**: このプロジェクトは[Claude Code](https://claude.ai/code)の検証用として作成されたサンプルアプリケーションです。本格的な運用での使用は想定していません。

Electronでローカルのメディアファイルを整理するアプリケーション

## スクリーンショット

![Application Screenshot](https://tamatsu.github.io/media-file-organizer/screenshot.png)

## 機能

### 📁 ディレクトリベース組織化

- **柔軟なディレクトリ構造**: 2階層（アーティスト/アルバム）と3階層（ジャンル/アーティスト/アルバム）に対応
- **自動階層解析**: フォルダ構造からメタデータを自動抽出
- **階層表示**: アーティスト→アルバム→ファイルの構造化された表示

### 🎵 音楽管理機能

- **星レーティングシステム**: アルバム単位での5段階評価
- **連続再生**: アルバム内の音声ファイルを自動で順次再生
- **レーティングフィルタ**: 星評価による絞り込み表示
- **永続化**: localStorage使用でレーティング情報を保存

### 🔍 検索・フィルタリング

- **テキスト検索**: ファイル名・アーティスト・アルバム名での検索
- **ファイルタイプフィルタ**: 画像・動画・音声での絞り込み
- **ジャンルフィルタ**: 3階層構造時の動的ジャンル絞り込み
- **ソート機能**: 名前・レーティング・ファイル数による並び替え

### 📺 表示モード

- **リストビュー**: 詳細な階層表示とファイル情報
- **グリッドビュー**: アルバムサムネイル付きタイル表示
- **アーティストグループ**: アーティスト別の展開可能表示

### 🎬 メディアプレビュー

- **マルチメディア対応**: 画像・動画・音声ファイルの統合プレビュー
- **大容量ファイル対応**: file://プロトコルで2GB以上のファイルも対応
- **スティッキープレビュー**: スクロール時にプレビューエリアを固定表示

## サポートファイル形式

### 画像

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### 動画

- MP4 (.mp4)
- WebM (.webm)
- OGV (.ogv)
- AVI (.avi)
- MOV (.mov)

### 音声

- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)
- M4A (.m4a)
- FLAC (.flac)

## 動作環境

- Node.js 16.x以上
- Windows 10/11, macOS, Linux

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/tamatsu/media-file-organizer.git
cd media-file-organizer

# 依存関係をインストール
npm install
```

## 使用方法

### 開発環境での起動

```bash
npm start
```

### ビルド

```bash
# 全プラットフォーム用ビルド
npm run build

# Windows用ビルド
npm run build:win

# macOS用ビルド
npm run build:mac

# Linux用ビルド
npm run build:linux
```

### 開発・品質管理コマンド

```bash
# テスト実行
npm test
npm run test:watch    # テストファイル監視モード
npm run test:coverage # カバレッジレポート付き

# コード品質チェック
npm run lint          # ESLintでコード解析
npm run lint:fix      # ESLint自動修正
npm run format        # Prettier自動フォーマット
npm run format:check  # フォーマットチェックのみ

# 包括的な品質チェック
npm run validate      # フォーマット・lint・型チェック・テストを一括実行
npm run validate:fix  # 自動修正可能な問題を修正してから一括実行
npm run ci            # CI環境用（validateと同じ）
npm run check         # validateと同じ
npm run precommit     # コミット前実行推奨（validate:fixと同じ）
```

### WSL環境でのWindows向けビルド

```bash
# プロジェクトをWindows側にコピー
cp -r . /mnt/c/temp/media-organizer

# Windows側でビルド実行
cmd.exe /c "cd C:\temp\media-organizer && npm install && npm run build:win"

# ビルド結果をプロジェクトにコピー
cp /mnt/c/temp/media-organizer/dist/*.exe ./
```

## 使い方

### 🎯 基本的な使い方

1. **フォルダ選択**: 「フォルダを選択」ボタンでメディアファイルが含まれるフォルダを選択
2. **ファイル表示**: 検出されたメディアファイルが左側のリストに表示
3. **プレビュー**: ファイルをクリックすると右側にプレビューが表示
4. **星レーティング**: アルバムの★マークをクリックして評価を設定

### 📁 推奨ディレクトリ構造

#### 2階層構造（従来）

```
Music/
├── Beatles/
│   ├── Abbey Road/
│   │   ├── Come Together.mp3
│   │   └── Something.mp3
│   └── Sgt. Pepper's/
│       └── Lucy in the Sky.mp3
└── Mozart/
    └── Symphony No. 40/
        └── Movement 1.mp3
```

#### 3階層構造（新機能）

```
Music/
├── Rock/
│   ├── Beatles/
│   │   ├── Abbey Road/
│   │   └── Sgt. Pepper's/
│   └── Led Zeppelin/
│       └── IV/
├── Classical/
│   └── Mozart/
│       └── Symphony No. 40/
└── Jazz/
    └── Miles Davis/
        └── Kind of Blue/
```

### 🎛️ 操作ガイド

- **🔍 検索**: 上部の検索ボックスでファイル名・アーティスト・アルバム名を絞り込み
- **🎭 ジャンルフィルタ**: 3階層構造の場合、ジャンル別絞り込みが自動表示
- **⭐ レーティングフィルタ**: 星評価での絞り込み表示
- **📊 ソート**: 名前・レーティング・ファイル数での並び替え
- **👁️ 表示切替**: リスト・グリッド・アーティストグループ表示
- **🎵 連続再生**: 音声ファイル再生時、アルバム内で自動的に次の曲へ

## 技術仕様

### 🏗️ アーキテクチャ

- **フレームワーク**: Electron 28.x (Node.js + Chromium)
- **プロセス分離**: メイン・レンダラープロセス分離アーキテクチャ
- **モジュラー設計**: 機能別utilityモジュール構成

### 🗃️ データ管理

- **ディレクトリ解析**: 2/3階層パス構造からメタデータ自動抽出
- **レーティング永続化**: localStorage使用（Artist/Album キー形式）
- **プレイリスト管理**: メモリ内playlist API

### 🔒 セキュリティ・パフォーマンス

- **ファイルアクセス**: file://プロトコル直接参照（大容量対応）
- **XSS対策**: DOM API使用、innerHTML回避
- **大容量メディア**: 2GB+ファイル対応

### 🧪 品質保証

- **テストフレームワーク**: Jest（143テスト、100%コアカバレッジ）
- **静的解析**: ESLint v9（Electron特化ルール）
- **コードフォーマット**: Prettier統合

## 開発

### 開発コマンド

```bash
# 開発サーバー起動
npm start

# テスト実行
npm test

# リンタ実行
npm run lint

# 型チェック実行
npm run typecheck
```

### プロジェクト構成

```
├── main.js                      # メインプロセス（Electron）
├── index.html                   # レンダラープロセス（UI）
├── renderer/utils/              # レンダラープロセス用ユーティリティ
│   ├── rating.js               # ★星レーティング管理
│   ├── sorting.js              # ソート・フィルタリング
│   ├── search.js               # 検索・グルーピング
│   ├── playlist.js             # 🎵連続再生プレイリスト
│   ├── ui.js                   # UI共通ヘルパー
│   └── thumbnail.js            # 🖼️サムネイル生成
├── tests/                       # テストスイート
│   ├── unit/                   # 単体テスト
│   ├── integration/            # 統合テスト
│   └── setup.js               # テスト設定
├── package.json                # プロジェクト設定・依存関係
├── jest.config.js              # テスト設定
├── eslint.config.js            # ESLint設定
├── CLAUDE.md                   # 開発指針・コマンド
└── dist/                       # ビルド出力先
```

## ライセンス

MIT License

## 作者

Generated with Claude Code
