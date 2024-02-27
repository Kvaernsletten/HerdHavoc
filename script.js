

let app = document.getElementById('app');
let gameScreen = document.getElementById('gameScreen');

let worldBackground;
let battleBackground;

//Player stats
let playerClass;
let playerName;
let playerLevel = 1;
let playerHealth = 100;
let playerMaxHealth = 100;
let playerEnergy = 100;
let playerMaxEnergy = 100;

//Enemy stats
let enemyName;
let enemyLevel = 1;
let enemyHealth = 100;
let enemyEnergy = 100;
let enemyGold = 0;

//inventory
let playerGold = 0;
let hasDesertRose = false;
let hasMountainKey = false;
let adventureInfo = "You wake up in your tent and a new adventure begins!"

// Game states
let isGameRunning = false;
let inBattle = false;
let mapLocationY;
let mapLocationX;

let inGrasslands = false;
let inForest = false;
let inDesert = false;
let inCave = false;

let areaHasRandomEncounters = false;
let encounterChance;

let canGoUp;
let canGoLeft;
let canGoRight;
let canGoDown;

// Player states
let goingLeft = false;
let passedOut = false;

let lostInDesertNorth = false;
let lostInDesertSouth = false;
let lostInDesertEast = false;
let lostInDesertWest = false;

let inOasis = false;
let inCampsite = false;

//UI
let buttonDisabled = false;

