//Create variables here
var dog, dogImg, happyDog;

var foodS, foodStock;

var database;

var fedTime, lastFed, addFoods,feed;

var foodObj;

var gameState, readState;

var bedroom, washroom, garden;


function preload()
{
  //load images here 
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroom = loadImage("img/Bed Room.png");
  washroom = loadImage("img/Wash Room.png");
  garden = loadImage("img/Garden.png");
  
}

function setup() {
  canvas = createCanvas(1000,500);

  database = firebase.database();

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);
 // foodStock.set(20);

 readState=database.ref("gameState");
 readState.on("value",function(data){
   gameState=data.val();
 })
  
  dog = createSprite(800,220,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw(){  

  background("green");

 fedTime = database.ref("FeedTime");
 fedTime.on("value", function(data){
    lastFed = data.val();
 })
    fill(255,255,254);
    textSize(15);

  currentTime = hour();
  
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
    
  }else{
    update("Hungry");
    foodObj.display();
    
    
  }

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    //addFoods();
    dog.addImage(dogImg);
  }

  
  drawSprites();

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()- 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState :"Hungry"
    })
}

function addFoods(){
  foodS++;
  // foodObj.updateFoodStock(foodObj.getFoodStock()+ 1);
  database.ref('/').update({
    Food : foodS 
  })
}

function update(state){
  database.ref("/").update({
    gameState : state
  })

}