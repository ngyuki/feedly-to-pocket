# feedly-saved-hook

```sh
# サーバを実行する
ts-node -T src/server.ts

# ブラウザで http://localhost:8080/ を開くと Feedly の OAuth 認証になるので認証を済ます
open http://localhost:8080/

# 認証が終わったら↑のサーバを停止する

# バッチを実行する
ts-node -T src/run.ts
```

```sh
# デプロイ
npx serverless deploy --verbose

# ログ
npx serverless logs -f main --tail

# 実行
npx serverless invoke -f main --log
```

## link

- https://gist.github.com/d3m3vilurr/5904029
