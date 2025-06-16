# feedly-to-raindrop

Feedly から保存した記事を Raindrop.io に自動転送する AWS Lambda 関数です。

## セットアップ

### Raindrop.io アプリケーション登録

1. [Raindrop.io](https://raindrop.io) にログイン
2. [Integrations 設定](https://app.raindrop.io/settings/integrations) にアクセス
3. 「Create new app」をクリック
4. アプリケーション情報を入力：
   - **Name**: `feedly-to-raindrop`
   - **Description**: `Feedly から Raindrop への自動転送システム`
   - **Redirect URI**: `http://localhost:8080/raindrop`
5. 作成後、Client ID と Client Secret を取得

### 環境変数設定

```sh
# Raindrop.io 認証情報
export RAINDROP_CLIENT_ID="取得したClient ID"
export RAINDROP_CLIENT_SECRET="取得したClient Secret"
export SSM_PARAMETER_RAINDROP="/feedly-to-raindrop/raindrop-token"

# Feedly 認証情報
export FEEDLY_CLIENT_ID="あなたのFeedly Client ID"
export FEEDLY_CLIENT_SECRET="あなたのFeedly Client Secret"
export SSM_PARAMETER_FEEDLY="/feedly-to-raindrop/feedly-token"
```

### ローカル開発

```sh
# OAuth 認証サーバーを起動
ts-node -T src/server.ts

# ブラウザで OAuth 認証を実行
open http://localhost:8080/

# 認証完了後、サーバーを停止してバッチを実行
ts-node -T src/run.ts
```

## デプロイ

```sh
# AWS にデプロイ
npx serverless deploy --verbose

# ログを確認
npx serverless logs -f main --tail

# 手動実行
npx serverless invoke -f main --log
```

## 動作概要

1. 10分間隔で定期実行
2. Feedly から保存済み記事を取得
3. 各記事を Raindrop.io にブックマーク追加
4. Feedly の保存済み記事を削除
5. 失敗時は SNS でメール通知

## link

- https://gist.github.com/d3m3vilurr/5904029