changeLocation();
updateView();
function updateView() {

    app.innerHTML = isGameRunning ? /*HTML*/ `
    <div class="gameScreen" ${inBattle ? battleBackground : worldBackground}>

        ${inBattle ? /*HTML*/`       
        <div class="topBattleDiv">
        </div>
        <div class="middleBattleDiv">
            <img class="player" src="imgs/Character_R.png">
            <img class="enemy" src="imgs/Character_L.png">
        </div>
        <div class="bottomBattleDiv">
        </div> 
    </div>
        <div class="battleInfo_container">
            <div class="playerInfo">${playerName ?? "Player"}
                <div>${playerClass ?? "Adventurer"} Lv. ${playerLevel}</div>
                    <div>Health: ${playerHealth + " / " + playerMaxHealth}</div>
                    <div>Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>
            </div>            
            <div class="worldActions">
                <button class="attackButton" 
                onmouseenter="showMenuTooltip('attack')"
                onmouseleave="showMenuTooltip('clear')" 
                ${inBattle ? 'onclick="attack()"' : 'disabled, style="opacity: 0"'}>Attack</button>
                <button class="itemsButton"
                onmouseenter="showMenuTooltip('items')"
                onmouseleave="showMenuTooltip('clear')"
                ${inBattle ? 'onclick="items()"' : 'disabled, style="opacity: 0"'}>Items</button>
                <button class="fleeButton" 
                onmouseenter="showMenuTooltip('flee')" 
                onmouseleave="showMenuTooltip('clear')" 
                ${inBattle ? 'onclick="flee()"' : 'disabled, style="opacity: 0"'}>Flee</button>
            </div>
        <div class="adventureInfo">${adventureInfo}</div>

        <div class="enemyInfo">${enemyName ?? "???"}
        <div>${playerClass ?? "Enemy"} Lv. ${playerLevel}</div>  
        <div>Health: ${enemyHealth ?? " "}</div>
        <div>Energy: ${enemyEnergy ?? " "}</div>                    
    </div>
    `

// NOT IN BATTLE:

            : /*HTML*/`       
        <div class="UpDiv">
            <button class="upButton" ${canGoUp ? 'onclick="moveCharacter(\'north\')"' : 'disabled'} style="${canGoUp ? '' : 'pointer-events: none; opacity: 0;'}">🡹</button>
        </div>
        <div class="LeftRightDiv">
            <button class="leftButton" ${canGoLeft ? 'onclick="moveCharacter(\'west\')"' : 'disabled'} style="${canGoLeft ? '' : 'pointer-events: none; opacity: 0;'}">🡸</button>
            <img class="player" src="${ passedOut ? "imgs/Character_Sleep.png" : playerStates()}">
            <button class="rightButton" ${canGoRight ? 'onclick="moveCharacter(\'east\')"' : 'disabled'} style="${canGoRight ? '' : 'pointer-events: none; opacity: 0;'}">🡺</button>
        </div>
        <div class="DownDiv">
            <button class="downButton" ${canGoDown ? 'onclick="moveCharacter(\'south\')"' : 'disabled'} style="${canGoDown ? '' : 'pointer-events: none; opacity: 0;'}">🡻</button>
        </div> 
    </div>
    <div class="worldInfo_container">
        <div class="playerInfo">${playerName ?? "Player"}
            <div>${playerClass ?? "Adventurer"} Lv. ${playerLevel}</div>
                    <div>Health: ${playerHealth + " / " + playerMaxHealth}</div>
                    <div>Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>
                <br>
                <br>
                <br>
                <div>Gold: ${playerGold}</div>
        </div>   
            <div class="worldActions">
                <button class="restButton"
                onmouseenter="showMenuTooltip('rest')"
                onmouseleave="showMenuTooltip('clear')" 
                ${inCampsite ? 'onclick="rest()"' : 'disabled'} style="${inCampsite ? '' : 'pointer-events: none; opacity: 0;'}">Rest</button>
            </div>
        <div class="adventureInfo">${adventureInfo}</div>

        <div class="PLACEHOLDER">${enemyName ?? "???"}           /////// Opacity set in styles.css
        <div>${playerClass ?? "Enemy"} Lv. ${playerLevel}</div>   /////    
        <div>Health: ${enemyHealth ?? " "}</div>                    //////
        <div>Energy: ${enemyEnergy ?? " "}</div>                    /////////
    </div>
    `
    }
    `

// START SCREEN:

            : /*HTML*/`       
            <div class="gameScreen" style="background-image: url(imgs/startScreen.png)">
            <div class="UpDiv">
            <button class="upButton" ${canGoUp ? 'onclick="moveCharacter(\'north\')"' : 'disabled, style="opacity: 0"'}>🡹</button>
            </div>
            <div class="inputDiv">
            <input id="nameInput" type="text" class="nameInput">
            <button class="nameButton" onclick="setName()">Set name</button>
            </div>
           
        <div class="LeftRightDiv">
            <button class="leftButton" onclick="goingLeft = true, updateView();">🡸</button>
            <img class="characterSelect" src=${goingLeft ? "imgs/Character_L.png" : "imgs/Character_R.png"}>
            <button class="rightButton" onclick="goingLeft = false, updateView();">🡺</button>
        </div>
        <div class="DownDiv">
            <button class="classButtons" 
            onclick="setClass('adventurer')"
            onmouseenter="showMenuTooltip('adventurer')"
            onmouseleave="showMenuTooltip('clear')">Adventurer</button>
            <button class="classButtons" 
            onclick="setClass('warrior')"
            onmouseenter="showMenuTooltip('warrior')"
            onmouseleave="showMenuTooltip('clear')">Warrior</button>
            <button class="classButtons" 
            onclick="setClass('rogue')"
            onmouseenter="showMenuTooltip('rogue')"
            onmouseleave="showMenuTooltip('clear')">Rogue</button>
            <button class="classButtons" 
            onclick="setClass('mage')"
            onmouseenter="showMenuTooltip('mage')"
            onmouseleave="showMenuTooltip('clear')">Mage</button>
            </div> 
    </div>
    </div>
    <div class="worldInfo_container">
        <div class="playerInfo">Your name: ${playerName ?? "Player"}
            <div>Your class: ${playerClass ?? "Adventurer"}</div>
                    <div>Health: ${playerHealth + " / " + playerMaxHealth}</div>
                    <div>Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>
        </div>   
            <div class="worldActions">
                <button class="restButton"
                onclick="startGame()">Start game</button>
            </div>
        <div class="adventureInfo">${adventureInfo}</div>

    `
}

function setName(){
    playerName = document.getElementById('nameInput').value;
    updateView();
}

