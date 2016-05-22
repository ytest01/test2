//=============================================================================
// TMVplugin - 装備スロット拡張
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 0.1b
// 最終更新日: 2016/05/12
//=============================================================================

/*:
 * @plugindesc アクターごとに部位設定を自由に変更できるようにします。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @help
 * 使い方:
 *   アクターのメモ欄に <equipSlotEx:1 2 5 5 5> のようなタグを書き込んでください。
 *   この例では武器、盾、装飾品３つという部位構成になります。
 *   タグがなければ通常の部位構成が採用されます。また、二刀流が設定されている場合
 *   は２つ目の部位が武器に置き換わります。
 *
 * プラグインコマンドはありません。
 * 
 */

var Imported = Imported || {};
Imported.TMEquipSlotEx = true;

(function() {

  //-----------------------------------------------------------------------------
  // Game_Actor
  //

  var _Game_Actor_equipSlots = Game_Actor.prototype.equipSlots;
  Game_Actor.prototype.equipSlots = function() {
    var equipSlotEx = this.actor().meta.equipSlotEx;
    if (equipSlotEx) {
      var slots = equipSlotEx.split(' ').map(Number);
      if (slots.length >= 2 && this.isDualWield()) {
        slots[1] = 1;
      }
      return slots;
    } else {
      return _Game_Actor_equipSlots.call(this);
    }
  };

})();
