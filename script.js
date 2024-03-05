

let app = document.getElementById('app');
let gameScreen = document.getElementById('gameScreen');

let worldBackground;
let battleBackground;

let adventureText = "Enter a name and choose a class for your adventure!";
let onHoverText = "";

//Player stats
let playerClass;
let playerName;
let playerLevel = 1;
let playerHealth = 100;
let playerMaxHealth = 100;
let playerEnergy = 100;
let playerMaxEnergy = 100;
let playerDamage;
let playerXP = 0;
let playerNextLevelXP = 27;
let excessXP;

//Enemy stats
let enemyName;
let enemyLevel = 1;
let enemyHealth;
let enemyDamage;
let enemyGold = 0;
let yieldXP;

//inventory
let playerGold = 70;
let stolenGoldAmount;

let hasApple1 = true;
let hasApple2 = false;
let hasApple3 = false;
let hasPotion = true;
let hasFishingRod = false;
let hasDesertRose = false;
let hasCopperKey = false;
let hasSilverKey = false;
let inventoryGoat;

let hasGoat1 = false;
let hasGoat2 = false;
let hasGoat3 = false;

let copperKeyUsed = false;
let silverKeyUsed = false;
let returnedGoat1 = false;
let returnedGoat2 = false;
let returnedGoat3 = false;

// Game states
let isGameRunning = false;
let inBattle = false;

let areaHasWorldItem;
let worldItem;

let areaHasRandomEncounters = false;
let encounterChance;

let canGoUp;
let canGoLeft;
let canGoRight;
let canGoDown;

// Location variables
let mapLocationY;
let mapLocationX;

let inGrasslands = false;
let inForest = false;
let inDesert = false;
let inCave = false;
let inOasis = false;
let inMainCampsite = false;
let inCampsite = false;
let inShopWest = false;
let inShopEast = false;
let inGoatArea1 = false;
let inGoatArea2 = false;
let inGoatArea3 = false;
let inFishableArea = false;
let inFrontOfCopperDoor = false;
let inFrontOfSilverDoor = false;

let doorUnlocked = false;

// Combat states
let actionMenu = false;

// Player states
let playerMale = true;
let goingLeft = false;
let passedOut = false;

let lostInDesertNorth = false;
let lostInDesertSouth = false;
let lostInDesertEast = false;
let lostInDesertWest = false;

let nextStepOasis = false;

//UI
let buttonDisabled = false;
let healthBarColor = "lightgreen";
let energyBarColor = "lightgreen";

let muted = false;
let currentMusic;

//Music
let bgm_grasslands = new Audio("sfx/grasslands.ogg")
let bgm_forest = new Audio("sfx/forest.ogg")
let bgm_desert = new Audio("sfx/desert.ogg")
let bgm_cave = new Audio("sfx/cave.ogg")
let fadeInInterval;
let fadeOutInterval
bgm_grasslands.volume = 0.0001;
bgm_forest.volume = 0.0001;
bgm_desert.volume = 0.0001;
bgm_cave.volume = 0.0001;

//SFX
let coinsAudio = new Audio("sfx/Coins.mp3")
let unlockAudio = new Audio("sfx/Unlock.mp3")
let eatAudio = new Audio("sfx/Eat.mp3")
let drinkAudio = new Audio("sfx/Drink.mp3")
let goatAudio = new Audio("sfx/Goat.mp3")

