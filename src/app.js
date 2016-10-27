var size;
var mylabel;
//背景スクロールで追加した部分
var gameLayer;
var background;
var scrollSpeed = 1;
var player;
var xSpeed = 0; //xプレイヤースピード
var ySpeed = 0; //yプレイヤースピード

var gameScene = cc.Scene.extend({
    onEnter:function () {
      //  var gradient = cc.LayerGradient.create(cc.color(0, 0, 0, 255), cc.color(0x46, 0x82, 0xB4, 255));
      //  this.addChild(gradient);
        this._super();
        gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);
    }
});

var game = cc.Layer.extend({
    init:function () {
        this._super();
        size = cc.director.getWinSize();
        // mylabel = cc.LabelTTF.create("GO!", "Arial", "32");
        // mylabel.setPosition(size.width / 2, size.height / 2);
        // this.addChild(mylabel);

        //スクロールする背景スプライトをインスタンス　スクロール速度:scrollSpeed
        background = new ScrollingBG();
        this.addChild(background);
        //scheduleUpdate関数は、描画の都度、update関数を呼び出す
        this.scheduleUpdate();

        //player表示
        player = new cc.Sprite(res.player_png);
        player.setPosition(60, 160);
        player.setScale(0.4, 0.4);
        player.ySpeed = 0;
        player.xSpeed = 0;

        cc.eventManager.addListener(keylistener, this);

        this.addChild(player);

        //enemy表示
        Enemy = new cc.Sprite(res.enemy_png);
        Enemy.setPosition(260, 160);
        this.addChild(Enemy);

    },
    update:function(dt){
      //backgroundのscrollメソッドを呼び出す
        background.scroll();

    },

});

//スクロール移動する背景クラス
var ScrollingBG = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor:function() {
        this._super();
        this.initWithFile(res.background_png);
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter:function() {
      //背景画像の描画開始位置 横960の画像の中心が、画面の端に設置される
      this.setPosition(size.width,size.height /2 );
      //  this.setPosition(480,160);
    },
    scroll:function(){
      //座標を更新する
        this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
        //画面の端に到達したら反対側の座標にする
        if(this.getPosition().x<0){
            this.setPosition(this.getPosition().x+480,this.getPosition().y);
        }
    }
});

//キーボードリスナープレイヤー移動処理
var keylistener = cc.EventListener.create({
  event: cc.EventListener.KEYBOARD,
  // setSwallowTouches: true,

  onKeyPressed: function(KeyCode, event){
    //左に移動
    if (KeyCode == 37) {
      player.xSpeed = -2.5;
      console.log("左");
    }//右に移動
    if (KeyCode == 39) {
      player.xSpeed = 2.5;
      console.log("右");
    }
    //上に移動
    if (KeyCode == 38) {
      player.ySpeed = 2.5;
      console.log("上");
    }
    //下に移動
    if (KeyCode == 40) {
      player.ySpeed = -2.5;
      console.log("下");
    }
    return true;
  }
});