function setClass(selectedClass){

    if(selectedClass == "adventurer"){
        playerHealth = 100;
        playerMaxHealth = 100;
        playerEnergy = 100;
        playerMaxEnergy = 100;
        playerClass = "Adventurer"
    }
    else if(selectedClass == "warrior"){
        playerHealth = 150;
        playerMaxHealth = 150;
        playerEnergy = 70;
        playerMaxEnergy = 70;
        playerClass = "Warrior"
    }
    else if(selectedClass == "rogue"){
        playerHealth = 85;
        playerMaxHealth = 85;
        playerEnergy = 125;
        playerMaxEnergy = 125;
        playerClass = "Rogue"
    }
    else if(selectedClass == "mage"){
        playerHealth = 70;
        playerMaxHealth = 70;
        playerEnergy = 150;
        playerMaxEnergy = 150;
        playerClass = "Mage"
    }
    
    updateView();
}


function startGame(){
    mapLocationY = 5;
    mapLocationX = 5;
    isGameRunning = true;
    changeLocation();
    updateView();
}

function rest(){
    if(mapLocationY == 10 && mapLocationX == 5){
        playerEnergy = playerMaxEnergy;
        adventureInfo = 'You recover and feel rested...';
        mapLocationY = 5;
        mapLocationX = 5;
        passedOut = false;
        changeLocation();
    }
    else{
        playerEnergy = playerMaxEnergy;
        adventureInfo = 'You take a moment to rest...';
    }

    updateView();
}

function passOut(){
    let stolenGoldAmount = Math.floor(Math.random() * (20-1) +1);
    passedOut = true;
    if(playerGold > stolenGoldAmount){
        adventureInfo = 'A stranger found you passed out in the dirt and helped you back to your campsite.. and also helped himself to ' + stolenGoldAmount + ' gold from your gold pouch..'
        playerGold -= stolenGoldAmount;
    }else if(playerGold <= stolenGoldAmount){
        adventureInfo = 'A stranger found you passed out in the dirt and helped you back to your campsite.. and also ran off with your entire gold pouch!'
        playerGold = 0;
    }
    
    updateView();
}

function enterCombat() {
    if(inGrasslands){
        battleBackground = `style="background-image: url(imgs/Arenas/grasslandsArena.png)"`;
    }
    else if(inForest){
        battleBackground = `style="background-image: url(imgs/Arenas/forestArena.png)"`;
    }
    else if(inDesert){
        battleBackground = `style="background-image: url(imgs/Arenas/desertArena.png)"`;
    }
    else if(inCave){
        battleBackground = `style="background-image: url(imgs/Arenas/caveArena.png"`;
    }
    enemyGold = Math.floor(Math.random() * (20-1) +1);
    enemyHealth = 150;
    inBattle = true;
    adventureInfo = enemyName ?? "Some dude" + " wants to fight!";
    updateView();
}

function attack(){
    if(playerClass == "Adventurer"){
        enemyHealth -= 25;
    }
    else if(playerClass == "Warrior"){
        enemyHealth -= 30;
    }
    if(playerClass == "Rogue"){
        enemyHealth -= 40;
    }
    if(playerClass == "Mage"){
        enemyHealth -= 60;
    }
    updateView();
    if (enemyHealth <= 0){
        winBattle();
    }
}

function items(){
    updateView();
}

function winBattle(){
    worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`
    inBattle = false;
    adventureInfo = "You emerge victorious and looted " + enemyGold + " gold from dead bodies... ";
    playerGold += enemyGold;
    updateView();
}

function flee(){
    worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`
    inBattle = false;
    adventureInfo = "You escaped!";
    updateView();
}

function takeDamage(){

}

function die(){

}

function showMenuTooltip(button){

    if(button == 'adventurer' && adventureInfo != "The adventurer is a balanced class."){
        adventureInfo = "The adventurer is a balanced class.";
        updateView();
    }
    if(button == 'warrior' && adventureInfo != "The warrior can take a beating but tires easily from wearing heavy armour."){
        adventureInfo = "The warrior can take a beating but tires easily from wearing heavy armour."
        updateView();
    }
    if(button == 'rogue' && adventureInfo != "Rogue flavour-text idk lol"){
        adventureInfo = "Rogue flavour-text idk lol"
        updateView();
    }
    if(button == 'mage' && adventureInfo != "While fragile in combat, the mage is the most powerful class and light armor lets them move around with ease. (also currently the most OP class since combat is not implemented and the only relevant stat is energy...)"){
        adventureInfo = "While fragile in combat, the mage is the most powerful class and light armor lets them move around with ease. (also currently the most OP class since combat is not implemented and the only relevant stat is energy...)";
        updateView();
    }

    if(button == 'attack' && adventureInfo != "Attack an enemy"){
        adventureInfo = "Attack an enemy";
        updateView();
    }
    if(button == 'items' && adventureInfo != "Use an item"){
        adventureInfo = "Use an item";
        updateView();
    }
    if(button == 'flee' && adventureInfo != "Attempt to run away!"){
        adventureInfo = "Attempt to run away!";
        updateView();
    }
    if(button == 'rest' && adventureInfo != "Rest in your tent?"){
        adventureInfo = "Rest in your tent?";
        updateView();
    }

    if(button == 'clear' && adventureInfo != ""){
        adventureInfo = "";
        updateView();
    }
}


