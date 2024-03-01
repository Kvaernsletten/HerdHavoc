

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

//Enemy stats
let enemyName;
let enemyLevel = 1;
let enemyHealth;
let enemyEnergy;
let enemyDamage;
let enemyGold = 0;

//inventory
let playerGold = 0;
let stolenGoldAmount;

let hasApple1 = false;
let hasApple2 = false;
let hasApple3 = false;
let hasPotion = false;
let hasFishingRod = false;
let hasDesertRose = false;
let hasCopperKey = false;
let hasSilverKey = false;
let hasGoat = false;

let returnedGoat = false;

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
let inGoatArea = false;

// Combat states
let actionMenu = false;

// Player states
let goingLeft = false;
let passedOut = false;

let lostInDesertNorth = false;
let lostInDesertSouth = false;
let lostInDesertEast = false;
let lostInDesertWest = false;

let nextStepOasis = false;

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
            <img class="playerInBattle" src="imgs/Character_R.png">
            <img class="enemy" src="imgs/Character_L.png">
        </div>
        <div class="bottomBattleDiv">
        </div> 
        <div class="adventureText">${adventureText}</div>
    </div>
        <div class="worldInfo_container">
            <div class="playerInfo">${playerName ?? "Dio"}
                <div>${playerClass ?? "Adventurer"} Lv. ${playerLevel}</div>
                    <div>Health: ${playerHealth + " / " + playerMaxHealth}</div>
                    <div>Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>
            </div>            
            <div class="worldActions">
                ${actionMenu ? /*HTML*/ `` : /*HTML*/ `<button class="attackButton" 
                onmouseenter="onHoverTooltip('attack')"
                onmouseleave="clearTooltip()" 
                ${inBattle ? 'onclick="attack(), onHoverTooltip(\'enemyTurn\'), updateView()"' : 'disabled, style="opacity: 0"'}>Attack</button>
                <button class="itemsButton"
                onmouseenter="onHoverTooltip('items')"
                onmouseleave="clearTooltip()"
                ${inBattle ? 'onclick="items()"' : 'disabled, style="opacity: 0"'}>Items</button>
                <button class="fleeButton" 
                onmouseenter="onHoverTooltip('flee')" 
                onmouseleave="clearTooltip()" 
                ${inBattle ? 'onclick="flee()"' : 'disabled, style="opacity: 0"'}>Flee</button>
                `}
            </div>
        <div class="onHoverText">${onHoverText}</div>

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
            <div class="playerContainer">
                <img class="player" src="${passedOut ? "imgs/Character_Sleep.png" : playerStates()}">
                ${areaHasWorldItem ? /*HTML*/`<img class="worldItem" src="${worldItem}">` : ``}
                ${inShopWest || inShopEast ? /*HTML*/`<img class="worldItem" src="imgs/world_items/NPC.png">` : ``}
                ${returnedGoat && inMainCampsite ? /*HTML*/`<img class="worldItem" src="imgs/world_items/Goat_WorldItem.png">` : ``}
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
            <div>${playerClass ?? "Adventurer"} Lv. ${playerLevel}</div>
                    <div>Health: ${playerHealth + " / " + playerMaxHealth}</div>
                    <div>Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>
        </div>   
            <div class="worldActions">
                
                ${inCampsite ?
                /*HTML*/`<button
                ${inCampsite ? 'onclick="rest()"' : 'disabled="disabled"'}
                style="${inCampsite ? '' : 'pointer-events: none; opacity: 0;'}"
                onmouseenter="{onHoverTooltip('rest')}"
                onmouseleave="if(onHoverText == 'Rest in your tent?') {clearTooltip()}">Rest</button> 
                ` :
                    /*HTML*/``}

                ${inShopWest ?
                    /*HTML*/`<button
                ${inShopWest ? 'onclick="buyItem(\'apple\')"' : 'disabled="disabled"'}
                style="${inShopWest ? '' : 'pointer-events: none; opacity: 0;'}"
                onmouseenter="{onHoverTooltip('buyApple')}"
                onmouseleave="if(onHoverText == 'Buy apple? (12 gold)') {clearTooltip()}">Purchase apple</button> 
                ` :
                    /*HTML*/``}

                ${inShopEast ?
                    /*HTML*/`<button
                ${inShopEast ? 'onclick="buyItem(\'apple\')"' : 'disabled="disabled"'}
                style="${inShopEast ? '' : 'pointer-events: none; opacity: 0;'}"
                onmouseenter="{onHoverTooltip('buyApple')}"
                onmouseleave="if(onHoverText == 'Buy apple? (12 gold)') {clearTooltip()}">Buy apple</button> 
                ` :
                    /*HTML*/``}
                    
                ${inShopEast ?
                    /*HTML*/`<button
                ${inShopEast && !hasFishingRod ? 'onclick="buyItem(\'fishingRod\')"' : 'disabled="disabled"'}
                style="${inShopEast && !hasFishingRod ? '' : 'pointer-events: none; opacity: 0;'}"
                onmouseenter="{onHoverTooltip('buyFishingRod')}"
                onmouseleave="if(onHoverText == 'Buy fishing rod? (150 gold)') {clearTooltip()}">Buy fishing rod</button> 
                ` :
                    /*HTML*/``}

                ${hasDesertRose && inShopWest ?
                    /*HTML*/`<button
                ${hasDesertRose && inShopWest ? 'onclick="buyItem(\'silverKey\')"' : 'disabled="disabled"'}
                style="${hasDesertRose && inShopWest ? '' : 'pointer-events: none; opacity: 0;'}"
                onmouseenter="{onHoverTooltip('tradeDesertRose')}"
                onmouseleave="if(onHoverText == 'Trade [desert rose] for [silver key] to the mountain?') {clearTooltip()}">Trade desert rose</button> 
                ` :
                    /*HTML*/``}

                ${inOasis ?
                        /*HTML*/`<button
                ${inOasis && !hasDesertRose && !hasSilverKey ? 'onclick="pickUpItem(\'desertRose\')"' : 'disabled="disabled"'}
                style="${inOasis && !hasDesertRose && !hasSilverKey ? '' : 'pointer-events: none; opacity: 0;'}"
                onmouseenter="{onHoverTooltip('pickUpDesertRose')}"
                onmouseleave="if(onHoverText == 'Pick up desert rose?') {clearTooltip()}">Pick up</button> 
                ` :
                    /*HTML*/``}

                    ${inGoatArea ?
                        /*HTML*/`<button
                ${inGoatArea && !hasGoat && !returnedGoat ? 'onclick="pickUpItem(\'goat\')"' : 'disabled="disabled"'}
                style="${inGoatArea && !hasGoat && !returnedGoat ? '' : 'pointer-events: none; opacity: 0;'}"
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
        onmouseleave="if(hasApple1 && onHoverText == 'Eat apple?'){clearTooltip()}"></div>
        <div id="Inventory_Slot2" class="inventorySlots inventoryTop" 
        onclick="if(hasApple2){useItem('apple')}"><img src=${hasApple2 ? "imgs/inventory_items/Apple.png" : "imgs/inventory_items/Apple_Slot.png"}
        onmouseenter="if(hasApple2){onHoverTooltip('inventory_apple2')}"
        onmouseleave="if(hasApple2 && onHoverText == 'Eat apple?'){clearTooltip()}"></div>
        <div id="Inventory_Slot3" class="inventorySlots inventoryRight inventoryTop"
        onclick="if(hasApple3){useItem('apple')}"><img src=${hasApple3 ? "imgs/inventory_items/Apple.png" : "imgs/inventory_items/Apple_Slot.png"}
        onmouseenter="if(hasApple3){onHoverTooltip('inventory_apple3')}"
        onmouseleave="if(hasApple3 && onHoverText == 'Eat apple?'){clearTooltip()}"></div>
        <div id="Inventory_Slot4" class="inventorySlots inventoryLeft"
        onclick="useItem()"><img src=${hasPotion ? "imgs/inventory_items/Potion.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('inventory_potion')"
        onmouseleave="if(hasPotion){clearTooltip()}"></div>
        <div id="Inventory_Slot5" class="inventorySlots"
        onclick="useItem()"><img src=${hasFishingRod ? "imgs/inventory_items/Fishingrod.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('inventory_fishingRod')"
        onmouseleave="if(hasFishingRod){clearTooltip()}"></div>
        <div id="Inventory_Slot6" class="inventorySlots inventoryRight"
        onclick="useItem()"><img src=${hasDesertRose ? "imgs/inventory_items/DesertRose.png" : (hasSilverKey ? "imgs/inventory_items/DesertRose_Slot.png" : "imgs/inventory_items/Empty_Slot.png")}                  
        onmouseenter="onHoverTooltip('inventory_desertRose')"
        onmouseleave="if(hasDesertRose){clearTooltip()}"></div>
        <div id="Inventory_Slot7" class="inventorySlots inventoryLeft inventoryBottom"
        onclick="useItem()"><img src=${hasCopperKey ? "imgs/inventory_items/CopperKey.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('inventory_copperKey')"
        onmouseleave="if(hasCopperKey){clearTooltip()}"></div>
        <div id="Inventory_Slot8" class="inventorySlots inventoryBottom"
        onclick="useItem()"><img src=${hasSilverKey ? "imgs/inventory_items/SilverKey.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('inventory_SilverKey')"
        onmouseleave="if(hasSilverKey){clearTooltip()}"></div>
        <div id="Inventory_Slot9" class="inventorySlots inventoryRight inventoryBottom"
        onclick="useItem('goat')"><img src=${hasGoat ? "imgs/inventory_items/Goat.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('goat')"
        onmouseleave="if(hasGoat){clearTooltip()}"></div>
        </div>
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
            <input id="nameInput" type="text" class="nameInput" placeholder="[Enter name]">
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
    adventureText = "You step out of your tent only to see that your three goats are missing... You have to find them and bring them back to your camp!";
    mapLocationY = 5;
    mapLocationX = 5;
    isGameRunning = true;
    changeLocation();
    updateView();
}

function rest() {
    if (mapLocationY == 10 && mapLocationX == 5) {
        playerEnergy = playerMaxEnergy;
        adventureText = 'You recover and feel rested...';
        mapLocationY = 5;
        mapLocationX = 5;
        passedOut = false;
        changeLocation();
    }
    else {
        playerEnergy = playerMaxEnergy;
        adventureText = 'You take a moment to rest and recover your energy!';
    }

    updateView();
}

function passOut() {
    stolenGoldAmount = Math.floor(playerGold * 0.25);
    passedOut = true;
    nextStepOasis = false;
    if (playerGold > stolenGoldAmount && stolenGoldAmount != 0) {
        adventureText = 'A stranger found you passed out in the dirt and helped you back to your campsite.. and also helped himself to ' + stolenGoldAmount + ' gold from your gold pouch..'
        playerGold -= stolenGoldAmount;
    } else if (playerGold <= stolenGoldAmount) {
        adventureText = 'A stranger found you passed out in the dirt and helped you back to your campsite.. and also ran off with your entire gold pouch!'
        playerGold = 0;
    }else if (stolenGoldAmount == 0){
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

    enemyName = "silly bandit"

    onHoverText = "Choose an action";
    enemyGold = Math.floor(Math.random() * (20 - 1) + 1);
    enemyHealth = 65;
    enemyEnergy = 100;
    enemyDamage = 5;

    return enemyName;
}

function attack() {

    actionMenu = true;
    enemyHealth -= playerDamage;
    adventureText = "You deal " + playerDamage + " damage!"

    if (enemyHealth <= 0) {
        enemyHealth = 0;
        //adventureText =   YOU DEAL amoutOfDamage AND =            FIX THIS.
        //set timeout with delay!!
        adventureText =  "The " + enemyName + " dies."
        setTimeout(winBattle, 2000);
    }
    else {
        setTimeout(takeDamage, 1500);
    }
    updateView();

}

function items() {
    updateView();
}

function winBattle() {
    worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`
    inBattle = false;
    actionMenu = false;
    adventureText = "You emerge victorious and looted " + enemyGold + " gold from the corpse... ";
    onHoverText = "";
    playerGold += enemyGold;
    updateView();
}

