var size;
var mylabel;
//背景スクロールで追加した部分
var gameLayer;
var background;
var scrollSpeed = 3.5;
var audioEngine;
var player;
var xSpeed = 0; //xプレイヤースピード
var ySpeed = 0; //yプレイヤースピード

var gameScene = cc.Scene.extend({
    onEnter: function() {
        //  var gradient = cc.LayerGradient.create(cc.color(0, 0, 0, 288), cc.color(0x46, 0x82, 0xB4, 288));
        //  this.addChild(gradient);
        this._super();
        gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);

        audioEngine = cc.audioEngine;
        audioEngine.playMusic(res.bgm_main , true);
    }
});

var game = cc.Layer.extend({
    init: function() {
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
        player = new player;
        this.addChild(player);

        //enemy表示
        enemy = new enemy;
        this.addChild(enemy);

        //  tama1 = new tama1();
        //  this.addChild(tama1);

        // tekitama = new tekitama1;
        // this.addChild(tekitama);

    },
    update: function(dt) {
        //backgroundのscrollメソッドを呼び出す
        background.scroll();

        var new_pos_x = player.getPosition().x + player.xSpeed;
        var new_pos_y = player.getPosition().y + player.ySpeed;
        if (new_pos_x < 8) {
            new_pos_x = 8;
        }
        if (new_pos_x > size.width - 8) {
            new_pos_x = size.width - 8;
        }
        if (new_pos_y < 8) {
            new_pos_y = 8;
        }
        if (new_pos_y > size.height - 8) {
            new_pos_y = size.height - 8;
        }
        player.setPosition(new_pos_x, new_pos_y);
    },
});

//スクロール移動する背景クラス
var ScrollingBG = cc.Sprite.extend({
    //ctorはコンストラクタ　クラスがインスタンスされたときに必ず実行される
    ctor: function() {
        this._super();
        this.initWithFile(res.background_png);
    },
    //onEnterメソッドはスプライト描画の際に必ず呼ばれる
    onEnter: function() {
        //背景画像の描画開始位置 横960の画像の中心が、画面の端に設置される
        this.setPosition(size.width, size.height / 2);
        //  this.setPosition(480,160);
    },
    scroll: function() {
        //座標を更新する
        this.setPosition(this.getPosition().x - scrollSpeed, this.getPosition().y);
        //画面の端に到達したら反対側の座標にする
        if (this.getPosition().x < 0) {
            this.setPosition(this.getPosition().x + 480, this.getPosition().y);
        }
    }
});

//キーボードリスナープレイヤー移動処理
var keylistener = cc.EventListener.create({
    event: cc.EventListener.KEYBOARD,
    // setSwallowTouches: true,

    onKeyPressed: function(KeyCode, event) {
        //左に移動
        if (KeyCode == 37) {
            player.xSpeed = -3.8;
            console.log("左");
        } //右に移動
        if (KeyCode == 39) {
            player.xSpeed = 3.8;
            console.log("右");
        }
        //上に移動
        if (KeyCode == 38) {
            player.ySpeed = 3.8;
            console.log("上");
        }
        //下に移動
        if (KeyCode == 40) {
            player.ySpeed = -3.8;
            console.log("下");
        }
        return true;
    },
    onKeyReleased: function(KeyCode, event) {
        player.xSpeed = 0;
        player.ySpeed = 0;
    }
});

var player = cc.Sprite.extend({
     _time: 0,
    ctor: function() {
        this._super();
        this.initWithFile(res.player_png)
    },
    onEnter: function() {
        this._super();
        this.setPosition(60, 160);
        this.setScale(0.6, 0.4);
        this.ySpeed = 0;
        this.xSpeed = 0;
        winSize = cc.director.getWinSize();
        this.screenRect = cc.Rect(0, 0, winSize.width, winSize.height);

        this.scheduleUpdate();
        cc.eventManager.addListener(keylistener, this);
    },
    update: function(dt) {
      var enemyBoundingBox = enemy.getBoundingBox();
      var tama1Boundingbox = this.getBoundingBox();

      if (cc.rectIntersection(enemyBoundingBox, tama1Boundingbox) && tama1.invulnerability == 0) {
        gameLayer.removetama1(enemy);
      }

      this._time += 1;
        if (this._time == 1) {
            var tama = new tama1();
            //tama.setPosition(this.x,this.y);

            tama.setPosition(player.getPosition().x + 10, player.getPosition().y-12);
            gameLayer. addChild(tama);

            var tamaleft = new tama1();
            tamaleft.setPosition(player.getPosition().x + 10, player.getPosition().y+12);

            gameLayer. addChild(tamaleft);
        }
        if (this._time > 15) this._time = 0;
    }
});

var tama1 = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile(res.tama1_png);
    },
    onEnter: function() {
        this._super();

        var moveAction = cc.MoveTo.create(13, new cc.Point(this.getPosition().x * 100 + 50,this.getPosition().y));
        this.runAction(moveAction);
        this.scheduleUpdate();
    },
    update: function(dt) {
        if (this.getPosition().x < 200) {
            this.removeChild(tama1);
            console.log("消した");
        }
    }
});

var enemy = cc.Sprite.extend({
  _time: 0,
 ctor: function() {
     this._super();
     this.initWithFile(res.enemy_png)
 },
 onEnter: function() {
     this._super();
     this.setPosition(450,Math.random() * 320);
     this.setScale(0.9, 0.9);

     this.scheduleUpdate();

        // var moveAction = cc.MoveTo.create(65, new cc.Point(enemy.getPosition().x * -50));
        // this.runAction(moveAction);
        this.scheduleUpdate();
    },
     update: function(dt) {
       this._time += 1;
         if (this._time == 1) {
             var tama = new tekitama1();
             //tama.setPosition(this.x,this.y);

             tama.setPosition(enemy.getPosition().x - 20, enemy.getPosition().y-2);
             gameLayer. addChild(tama);

           }
         if (this._time > 40) this._time = 0;
     }
});

var tekitama1 = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile(res.tekitama_png);
    },
    onEnter: function() {
        this._super();
        //this.setPosition(enemy.getPosition().x - 20, enemy.getPosition().y - 2);

        var moveAction = cc.MoveTo.create(90, new cc.Point(this.getPosition().x * -100, this.getPosition().y));
        this.runAction(moveAction);
        this.scheduleUpdate();
    },
    update: function(dt) {
        /*if (this.getPosition().x < -200) {
            gameLayer.removeChild(tekitama1);
            console.log("消した");
        }*/
    }
});