function playerStates(){
    if(goingLeft == true){

        return "imgs/Character_L.png"

    }
    else{

        return "imgs/Character_R.png"

    }
}

function moveCharacter(direction) {

    if (direction == 'north') {
        if (canGoRight && mapLocationY == 10 && mapLocationX == 0) {
            mapLocationY = 1;
            mapLocationX = 3;
        }
        if(playerEnergy == 0){
            mapLocationY = 10;
            mapLocationX = 5;
            passOut();
        }
        else if (canGoUp && !lostInDesertNorth && !inOasis && playerEnergy > 0) {
            mapLocationY++;
            adventureInfo = "You walk north...";
            playerEnergy -= 5;
        }
        else if (canGoUp && lostInDesertNorth && playerEnergy >= 5) {
            mapLocationY--;
            adventureInfo = "You walk north...?";
            playerEnergy -= 5;
        }
        else if (canGoUp && inOasis) {
            mapLocationY = 10;
            mapLocationX = 0;
        } 
    }

    if (direction == 'south') {
        if (canGoRight && mapLocationY == 10 && mapLocationX == 0) {
            mapLocationY = 3;
            mapLocationX = 3;
        }
        if(playerEnergy == 0){
            mapLocationY = 10;
            mapLocationX = 5;
            passOut();
        }
        else if (canGoDown && !lostInDesertSouth && !inOasis && playerEnergy > 0) {
            mapLocationY--;
            adventureInfo = "You walk south...";
            playerEnergy -= 5;
        }
        else if (canGoDown && lostInDesertSouth) {
            mapLocationY++;
            adventureInfo = "You walk south...?";
            playerEnergy -= 5;
        }
        else if (canGoDown && inOasis) {
            mapLocationY = 10;
            mapLocationX = 0;
        }
    }

    if (direction == 'east') {

        goingLeft = false;

        if (canGoRight && mapLocationY == 10 && mapLocationX == 0) {
            mapLocationY = 2;
            mapLocationX = 2;
        }
        if(playerEnergy == 0){
            mapLocationY = 10;
            mapLocationX = 5;
            passOut();
        }
        else if (canGoRight && !lostInDesertEast && !inOasis && playerEnergy > 0) {
            mapLocationX++;
            adventureInfo = "You walk east...";
            playerEnergy -= 5;
        } 
        else if (canGoRight && lostInDesertEast) {
            mapLocationX--;
            adventureInfo = "You walk east...?";
            playerEnergy -= 5;
        }
        else if (canGoRight && inOasis) {
            mapLocationY = 10;
            mapLocationX = 0;
        }
    }

    if (direction == 'west') {

        goingLeft = true;

        if (canGoRight && mapLocationY == 10 && mapLocationX == 0) {
            mapLocationY = 2;
            mapLocationX = 4;
        }
        if(playerEnergy == 0){
            mapLocationY = 10;
            mapLocationX = 5;
            passOut();
        }
        else if (canGoLeft && !lostInDesertWest && !inOasis && playerEnergy > 0) {
            mapLocationX--;
            adventureInfo = "You walk west...";
            playerEnergy -= 5;
        } 
        else if (canGoLeft && lostInDesertWest) {
            mapLocationX++;
            adventureInfo = "You walk west...?";
            playerEnergy -= 5;
        }
        else if (canGoLeft && inOasis) {
            mapLocationY = 10;
            mapLocationX = 0;
        }
    }
    changeLocation();
    updateView();
}



