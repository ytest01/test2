//==============================================================================
// dsEquipmentSkillLearning.js
// Copyright (c) 2016 Douraku
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//==============================================================================

/*:
 * @plugindesc 装備に設定されたスキルを習得するプラグイン ver1.01
 * @author 道楽
 *
 * @param Lp
 * @desc 装備からスキルを習得する蓄積値の略称(Learning Point)
 * @default LP
 *
 * @param Reward Lp Text
 * @desc 戦闘後にLPを獲得した時に表示されるテキスト
 * @default %1 の%2を獲得！
 *
 * @param Show Reward Lp Text
 * @desc 戦闘後にLPを獲得したテキストを表示するか
 * (true なら表示する / false なら表示しない)
 * @default true
 *
 * @param Learning Skill Text
 * @desc 戦闘で得たLPによってスキルを習得した時に表示されるテキスト
 * @default %1は%2を覚えた！
 *
 * @param Usable Equipment Skill
 * @desc 装備品が持つ未修得のスキルを使用できるか
 * (true なら使用できる / false なら使用できない)
 * @default true
 *
 * @param Show Lp Gauge
 * @desc LPをゲージで表示するか？
 * (true なら表示する / false なら表示しない)
 * @default true
 *
 * @param Show Lp Value
 * @desc LPを数値で表示するか？
 * (true なら表示する / false なら表示しない)
 * @default false
 *
 * @param Lp Value Font Size
 * @desc LP表示で使用するフォントのサイズ
 * @default 18
 *
 * @help
 * このプラグインは以下のメモタグの設定ができます。
 *
 * -----------------------------------------------------------------------------
 * スキルに設定するメモタグ
 *
 * <lp:[必要LP]>
 *  スキルを習得するために必要なLPを設定します。
 *  [必要LP] - スキルの習得に必要なLP(数字)
 *
 * -----------------------------------------------------------------------------
 * 武器・防具に設定するメモタグ
 *
 * <learningSkill[習得番号]:[スキルID]>
 *  装備から習得できるスキルを設定します。
 *  [習得番号] - 00～04までの2桁の数値が設定できます。
 *               なお、ひとつの装備に同じ習得番号を複数設定出来ません。
 *  [スキルID] - スキルのID(数字)
 *
 * -----------------------------------------------------------------------------
 * 敵キャラに設定するメモタグ
 *
 * <rewardLp:[獲得LP]>
 *  敵キャラ撃破時に獲得できるLPの値を設定します。
 *  [獲得LP] - 撃破時に獲得できるLP(数字)
 */

var Imported = Imported || {};
Imported.dsEquipmentSkillLearning = true;

var dsEquipmentSkillLearning = {};

