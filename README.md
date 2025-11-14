# Readme ELWebAPITool v3

## 1. Abstract

ELWebAPITool は、エコーネットコンソーシアムが策定した [ECHONET Lite WebAPI](https://echonet.jp/web_api/#guideline) を利用してサーバーにアクセスするクライアント側のアプリケーションプログラムです。Windows または MacOS 上で動作します。

エコーネットコンソーシアムが運用している ECHONET Lite WebAPI 実験サーバーと、神奈川工科大学スマートハウス研究センターが運用している ECHONET Lite WebAPI 実証システムにアクセスすることを想定しています。

ECHONET Lite WebAPI 実験サーバー（以下、実験サーバーと省略します）は、ECHONET Lite WebAPI のリファレンスサーバーです。ECHONET Lite WebAPI で定義された全ての API を実装しています。制御対象デバイスはサーバー内で静的にエミュレーションしています。ELWebAPITool は、実験サーバーのデバイス設定機能も備えています。

実験サーバーは、エコーネットコンソーシアムの会員企業の方が利用できます。[エコーネットコンソーシアムの会員限定ページ](https://echonet.jp/m_only/web_api_cloud/) から実験サーバーのアカウントを作成し、あらかじめAPI キーを取得してください。

ECHONET Lite WebAPI 実証システム（以下、実証システムと省略します）は、ECHONET Lite WebAPI を利用して ECHONET Lite の実機を制御することを目的としたシステムです。ECHONET Lite の実機が接続された LAN 内に、実証システム対応の Gateway 装置を設置することで、ECHONET Lite WebAPI を利用して インターネット経由でECHONET Lite の実機を制御することができます。

実証システムは、神奈川工科大学スマートハウス研究センターとの共同研究で利用することができます。実証システムに関しては[神奈川工科大学スマートハウス研究センター](http://sh-center.org/contactus.html)に問い合わせください。

ELWebAPITool をコンソーシアムから配布するバージョンは、実証システムに関する部分を非表示にします。
src/config.ts ファイルをエディタで開き、forConsortium の値を true に修正してからビルドを実行してください。

## 2. Installation & Setup

ELWebAPITool は、Web ブラウザーを利用して動作する Web Application です。HTML, JavaScript, CSS という３種類のコードで構成されます。これらのファイルを Web ブラウザーに読み込ませるために、Web ブラウザーが動作している PC 上で Web server を実行します。Web server を実行する方法はいくつかありますが、ここでは Node.js という JavaScript 実行エンジンと、JavaScript で記述されたWeb server プログラムである serve を利用します。

ELWebAPITool は Vue CLI という環境を利用して開発しています。ソースコードから HTML, JavaScript, CSS のファイルを作成することを、ビルドと呼びます。

### 2.1 Node.js のインストール

- [Node.js のホームページ](https://nodejs.org/ja) にアクセスし、推奨版をダウンロードします。
- ダウンロードしたインストーラを使って Node.js をインストールします。Node.js のインストール中に、npm というツールも自動でイントールされます。

### 2.2 ELWebAPITool のビルド作業

- ELWebAPITool の zip file をダウンロードします。
- zip file を適当なフォルダに移動して、解凍します。
- コマンドプロンプト(PC) またはターミナル(Mac) を起動します。
- このコマンドプロンプトまたはターミナルで CD コマンドを使い、zip fileを解凍したフォルダに移動します。
- 次のコマンドを実行して、必要なモジュールをインストールします。Web server プログラムの serve もインストールされます。

```shell
npm ci
```

- 次のコマンドを実行して、プログラムをビルドします。しばらくすると、"Build complete. The dist directory is ready to be deployed." というメッセージが表示されます。これで準備は終了です。config.ts などのソースコードを修正した場合は、ビルドを実行します。

```shell
npm run build
```

### 2.3 ELWebAPITool の実行

- 次のコマンドを実行して、本アプリを起動します。

```shell
npm start
```

- Web Browser を起動し、<http://localhost:3010> をアクセスします。
- Home 画面が表示されます。
- 画面右上の Setting アイコンをクリックして Setting 画面に移動します。
- 実験サーバーにアクセスする場合は、
  - "API key for 実験サーバー" のテキストフィールドに API key を入力します。
  - 画面右上の Home アイコンをクリックして Home 画面に戻ります。
- 実証システムにアクセスする場合は、
  - "Select a server" で "実証システム" を選択します。
  - "API key for 実証システム" のテキストフィールドに API key を入力します。
  - 画面右上の Home アイコンをクリックして Home 画面に戻ります。
  - Home 画面の "Connect web socket" をクリックします。
    - Web socket の接続が完了すると、ボタンの右側にリンクのアイコンが表示されます。
  - 以降の操作は、実験サーバーのアクセスと同じです。

### 2.4 memo

Method で PUT を選択した場合の Resource Name のリストは、GET を選択した場合の Resource Name のリストと同じです。
（read only の property も表示します）。これは、実験クラウド専用の以下の実装をサポートするためです。
「実験クラウドでは、機器はサーバー上でエミュレーションしています。read only の property は、通常の PUT ではエラーとなりますが、bodyに forced:true を追加することで property の値を書き換えることができます。」

## 3 プログラムについて

### 3.1 全体構成

- プログラムはフロントエンドのみの機能として実装しています。
- Web server として "serve" を利用しています。
  - プログラム実行時の "npm start" は、"serve -s dist -l 3010" を実行します。
- Framework として、TypeScript, VueCLI, VueRouter, VueX を利用しています。
- CSS の Framework として、Bootstrap を利用しています。
- アイコン表示に fontawesome を利用しています。

### 3.2 定数

定数は、config.ts に記述されています。プログラムの動作に影響がある項目は、以下のとおりです。

- serverUrl1: 実験サーバーの URL
- serverUrl2: 実証システムの URL
- fileName4Log: Log download のファイル名
- forConsortium: コンソ限定バージョン（実証システム関連を非表示）の場合は true とする
- addDeviceList: 設定画面で実験サーバーを選択した場合の、機器追加のリスト

### 3.3 Local stroage

以下の項目に関して、Web browser の local storage を利用しています。

- serverSelection: 設定画面の "Select a server" の値
- apiKey1: 設定画面の "API key for 実験サーバー" の値
- apiKey2: 設定画面の "API key for 実証システム" の値

### 3.4 Global 変数

Component 間での値の受け渡しは、VueX の store を利用しています。
Global 変数の定義は、`src/store/index.ts` に記述しています。

- serverSelection: 選択されたサーバーを示す文字列。"server1":実験サーバー, "server2":実証システム
- serverUrl: 選択されたサーバーの URL
- apiKey: 選択されたサーバーの API key
- request: EL WebAPI Server へ送信した request
- statusCode: EL WebAPI Server からの status code
- response: EL WebAPI Server からの response
- logId: LOG の id
- logArray: 複数の LOG を Array として格納したもの
- notificationData: EL WebAPI Server から受信した通知のデータ
- webSocketIsConnected: EL WebAPI Server と web socket での接続状況

### 3.5 TypeScript 関連

- VueX で定義した store の型定義は、src/vuex.d.ts で記述しています
- Global な type 宣言は src/global.d.ts で記述しています。
  - Log
  - NotificationData
  - IdInfo

### 3.6 ページの構成

- 全体の構成は src/App.vue で記述しています。
- ページの共通ヘッダーは src/components/NavHeader.vue で記述しています。
- それ以下の部分は VueRouter を利用して Home, Setting, About 画面を表示します。
- それぞれの画面に対応した view は、src/views にあります。
- src/views にある vue ファイルは、src/components にある vue ファイルを利用します

### 3.7 プロジェクト作成方法の reminder

- Vue CLI プロジェクトを作成する際にオプションを指定することで以下のモジュールが組み込まれます。
  - TypeScript, VueRouter, VueX
- serve と Bootstrap は、以下のようにインストールします。

  ```sh
  npm i serve
  npm i bootstrap
  ```

- bootstrap をプログラム内で利用するには、`/src/main.ts` に以下の行を追加します。

  ```ts
  import 'bootstrap/dist/css/bootstrap.min.css'
  ```

- fontawesome は、以下のようにインストールします。

  ```sh
  npm i @fortawesome/fontawesome-svg-core
  npm i @fortawesome/free-solid-svg-icons
  npm i @fortawesome/free-regular-svg-icons
  npm i @fortawesome/vue-fontawesome@prerelease
  ```

- fontawesome のアイコンを利用するには、`/src/main.ts` に以下の行を追加します。

  ```ts
  /* import the fontawesome core */
  import { library } from '@fortawesome/fontawesome-svg-core'
  /* import specific icons */
  import { faHome } from '@fortawesome/free-solid-svg-icons'
  import { faCog } from '@fortawesome/free-solid-svg-icons'
  import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
  import { faTrash } from '@fortawesome/free-solid-svg-icons'
  import { faLink } from '@fortawesome/free-solid-svg-icons'
  /* add icons to the library */
  library.add(faHome)
  library.add(faCog)
  library.add(faQuestionCircle)
  library.add(faTrash)
  library.add(faLink)
  /* import font awesome icon component */
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(store)
    .use(router)
    .mount('#app')
  ```