function changeLocation() {

    // Y: 0
    if (mapLocationY == 0 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = false;
        lostInDesertSouth = false;
        lostInDesertEast = false;
        lostInDesertWest = false;
        inOasis = true;
    }
    if (mapLocationY == 0 && mapLocationX == 1) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertSouth = true;
        lostInDesertWest = false;
    }
    if (mapLocationY == 0 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertSouth = true;
        lostInDesertEast = false;
    }
    if (mapLocationY == 0 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertSouth = true;
        lostInDesertEast = true;
    }
    // if(mapLocationY == 0 && mapLocationX == 4){

    // }
    // if(mapLocationY == 0 && mapLocationX == 5){

    // }
    // if(mapLocationY == 0 && mapLocationX == 6){

    // }
    if (mapLocationY == 0 && mapLocationX == 7) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 0 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;
    }
    // if(mapLocationY == 0 && mapLocationX == 9){

    // }
    // if(mapLocationY == 0 && mapLocationX == 10){

    // }

    // Y: 1
    if (mapLocationY == 1 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertWest = true;
        lostInDesertSouth = false;
    }
    if (mapLocationY == 1 && mapLocationX == 1) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertWest = false;
        lostInDesertSouth = false;
    }
    if (mapLocationY == 1 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertSouth = false;
        lostInDesertEast = false;
    }
    if (mapLocationY == 1 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertEast = true;
        lostInDesertSouth = false;
    }
    if (mapLocationY == 1 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 1 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 1 && mapLocationX == 6) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 1 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 1 && mapLocationX == 8) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 1 && mapLocationX == 9) {
        if (!hasMountainKey) {
            canGoUp = false;
        } else {
            canGoUp = true;
        }
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = true;
        inCave = false;
    }
    if (mapLocationY == 1 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        inCampsite = false;
    }

    // Y: 2
    if (mapLocationY == 2 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertWest = true;
        lostInDesertNorth = false;
    }
    if (mapLocationY == 2 && mapLocationX == 1) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertWest = false;
        lostInDesertNorth = false;
    }
    if (mapLocationY == 2 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = false;
    }
    if (mapLocationY == 2 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = false;
        inDesert = true;

        lostInDesertNorth = false;
        lostInDesertSouth = false;
        lostInDesertEast = false;
        lostInDesertWest = false;
    }
    if (mapLocationY == 2 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        inGrasslands = true;
        inDesert = false;
    }
    if (mapLocationY == 2 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 2 && mapLocationX == 6) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;
    }
    if (mapLocationY == 2 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 2 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 2 && mapLocationX == 9) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        inGrasslands = false;
        inCave = true;
    }
    if (mapLocationY == 2 && mapLocationX == 10) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        inCampsite = true;
    }

    // Y: 3
    if (mapLocationY == 3 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = true;
        lostInDesertWest = true;
    }
    if (mapLocationY == 3 && mapLocationX == 1) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = true;
        lostInDesertWest = false;
    }
    if (mapLocationY == 3 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = true;
        lostInDesertEast = false;
    }
    if (mapLocationY == 3 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = true;
        lostInDesertEast = true;
    }
    if (mapLocationY == 3 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 3 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 3 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 3 && mapLocationX == 7) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 3 && mapLocationX == 8) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 3 && mapLocationX == 9) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 3 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;
    }

    // Y: 4
    if (mapLocationY == 4 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 4 && mapLocationX == 1) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 4 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 4 && mapLocationX == 3) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 4 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 4 && mapLocationX == 5) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 4 && mapLocationX == 6) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 4 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = true;
    }
    if (mapLocationY == 4 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        areaHasRandomEncounters = false;
    }
    if (mapLocationY == 4 && mapLocationX == 9) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 4 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;
    }

    // Y: 5
    if (mapLocationY == 5 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    // if(mapLocationY == 5 && mapLocationX == 1){

    // }
    if (mapLocationY == 5 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    // if(mapLocationY == 5 && mapLocationX == 3){

    // }
    if (mapLocationY == 5 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        areaHasRandomEncounters = true;
        inGrasslands = true;
        inCampsite = false;
    }
    if (mapLocationY == 5 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inCampsite = true;
        areaHasRandomEncounters = false;
        lostInDesertNorth = false;
        lostInDesertSouth = false;
        lostInDesertEast = false;
        lostInDesertWest = false;
        inOasis = false;
    }
    if (mapLocationY == 5 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;
        
        areaHasRandomEncounters = true;
        inCampsite = false;
    }
    if (mapLocationY == 5 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;
    }
    if (mapLocationY == 5 && mapLocationX == 8) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 5 && mapLocationX == 9) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 5 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }

    // Y: 6
    if (mapLocationY == 6 && mapLocationX == 0) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 6 && mapLocationX == 1) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 6 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = true;
    }
    if (mapLocationY == 6 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = false;
    }
    if (mapLocationY == 6 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = true;
    }
    if (mapLocationY == 6 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        inGrasslands = true;
        areaHasRandomEncounters = true;
        inCampsite = false;
    }
    if (mapLocationY == 6 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 6 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 6 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;
    }
    if (mapLocationY == 6 && mapLocationX == 9) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 6 && mapLocationX == 10) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }

    // Y: 7
    // if(mapLocationY == 7 && mapLocationX == 0){

    // }
    // if(mapLocationY == 7 && mapLocationX == 1){

    // }
    if (mapLocationY == 7 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 7 && mapLocationX == 3) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 7 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 7 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        inGrasslands = true;
        inForest = false;
    }
    if (mapLocationY == 7 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = false;
        inForest = true;
    }
    if (mapLocationY == 7 && mapLocationX == 7) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;
    }
    if (mapLocationY == 7 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 7 && mapLocationX == 9) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 7 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;
    }

    // Y: 8
    // if(mapLocationY == 8 && mapLocationX == 0){

    // }
    // if(mapLocationY == 8 && mapLocationX == 1){

    // }
    if (mapLocationY == 8 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 8 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 8 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = true;
        inForest = false;
    }
    if (mapLocationY == 8 && mapLocationX == 5) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;
    }
    if (mapLocationY == 8 && mapLocationX == 6) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 8 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 8 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;
    }
    if (mapLocationY == 8 && mapLocationX == 9) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        inCampsite = true;
    }
    if (mapLocationY == 8 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        inCampsite = false;
    }

    // Y: 9
    // if(mapLocationY == 9 && mapLocationX == 0){

    // }
    // if(mapLocationY == 9 && mapLocationX == 1){

    // }
    if (mapLocationY == 9 && mapLocationX == 2) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 9 && mapLocationX == 3) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = true;
        inForest = false;
    }
    if (mapLocationY == 9 && mapLocationX == 4) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = false;
        inForest = true;
    }
    if (mapLocationY == 9 && mapLocationX == 5) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 9 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 9 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 9 && mapLocationX == 8) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;
    }
    if (mapLocationY == 9 && mapLocationX == 9) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        inCampsite = false;
    }
    if (mapLocationY == 9 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;
    }

    // Y: 10
    if (mapLocationY == 10 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = false;

        adventureInfo = "You have found a hidden oasis!"

        lostInDesertNorth = false;
        lostInDesertSouth = false;
        lostInDesertEast = false;
        lostInDesertWest = false;
        inOasis = false;
    }
    // if(mapLocationY == 10 && mapLocationX == 1){

    // }
    // if(mapLocationY == 10 && mapLocationX == 2){

    // }
    // if(mapLocationY == 10 && mapLocationX == 3){

    // }
    // if(mapLocationY == 10 && mapLocationX == 4){

    // }
    if(mapLocationY == 10 && mapLocationX == 5){
        canGoUp = false;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = false;
        
        areaHasRandomEncounters = false;
        inCampsite = true;
    }
    // if(mapLocationY == 10 && mapLocationX == 6){

    // }
    // if(mapLocationY == 10 && mapLocationX == 7){

    // }
    // if(mapLocationY == 10 && mapLocationX == 8){

    // }
    if (mapLocationY == 10 && mapLocationX == 9) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;
    }
    if (mapLocationY == 10 && mapLocationX == 10) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;
    }
    
    worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`

    if(areaHasRandomEncounters){
        encounterChance = Math.floor(Math.random() * (10-1) +1);
        if(encounterChance == 5){
            enterCombat();
        }
    }

}
