# Media File Organizer

> **⚠️ 注意**: このプロジェクトは[Claude Code](https://claude.ai/code)の検証用として作成されたサンプルアプリケーションです。本格的な運用での使用は想定していません。

Electronでローカルのメディアファイルを整理するアプリケーション

## 機能

- **フォルダ選択とファイル検索**: ローカルフォルダを選択し、再帰的にメディアファイルを検索
- **メディアプレビュー**: 画像、動画、音声ファイルのプレビュー表示
- **メタデータ抽出**: 音楽ファイルからアルバム、アーティスト、タイトル情報を取得
- **階層表示**: アーティスト→アルバム→ファイルの3階層グルーピング表示
- **検索・フィルタ**: ファイル名検索とファイルタイプフィルタリング
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

1. **フォルダ選択**: 「フォルダを選択」ボタンでメディアファイルが含まれるフォルダを選択
2. **ファイル表示**: 検出されたメディアファイルが左側のリストに表示
3. **プレビュー**: ファイルをクリックすると右側にプレビューが表示
4. **グルーピング**: 「アルバムでグループ表示」でメタデータベースの階層表示に切り替え
5. **検索**: 上部の検索ボックスでファイル名を絞り込み
6. **フィルタ**: ファイルタイプボタンで表示するファイル形式を選択

## 技術仕様

- **フレームワーク**: Electron 28.x
- **メタデータ抽出**: music-metadata 10.x
- **セキュリティ**: DOM API使用でXSS対策済み
- **ファイルアクセス**: Base64データURL経由でローカルファイル表示

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
├── main.js           # メインプロセス（Electron）
├── index.html        # レンダラープロセス（UI）
├── package.json      # プロジェクト設定
├── CLAUDE.md         # 開発メモ
└── dist/            # ビルド出力先
```

## ライセンス

MIT License

## 貢献

Issue報告やプルリクエストを歓迎します。

## 作者

Generated with Claude Code