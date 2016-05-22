//-----------------------------------------------------------------------------
//  Galv's Actor Equip Items
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_ActorEquipItem.js
//-----------------------------------------------------------------------------
//  2016-05-07 - Version 1.3 - fixed compatibility issue with Yanfly Equip Core
//  2016-05-06 - Version 1.2 - fixed a crash in main item scene and some items
//                           - not working used from actor items
//  2016-05-05 - Version 1.1 - fixed a bug when trying to use a battle item
//                           - from the actor item equip scene
//  2016-05-05 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_ActorEquipItems = true;

var Galv = Galv || {};            // Galv's main object
Galv.AEI = Galv.AEI || {};        // Galv's stuff

// Galv Notetag setup (Add notes required for this plugin if not already added)
Galv.noteFunctions = Galv.noteFunctions || [];       // Add note function to this.

//-----------------------------------------------------------------------------
/*:
 * @plugindesc Actors can only use items in battle that they have equipped.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Item Slots
 * @desc The number of item slots an actor has by default
 * @default 6
 *
 * @param Stack Size
 * @desc The amount of an item that can be equipped to each slot if not specified by item note
 * @default 5
 *
 * @param Default Armor Type
 * @desc The default armor type of the item - required for actors to have the trait to equip them.
 * @default 1
 *
 * @param ----- Vocab -----
 * @desc
 * @default
 *
 * @param Menu Command
 * @desc The text for the main menu command. Leave blank to disable in menu
 * @default Pockets
 *
 * @param Empty Slot Text
 * @desc Text displayed for an empty actor item slot.
 * @default ---------
 *
 * @param Equip Text
 * @desc Text used for equipping item command
 * @default Equip
 *
 * @param Remove Text
 * @desc Text used for removing item command
 * @default Remove
 *
 * @param Use Text
 * @desc Text used for using item command
 * @default Use
 *
 * @param Clear Text
 * @desc Text used for clearing all items command
 * @default Clear
 *
 * @param Equip Amount Text
 * @desc Text used for how many items to equip
 * @default Equip Amount:
 *
 * @param Remove Amount Text
 * @desc Text used for how many items to equip
 * @default Remove Amount:
 *
 * @help
 *   Galv's Actor Equip Items
 * ----------------------------------------------------------------------------
 * This plugin makes it so that each actor can equip and hold a certain amount
 * of items. In battle, actors only have access to the items that they
 * currently have equipped. Outside of battle the inventory works as usual,
 * with a new scene for the player to equip items to their actors.
 *
 * ARMOR TYPE - FOR ITEMS
 * ----------------------
 * You can set items to have a certain Armor Type by using a note tag (below).
 * Actors must have the trait "Equip Armor X" (X referring to the armor type
 * you set for the item) in order to equip the item for battle.
 *
 * NOTE: This does NOT stop the items being used by anyone or on anyone in the
 * normal item menu. It just stops actors equipping them so they cant use
 * certain items in battle.
 *
 * ----------------------------------------------------------------------------
 *   Note tag for ACTORS
 * ----------------------------------------------------------------------------
 *
 *       <itemslots:x>         // x being the number of items they can equip
 *
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 *   Note tag for ITEMS
 * ----------------------------------------------------------------------------
 *
 *       <slotStack:x>        // x being the max item number the actor can
 *                            // equip in the item slot.
 *
 *       <atype:x>            // set the Armor Type ID of the item. If no tag
 *                            // is present it uses the plugin setting default
 *                            // Armor types can be modified in the database:
 *                            // Database > Types > Armor Types
 *
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 *   SCRIPT CALLS
 * ----------------------------------------------------------------------------
 * The below script calls have values as below:
 * --------------------------------------------
 *  a = actor ID. The actor ID you are changing.
 *  s = slot ID. The id of the equip slot you are changing
 *  i = item ID. The id of an ITEM from the database
 *  n = Number. The number of items you are equipping/removing
 *  d = true or false. If true, destroy all items referenced
 *  k = true or false. If true, keep items in inventory. false removes them
 * ----------------------------------------------------------------------------
 *
 *  $gameActors.actor(a).clearAllActorItemSlots(d);    // clear all slots
 *
 *  $gameActors.actor(a).clearActorItemSlot(s,d);      // clear specific slot
 *
 *  $gameActors.actor(a).equipActorItemSlot(s,i,n,k);  // equip item to slot
 *                                                     // make s = -1 to equip
 *                                                     // to first free slot
 *                                                     // (fails if none free)
 *
 *  $gameActors.actor(a).unEquipActorItemSlot(s,i,n,d); // unequip item in slot
 *                                                      // s = -1 to unequip
 *                                                      // item from all slots
 *
 *  $gameActors.actor(a).removeFromActorItemSlot(s,n,k); // remove no. items
 *                                                       // from slot while
 *                                                       // not knowing items
 * ----------------------------------------------------------------------------
 *   SCRIPT for CONTROL VARIABLE
 * ----------------------------------------------------------------------------
 *
 *  $gameActors.actor(a).noActorItems(s,i);  // returns the number of a certain
 *                                           // item in the specified slot.
 *                                           // Use -1 to count the number of
 *                                           // the item in all slots
 *
 *  $gameActors.actor(a).noActorItems(s);    // returns the number of items in
 *                                           // the specified slot. Use -1 to
 *                                           // count number of items actor has
 *                                           // in all slots
 *
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {


Galv.AEI.slots = Number(PluginManager.parameters('Galv_ActorEquipItems')["Item Slots"]);
Galv.AEI.stack = Number(PluginManager.parameters('Galv_ActorEquipItems')["Stack Size"]);
Galv.AEI.empty = PluginManager.parameters('Galv_ActorEquipItems')["Empty Slot Text"];
Galv.AEI.atypeId = Number(PluginManager.parameters('Galv_ActorEquipItems')["Default Armor Type"]);
Galv.AEI.menuCommand = PluginManager.parameters('Galv_ActorEquipItems')["Menu Command"];

Galv.AEI.txtEquip = PluginManager.parameters('Galv_ActorEquipItems')["Equip Text"];
Galv.AEI.txtRemove = PluginManager.parameters('Galv_ActorEquipItems')["Remove Text"];
Galv.AEI.txtUse = PluginManager.parameters('Galv_ActorEquipItems')["Use Text"];
Galv.AEI.txtClear = PluginManager.parameters('Galv_ActorEquipItems')["Clear Text"];

Galv.AEI.txtEquipAmount = PluginManager.parameters('Galv_ActorEquipItems')["Equip Amount Text"];
Galv.AEI.txtRemoveAmount = PluginManager.parameters('Galv_ActorEquipItems')["Remove Amount Text"];

//-----------------------------------------------------------------------------
//  NOTE TAGS
//-----------------------------------------------------------------------------

if (!Galv.notetagAlias) {   // Add alias only if not added by another Galv plugin
	Galv.AEI.Scene_Boot_start = Scene_Boot.prototype.start;
	Scene_Boot.prototype.start = function() {	
		for (var i = 0;i < Galv.noteFunctions.length; i++) {
			Galv.noteFunctions[i]();	
		};
		Galv.AEI.Scene_Boot_start.call(this);
	};
	Galv.notetagAlias = true;
};

Galv.AEI.notetags = function() {
	// Item Notes
	for (var i = 1;i < $dataItems.length;i++) {
		var note = $dataItems[i].note.toLowerCase().match(/<slotStack:(.*)>/i);
		$dataItems[i].actorStack = note ? Number(note[1]) : Galv.AEI.stack;
		var note2 = $dataItems[i].note.toLowerCase().match(/<atype:(.*)>/i);
		$dataItems[i].atypeId = note2 ? Number(note2[1]) : Galv.AEI.atypeId;
	};
};

Galv.noteFunctions.push(Galv.AEI.notetags);

})();



// GAME ACTOR
//-----------------------------------------------------------------------------

Galv.AEI.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
	Galv.AEI.Game_Actor_setup.call(this,actorId);
	this.setupItemSlots();
};

Game_Actor.prototype.setupItemSlots = function() {
	this._equipItemSlots = [];
	var note = this.actor().note.toLowerCase().match(/<itemslots:(.*)>/i);
	var count = note ? Number(note[1]) : Galv.AEI.slots;
	for (var i = 0; i < count; i++) {
		this.createActorItemSlot(i);
	};
};

Game_Actor.prototype.createActorItemSlot = function(slotId) {
	this._equipItemSlots[slotId] = new Game_Item();
	this._equipItemSlots[slotId].amount = 0;
	this._equipItemSlots[slotId].slotId = slotId;
};

Game_Actor.prototype.clearAllActorItemSlots = function(destroy) {
	for (var i = 0; i < this._equipItemSlots.length; i++) {
		this.clearActorItemSlot(i,destroy);
	};
};

Game_Actor.prototype.clearActorItemSlot = function(slotId,destroy) {
	if (this._equipItemSlots[slotId] && !destroy) {
		this.returnActorItemSlotItems(slotId);
	};
	this.createActorItemSlot(slotId);
};

Game_Actor.prototype.returnActorItemSlotItems = function(slotId) {
	var itemId = this._equipItemSlots[slotId].itemId();
	if (this._equipItemSlots[slotId] && itemId > 0) {
		$gameParty.gainItem($dataItems[itemId],this._equipItemSlots[slotId].amount);
	};
	this.createActorItemSlot(slotId);
};

Game_Actor.prototype.equipActorItemSlot = function(slotId,itemId,amount,keepInInven) {
	if (isNaN(itemId)) {
		itemId = itemId.id;
	};
	if (slotId < 0) {
		// If player sets slotId to -1, check for free slot and add item there.
		for (var i = 0; i < this._equipItemSlots.length; i++) {
			if (!this._equipItemSlots[i].object()) {
				slotId = i;
				break;
			};
		};
	};
	
	if (!this._equipItemSlots[slotId]) return false; // If no equip item slot, stop here
	var item = $dataItems[itemId];
	
	// if not a real item - clear slot
	if (itemId <= 0 || !item) {	
		this.clearActorItemSlot(slotId);
		return;
	};

	var oldAmount = this._equipItemSlots[slotId].amount;

	// if a different item is equipped
	if (this._equipItemSlots[slotId].itemId() != itemId) {
		this.clearActorItemSlot(slotId,!keepInInven);
		this._equipItemSlots[slotId].setObject(item); // set new object
	};

	// set amount of item equipped but dont go over max stack
	var newAmount = Math.min(item.actorStack,this._equipItemSlots[slotId].amount + amount);
	var gainedAmount = newAmount - oldAmount;
	this._equipItemSlots[slotId].amount = newAmount;
};

// Unequip certain items from a slot or all slots
Game_Actor.prototype.unEquipActorItemSlot = function(slotId,itemId,amount,destroy) {
	if (slotId < 0) {
		// If player sets slotId to -1, check for all slots containing item.
		for (var i = 0; i < this._equipItemSlots.length; i++) {
			if (this._equipItemSlots[i].itemId() == itemId) this.clearActorItemSlot(i,destroy);
		};
	} else if (this._equipItemSlots[slotId]) {
		if (this._equipItemSlots[slotId].itemId() == itemId) this.clearActorItemSlot(i,destroy);
	};
};

// Remove a number of items from a slot, no matter what's in that slot
Game_Actor.prototype.removeFromActorItemSlot = function(slotId,amount,toInven) {
	if (this._equipItemSlots[slotId]) {
		var origAmount = this._equipItemSlots[slotId].amount;
		this._equipItemSlots[slotId].amount -= amount;
		if (toInven) {
			var maxLost = Math.min(origAmount,amount);
			$gameParty.gainItem(this._equipItemSlots[slotId].object(),maxLost);
		};
		if (this._equipItemSlots[slotId].amount <= 0) this.clearActorItemSlot(slotId,!toInven);
		
	};
};

// Count number of items an actor has in slot or on them
Game_Actor.prototype.noActorItems = function(slotId,itemId) {
	var count = 0;
	if (slotId < 0) {
		// If player sets slotId to -1, count all. Leave item Id blank to count all items in slot
		for (var i = 0; i < this._equipItemSlots.length; i++) {
			if (!itemId || this._equipItemSlots[i].itemId() == itemId) {
				count += this._equipItemSlots[i].amount;
			};
		};
	} else if (this._equipItemSlots[slotId]) {
		// Count only items in slot, if itemId not specified, counts how many of any item in there
		if (!itemId || this._equipItemSlots[slotId].itemId() == itemId) {
			count += this._equipItemSlots[slotId].amount;
		};
	};
	return count;
};

Game_Actor.prototype.maxActorItemAdd = function(slotId,itemId) {
	var itemSlot = this._equipItemSlots[slotId];
	if (itemId) {
		var item = $dataItems[itemId];
	} else {
		return 0;
	};
	var m = 0;
	
	if (itemSlot.itemId() != itemId) {
		// Equiping whole new item, so max is full stack amount
		var m = item.actorStack;
	} else {
		// Can add x more to existing stack
		var m = item.actorStack - itemSlot.amount;
	};

	return m;
};

Galv.AEI.Game_Actor_consumeItem = Game_Actor.prototype.consumeItem;
Game_Actor.prototype.consumeItem = function(item) {
	if (SceneManager._scene.constructor.name == "Scene_Battle") {
		// Consume from actor's inventory slot instead
		this.removeFromActorItemSlot(this.currentAction()._item.slotId,1);
	} else if (SceneManager._scene.constructor.name == "Scene_EquipItems") {
		// Removed manually in scene.
		//this.removeFromActorItemSlot(Galv.AEI._tempMenuItemSlot,1);
	} else {
		Galv.AEI.Game_Actor_consumeItem.call(this,item);
	};
};

Game_Actor.prototype.canEquipItem = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isItem(item)) {
        return this.isEquipAtypeOk(item.atypeId);
    } else {
        return false;
    }
};


// GAME ACTION
//-----------------------------------------------------------------------------

Game_Action.prototype.setActorEquipItem = function(actor,slotId) {
	this._item = actor._equipItemSlots[slotId];
};


// SCENE BATTLE
//-----------------------------------------------------------------------------

// OVERWRITE
Scene_Battle.prototype.onItemOk = function() {
    var item = this._itemWindow.item();
    var action = BattleManager.inputtingAction();
	var actor = $gameParty.members()[BattleManager._actorIndex];
    action.setActorEquipItem(actor,this._itemWindow._index);
    $gameParty.setLastItem(item);
    this.onSelectAction();
};


// Add to menu stuff
//-----------------------------------------------------------------------------

if (Galv.AEI.menuCommand != "") {
	Galv.AEI.Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
	Scene_Menu.prototype.onPersonalOk = function() {
		if (this._commandWindow.currentSymbol() === "equipitem") {
			SceneManager.push(Scene_EquipItems);
			return;
		};
		Galv.AEI.Scene_Menu_onPersonalOk.call(this);
	};
	
	Galv.AEI.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		Galv.AEI.Window_MenuCommand_addOriginalCommands.call(this);
		var enabled = true;
		this.addCommand(Galv.AEI.menuCommand, 'equipitem', enabled);
	};
	
	Galv.AEI.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
		Galv.AEI.Scene_Menu_createCommandWindow.call(this);
		this._commandWindow.setHandler('equipitem',     this.commandPersonal.bind(this));
	};

};


// Window Item List
//-----------------------------------------------------------------------------

Window_ItemList.prototype.makeActorItemList = function() {
	this._data = [];
	var actor = $gameParty.members()[BattleManager._actorIndex];
	for (var i = 0; i < actor._equipItemSlots.length; i++) {
		this._data[i] = actor._equipItemSlots[i].object();
	};
};

Window_ItemList.prototype.drawActorItem = function(index) {
	this._iIteration = index;
    if (!this._data[index]) {
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.drawText(Galv.AEI.empty, rect.x, rect.y, rect.width);
    };
	Window_ItemList.prototype.drawItem.call(this,index);
};

Window_Selectable.prototype.drawActorItemNumber = function(item, x, y, width) {
	var actor = $gameParty.members()[BattleManager._actorIndex];
	var itemSlot = actor._equipItemSlots[this._iIteration];
	var txt = itemSlot.amount + "/" + item.actorStack;
	this.drawText(txt, x, y, width, 'right');
};


// Window_BattleItem
//-----------------------------------------------------------------------------

Window_BattleItem.prototype.makeItemList = function() {
	Window_ItemList.prototype.makeActorItemList.call(this);
};
Window_BattleItem.prototype.drawItem = function(index) {
	Window_ItemList.prototype.drawActorItem.call(this,index);
};
Window_BattleItem.prototype.drawItemNumber = function(item, x, y, width) {
	Window_Selectable.prototype.drawActorItemNumber.call(this,item,x,y,width);
};

Window_BattleItem.prototype.isEnabled = function(item) {
	if (!item) return false;
	var actor = $gameParty.members()[BattleManager._actorIndex];
    return actor && actor.meetsUsableItemConditions(item);
};


// Window_EquipActorItem
//-----------------------------------------------------------------------------
function Window_EquipActorItem() {
    this.initialize.apply(this, arguments);
}

Window_EquipActorItem.prototype = Object.create(Window_EquipItem.prototype);
Window_EquipActorItem.prototype.constructor = Window_EquipActorItem;

Window_EquipActorItem.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
    this._actor = $gameParty.menuActor();
    this._slotId = 0;
	this.refresh();
};

Window_EquipActorItem.prototype.includes = function(item) {
    if (!item) return false;
    return this._actor.canEquipItem(item);
};

Window_EquipActorItem.prototype.maxCols = function() {
    return 2;
};


// Window_EquipCommand
//-----------------------------------------------------------------------------

function Window_EquipItemCommand() {
    this.initialize.apply(this, arguments);
}

Window_EquipItemCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_EquipItemCommand.prototype.constructor = Window_EquipItemCommand;

Window_EquipItemCommand.prototype.initialize = function(x, y, width) {
    this._windowWidth = width;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

Window_EquipItemCommand.prototype.windowWidth = function() {
    return this._windowWidth;
};

Window_EquipItemCommand.prototype.maxCols = function() {
    return 4;
};

Window_EquipItemCommand.prototype.makeCommandList = function() {
    this.addCommand(Galv.AEI.txtEquip,   'equip');
    this.addCommand(Galv.AEI.txtRemove,  'remove');
	this.addCommand(Galv.AEI.txtUse,  'use');
    this.addCommand(Galv.AEI.txtClear,   'clear');
};


// WINDOW_EQUIPITEMSLOT
//-----------------------------------------------------------------------------

function Window_EquipItemSlot() {
    this.initialize.apply(this, arguments);
}

Window_EquipItemSlot.prototype = Object.create(Window_Selectable.prototype);
Window_EquipItemSlot.prototype.constructor = Window_EquipItemSlot;

Window_EquipItemSlot.prototype.initialize = function(x, y, width) {
	var height = this.fittingHeight(4);
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this.refresh();
};

Window_EquipItemSlot.prototype.maxCols = function() {
    return 2;
};

Window_EquipItemSlot.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_EquipItemSlot.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setSlotId(this.index());
    }
};

Window_EquipItemSlot.prototype.maxItems = function() {
    return this._actor ? this._actor._equipItemSlots.length : 0;
};

Window_EquipItemSlot.prototype.item = function() {
	if (!this._actor) return null;
    return this._actor._equipItemSlots[this.index()] ? this._actor._equipItemSlots[this.index()].object() : null;
};

Window_EquipItemSlot.prototype.drawItemNumber = function(item, x, y, width, index) {
	var itemSlot = this._actor._equipItemSlots[index];
	var txt = itemSlot.amount + "/" + item.actorStack;
	this.drawText(txt, x, y, width, 'right');
};

Window_EquipItemSlot.prototype.drawItem = function(index) {
    if (this._actor) {
        var rect = this.itemRectForText(index);
        this.changePaintOpacity(this.isEnabled(index));

		if (this._actor._equipItemSlots[index].itemId() > 0) {
			var item = this._actor._equipItemSlots[index].object();
			this.drawItemName(item, rect.x, rect.y, rect.width);
			this.drawItemNumber(item, rect.x, rect.y, rect.width, index);
		} else {
			this.drawText(Galv.AEI.empty, rect.x, rect.y, rect.width);
		};
        this.changePaintOpacity(true);
    }
};

Window_EquipItemSlot.prototype.isEnabled = function(index) {
    return true;
};

Window_EquipItemSlot.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.index());
};

Window_EquipItemSlot.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
    this.update();
};

Window_EquipItemSlot.prototype.updateHelp = function() {
    Window_Selectable.prototype.updateHelp.call(this);
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setTempActor(null);
    }
};


// Window Equip Item Number
//-----------------------------------------------------------------------------

function Window_EquipItemNumber() {
    this.initialize.apply(this, arguments);
}

Window_EquipItemNumber.prototype = Object.create(Window_ShopNumber.prototype);
Window_EquipItemNumber.prototype.constructor = Window_EquipItemNumber;

Window_EquipItemNumber.prototype.initialize = function(x, y, width, height) {
	Window_Selectable.prototype.initialize.call(this, x, y, width, height);
	this._item = null;
    this._max = 1;
    this._number = 1;
    this.createButtons();
};

Window_EquipItemNumber.prototype.setup = function(item, max, msg) {
	this._msg = msg;
    this._item = item;
    this._max = Math.floor(max);
    this._number = 1;
    this.placeButtons();
    this.updateButtonsVisiblity();
    this.refresh();
};

Window_EquipItemNumber.prototype.refresh = function() {
    this.contents.clear();
	this.drawText(this._msg,0,0,this.contents.width,'center');
    this.drawItemName(this._item, 0, this.itemY());
    this.drawMultiplicationSign();
    this.drawNumber();
};

Window_ShopNumber.prototype.itemY = function() {
    return this.lineHeight(1) + 10;
};


// SCENE_EQUIPITEMS
//-----------------------------------------------------------------------------

function Scene_EquipItems() {
    this.initialize.apply(this, arguments);
}

Scene_EquipItems.prototype = Object.create(Scene_ItemBase.prototype);
Scene_EquipItems.prototype.constructor = Scene_EquipItems;

Scene_EquipItems.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_EquipItems.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
	this.createNumberWindow();
	this.createActorWindow();
    this.refreshActor();
};

Scene_EquipItems.prototype.createCommandWindow = function() {
    var wx = 0;
    var wy = this._helpWindow.height;
    var ww = Graphics.boxWidth;
    this._commandWindow = new Window_EquipItemCommand(wx, wy, ww);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler('equip',    this.commandEquip.bind(this));
    this._commandWindow.setHandler('remove',   this.commandEquip.bind(this));
	this._commandWindow.setHandler('use',   this.commandEquip.bind(this));
    this._commandWindow.setHandler('clear',    this.commandClear.bind(this));
    this._commandWindow.setHandler('cancel',   this.popScene.bind(this));
    this._commandWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._commandWindow.setHandler('pageup',   this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_EquipItems.prototype.createSlotWindow = function() {
    var wx = 0;
    var wy = this._commandWindow.y + this._commandWindow.height;
    var ww = Graphics.boxWidth;
    this._slotWindow = new Window_EquipItemSlot(wx, wy, ww);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setHandler('ok',       this.onSlotOk.bind(this));
    this._slotWindow.setHandler('cancel',   this.onSlotCancel.bind(this));
    this.addWindow(this._slotWindow);
};

Scene_EquipItems.prototype.createItemWindow = function() {
    var wx = 0;
    var wy = this._slotWindow.y + this._slotWindow.height;
    var ww = Graphics.boxWidth;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_EquipActorItem(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};


Scene_EquipItems.prototype.createNumberWindow = function() {
	var ww = 400;
	var wh = 130;
    var wx = Graphics.boxWidth / 2 - ww / 2;
    var wy = this._itemWindow.y - wh / 2;
	
    this._numberWindow = new Window_EquipItemNumber(wx, wy, ww, wh);
    this._numberWindow.hide();
    this._numberWindow.setHandler('ok',     this.onNumberOk.bind(this));
    this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
    this.addWindow(this._numberWindow);
};

Scene_EquipItems.prototype.user = function() {
    return this.actor();
};

Scene_EquipItems.prototype.item = function() {
    return this._slotWindow.item();
};

Scene_EquipItems.prototype.playSeForItem = function() {
    SoundManager.playUseItem();
};

Scene_EquipItems.prototype.hideSubWindow = function(window) {
    window.hide();
    window.deactivate();
    this._slotWindow.refresh();
    this._slotWindow.activate();
};

Scene_EquipItems.prototype.refreshActor = function() {
    var actor = this.actor();
    this._slotWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

Scene_EquipItems.prototype.commandEquip = function() {
    this._slotWindow.activate();
    this._slotWindow.select(0);
};

Scene_EquipItems.prototype.commandClear = function() {
    SoundManager.playEquip();
    this.actor().clearAllActorItemSlots();
    this._slotWindow.refresh();
	this._itemWindow.refresh();
    this._commandWindow.activate();
};

Scene_EquipItems.prototype.onActorOk = function() {
    if (this.actor()._equipItemSlots[this._slotWindow.index()].amount > 0 && this.isItemEffectsValid()) {
        this.useItem();
		this.actor().removeFromActorItemSlot(this._slotWindow.index(),1);
		this._slotWindow.refresh();
    } else {
        SoundManager.playBuzzer();
    };
};

Scene_EquipItems.prototype.onSlotOk = function() {
	if (this._commandWindow.currentSymbol() === "use") {
		// console.log(this.actor().canUse(this.item()),this.actor()._equipItemSlots[this._slotWindow.index()].amount);
		if (this.actor()._equipItemSlots[this._slotWindow.index()].amount > 0 && this.actor().meetsUsableItemConditions(this.item())) {
			$gameParty.setLastItem(this.item());
			this.determineItem();
		} else {
			SoundManager.playBuzzer();
			this.hideSubWindow(this._actorWindow);
		};
	} else if (this._commandWindow.currentSymbol() === "remove") {
		// Remove
		var maxRemove = this.actor()._equipItemSlots[this._slotWindow.index()].amount;
		if (maxRemove <= 0) {
			// Already maxed out in that slot! Cannot equip more
			SoundManager.playBuzzer();
			this._slotWindow.activate();
		} else {
			this._numberWindow.setup(this._slotWindow.item(), maxRemove, Galv.AEI.txtRemoveAmount);
			this._numberWindow.show();
			this._numberWindow.activate();
		};
	} else {
		// Equip
		this._itemWindow.activate();
    	this._itemWindow.select(0);
	};
};

Scene_EquipItems.prototype.onSlotCancel = function() {
    this._slotWindow.deselect();
    this._commandWindow.activate();
};

Scene_EquipItems.prototype.onItemOk = function() {
	var iId = this._itemWindow.item() ? this._itemWindow.item().id : 0;
	var actorSpace = this.actor().maxActorItemAdd(this._slotWindow.index(),iId);
	if (iId <= 0) {
		// equip nothing
		this.actor().clearActorItemSlot(this._slotWindow.index());
		SoundManager.playEquip();
		this._itemWindow.activate();
	} else if (actorSpace <= 0) {
		// Already maxed out in that slot! Cannot equip more
		SoundManager.playBuzzer();
		this._itemWindow.activate();
	} else {
		SoundManager.playEquip();
		var maxEquip = Math.min($gameParty.numItems(this._itemWindow.item()),actorSpace);
		this._numberWindow.setup(this._itemWindow.item(), maxEquip, Galv.AEI.txtEquipAmount);
		this._numberWindow.show();
		this._numberWindow.activate();
	};
};

Scene_EquipItems.prototype.onNumberOk = function() {
	if (this._commandWindow.currentSymbol() === "remove") {
		this.actor().removeFromActorItemSlot(this._slotWindow.index(),this._numberWindow.number(),true)
	} else {
		this.actor().equipActorItemSlot(this._slotWindow.index(),this._itemWindow.item(),this._numberWindow.number(),true);
		$gameParty.gainItem(this._itemWindow.item(),-this._numberWindow.number());
	};
	this._numberWindow.deactivate();
	this._numberWindow.hide();
	this._slotWindow.activate();
    this._slotWindow.refresh();
    this._itemWindow.deselect();
    this._itemWindow.refresh();
};

Scene_EquipItems.prototype.onNumberCancel = function() {
	this._numberWindow.hide();
		this._numberWindow.deactivate();
	if (this._commandWindow.currentSymbol() === "remove") {
		this._slotWindow.activate();
	} else {
		this._itemWindow.activate();
	};
};

Scene_EquipItems.prototype.onItemCancel = function() {
    this._slotWindow.activate();
    this._itemWindow.deselect();
};

Scene_EquipItems.prototype.onActorChange = function() {
    this.refreshActor();
    this._commandWindow.activate();
};