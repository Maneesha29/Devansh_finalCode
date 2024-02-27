var player_img , player;
var play_btn , about_btn;
var splashScreen, background;
var platform,platformGroup;
var fire, fireImg , fireGroup;
var enemy, enemyImg , enemyGroup;
var invisbile_ground;
var health = 200 ;
var maxHealth = 200;
var score = 0;
var jump = 0;

var gameState = "wait"

function preload(){
    player_img = loadImage ("assets/Player.png");
    background_img = loadImage ("assets/Background.jpg");
    splashScreen = loadImage ("assets/Parkour.gif");
    //enemyImg = loadImage ("assets/Enemy.gif")
    enemyImg = loadImage("assets/enemy.gif");
    fireImg = loadImage ("assets/Fire.png");
}

function setup(){
  createCanvas ( windowWidth, windowHeight );

  play_btn = createImg ("assets/Play.png")
  play_btn.position( windowWidth/4, windowHeight/4.5 ) 
  play_btn.size( windowWidth/2 , windowHeight/2 )
  play_btn.hide()

  about_btn = createImg ("assets/About.png")
  about_btn.position( windowWidth/4.125, windowHeight/1.8 ) 
  about_btn.size( windowWidth/2 , windowHeight/2 )
  about_btn.hide()

  player = createSprite(windowWidth/10, windowHeight-120);
  player.addImage(player_img)
  player.scale = 1 
  player.visible = false
  player.debug = false
  player.setCollider("rectangle",0,0,player.width,player.height);

  invisbile_ground = createSprite(0, windowHeight, windowWidth/5, 10); 
  invisbile_ground.visible = false;

  platformGroup = new Group();
  fireGroup = new Group();
  enemyGroup = new Group();
 
}

function draw(){
    if(gameState == "wait"){
        background(splashScreen);
        score = 0;
        health = 200;
        play_btn.show();
        about_btn.show();

    }
    play_btn.mousePressed(() => {
        about_btn.hide();
        play_btn.hide();
        gameState = "level1";
    })

    about_btn.mousePressed(() => {
        about_btn.hide();
        play_btn.hide();
        gameState = "about";
    })

    if(gameState == "about"){
        aboutGame();
    }

    if(gameState == "collide"){
        health -= 50;
    }

    if(gameState == "lost"){
        gameOver();
    }
    if(gameState == "win"){
        gameWin();
    }
    if( gameState == "level1" ){
        background(background_img)
        player.visible = true;
        enemySpawn();
        playerMovement();
        platformSpawn();
        fireformSpawn();
       
        if (frameCount % 50 == 0 && health >0){
            score += 5
        }

        if (health==0){
            player.visible = false;
            enemyGroup.destroyEach();
            fireGroup.destroyEach();
            platformGroup.destroyEach();
            gameState = "lost"
        }
    
        if (score==1000){
            player.visible = false;
            enemyGroup.destroyEach();
            fireGroup.destroyEach();
            platformGroup.destroyEach();
            gameState = "win"
        }
    

}
drawSprites();

if(gameState == "level1"){
fill("Black");
textSize(40);
text("Score : " + score, windowWidth/12, windowHeight/12);

healthLevel();
}
}
function playerMovement(){
   player.collide(invisbile_ground);
   

   if ( player.x <= 50){
        player.x = 50;
   }

   if ( player.x >= windowWidth){
    player.x = windowWidth;
   }

   if ( player.y <= 0){
    player.y = 0;
   }

   if(player.y > windowHeight+100){
        gameState = "lost"
   }

   if (jump == 0){
    if(keyDown("SPACE")){
        player.velocityY = -40;
        jump = 1
    }
   }
    
   if (player.isTouching(platformGroup) ){
     jump = 0
   }
 
   if (player.isTouching(invisbile_ground)){
    jump = 0
   }

    if(keyDown("A") || keyDown("LEFT_ARROW")){
        player.velocityX = -30;
    }
    else{
        player.velocityX = 0
    }

    if(keyDown("D") || keyDown("RIGHT_ARROW")){
        player.velocityX = 30;
    }

    player.velocityY += 4;

}

function healthLevel(){
    stroke("Black");
    strokeWeight(10);
    noFill();
    rect(windowWidth/1.3, windowHeight/14, maxHealth, 20);

    noStroke();
    fill("Red");
    rect(windowWidth/1.3, windowHeight/14, health, 20);
}

function aboutGame(){
    swal({
        title : "About Parkour Game",
        text: " Use your parkour skills and reach till the end to save your city... ",
        textAlign : "center",
        imageUrl : "assets/Parkour.gif",
        imageSize : "300x300",
        confirmButtonText : " Go back to main screen ",
        confirmButtonColor : "green"
    },
    function(){
        gameState = "wait"
    }
    )
}

function gameOver(){
    swal({
        title : "Game lost",
        text: " Try Again",
        textAlign : "center",
        imageUrl : "assets/Parkour.gif",
        imageSize : "300x300",
        confirmButtonText : "Restart the game ",
        confirmButtonColor : "green"
    },
    function(){
        gameState = "wait";
        window.location.reload();
    }
    )
}

function gameWin(){
    swal({
        title : "Game Win",
        text: " Use your parkour skills and score higher and reach till the end to save your city... ",
        textAlign : "center",
        imageUrl : "assets/Parkour.gif",
        imageSize : "300x300",
        confirmButtonText : " Restart the game",
        confirmButtonColor : "green"
    },
    function(){
        gameState = "wait"
        window.location.reload();
    }
    )
}


function platformSpawn(){

    
    var random = Math.round(Math.random() * (windowHeight/3 - (windowHeight -50))+( windowHeight -50));
    platform = createSprite (windowWidth+350, random,width/3,windowHeight/10);
   
    if(frameCount % 100 == 0){
    
    console.log(random);
    platform.visible = true;
    platform.shapeColor = " #ad8aff "
    platform.velocityX = -10;
   // platform.debug = true;
    platform.setCollider("rectangle",0,0,platform.width,platform.height);
    platform.lifetime =400;

    platform.depth = player.depth;
    player.depth = player.depth+1;
 }
    
    platformGroup.add(platform);
    player.collide(platformGroup);
    
} 

function fireformSpawn(){

    fire = createSprite (player.x + 20, -150,width/4,windowHeight/10);

    if(frameCount % 150 == 0){
    
    fire.addImage (fireImg)
    fire.visible = true;
    fire.shapeColor = " #ad8aff "
    fire.velocityY = 5;
    fire.scale = 0.3
    }

    fireGroup.add(fire);
    if(player.isTouching(fireGroup)){
        fireGroup.destroyEach();
        health -=10;

    }
   
    
}

function enemySpawn(){

    var random = Math.round(Math.random() * (windowHeight/3 - (windowHeight -50))+( windowHeight -50));

    enemy = createSprite (windowWidth+250  , random ,width/4,windowHeight/10);


    if(frameCount % 300 == 0){
        
    enemy.addImage(enemyImg);
    enemy.visible = true;
    enemy.velocityX = -10;
    enemy.scale = 0.5
    }
    
    enemyGroup.add(enemy);
    
    if(player.isTouching(enemyGroup)){
        enemyGroup.destroyEach();
        health -=10;
    
    }
    
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