BGM('startScreen');
setUpArea();
updateView();
function updateView() {

    app.innerHTML = isGameRunning ? /*HTML*/ `
    <div class="gameScreen" ${inBattle ? battleBackground : worldBackground}>

        ${inBattle ? /*HTML*/`       
        <div class="topBattleDiv">
        </div>
        <div class="middleBattleDiv">
            <img class="playerInCombat" src=${playerMale ? "imgs/Character_Male_inCombat.png" : "imgs/Character_Female_inCombat.png"}>
            <img class="enemyInCombat" src=${enemySprite}>
        </div>
        <div class="bottomBattleDiv">
        </div> 
        <div class="adventureText">${adventureText}</div>
    </div>
        <div class="worldInfo_container">
            <div class="playerInfo">${playerName ?? "Dio"}
                <div>${playerClass ?? "Adventurer"} (Lv. ${playerLevel})</div>
                    <div>XP: ${playerXP + " / " + playerNextLevelXP}</div>
                    <div style="color:${healthBarColor}">Health: ${playerHealth + " / " + playerMaxHealth}</div>
                    <div style="color:${energyBarColor}">Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>
            </div>            
            <div class="worldActions">
                ${actionMenu ? /*HTML*/ ``
                : /*HTML*/ `<button class="attackButton" 
                onmouseenter="onHoverTooltip('attack')"
                onmouseleave="clearTooltip()" 
                ${inBattle ? 'onclick="attack(), onHoverTooltip(\'enemyTurn\'), updateView()"' : 'disabled, style="opacity: 0"'}>Attack</button>
                <button class="magicButton"
                onmouseenter="onHoverTooltip('magic')"
                onmouseleave="clearTooltip()"
                ${inBattle ? 'onclick="magic()"' : 'disabled, style="opacity: 0"'}>Magic</button>
                <button class="fleeButton" 
                onmouseenter="onHoverTooltip('flee')" 
                onmouseleave="clearTooltip()" 
                ${inBattle ? 'onclick="flee()"' : 'disabled, style="opacity: 0"'}>Flee</button>
                `}
            </div>
        <div class="onHoverText">${onHoverText}</div>

        <div class="enemyInfo">${enemyName.charAt(0).toUpperCase() + enemyName.slice(1) ?? "???"}
        <div>Enemy (Lv. ${enemyLevel})</div>  
        <div>Health: ${enemyHealth ?? " "}</div>                
    </div>
    </div>
    <button onclick="muteAudio()">Mute</button>
    `

            // NOT IN BATTLE:

            : /*HTML*/`       
        <div class="UpDiv">
            <button class="upButton" ${canGoUp ? 'onclick="moveCharacter(\'north\')"' : 'disabled'} style="${canGoUp ? '' : 'pointer-events: none; opacity: 0;'}">🡹</button>
        </div>
        <div class="LeftRightDiv">
            <button class="leftButton" ${canGoLeft ? 'onclick="moveCharacter(\'west\')"' : 'disabled'} style="${canGoLeft ? '' : 'pointer-events: none; opacity: 0;'}">🡸</button>
            <div class="playerContainer">
                <img class="player" src="${passedOut ? (playerMale ? "imgs/Character_Sleep.png" : "imgs/Character_Sleep_Female.png") : playerStates()}">
                ${areaHasWorldItem ? /*HTML*/`<img class="worldItem" src="${worldItem}">` : ``}
                ${inShopWest || inShopEast ? /*HTML*/`<img class="worldItem" src="imgs/world_items/NPC.png">` : ``}
                ${returnedGoat1 && inMainCampsite ? /*HTML*/`<img class="worldItem" src="imgs/world_items/Goat1_WorldItem.png">` : ``}
                ${returnedGoat2 && inMainCampsite ? /*HTML*/`<img class="worldItem" src="imgs/world_items/Goat2_WorldItem.png">` : ``}
                ${returnedGoat3 && inMainCampsite ? /*HTML*/`<img class="worldItem" src="imgs/world_items/Goat3_WorldItem.png">` : ``}
                </div>
                <button class="rightButton" ${canGoRight ? 'onclick="moveCharacter(\'east\')"' : 'disabled'} style="${canGoRight ? '' : 'pointer-events: none; opacity: 0;'}">🡺</button>
        </div>
        <div class="DownDiv">
            <button class="downButton" ${canGoDown ? 'onclick="moveCharacter(\'south\')"' : 'disabled'} style="${canGoDown ? '' : 'pointer-events: none; opacity: 0;'}">🡻</button>
        </div> 
        <div class="adventureText">${adventureText}</div>
    </div>
    <div class="worldInfo_container">
        <div class="playerInfo">${playerName ?? "Dio"}
            <div>${playerClass ?? "Adventurer"} (Lv. ${playerLevel})</div>
            <div>XP: ${playerXP + " / " + playerNextLevelXP}</div>
            <div style="color:${healthBarColor}">Health: ${playerHealth + " / " + playerMaxHealth}</div>
            <div style="color:${energyBarColor}">Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>
        </div>   
            <div class="worldActions">
                
                ${inCampsite ?
                /*HTML*/`<button
                ${inCampsite ? 'onclick="rest()"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('rest')}"
                onmouseleave="if(onHoverText == 'Rest in your tent?') {clearTooltip()}">Rest</button> 
                ` :
                    /*HTML*/``}

                ${inShopWest ?
                    /*HTML*/`<button
                ${inShopWest ? 'onclick="buyItem(\'apple\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('buyApple')}"
                onmouseleave="if(onHoverText == 'Buy an apple? (12 gold)') {clearTooltip()}">Buy apple</button>
                <button
                ${inShopWest ? 'onclick="buyItem(\'potion\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('buyPotion')}"
                onmouseleave="if(onHoverText == 'Buy a potion? (50 gold)') {clearTooltip()}">Buy potion</button>  
                
                ` :
                    /*HTML*/``}

                ${inShopEast ?
                    /*HTML*/`<button
                ${inShopEast ? 'onclick="buyItem(\'apple\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('buyApple')}"
                onmouseleave="if(onHoverText == 'Buy apple? (12 gold)') {clearTooltip()}">Buy apple</button> 
                ` :
                    /*HTML*/``}
                    
                ${inShopEast && !hasFishingRod ?
                    /*HTML*/`<button
                ${inShopEast && !hasFishingRod ? 'onclick="buyItem(\'fishingRod\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('buyFishingRod')}"
                onmouseleave="if(onHoverText == 'Buy fishing rod? (150 gold)') {clearTooltip()}">Buy fishing rod</button> 
                ` :
                    /*HTML*/``}

                ${hasDesertRose && inShopWest ?
                    /*HTML*/`<button
                ${hasDesertRose && inShopWest ? 'onclick="buyItem(\'silverKey\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('tradeDesertRose')}"
                onmouseleave="if(onHoverText == 'Trade [desert rose] for [silver key] to the mountain?') {clearTooltip()}">Trade desert rose</button> 
                ` :
                    /*HTML*/``}

                ${inOasis ?
                        /*HTML*/`<button
                ${inOasis && !hasDesertRose && !hasSilverKey ? 'onclick="pickUpItem(\'desertRose\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('pickUpDesertRose')}"
                onmouseleave="if(onHoverText == 'Pick up desert rose?') {clearTooltip()}">Take rose</button> 
                ` :
                    /*HTML*/``}

                ${inGoatArea1 && !hasGoat1 && !returnedGoat1 ?
                    /*HTML*/`<button
                onclick="pickUpItem('goat1')"
                onmouseenter="{onHoverTooltip('pickUpGoat')}"
                onmouseleave="if(onHoverText == 'Take goat?') {clearTooltip()}">Take goat</button> 
                ` :
                    /*HTML*/``}
                
                ${inGoatArea2 && !hasGoat2 && !returnedGoat2 ?
                    /*HTML*/`<button
                onclick="pickUpItem('goat2')"
                onmouseenter="{onHoverTooltip('pickUpGoat')}"
                onmouseleave="if(onHoverText == 'Take goat?') {clearTooltip()}">Take goat</button> 
                ` :
                /*HTML*/``}

                ${inGoatArea3 && !hasGoat3 && !returnedGoat3 ?
                    /*HTML*/`<button
                onclick="pickUpItem('goat3')"
                onmouseenter="{onHoverTooltip('pickUpGoat')}"
                onmouseleave="if(onHoverText == 'Take goat?') {clearTooltip()}">Take goat</button> 
                ` :
                    /*HTML*/``}
                    
            </div>
        


        <div class="onHoverText">${onHoverText}</div>

        <div>Inventory: <br>
        Gold: ${playerGold}
        </div>
        <div class="inventoryGrid">

        <div id="Inventory_Slot1" class="inventorySlots inventoryLeft inventoryTop"
        onclick="if(hasApple1){useItem('apple')}"><img src=${hasApple1 ? "imgs/inventory_items/Apple.png" : "imgs/inventory_items/Apple_Slot.png"}
        onmouseenter="if(hasApple1){onHoverTooltip('inventory_apple1')}"
        onmouseleave="if(hasApple1 && onHoverText == 'Eat apple? (+25 health)'){clearTooltip()}">
        </div>

        <div id="Inventory_Slot2" class="inventorySlots inventoryTop" 
        onclick="if(hasApple2){useItem('apple')}"><img src=${hasApple2 ? "imgs/inventory_items/Apple.png" : "imgs/inventory_items/Apple_Slot.png"}
        onmouseenter="if(hasApple2){onHoverTooltip('inventory_apple2')}"
        onmouseleave="if(hasApple2 && onHoverText == 'Eat apple? (+25 health)'){clearTooltip()}">
        </div>

        <div id="Inventory_Slot3" class="inventorySlots inventoryRight inventoryTop"
        onclick="if(hasApple3){useItem('apple')}"><img src=${hasApple3 ? "imgs/inventory_items/Apple.png" : "imgs/inventory_items/Apple_Slot.png"}
        onmouseenter="if(hasApple3){onHoverTooltip('inventory_apple3')}"
        onmouseleave="if(hasApple3 && onHoverText == 'Eat apple? (+25 health)'){clearTooltip()}">
        </div>

        <div id="Inventory_Slot4" class="inventorySlots inventoryLeft"
        onclick="useItem('potion')">
        <img src=${hasPotion ? "imgs/inventory_items/Potion.png" : "imgs/inventory_items/Potion_Empty.png"}
        onmouseenter="onHoverTooltip('inventory_potion')"
        onmouseleave="clearTooltip()">
        </div>

        <div id="Inventory_Slot5" class="inventorySlots"
        onclick="useItem('fishingRod')">
        <img src=${hasFishingRod ? "imgs/inventory_items/Fishingrod.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('inventory_fishingRod')"
        onmouseleave="if(hasFishingRod){clearTooltip()}">
        </div>

        <div id="Inventory_Slot6" class="inventorySlots inventoryRight"
        onclick="useItem('desertRose')">
        <img src=${hasDesertRose ? "imgs/inventory_items/DesertRose.png" : (hasSilverKey ? "imgs/inventory_items/DesertRose_Slot.png" : "imgs/inventory_items/Empty_Slot.png")}                  
        onmouseenter="onHoverTooltip('inventory_desertRose')"
        onmouseleave="if(hasDesertRose){clearTooltip()}">
        </div>

        <div id="Inventory_Slot7" class="inventorySlots inventoryLeft inventoryBottom"
        onclick="useItem('copperKey')">
        <img src=${hasCopperKey ? "imgs/inventory_items/CopperKey.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('inventory_copperKey')"
        onmouseleave="if(hasCopperKey){clearTooltip()}">
        </div>

        <div id="Inventory_Slot8" class="inventorySlots inventoryBottom"
        onclick="useItem('silverKey')">
        <img src=${hasSilverKey ? "imgs/inventory_items/SilverKey.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('inventory_silverKey')"
        onmouseleave="if(hasSilverKey){clearTooltip()}">
        </div>

        <div id="Inventory_Slot9" class="inventorySlots inventoryRight inventoryBottom"
        onclick="useItem('goat')">
        <img src=${hasGoat1 || hasGoat2 || hasGoat3 ? inventoryGoat : "imgs/inventory_items/Goat_Empty.png"} 
        onmouseenter="onHoverTooltip('inventory_goat')"
        onmouseleave="if((hasGoat1 || hasGoat2 || hasGoat3) || (returnedGoat1 || returnedGoat2 || returnedGoat3)){clearTooltip()}"></div>
        </div>
    </div>
    <button onclick="muteAudio()">Mute</button>
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
            <input id="nameInput" type="text" class="nameInput" placeholder="[Enter name]" max="12">
            <button class="nameButton" onclick="setName()">Set name</button>
            </div>
           
        <div class="LeftRightDiv">
            <button class="leftButton" onclick="goingLeft = !goingLeft, playerMale = !playerMale, updateView();">🡸</button>
            <img class="characterSelect" src=${goingLeft ? "imgs/Character_Female_R.png" : "imgs/Character_R.png"}>
            <button class="rightButton" onclick="goingLeft = !goingLeft, playerMale = !playerMale, updateView();">🡺</button>
        </div>
        <div class="DownDiv">
            <button class="classButtons" 
            onclick="setClass('adventurer')"
            onmouseenter="onHoverTooltip('adventurer')"
            onmouseleave="clearTooltip()">Adventurer</button>
            <button class="classButtons" 
            onclick="setClass('warrior')"
            onmouseenter="onHoverTooltip('warrior')"
            onmouseleave="clearTooltip()">Warrior</button>
            <button class="classButtons" 
            onclick="setClass('rogue')"
            onmouseenter="onHoverTooltip('rogue')"
            onmouseleave="clearTooltip()">Rogue</button>
            <button class="classButtons" 
            onclick="setClass('mage')"
            onmouseenter="onHoverTooltip('mage')"
            onmouseleave="clearTooltip()">Mage</button>
            </div> 
            <div class="adventureText">${adventureText}</div>
    </div>
    </div>
    <div class="worldInfo_container">
        <div class="playerInfo">Your name: ${playerName ?? "Dio"}
            <div>Your class: ${playerClass ?? "Adventurer"}</div>
                    <div>Health: ${playerHealth + " / " + playerMaxHealth}</div>
                    <div>Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>
        </div>   
            <div class="worldActions">
                <button
                onclick="startGame()">Start game</button>
            </div>
            <div class="onHoverText">${onHoverText}</div>
        <div class="inventoryGrid"></div>
        </div>
        <button onclick="muteAudio()">Mute</button>
        `
}

function setName() {
    playerName = document.getElementById('nameInput').value;
    updateView();
}

function setClass(selectedClass) {

    if (selectedClass == "adventurer") {
        playerHealth = 100;
        playerMaxHealth = 100;
        playerEnergy = 100;
        playerMaxEnergy = 100;
        playerDamage = 25;
        playerClass = "Adventurer"
    }
    else if (selectedClass == "warrior") {
        playerHealth = 150;
        playerMaxHealth = 150;
        playerEnergy = 70;
        playerMaxEnergy = 70;
        playerDamage = 30;
        playerClass = "Warrior"
    }
    else if (selectedClass == "rogue") {
        playerHealth = 85;
        playerMaxHealth = 85;
        playerEnergy = 125;
        playerMaxEnergy = 125;
        playerDamage = 40;
        playerClass = "Rogue"
    }
    else if (selectedClass == "mage") {
        playerHealth = 70;
        playerMaxHealth = 70;
        playerEnergy = 150;
        playerMaxEnergy = 150;
        playerDamage = 45;
        playerClass = "Mage"
    }
    adventureText = "Start game as the " + playerClass + " class?"

    updateView();
}


function startGame() {
    if (playerName == null) {
        playerName = "Dio"
    }
    if (playerClass == null) {
        playerHealth = 100;
        playerMaxHealth = 100;
        playerEnergy = 100;
        playerMaxEnergy = 100;
        playerDamage = 25;
        playerClass = "Adventurer"
    }
    adventureText = "You step out of your tent only to see that your three goats are missing... You have to find them and bring them back here!";
    mapLocationY = 5;
    mapLocationX = 5;
    isGameRunning = true;
    inventoryGoat = "imgs/inventory_items/Empty_Slot.png"
    setUpArea();
    updateView();
}

function rest() {
    if (mapLocationY == 10 && mapLocationX == 5) {
        playerEnergy = playerMaxEnergy;
        adventureText = 'You recover and feel rested...';
        mapLocationY = 5;
        mapLocationX = 5;
        passedOut = false;
        setUpArea();
    }
    else {
        playerEnergy = playerMaxEnergy;
        adventureText = 'You take a moment to rest and recover your energy!';
    }
    statusBars();
    updateView();
}

function passOut() {
    stolenGoldAmount = Math.floor(playerGold * 0.25);
    passedOut = true;
    areaHasWorldItem = false;
    nextStepOasis = false;
    inShopEast = false;
    inShopWest = false;
    inFrontOfCopperDoor = false;
    inFrontOfSilverDoor = false;
    doorUnlocked = false;
    lostInDesertNorth = false;
    lostInDesertSouth = false;
    lostInDesertEast = false;
    lostInDesertWest = false;
    inOasis = false;
    inGoatArea1 = false;
    inGoatArea2 = false;
    inGoatArea3 = false;
    inFishableArea = false;
    inGrasslands = false;
    inForest = false;
    inDesert = false;
    inCave = false;

    if (playerGold > stolenGoldAmount && stolenGoldAmount != 0) {
        adventureText = 'A stranger found you passed out in the dirt and helped you back to your campsite.. and also helped himself to ' + stolenGoldAmount + ' gold from your gold pouch..'
        playerGold -= stolenGoldAmount;
    } else if (playerGold <= stolenGoldAmount) {
        adventureText = 'A stranger found you passed out in the dirt and helped you back to your campsite.. and also ran off with your entire gold pouch!'
        playerGold = 0;
    } else if (stolenGoldAmount == 0) {
        adventureText = 'A stranger found you passed out in the dirt and helped you back to your campsite..'
    }

    updateView();
}

function enterCombat() {

    setUpEnemy();

    adventureText = "A " + enemyName + " ambushed you!"

    if (inGrasslands) {
        battleBackground = `style="background-image: url(imgs/Arenas/grasslandsArena.png)"`;
    }
    else if (inForest) {
        battleBackground = `style="background-image: url(imgs/Arenas/forestArena.png)"`;
    }
    else if (inDesert) {
        battleBackground = `style="background-image: url(imgs/Arenas/desertArena.png)"`;
    }
    else if (inCave) {
        battleBackground = `style="background-image: url(imgs/Arenas/caveArena.png"`;
    }

    inBattle = true;
    updateView();
}

function setUpEnemy() {

    if (inGrasslands) {
        enemyName = "silly bandit"
        enemySprite = "imgs/Enemy_sillyBandit_inCombat.png"
        onHoverText = "Choose an action";
        enemyGold = Math.floor(Math.random() * 21) + 5;
        enemyLevel = 1;
        enemyHealth = 65;
        enemyDamage = 5;
        yieldXP = 10;

    }
    if (inForest) {
        enemyName = "forest goblin"
        enemySprite = "imgs/Enemy_forestGoblin_inCombat.png"
        onHoverText = "Choose an action";
        enemyGold = Math.floor(Math.random() * 21) + 5;
        enemyLevel = 3;
        enemyHealth = 85;
        enemyDamage = 10;
        yieldXP = 15;
    }
    if (inDesert) {
        enemyName = "skeleton warrior"
        enemySprite = "imgs/Enemy_skeleton_inCombat.png"
        onHoverText = "Choose an action";
        enemyGold = Math.floor(Math.random() * 21) + 5;
        enemyLevel = 6;
        enemyHealth = 105;
        enemyDamage = 15;
        yieldXP = 20;
    }
    if (inCave) {
        enemyName = "cave troll"
        enemySprite = "imgs/Enemy_caveTroll_inCombat.png"
        onHoverText = "Choose an action";
        enemyGold = Math.floor(Math.random() * 21) + 5;
        enemyLevel = 10;
        enemyHealth = 125;
        enemyDamage = 20;
        yieldXP = 30;
    }
}

function attack() {

    actionMenu = true;
    enemyHealth -= playerDamage;
    adventureText = "You deal " + playerDamage + " damage!"

    if (enemyHealth <= 0) {
        enemyHealth = 0;
        //adventureText =   YOU DEAL amoutOfDamage AND =            FIX THIS.
        //set timeout with delay!!
        adventureText = "The " + enemyName + " dies."
        setTimeout(winBattle, 2000);
    }
    else {
        setTimeout(takeDamage, 1500);
    }
    updateView();

}

function magic() {
    updateView();
}

function winBattle() {
    worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`
    inBattle = false;
    actionMenu = false;
    adventureText = "You emerge victorious and looted " + enemyGold + " gold from the corpse... ";
    clearTooltip();
    playerGold += enemyGold;
    playerXP += yieldXP;
    levelUp();
    updateView();
}

function levelUp() {
    if (playerXP >= playerNextLevelXP) {
        playerLevel++;
        excessXP = playerXP - playerNextLevelXP;
        playerXP = 0;
        playerXP += excessXP;
        playerNextLevelXP = playerLevel * 27;

        if (playerClass == 'Adventurer') {
            playerMaxHealth += 5;
            playerMaxEnergy += 5;
            playerDamage += 7;
        }
        if (playerClass == 'Warrior') {
            playerMaxHealth += 5;
            playerMaxEnergy += 5;
            playerDamage += 7;
        }
        if (playerClass == 'Rogue') {
            playerMaxHealth += 5;
            playerMaxEnergy += 5;
            playerDamage += 10;
        }
        if (playerClass == 'Mage') {
            playerMaxHealth += 5;
            playerMaxEnergy += 5;
            playerDamage += 7;
        }

    }
}

function flee() {
    worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`
    inBattle = false;
    actionMenu = false;

    droppedGold = Math.floor(playerGold * 0.10);
    if (playerGold > droppedGold && droppedGold != 0) {
        adventureText = 'You grab a handful of gold coins and toss it at your enemy as a distraction to escape... You lose ' + droppedGold + ' gold!'
        playerGold -= droppedGold;
    } else if (playerGold <= droppedGold) {
        adventureText = 'You grab all of your gold coins and toss it and toss it at your enemy as a distraction to escape...'
        playerGold = 0;
    } else if (droppedGold == 0) {
        adventureText = 'You escaped!'
    }

    clearTooltip();
    updateView();
}

function takeDamage() {

    playerHealth -= enemyDamage;
    adventureText = "The " + enemyName + " attacks you for " + enemyDamage + " damage!";
    actionMenu = false;
    if (playerHealth <= 0) {
        die();
    }
    statusBars();
    updateView();
}

function die() {
    location.reload();
}

function buyItem(item) {

    if (item == "apple") {
        if (playerGold >= 12) {

            if (!hasApple1 && !hasApple2 && !hasApple3) {
                hasApple1 = true;
                adventureText = "You bought an apple."
                playerGold -= 12;
                coinsAudio.currentTime = 0;
                coinsAudio.play();
            }
            else if (hasApple1 && !hasApple2 && !hasApple3) {
                hasApple2 = true;
                adventureText = "You bought an apple."
                playerGold -= 12;
                coinsAudio.currentTime = 0;
                coinsAudio.play();
            }
            else if (hasApple1 && hasApple2 && !hasApple3) {
                hasApple3 = true;
                adventureText = "You bought an apple."
                playerGold -= 12;
                coinsAudio.currentTime = 0;
                coinsAudio.play();
            }
        } else if (playerGold < 12) {
            adventureText = "You do not have enough gold!"
        }
    }

    if (item == "potion") {
        if (playerGold >= 50) {

            if (!hasPotion) {
                hasPotion = true;
                adventureText = "You bought a potion."
                playerGold -= 50;
                coinsAudio.play();
            }
        } else if (playerGold < 50) {
            adventureText = "You do not have enough gold!"
        }
    }

    if (item == "fishingRod") {
        if (playerGold >= 150) {

            if (!hasFishingRod) {
                hasFishingRod = true;
                areaHasWorldItem = false;
                adventureText = "You bought a fishing rod."
                playerGold -= 150;
                coinsAudio.play();
            }
        } else if (playerGold < 150) {
            adventureText = "You do not have enough gold!"
        }

    }

    if (item == "silverKey") {
        if (hasDesertRose) {
            hasSilverKey = true;
            hasDesertRose = false;
            adventureText = "You traded the rose for a silver key!"
        } else if (!hasDesertRose) {
            adventureText = "You don't have the desert rose! There is a rumour it can be found if you keep heading south-east in the desert...."
        }
    }
    updateView();
}

function pickUpItem(item) {
    if (item == "desertRose") {
        if (!hasDesertRose && !hasSilverKey) {
            hasDesertRose = true;
            areaHasWorldItem = false;
            adventureText = "You carefully pluck the rare desert rose from the hidden oasis.."
        }
    }
    if (item == "goat1" && !hasGoat2 && !hasGoat3) {
        if (!hasGoat1 && !returnedGoat1) {
            hasGoat1 = true;
            areaHasWorldItem = false;
            adventureText = "You take the goat!"
            inventoryGoat = "imgs/inventory_items/Goat1.png"
        }
    }
    else if (item == "goat1" && (hasGoat2 || hasGoat3)) {
        adventureText = "You can only carry one goat at a time! Head back and drop off a goat first!"
    }
    if (item == "goat2" && !hasGoat1 && !hasGoat3) {
        if (!hasGoat2 && !returnedGoat2) {
            hasGoat2 = true;
            areaHasWorldItem = false;
            adventureText = "You take the goat!"
            inventoryGoat = "imgs/inventory_items/Goat2.png"
        }
    }
    else if (item == "goat2" && (hasGoat1 || hasGoat3)) {
        adventureText = "You can only carry one goat at a time! Head back and drop off a goat first!"
    }
    if (item == "goat3" && !hasGoat1 && !hasGoat2) {
        if (!hasGoat3 && !returnedGoat3) {
            hasGoat3 = true;
            areaHasWorldItem = false;
            adventureText = "You take the goat!"
            inventoryGoat = "imgs/inventory_items/Goat3.png"
        }
    }
    else if (item == "goat3" && (hasGoat1 || hasGoat2)) {
        adventureText = "You can only carry one goat at a time! Head back and drop off a goat first!"
    }
    updateView();
}

function useItem(item) {
    if (item == 'apple') {
        if (playerHealth < playerMaxHealth) {
            eatApple();
        } else {
            adventureText = "You are full!"
        }
    }
    if (item == 'potion' && hasPotion) {
        if (playerEnergy < playerMaxEnergy) {
            hasPotion = false;
            adventureText = "You drink the potion.. +50 energy!"
            playerEnergy += 50;
            if (playerEnergy >= playerMaxEnergy) {
                playerEnergy = playerMaxEnergy;
            }
            drinkAudio.play();
            clearTooltip();
            statusBars();
        } else {
            adventureText = "You already feel energized!"
        }
    }

    if (item == 'goat' && inMainCampsite && hasGoat1) {
        returnedGoat1 = true;
        hasGoat1 = false;
        adventureText = "You return the goat to your campsite!"
        goatAudio.play();
    }
    if (item == 'goat' && inMainCampsite && hasGoat2) {
        returnedGoat2 = true;
        hasGoat2 = false;
        adventureText = "You return the goat to your campsite!"
        goatAudio.play();
    }
    if (item == 'goat' && inMainCampsite && hasGoat3) {
        returnedGoat3 = true;
        hasGoat3 = false;
        adventureText = "You return the goat to your campsite!"
        goatAudio.play();
    }
    else if (item == 'goat' && !inMainCampsite && (hasGoat1 || hasGoat2 || hasGoat3)) {
        adventureText = "You should bring the goat back to your main campsite first!"
        goatAudio.play();
    }

    if (item == 'fishingRod' && inFishableArea && hasFishingRod) {
        if (!hasCopperKey) {
            hasCopperKey = true;
            adventureText = "You use your fishing rod to pull an old rusty key from the depths of the forest lake!"
        }
        else if (hasCopperKey) {
            adventureText = "This water doesn't seem suitable for fish to live in..."
        }
    }
    else if (item == 'fishingRod' && !inFishableArea && hasFishingRod) {
        adventureText = "There's no fishable water in this area... You might try elsewhere!"
    }

    if (item == 'desertRose' && hasDesertRose) {
        adventureText = "The rose has a vile stench! You did not expect that!"
    }

    if (item == 'copperKey' && hasCopperKey && inFrontOfCopperDoor && !copperKeyUsed) {
        copperKeyUsed = true;
        doorUnlocked = true;
        unlockAudio.play();
        canGoUp = true;
        changeLocation();
    }
    else if (item == 'copperKey' && hasCopperKey && !inFrontOfCopperDoor || item == 'copperKey' && copperKeyUsed) {
        adventureText = "There are no compatible locks for this key in the area..."
    }

    if (item == 'silverKey' && hasSilverKey && inFrontOfSilverDoor && !silverKeyUsed) {
        silverKeyUsed = true;
        doorUnlocked = true;
        unlockAudio.play();
        canGoUp = true;
        changeLocation();
    }
    else if (item == 'silverKey' && hasSilverKey && !inFrontOfSilverDoor || item == 'silverKey' && silverKeyUsed) {
        adventureText = "There are no compatible locks for this key in the area..."
    }

    updateView();
}

function eatApple() {
    if (hasApple1 && !hasApple2 && !hasApple3) {
        hasApple1 = false;
        adventureText = "You eat an apple.. +25 health!"
        eatAudio.play();
        heal(25);
        clearTooltip();
    }
    if (hasApple1 && hasApple2 && !hasApple3) {
        hasApple2 = false;
        adventureText = "You eat an apple.. +25 health!"
        eatAudio.play();
        heal(25);
        clearTooltip();
    }
    if (hasApple1 && hasApple2 && hasApple3) {
        hasApple3 = false;
        adventureText = "You eat an apple.. +25 health!"
        eatAudio.play();
        heal(25);
        clearTooltip();
    }
    updateView();
}

function heal(healAmount) {
    playerHealth += healAmount;
    if (playerHealth >= playerMaxHealth) {
        playerHealth = playerMaxHealth;
    }
    statusBars();
}


function onHoverTooltip(button) {

    //class selection
    if (button == 'adventurer' && onHoverText != "The adventurer is a balanced class.") {
        onHoverText = "The adventurer is a balanced class.";
        updateView();
    }
    if (button == 'warrior' && onHoverText != "The warrior can take a beating but tires easily from wearing heavy armour.") {
        onHoverText = "The warrior can take a beating but tires easily from wearing heavy armour."
        updateView();
    }
    if (button == 'rogue' && onHoverText != "Rogue flavour-text idk lol") {
        onHoverText = "Rogue flavour-text idk lol"
        updateView();
    }
    if (button == 'mage' && onHoverText != "While fragile in combat, the mage is the most powerful class and light armor lets them move around with ease.") {
        onHoverText = "While fragile in combat, the mage is the most powerful class and light armor lets them move around with ease.";
        updateView();
    }

    //interact buttons
    if (button == 'attack' && onHoverText != "Attack your enemy!") {
        onHoverText = "Attack your enemy!";
        updateView();
    }
    if (button == 'magic' && onHoverText != "Cast a spell (NOT IMPLEMENTED)") {
        onHoverText = "Cast a spell (NOT IMPLEMENTED)";
        updateView();
    }
    if (button == 'flee' && onHoverText != "Attempt to run away!") {
        onHoverText = "Attempt to run away!";
        updateView();
    }
    if (button == 'rest' && onHoverText != "Rest in your tent?") {
        onHoverText = "Rest in your tent?";
        updateView();
    }
    if (button == 'buyApple' && onHoverText != "Buy an apple? (12 gold)") {
        onHoverText = "Buy an apple? (12 gold)";
        updateView();
    }
    if (button == 'buyPotion' && onHoverText != "Buy a potion? (50 gold)") {
        onHoverText = "Buy a potion? (50 gold)";
        updateView();
    }
    if (button == 'buyFishingRod' && onHoverText != "Buy fishing rod? (150 gold)") {
        onHoverText = "Buy fishing rod? (150 gold)"
        updateView();
    }

    //inventory items
    if (button == 'inventory_apple1' && hasApple1 && onHoverText != "Eat apple? (+25 health)") {
        onHoverText = "Eat apple? (+25 health)"
        updateView();
    }
    if (button == 'inventory_apple2' && hasApple1 && onHoverText != "Eat apple? (+25 health)") {
        onHoverText = "Eat apple? (+25 health)"
        updateView();
    }
    if (button == 'inventory_apple3' && hasApple1 && onHoverText != "Eat apple? (+25 health)") {
        onHoverText = "Eat apple? (+25 health)"
        updateView();
    }
    if (button == 'inventory_potion' && hasPotion && onHoverText != "Drink potion? (+50 energy)") {
        onHoverText = "Drink potion? (+50 energy)"
        updateView();
    }
    if (button == 'inventory_potion' && !hasPotion && onHoverText != "Your empty potion flask..") {
        onHoverText = "Your empty potion flask.."
        updateView();
    }
    if (button == 'inventory_fishingRod' && hasFishingRod && onHoverText != "Use fishing rod?") {
        onHoverText = "Use fishing rod?"
        updateView();
    }
    if (button == 'inventory_desertRose' && hasDesertRose && onHoverText != "Smell flower?") {
        onHoverText = "Smell flower?"
        updateView();
    }
    if (button == 'inventory_copperKey' && hasCopperKey && onHoverText != "Use copper key?") {
        onHoverText = "Use copper key?"
        updateView();
    }
    if (button == 'inventory_silverKey' && hasSilverKey && onHoverText != "Use silver key?") {
        onHoverText = "Use silver key?"
        updateView();
    }
    if (button == 'inventory_goat' && (hasGoat1 || hasGoat2 || hasGoat3) && onHoverText != "Leave the goat?") {
        onHoverText = "Leave the goat?"
        updateView();
    }

}

function clearTooltip() {
    onHoverText = "";
    updateView();
}


function playerStates() {
    if (goingLeft) {

        if (playerMale) {
            return "imgs/Character_L.png"
        }
        else if (!playerMale) {
            return "imgs/Character_Female_L.png"
        }
    }
    else {

        if (playerMale) {
            return "imgs/Character_R.png"
        }
        else if (!playerMale) {
            return "imgs/Character_Female_R.png"
        }

    }
    // return "imgs/worlditemstest.png"
}

function moveCharacter(direction) {

    if (direction == 'north') {
        if (canGoRight && mapLocationY == 10 && mapLocationX == 0) {
            mapLocationY = 1;
            mapLocationX = 3;
        }
        if (playerEnergy == 0) {
            mapLocationY = 10;
            mapLocationX = 5;
            passOut();
        }
        else if (canGoUp && !lostInDesertNorth && !nextStepOasis && playerEnergy > 0) {
            mapLocationY++;
            adventureText = "You walk north...";
            playerEnergy -= 5;
        }
        else if (canGoUp && lostInDesertNorth && playerEnergy >= 5) {
            mapLocationY--;
            adventureText = "You walk north...?";
            playerEnergy -= 5;
        }
        else if (canGoUp && nextStepOasis) {
            mapLocationY = 10;
            mapLocationX = 0;
        }
    }

    if (direction == 'south') {
        if (canGoRight && mapLocationY == 10 && mapLocationX == 0) {
            mapLocationY = 3;
            mapLocationX = 3;
        }
        if (playerEnergy == 0) {
            mapLocationY = 10;
            mapLocationX = 5;
            passOut();
        }
        else if (canGoDown && !lostInDesertSouth && !nextStepOasis && playerEnergy > 0) {
            mapLocationY--;
            adventureText = "You walk south...";
            playerEnergy -= 5;
        }
        else if (canGoDown && lostInDesertSouth) {
            mapLocationY++;
            adventureText = "You walk south...?";
            playerEnergy -= 5;
        }
        else if (canGoDown && nextStepOasis) {
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
        if (playerEnergy == 0) {
            mapLocationY = 10;
            mapLocationX = 5;
            passOut();
        }
        else if (canGoRight && !lostInDesertEast && !nextStepOasis && playerEnergy > 0) {
            mapLocationX++;
            adventureText = "You walk east...";
            playerEnergy -= 5;
        }
        else if (canGoRight && lostInDesertEast) {
            mapLocationX--;
            adventureText = "You walk east...?";
            playerEnergy -= 5;
        }
        else if (canGoRight && nextStepOasis) {
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
        if (playerEnergy == 0) {
            mapLocationY = 10;
            mapLocationX = 5;
            passOut();
        }
        else if (canGoLeft && !lostInDesertWest && !nextStepOasis && playerEnergy > 0) {
            mapLocationX--;
            adventureText = "You walk west...";
            playerEnergy -= 5;
        }
        else if (canGoLeft && lostInDesertWest) {
            mapLocationX++;
            adventureText = "You walk west...?";
            playerEnergy -= 5;
        }
        else if (canGoLeft && nextStepOasis) {
            mapLocationY = 10;
            mapLocationX = 0;
        }
    }
    statusBars();
    setUpArea();
    updateView();
}



function setUpArea() {

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
        nextStepOasis = true;
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

        doorUnlocked = false;
        inFrontOfCopperDoor = false;
        areaHasRandomEncounters = true;
    }
    if (mapLocationY == 1 && mapLocationX == 9) {

        inFrontOfCopperDoor = true;

        if (copperKeyUsed) {
            doorUnlocked = true;
        }
        if (doorUnlocked) {
            canGoUp = true;
        } else {
            canGoUp = false;
        }

        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = true;
        inCave = false;
        areaHasRandomEncounters = false;

        currentMusic = bgm_grasslands;
        if (bgm_grasslands.volume <= 0.050) {
            clearInterval(fadeInInterval)
            clearInterval(fadeOutInterval)
            BGM('grasslands');
        }
    }
    if (mapLocationY == 1 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        doorUnlocked = false;
        inCampsite = false;
        inFrontOfCopperDoor = false;
        areaHasRandomEncounters = true;
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
        inOasis = false;

        areaHasWorldItem = false;

        lostInDesertNorth = false;
        lostInDesertSouth = false;
        lostInDesertEast = false;
        lostInDesertWest = false;

        currentMusic = bgm_desert;
        if (bgm_desert.volume <= 0.050) {
            clearInterval(fadeInInterval)
            clearInterval(fadeOutInterval)
            BGM('desert');
        }
    }
    if (mapLocationY == 2 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        inGrasslands = true;
        inDesert = false;

        currentMusic = bgm_grasslands;
        if (bgm_grasslands.volume <= 0.050) {
            clearInterval(fadeInInterval)
            clearInterval(fadeOutInterval)
            BGM('grasslands');
        }
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
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        doorUnlocked = false;
        inGrasslands = false;
        inCave = true;
        inFrontOfCopperDoor = false;
        areaHasRandomEncounters = true;

        currentMusic = bgm_cave;
        if (bgm_cave.volume <= 0.050) {
            clearInterval(fadeInInterval)
            clearInterval(fadeOutInterval)
            BGM('cave');
        }
    }
    if (mapLocationY == 2 && mapLocationX == 10) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        inCampsite = true;
        areaHasRandomEncounters = false;
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
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;
    }
    if (mapLocationY == 3 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        inFrontOfSilverDoor = false;
        areaHasRandomEncounters = true;
        doorUnlocked = false;
    }

    // Y: 4
    if (mapLocationY == 4 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        inGoatArea1 = false;
        areaHasWorldItem = false;
        areaHasRandomEncounters = true;
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

        inShopEast = false;
        areaHasWorldItem = false;
        areaHasRandomEncounters = false;
    }
    if (mapLocationY == 4 && mapLocationX == 9) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        inFrontOfSilverDoor = false;
        areaHasRandomEncounters = true;
        doorUnlocked = false;
    }
    if (mapLocationY == 4 && mapLocationX == 10) {
        inFrontOfSilverDoor = true;
        areaHasRandomEncounters = false;

        if (silverKeyUsed) {
            doorUnlocked = true;
        }
        if (doorUnlocked) {
            canGoUp = true;
        } else {
            canGoUp = false;
        }
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

        inGoatArea1 = true;
        areaHasRandomEncounters = false;

        if (!hasGoat1 || !returnedGoat1) {
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/Goat1_WorldItem.png'
        }
        if (hasGoat1 || returnedGoat1) {
            areaHasWorldItem = false;
        }
        
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
        inMainCampsite = false;
        inCampsite = false;
    }
    if (mapLocationY == 5 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inMainCampsite = true;
        inCampsite = true;
        areaHasRandomEncounters = false;

        currentMusic = bgm_grasslands;
        if (bgm_grasslands.volume <= 0.050) {
            clearInterval(fadeInInterval)
            clearInterval(fadeOutInterval)
            BGM('grasslands'); 
        }
    }
    if (mapLocationY == 5 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = true;
        inGrasslands = true;
        inMainCampsite = false;
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

        inShopEast = true;

        if (!hasFishingRod) {
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/FishingRod_WorldItem.png'
        }
        if (hasFishingRod) {
            areaHasWorldItem = false;
        }
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

        inGoatArea3 = false;
        areaHasWorldItem = false;
        areaHasRandomEncounters = true;

        inFrontOfSilverDoor = false;
        doorUnlocked = false;
    }

    // Y: 6
    if (mapLocationY == 6 && mapLocationX == 0) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        inGoatArea1 = false;
        areaHasWorldItem = false;
        areaHasRandomEncounters = true;
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

        inShopWest = false;
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

        inMainCampsite = false;
        inCampsite = false;
    }
    if (mapLocationY == 6 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        inGoatArea2 = true;
        areaHasRandomEncounters = false;

        if (!hasGoat2 || !returnedGoat2) {
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/Goat2_WorldItem.png'
        }
        if (hasGoat2 || returnedGoat2) {
            areaHasWorldItem = false;
        }
    }
    if (mapLocationY == 6 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inGoatArea2 = false;
        areaHasWorldItem = false;
        areaHasRandomEncounters = true;
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

        inFishableArea = true;
    }
    if (mapLocationY == 6 && mapLocationX == 10) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        inGoatArea3 = true;
        areaHasRandomEncounters = false;

        if (!hasGoat3 || !returnedGoat3) {
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/Goat3_WorldItem.png'
        }
        if (hasGoat3 || returnedGoat3) {
            areaHasWorldItem = false;
        }
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

        inShopWest = true;
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

        currentMusic = bgm_grasslands;
        if (bgm_grasslands.volume <= 0.050) {
            clearInterval(fadeInInterval)
            clearInterval(fadeOutInterval)
            BGM('grasslands');
        }
    }
    if (mapLocationY == 7 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = false;
        inForest = true;

        currentMusic = bgm_forest;
        if (bgm_forest.volume <= 0.050) {
            clearInterval(fadeInInterval)
            clearInterval(fadeOutInterval)
            BGM('forest');
        }
        
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

        inFishableArea = false;
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

        currentMusic = bgm_grasslands;
        if (bgm_grasslands.volume < 0.050) {
            clearInterval(fadeInInterval)
            clearInterval(fadeOutInterval)
            BGM('grasslands');
        }
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

        currentMusic = bgm_grasslands;
        if (bgm_grasslands.volume <= 0.050) {
            clearInterval(fadeInInterval)
            clearInterval(fadeOutInterval)
            BGM('grasslands');
        }
    }
    if (mapLocationY == 9 && mapLocationX == 4) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = false;
        inForest = true;

        currentMusic = bgm_forest;
        if (bgm_forest.volume <= 0.050) {
            clearInterval(fadeInInterval)
            clearInterval(fadeOutInterval)
            BGM('forest');
        }
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

        adventureText = "You have found a hidden oasis" + (hasDesertRose || hasSilverKey ? "!" : "! There is a rare desert rose growing here!")

        if (!hasDesertRose || !hasSilverKey) {
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/DesertRose_WorldItem.png'
        }
        if (hasDesertRose || hasSilverKey) {
            areaHasWorldItem = false;
        }

        lostInDesertNorth = false;
        lostInDesertSouth = false;
        lostInDesertEast = false;
        lostInDesertWest = false;

        nextStepOasis = false;
        inOasis = true;
    }
    // if(mapLocationY == 10 && mapLocationX == 1){

    // }
    // if(mapLocationY == 10 && mapLocationX == 2){

    // }
    // if(mapLocationY == 10 && mapLocationX == 3){

    // }
    // if(mapLocationY == 10 && mapLocationX == 4){

    // }
    if (mapLocationY == 10 && mapLocationX == 5) {
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

    changeLocation();

    if (areaHasRandomEncounters) {
        encounterChance = Math.floor(Math.random() * (10 - 1) + 1);
        if (encounterChance == 5) {
            enterCombat();
        }
    }
}

function changeLocation() {
    if (doorUnlocked) {
        worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}` + `-unlocked` + `.png)"`
    }
    else {
        worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`
    }
}

function statusBars() {

    if (playerHealth > (0.5 * playerMaxHealth)) {
        healthBarColor = 'lightgreen'
    }
    if (playerHealth > (0.25 * playerMaxHealth) && playerHealth <= (0.5 * playerMaxHealth)) {
        healthBarColor = 'yellow'
    }
    if (playerHealth <= (0.25 * playerMaxHealth)) {
        healthBarColor = 'red'
    }

    if (playerEnergy > (0.5 * playerMaxEnergy)) {
        energyBarColor = 'lightgreen'
    }
    if (playerEnergy > (0.25 * playerMaxEnergy) && playerEnergy <= (0.5 * playerMaxEnergy)) {
        energyBarColor = 'yellow'
    }
    if (playerEnergy <= (0.25 * playerMaxEnergy)) {
        energyBarColor = 'red'
    }
}


function BGM(area) {
    clearInterval(fadeInInterval);
    clearInterval(fadeOutInterval);

    if(muted){
        return;
    }

    else if(!muted){

        if (area == 'grasslands') {
        if (!bgm_grasslands.paused) {
            bgm_grasslands.pause();
            bgm_grasslands.currentTime = 0;
        }
        bgm_grasslands.loop = true;
        bgm_grasslands.play();
        fadeInInterval = setInterval(function() { audioFadeIn('grasslands') }, 200);
        if (bgm_forest.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('forest') }, 200);
        }
        if (bgm_desert.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('desert') }, 200);
        }
        if (bgm_cave.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('cave') }, 200);
        }
        
    } 
    else if (area == 'forest') {
        if (!bgm_forest.paused) {
            bgm_forest.pause();
            bgm_forest.currentTime = 0;
        }
        bgm_forest.loop = true;
        bgm_forest.play();
        fadeInInterval = setInterval(function() { audioFadeIn('forest') }, 200);
        if (bgm_grasslands.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('grasslands') }, 200);
        }
        if (bgm_desert.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('desert') }, 200);
        }
        if (bgm_cave.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('cave') }, 200);
        }
    } 
    else if (area == 'desert'){
        if (!bgm_desert.paused) {
            bgm_desert.pause();
            bgm_desert.currentTime = 0;
        }
        bgm_desert.loop = true;
        bgm_desert.play();
        fadeInInterval = setInterval(function() { audioFadeIn('desert') }, 200);
        if (bgm_grasslands.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('grasslands') }, 200);
        }
        if (bgm_forest.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('forest') }, 200);
        }
        if (bgm_cave.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('cave') }, 200);
        }
    }
    else if (area == 'cave'){
        if (!bgm_cave.paused) {
            bgm_cave.pause();
            bgm_cave.currentTime = 0;
        }
        bgm_cave.loop = true;
        bgm_cave.play();
        fadeInInterval = setInterval(function() { audioFadeIn('cave') }, 200);
        if (bgm_grasslands.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('grasslands') }, 200);
        }
        if (bgm_desert.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('desert') }, 200);
        }
        if (bgm_forest.volume > 0.1){
            fadeOutInterval = setInterval(function() { audioFadeOut('forest') }, 200);
        }
    } 
    }


}

function audioFadeIn(area) {
    if (area == 'grasslands') {
        if (bgm_grasslands.volume < 0.3) {
            bgm_grasslands.volume += 0.05;
        }
        if (bgm_grasslands.volume >= 0.3) {
            clearInterval(fadeInInterval);
        }
    }
    if (area == 'forest') {
        if (bgm_forest.volume < 0.3) {
            bgm_forest.volume += 0.05;
        }
        if (bgm_forest.volume >= 0.3) {
            clearInterval(fadeInInterval);
        }
    }
    if (area == 'desert') {
        if (bgm_desert.volume < 0.3) {
            bgm_desert.volume += 0.05;
        }
        if (bgm_desert.volume >= 0.3) {
            clearInterval(fadeInInterval);
        }
    }
    if (area == 'cave') {
        if (bgm_cave.volume < 0.3) {
            bgm_cave.volume += 0.05;
        }
        if (bgm_cave.volume >= 0.3) {
            clearInterval(fadeInInterval);
        }
    }
}

function audioFadeOut(area) {
    if (area == 'grasslands' || area == 'campsite')  {
        if (bgm_grasslands.volume > 0.1) {
            bgm_grasslands.volume -= 0.05;
        }
        if (bgm_grasslands.volume <= 0.1) {
            clearInterval(fadeOutInterval);
            bgm_grasslands.volume = 0.0;
            bgm_grasslands.pause();
            bgm_grasslands.currentTime = 0;
        }
    } 
    if (area == 'forest') {
        if (bgm_forest.volume > 0.1) {
            bgm_forest.volume -= 0.05;
        }
        if (bgm_forest.volume <= 0.1) {
            clearInterval(fadeOutInterval);
            bgm_forest.volume = 0.0;
            bgm_forest.pause();
            bgm_forest.currentTime = 0;
        }
    }
    if (area == 'desert') {
        if (bgm_desert.volume > 0.1) {
            bgm_desert.volume -= 0.05;
        }
        if (bgm_desert.volume <= 0.1) {
            clearInterval(fadeOutInterval);
            bgm_desert.volume = 0.0;
            bgm_desert.pause();
            bgm_desert.currentTime = 0;
        }
    }
    if (area == 'cave') {
        if (bgm_cave.volume > 0.1) {
            bgm_cave.volume -= 0.05;
        }
        if (bgm_cave.volume <= 0.1) {
            clearInterval(fadeOutInterval);
            bgm_cave.volume = 0.0;
            bgm_cave.pause();
            bgm_cave.currentTime = 0;
        }
    }

}

function muteAudio(){
        muted = !muted;
    if(muted){
        bgm_grasslands.volume = 0;
        bgm_forest.volume = 0;
        bgm_desert.volume = 0;
        bgm_cave.volume = 0;


        coinsAudio.volume = 0;
        unlockAudio.volume = 0;
        eatAudio.volume = 0;
        drinkAudio.volume = 0;
        goatAudio.volume = 0;
    }
    else if(!muted){
        bgm_grasslands.volume = 0.0001;
        bgm_forest.volume = 0.0001;
        bgm_desert.volume = 0.0001;
        bgm_cave.volume = 0.0001;


        coinsAudio.volume = 1;
        unlockAudio.volume = 1;
        eatAudio.volume = 1;
        drinkAudio.volume = 1;
        goatAudio.volume = 1;
        
        currentMusic.volume = 0.3;
        currentMusic.play();
    }

}