function flee() {
    worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`
    inBattle = false;
    actionMenu = false;
    adventureText = "You escaped!";
    onHoverText = "";
    updateView();
}

function takeDamage() {

    playerHealth -= enemyDamage;
    adventureText = "The " + enemyName + " attacks you for " + enemyDamage + " damage!";
    actionMenu = false;
    if (playerHealth <= 0) {

        die();
    }
    updateView();
}

function die() {
    location.reload(); // lol
}

function buyItem(item) {

    if (item == "apple") {
        if (playerGold >= 12) {

            if (!hasApple1 && !hasApple2 && !hasApple3) {
                hasApple1 = true;
                adventureText = "You bought an apple."
                playerGold -= 12;
            }
            else if (hasApple1 && !hasApple2 && !hasApple3) {
                hasApple2 = true;
                adventureText = "You bought an apple."
                playerGold -= 12;
            }
            else if (hasApple1 && hasApple2 && !hasApple3) {
                hasApple3 = true;
                adventureText = "You bought an apple."
                playerGold -= 12;
            }
        } else if (playerGold < 12) {
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
            }
        } else if (playerGold < 150) {
            adventureText = "You do not have enough gold!"
        }

    }

    if (item == "silverKey"){
        if (hasDesertRose){
            hasSilverKey = true;
            hasDesertRose = false;
            adventureText = "You traded the rose for a silver key!"
        }else if (!hasDesertRose){
            adventureText = "You don't have the desert rose! There is a rumour it can be found if you keep heading south-east in the desert...."
        }
    }
    updateView();
}

function pickUpItem(item){
    if (item == "desertRose"){
        if (!hasDesertRose && !hasSilverKey){
            hasDesertRose = true;
            areaHasWorldItem = false;
            adventureText = "You carefully pluck the rare desert rose from the hidden oasis.."
        }
    }
    if (item == "goat"){
        if (!hasGoat && !returnedGoat){
            hasGoat = true;
            areaHasWorldItem = false;
            adventureText = "You take the goat!"
        }
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
    if (item == 'goat' && inMainCampsite) {
        returnedGoat = true;
        hasGoat = false;
    }  
    else if(item == 'goat' && !inMainCampsite){
        adventureText = "You should bring the goat back to your main campsite first!"
    }
    updateView();
}

function eatApple() {
    if (hasApple1 && !hasApple2 && !hasApple3) {
        hasApple1 = false;
        adventureText = "You eat an apple.. +25 health!"
        heal(25);
        onHoverText = "";
    }
    if (hasApple1 && hasApple2 && !hasApple3) {
        hasApple2 = false;
        adventureText = "You eat an apple.. +25 health!"
        heal(25);
        onHoverText = "";
    }
    if (hasApple1 && hasApple2 && hasApple3) {
        hasApple3 = false;
        adventureText = "You eat an apple.. +25 health!"
        heal(25);
        onHoverText = "";
    }
    updateView();
}

function heal(healAmount) {
    playerHealth += healAmount;
    if (playerHealth >= playerMaxHealth) {
        playerHealth = playerMaxHealth;
    }
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
    if (button == 'items' && onHoverText != "Use an item (NOT IMPLEMENTED)") {
        onHoverText = "Use an item (NOT IMPLEMENTED)";
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
    if (button == 'buyFishingRod' && onHoverText != "Buy fishing rod? (150 gold)") {
        onHoverText = "Buy fishing rod? (150 gold)"
        updateView();
    }

    //clears
    if (button == 'clear' && passedOut && playerGold > stolenGoldAmount) {
        onHoverText = "A stranger found you passed out in the dirt and helped you back to your campsite.. and also helped himself to " + stolenGoldAmount + " gold from your gold pouch.."
        updateView();
    } else if (button == 'clear' && passedOut && playerGold <= 0) {
        onHoverText = "A stranger found you passed out in the dirt and helped you back to your campsite.. and also ran off with your entire gold pouch!"
        updateView();
    }

    //inventory items
    if (button == 'inventory_apple1' && hasApple1 && onHoverText != "Eat apple?") {
        onHoverText = "Eat apple?"
        updateView();
    }
    if (button == 'inventory_apple2' && hasApple1 && onHoverText != "Eat apple?") {
        onHoverText = "Eat apple?"
        updateView();
    }
    if (button == 'inventory_apple3' && hasApple1 && onHoverText != "Eat apple?") {
        onHoverText = "Eat apple?"
        updateView();
    }
}

function clearTooltip() {
    onHoverText = "";
    updateView();
}


function playerStates() {
    // if (goingLeft == true) {

    //     return "imgs/Character_L.png"

    // }
    // else {

    //     return "imgs/Character_R.png"

    // }
    return "imgs/worlditemstest.png"
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
    }
    if (mapLocationY == 1 && mapLocationX == 9) {
        if (!hasSilverKey) {
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
        inOasis = false;
        
        areaHasWorldItem = false;

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

        inGoatArea = true;
        areaHasRandomEncounters = false;

        if(!hasGoat || !returnedGoat){
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/Goat_WorldItem.png'
        }
        if (hasGoat || returnedGoat){ 
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

        if(!hasFishingRod){
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/FishingRod_WorldItem.png'
        }
        if (hasFishingRod){ 
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
    }

    // Y: 6
    if (mapLocationY == 6 && mapLocationX == 0) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

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

        adventureText = "You have found a hidden oasis" + (hasDesertRose || hasSilverKey ? "!" : "! There is a rare desert rose growing here!")
        
        if(!hasDesertRose || !hasSilverKey){
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/DesertRose_WorldItem.png'
        }
        if (hasDesertRose || hasSilverKey){ 
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

    worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`

    if (areaHasRandomEncounters) {
        encounterChance = Math.floor(Math.random() * (10 - 1) + 1);
        if (encounterChance == 5) {
            enterCombat();
        }
    }
}