(function(ns) {

	ns.Param = (function() {
		var ret = {};
		var parameters = PluginManager.parameters('dsEquipmentSkillLearning');
		ret.Lp = String(parameters['Lp']);
		ret.RewardLpText = String(parameters['Reward Lp Text']);
		ret.ShowRewardLpText = Boolean(parameters['Show Reward Lp Text'] === 'true' || false);
		ret.LearningSkillText = String(parameters['Learning Skill Text']);
		ret.UsableEquipmentSkill = Boolean(parameters['Usable Equipment Skill'] === 'true' || false);
		ret.ShowLpGauge = Boolean(parameters['Show Lp Gauge'] === 'true' || false);
		ret.ShowLpValue = Boolean(parameters['Show Lp Value'] === 'true' || false);
		ret.LpValueFontSize = Number(parameters['Lp Value Font Size']);
		ret.EquipmentSkillMax = 5;
		return ret;
	})();

	//--------------------------------------------------------------------------
	/** Utility */
	var Utility = {};

	Utility.leaningSkills = function(item)
	{
		var list = [];
		for ( var jj = 0; jj < ns.Param.EquipmentSkillMax; jj++ )
		{
			var learningSkill = 'learningSkill' + ('0'+jj).slice(-2);
			if ( item.meta[learningSkill] )
			{
				var id = Number(item.meta[learningSkill]);
				if ( !list.contains($dataSkills[id]) )
				{
					list.push($dataSkills[id]);
				}
			}
		}
		return list;
	};

	//--------------------------------------------------------------------------
	/** Game_Actor */
	var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
	Game_Actor.prototype.initMembers = function()
	{
		_Game_Actor_initMembers.call(this);
		this._skillLp = {};
	};

	var _Game_Actor_skills = Game_Actor.prototype.skills;
	Game_Actor.prototype.skills = function()
	{
		var list = _Game_Actor_skills.call(this);
		if ( ns.Param.UsableEquipmentSkill )
		{
			this.equipmentSkills().forEach(function(skill) {
				if ( !list.contains(skill) )
				{
					list.push(skill);
				}
			});
		}
		return list;
	};

	Game_Actor.prototype.equipmentSkills = function()
	{
		var list = [];
		var equips = this.equips();
		for ( var ii = 0; ii < equips.length; ii++ )
		{
			var item = equips[ii];
			if ( item )
			{
				Utility.leaningSkills(item).forEach(function(skill) {
					if ( !list.contains(skill) )
					{
						list.push(skill);
					}
				});
			}
		}
		return list;
	};

	Game_Actor.prototype.learningSkills = function()
	{
		var list = [];
		for ( var id in this._skillLp )
		{
			if ( this._skillLp[id] < Number($dataSkills[id].meta.lp) )
			{
				if ( !list.contains($dataSkills[id]) )
				{
					list.push($dataSkills[id]);
				}
			}
		}
		return list;
	};

	Game_Actor.prototype.gainLp = function(lp, show)
	{
		var lastSkills = this.skills();
		this.equipmentSkills().forEach(function(skill) {
			this.addSkillLp(skill, lp);
		}, this);
		if ( show )
		{
			var newSkills = this.findNewSkills(lastSkills);
			if ( newSkills.length > 0 )
			{
				$gameMessage.newPage();
				newSkills.forEach(function(skill) {
					var text = ns.Param.LearningSkillText.format(this.name(), skill.name);
					$gameMessage.add(text);
				}, this);
			}
		}
	};

	Game_Actor.prototype.addSkillLp = function(skill, lp)
	{
		if ( skill.meta.lp )
		{
			var skillId = skill.id;
			if ( this._skillLp[skillId] )
			{
				this._skillLp[skillId] += lp;
			}
			else
			{
				this._skillLp[skillId] = lp;
			}
			if ( this._skillLp[skillId] >= Number(skill.meta.lp) )
			{
				this.learnSkill(skillId);
				this._skillLp[skillId] = Number(skill.meta.lp);
			}
		}
	};

	Game_Actor.prototype.skillLp = function(skill)
	{
		if ( this._skillLp[skill.id] )
		{
			return this._skillLp[skill.id];
		}
		return 0;
	};

	Game_Actor.prototype.skillLpMax = function(skill)
	{
		if ( skill.meta.lp )
		{
			return Number(skill.meta.lp);
		}
		return 1;
	};

	Game_Actor.prototype.lpRate = function(skill)
			{
		return this.skillLp(skill) / this.skillLpMax(skill);
	};

	Game_Actor.prototype.isEquipmentSkill = function(skill)
	{
		var skills = this.equipmentSkills();
		return skills.contains(skill) ? true : false;
	};

	Game_Actor.prototype.isLearningSkill = function(skill)
	{
		var skills = this.learningSkills();
		return skills.contains(skill) ? true : false;
	};

	//--------------------------------------------------------------------------
	/** Game_Enemy */
	Game_Enemy.prototype.lp = function()
	{
		var enemy = this.enemy();
		if ( enemy.meta.rewardLp )
		{
			return Number(enemy.meta.rewardLp);
		}
		return 0;
	};

	//--------------------------------------------------------------------------
	/** Game_Troop */
	Game_Troop.prototype.lpTotal = function()
	{
		return this.deadMembers().reduce(function(r, enemy) {
			return r + enemy.lp();
		}, 0);
	};

	//--------------------------------------------------------------------------
	/** Window_Base */
	Window_Base.prototype.lpColor = function()
	{
		return this.systemColor();
	};

	Window_Base.prototype.learningGaugeColor1 = function()
	{
		return this.textColor(28);
	};

	Window_Base.prototype.learningGaugeColor2 = function()
	{
		return this.textColor(29);
	};

	Window_Base.prototype.lpValueWidth = function()
	{
		this.contents.fontSize = ns.Param.LpValueFontSize;
		var valueWidth = this.textWidth('000');
		var slashWidth = this.textWidth('/');
		this.contents.fontSize = this.standardFontSize();
		return valueWidth * 2 + slashWidth;
	};

	Window_Base.prototype.drawChangeTab = function(x, y)
	{
		var text = 'Tab:切り替え';
		var lastFontSize = this.contents.fontSize;
		this.contents.fontSize = 14;
		this.changeTextColor(this.systemColor());
		this.drawText(text, x, y, 112);
		this.contents.fontSize = lastFontSize;
	};

	Window_Base.prototype.drawLpGauge = function(actor, skill, x, y, width)
	{
		if ( ns.Param.ShowLpGauge )
		{
			var iconBoxWidth = Window_Base._iconWidth + 4;
			var x1 = x + iconBoxWidth;
			var gaugeWidth = width - iconBoxWidth;
			var rate = actor.lpRate(skill);
			var color1 = this.learningGaugeColor1();
			var color2 = this.learningGaugeColor2();
			this.drawGauge(x1, y, gaugeWidth, rate, color1, color2);
		}
	};

	Window_Base.prototype.drawLpValue = function(actor, skill, x, y, width)
	{
		if ( ns.Param.ShowLpValue )
		{
			var lp = actor.skillLp(skill);
			var lpMax = actor.skillLpMax(skill);
			this.contents.fontSize = ns.Param.LpValueFontSize;
			var labelWidth = this.textWidth(ns.Param.Lp);
			var valueWidth = this.textWidth('000');
			var slashWidth = this.textWidth('/');
			var valueHeight = (this.lineHeight() - this.contents.fontSize) / 2;
			var x1 = x + width - valueWidth;
			var x2 = x1 - slashWidth;
			var x3 = x2 - valueWidth;
			var y1 = y - valueHeight;
			var y2 = y + valueHeight;
			if ( y2 - y1 >= this.contents.fontSize )
			{
				this.changeTextColor(this.lpColor());
				this.drawText(ns.Param.Lp, x3, y1, labelWidth);
			}
			if ( x3 >= x + labelWidth )
			{
				this.resetTextColor();
				this.drawText(lp, x3, y2, valueWidth, 'right');
				this.drawText('/', x2, y2, slashWidth, 'right');
				this.drawText(lpMax, x1, y2, valueWidth, 'right');
			}
			else
			{
				this.resetTextColor();
				this.drawText(lp, x1, y2, valueWidth, 'right');
			}
			this.contents.fontSize = this.standardFontSize();
		}
	};

	//--------------------------------------------------------------------------
	/** Window_Selectable */
	var _Window_Selectable_processHandling = Window_Selectable.prototype.processHandling;
	Window_Selectable.prototype.processHandling = function()
	{
		_Window_Selectable_processHandling.call(this);
		if ( this.isOpenAndActive() )
		{
			if ( this.isHandled('tab') && Input.isTriggered('tab') )
			{
				this.processTab();
			}
		}
	};

	Window_Selectable.prototype.processTab = function()
	{
		SoundManager.playCursor();
		this.callHandler('tab');
	};

	//--------------------------------------------------------------------------
	/** Window_MenuSkill */
	ns.Window_MenuSkill = (function() {

		function Window_MenuSkill()
		{
			this.initialize.apply(this, arguments);
		}

		Window_MenuSkill.prototype = Object.create(Window_SkillList.prototype);
		Window_MenuSkill.prototype.constructor = Window_MenuSkill;

		Window_MenuSkill.prototype.isEnabled = function(item)
		{
			if ( this._actor )
			{
				if ( !ns.Param.UsableEquipmentSkill )
				{
					if ( this._actor.skills().indexOf(item) < 0 )
					{
						return false;
					}
				}
				return this._actor.canUse(item);
			}
			return false;
		};

		Window_MenuSkill.prototype.makeItemList = function()
		{
			if ( this._actor )
			{
				var skills = this._actor.skills();
				this._actor.equipmentSkills().forEach(function(skill) {
					if ( !skills.contains(skill) )
					{
						skills.push(skill);
					}
				}, this);
				this._actor.learningSkills().forEach(function(skill) {
					if ( !skills.contains(skill) )
					{
						skills.push(skill);
					}
				}, this);
				this._data = skills.filter(function(skill) {
					return this.includes(skill);
				}, this);
				this._data.sort(function(a, b) {
					return a.id - b.id;
				});
			}
			else
			{
				this._data = [];
			}
		};

		Window_MenuSkill.prototype.drawItem = function(index)
		{
			var skill = this._data[index];
			if ( skill )
			{
				var costWidth = this.costWidth();
				var rect = this.itemRect(index);
				rect.width -= this.textPadding();
				if ( this.isLearningSkill(skill) )
				{
					this.drawLearning(skill, rect.x, rect.y, rect.width - costWidth);
				}
				if ( ns.Param.ShowLpValue )
				{
					costWidth += this.lpValueWidth();
				}
				this.changePaintOpacity(this.isEnabled(skill));
				this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
				this.drawSkillCost(skill, rect.x, rect.y, rect.width);
				this.changePaintOpacity(true);
				if ( this.isEquipmentSkill(skill) )
				{
					this.drawEquipment(skill, rect.x, rect.y, rect.width);
				}
			}
		};

		Window_MenuSkill.prototype.drawEquipment = function(skill, x, y, width)
		{
			this.contents.fontSize = Window_Base._iconWidth / 2;
			this.changeTextColor(this.systemColor());
			this.drawText('Ｅ', x + 4, y + 8, Window_Base._iconWidth, 'right');
			this.contents.fontSize = this.standardFontSize();
			this.resetTextColor();
		};

		Window_MenuSkill.prototype.drawLearning = function(skill, x, y, width)
		{
			this.drawLpGauge(this._actor, skill, x, y, width);
			this.drawLpValue(this._actor, skill, x, y, width);
		};

		Window_MenuSkill.prototype.isEquipmentSkill = function(item)
		{
			return this._actor && this._actor.isEquipmentSkill(item);
		};

		Window_MenuSkill.prototype.isLearningSkill = function(item)
		{
			if ( this._actor )
			{
				if ( !this._actor.isLearnedSkill(item.id) )
				{
					return this._actor.isLearningSkill(item) || this._actor.isEquipmentSkill(item);
				}
			}
			return false;
		};

		return Window_MenuSkill;
	})();

	//--------------------------------------------------------------------------
	/** Window_EquipStatus */
	var _Window_EquipStatus_refresh = Window_EquipStatus.prototype.refresh;
	Window_EquipStatus.prototype.refresh = function()
	{
		_Window_EquipStatus_refresh.call(this);
		this.drawChangeTab(190, 0);
	};

	//--------------------------------------------------------------------------
	/** Window_EquipLearning */
	ns.Window_EquipLearning = (function() {

		function Window_EquipLearning()
		{
			this.initialize.apply(this, arguments);
		}

		Window_EquipLearning.prototype = Object.create(Window_Base.prototype);
		Window_EquipLearning.prototype.constructor = Window_EquipLearning;

		Window_EquipLearning.prototype.initialize = function(x, y)
		{
			var width = this.windowWidth();
			var height = this.windowHeight();
			Window_Base.prototype.initialize.call(this, x, y, width, height);
			this._actor = null;
			this._item = null;
			this.refresh();
		};

		Window_EquipLearning.prototype.windowWidth = function()
		{
			return 312;
		};

		Window_EquipLearning.prototype.windowHeight = function()
		{
			return this.fittingHeight(this.numVisibleRows());
		};

		Window_EquipLearning.prototype.numVisibleRows = function()
		{
			return 7;
		};

		Window_EquipLearning.prototype.setActor = function(actor)
		{
			if ( this._actor !== actor )
			{
				this._actor = actor;
				this.refresh();
			}
		};

		Window_EquipLearning.prototype.setItem = function(item)
		{
			if ( this._item !== item )
			{
				this._item = item;
				this.refresh();
			}
		};

		Window_EquipLearning.prototype.refresh = function()
		{
			this.contents.clear();
			if ( this._actor )
			{
				this.drawActorName(this._actor, this.textPadding(), 0);
				if ( this._item )
				{
					var lineHeight = this.lineHeight();
					var x1 = this.textPadding();
					var y1 = lineHeight;
					var width = this.contentsWidth() - this.textPadding();
					this.drawItemName(this._item, x1, y1, width);
					var lineY = y1 + lineHeight + lineHeight / 4 - 1;
					this.contents.paintOpacity = 48;
					this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
					this.contents.paintOpacity = 255;
					Utility.leaningSkills(this._item).forEach(function(skill, idx) {
						this.drawLearningSkill(skill, x1, y1 + lineHeight * (1.5 + idx), width);
					}, this);
				}
			}
			this.drawChangeTab(190, 0);
		};

		Window_EquipLearning.prototype.drawLearningSkill = function(skill, x, y, width)
		{
			this.drawLpGauge(this._actor, skill, x, y, width);
			this.drawLpValue(this._actor, skill, x, y, width);
			if ( ns.Param.ShowLpValue )
			{
				width -= this.lpValueWidth();
			}
			this.drawItemName(skill, x, y, width);
		};

		Window_EquipLearning.prototype.lineColor = function()
		{
			return this.normalColor();
		};

		return Window_EquipLearning;
	})();

	//--------------------------------------------------------------------------
	/** Scene_Skill */
	Scene_Skill.prototype.createItemWindow = function()
	{
		var wx = 0;
		var wy = this._statusWindow.y + this._statusWindow.height;
		var ww = Graphics.boxWidth;
		var wh = Graphics.boxHeight - wy;
		this._itemWindow = new ns.Window_MenuSkill(wx, wy, ww, wh);
		this._itemWindow.setHelpWindow(this._helpWindow);
		this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
		this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
		this._skillTypeWindow.setSkillWindow(this._itemWindow);
		this.addWindow(this._itemWindow);
	};

	//--------------------------------------------------------------------------
	/** Scene_Equip */
	Scene_Equip.prototype.create = function()
	{
		Scene_MenuBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createStatusWindow();
		this.createLearningWindow();
		this.createCommandWindow();
		this.createSlotWindow();
		this.createItemWindow();
		this.refreshActor();
	};

	Scene_Equip.prototype.createLearningWindow = function()
	{
		this._learningWindow = new ns.Window_EquipLearning(0, this._helpWindow.height);
		this._learningWindow.hide();
		this.addWindow(this._learningWindow);
	};

	var _Scene_Equip_createSlotWindow = Scene_Equip.prototype.createSlotWindow;
	Scene_Equip.prototype.createSlotWindow = function()
	{
		_Scene_Equip_createSlotWindow.call(this);
		this._slotWindow.setHandler('tab', this.onWindowChange.bind(this));
	};

	var _Scene_Equip_createCommandWindow = Scene_Equip.prototype.createCommandWindow;
	Scene_Equip.prototype.createCommandWindow = function()
	{
		_Scene_Equip_createCommandWindow.call(this);
		this._commandWindow.setHandler('tab', this.onWindowChange.bind(this));
	};

	var _Scene_Equip_createItemWindow = Scene_Equip.prototype.createItemWindow;
	Scene_Equip.prototype.createItemWindow = function()
	{
		_Scene_Equip_createItemWindow.call(this);
		this._itemWindow.setHandler('tab', this.onWindowChange.bind(this));
	};

	var _Scene_Equip_refreshActor = Scene_Equip.prototype.refreshActor;
	Scene_Equip.prototype.refreshActor = function()
	{
		_Scene_Equip_refreshActor.call(this);
		var actor = this.actor();
		this._learningWindow.setActor(actor);
	};

	var _Scene_Equip_update = Scene_Equip.prototype.update;
	Scene_Equip.prototype.update = function()
	{
		_Scene_Equip_update.call(this);
		this.updateLearningSkill();
	};

	Scene_Equip.prototype.updateLearningSkill = function()
	{
		if ( this._commandWindow.active )
		{
			this._learningWindow.setItem(null);
		}
		else if ( this._slotWindow.active )
		{
			var item = this._slotWindow.item();
			this._learningWindow.setItem(item);
		}
		else if ( this._itemWindow.active )
		{
			var item = this._itemWindow.item();
			this._learningWindow.setItem(item);
		}
	};

	Scene_Equip.prototype.onWindowChange = function()
	{
		if ( this._statusWindow.visible )
		{
			this._statusWindow.hide();
			this._learningWindow.show();
		}
		else
		{
			this._statusWindow.show();
			this._learningWindow.hide();
		}
	};

	//--------------------------------------------------------------------------
	/** BattleManager */
	var _BattleManager_makeRewards = BattleManager.makeRewards;
	BattleManager.makeRewards = function()
	{
		_BattleManager_makeRewards.call(this);
		this._rewards.lp = $gameTroop.lpTotal();
	};

	var _BattleManager_displayRewards = BattleManager.displayRewards;
	BattleManager.displayRewards = function()
	{
		_BattleManager_displayRewards.call(this);
		this.displayLp();
	};

	BattleManager.displayLp = function()
	{
		if ( ns.Param.ShowRewardLpText )
		{
			var lp = this._rewards.lp;
			if ( lp > 0 )
			{
				var text = ns.Param.RewardLpText.format(lp, ns.Param.Lp);
				$gameMessage.add('\\.' + text);
			}
		}
	};

	var _BattleManager_gainRewards = BattleManager.gainRewards;
	BattleManager.gainRewards = function()
	{
		_BattleManager_gainRewards.call(this);
		this.gainLp();
	};

	BattleManager.gainLp = function()
	{
		var lp = this._rewards.lp;
		$gameParty.allMembers().forEach(function(actor) {
			actor.gainLp(lp, true);
		});
	};

})(dsEquipmentSkillLearning);

