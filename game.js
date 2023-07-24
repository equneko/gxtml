var MyGame = GXTML.create({
    id: "MyGame",
    orientation: 'landscape',
    color:'white',

    logo: GXTML.dom((GXTML.WIDTH/2)-100, GXTML.HEIGHT-10, 256, 0, "#logo"),
    hello: GXTML.dom((GXTML.WIDTH/2)-225, GXTML.HEIGHT-180, 500, 0, "#hello"),
    sub: GXTML.dom((GXTML.WIDTH/2)-250, GXTML.HEIGHT-220, 800, 0, "#sub"),

    player: GXTML.object({
        x:0, y:0, width:200, height:200,
        bound: [50, 0],
        sprite:'assets/IDLE/0.png',
        isRun: false
    }),
    speed: 3,

    /* Initialize load */
    setup: function(G) {
        GXTML.size(980, 556);

        G.player.x = GXTML.size(420);
        G.player.y = GXTML.size(0, 100);

        G.on('keydown', function (e) {
            G.player.isRun = true;
            if (e.keyCode == 39) {
                G.player.velX = G.speed;
                G.player.flipX = 1;
            }
            if (e.keyCode == 37) {
                G.player.velX = -G.speed;
                G.player.flipX = -1;
            }
            if (e.keyCode == 38) G.player.velY = G.speed;
            if (e.keyCode == 40) G.player.velY = -G.speed;

            if(e.keyCode == 32)
                G.stucked = !G.stucked;
        });
        G.on('keyup',function(){
            G.player.isRun = false;
            G.player.velX = 0;
            G.player.velY = 0;
        });
    },

    /* Rendering update */
    update: function(G) {
        if(G.player.isRun){
            G.player.anim('assets/RUN/$.png',3,2);
        }else{
            G.player.anim('assets/IDLE/$.png',3,3);
        }

        if(G.player.x > GXTML.WIDTH){
            G.player.x = 0-G.player.width;
        }
        if(G.player.x < 0-G.player.width){
            G.player.x = GXTML.WIDTH;
        }
        if(G.player.y > GXTML.HEIGHT){
            G.player.y = 0-G.player.width;
        }
        if(G.player.y < 0-G.player.height){
            G.player.y = GXTML.HEIGHT;
        }
    }
});