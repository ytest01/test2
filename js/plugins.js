// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"SupportFaceChat","status":true,"description":"フェイスチャット機能を実装します。","parameters":{"x":"0","y":"550","width":"410","type":"1","IconNumber":"4","[C]color":"2","MsgWindowHeight":"","ChangeTone":"true"}},
{"name":"YEP_BattleStatusWindow","status":true,"description":"v1.04 A simple battle status window that shows the\nfaces of your party members in horizontal format.","parameters":{"---Visual---":"","No Action Icon":"16","Name Font Size":"20","Param Font Size":"20","Param Y Buffer":"7","Param Current Max":"false","Adjust Columns":"false","---Actor Switching---":"","Left / Right":"false","PageUp / PageDown":"false","Allow Turn Skip":"false","---Front View---":"","Show Animations":"true","Show Sprites":"false","Align Animations":"true","X Offset":"24","Y Offset":"-16"}},
{"name":"YEP_CoreEngine","status":true,"description":"Yanfly Engine Scriptsの大元となる機能です。\r\nRPGツクールMVのバグを修正したり、様々なカスタムを行います。","parameters":{"---スクリーン---":"","Screen Width":"916","Screen Height":"624","Scale Battlebacks":"true","Scale Title":"true","Open Console":"false","Reposition Battlers":"true","---ゴールド---":"","Gold Max":"99999999","Gold Font Size":"28","Gold Icon":"0","Gold Overlap":"a lotta","---アイテム---":"","Default Max":"99","Quantity Text Size":"20","---ステータス---":"","Max Level":"99","Actor MaxHP":"9999","Actor MaxMP":"9999","Actor Parameter":"999","Enemy MaxHP":"999999","Enemy MaxMP":"9999","Enemy Parameter":"999","---バトル---":"","Animation Rate":"4","Flash Target":"true","---フォント---":"","Chinese Font":"SimHei, Heiti TC, sans-serif","Korean Font":"Dotum, AppleGothic, sans-serif","Default Font":"GameFont, Verdana, Arial, Courier New","Font Size":"24","Text Align":"center","---ウィンドウ---":"","Digit Grouping":"true","Line Height":"36","Icon Width":"32","Icon Height":"32","Face Width":"144","Face Height":"144","Window Padding":"18","Text Padding":"6","Window Opacity":"192","Gauge Outline":"true","Gauge Height":"6","Menu TP Bar":"true","---ウィンドウカラー---":"","Color: Normal":"0","Color: System":"16","Color: Crisis":"17","Color: Death":"18","Color: Gauge Back":"19","Color: HP Gauge 1":"20","Color: HP Gauge 2":"21","Color: MP Gauge 1":"22","Color: MP Gauge 2":"23","Color: MP Cost":"23","Color: Power Up":"24","Color: Power Down":"25","Color: TP Gauge 1":"28","Color: TP Gauge 2":"29","Color: TP Cost Color":"29"}},
{"name":"YEP_ItemCore","status":true,"description":"ゲーム内やアイテムシーン内でのアイテムの処理を変更します","parameters":{"---一般---":"","Max Items":"0","Max Weapons":"20","Max Armors":"0","Starting ID":"3000","Random Variance":"10","Name Format":"%1%2%3%4","Name Spacing":"false","Boost Format":"+%1","---アイテムシーン---":"","Updated Scene Item":"true","List Equipped Items":"true","Show Icon":"false","Icon Size":"128","Font Size":"24","Command Alignment":"center","Recovery Format":"%1 回復","Add State":"+State","Add Buff":"+Buff","Remove State":"-State","Remove Buff":"-Buff","Maximum Icons":"4","Use Command":"使う","Carry Format":"%1/%2"}},
{"name":"YEP_X_ItemUpgradeSlots","status":true,"description":"個別アイテムを強化出来るようになります。\n(使用するにはYEP_ItemCore.jsが必要です)","parameters":{"Default Slots":"3","Slot Variance":"1","Upgrade Command":"チューニング","Slots Available":"チューニング可能回数","Show Slot Upgrades":"true","Slot Upgrade Format":"履歴%1: %2","Default Sound":"Item3"}},
{"name":"CraftingSystem","status":true,"description":"Craft items, weapons and armors based on categorized recipe books.","parameters":{"Categories":"マスタリングを行うアイテムを選択してください。(※決定で即、素材を消費して作成されます。)","CraftingSounds":"Sword2, Ice4","Price Text":"基本価格","Equip Text":"装備","Type Text":"タイプ","Ingredients Text":"所持/必要数","Currency Text":"マスタリング費用","Item Crafted Text":"完成したアイテム"}},
{"name":"Yami_SkipTitle","status":false,"description":"テストプレイ用にタイトルシーンを飛ばすことができます。","parameters":{}},
{"name":"dsEquipmentSkillLearning","status":true,"description":"装備に設定されたスキルを習得するプラグイン ver1.01","parameters":{"Lp":"LP","Reward Lp Text":"%1 の%2を獲得！","Show Reward Lp Text":"true","Learning Skill Text":"%1は%2を覚えた！","Usable Equipment Skill":"true","Show Lp Gauge":"true","Show Lp Value":"true","Lp Value Font Size":"18"}},
{"name":"TMEquipSlotEx","status":true,"description":"アクターごとに部位設定を自由に変更できるようにします。","parameters":{}},
{"name":"GALV_ActorEquipItems","status":true,"description":"Actors can only use items in battle that they have equipped.","parameters":{"Item Slots":"4","Stack Size":"5","Default Armor Type":"1","----- Vocab -----":"","Menu Command":"戦闘準備","Empty Slot Text":"---------","Equip Text":"装備","Remove Text":"戻す","Use Text":"使う","Clear Text":"リセット","Equip Amount Text":"取り出す数:","Remove Amount Text":"戻す数:"}},
{"name":"TYA_EnemyHPGauge","status":true,"description":"敵ターゲットウィンドウにＨＰゲージを表示させます。\r\n特定の敵のゲージを非表示にすることもできます。","parameters":{}},
{"name":"TinyGetInfoWnd","status":true,"description":"マップ上でアイテムの入手/消失を小さなウィンドウで表示します。","parameters":{"Event Command Switch":"22","Y position type":"1","textGainItem":"%1を入手！","textLoseItem":"%1を消失した……。","SE filename":"Item3","SE volume":"90","SE pitch":"100"}},
{"name":"ChangeWeaponOnBattle","status":true,"description":"戦闘コマンドに装備変更を追加","parameters":{"commandName":"装備変更"}},
{"name":"UCHU_MobileOperation","status":true,"description":"スマホ操作用プラグイン。横持ち/縦持ちに対応した仮想ボタン、\r\nタッチ操作の方法を追加拡張し、スマホプレイを快適にします。","parameters":{"---PC Option---":"","PC BtnDisplay":"true","PC TouchExtend":"true","---File Path---":"","DPad Image":"./img/system/DirPad.png","ActionBtn Image":"./img/system/ActionButton.png","CancelBtn Image":"./img/system/CancelButton.png","---Button Customize---":"","Button Opacity":"0.7","Vertical BtnZoom":"1.7","Tablet BtnZoom":"0.8","TabVertical BtnZoom":"1.1","HideButton OnMessage":"true","DPad Visible":"true","DPad Size":"200","DPad Margin":"10; 10","DPad Orientation":"left; bottom","DPad OpelationRange":"1.3","DPad DiagonalRange":"0.3","ActionBtn Visible":"true","ActionBtn Size":"100","ActionBtn Margin":"10; 90","ActionBtn Orientation":"right; bottom","CancelBtn Visible":"true","CancelBtn Size":"100","CancelBtn Margin":"110; 10","CancelBtn Orientation":"right; bottom","---TouchInput Extend---":"","Flick PageUp-PageDown":"false","HoldCanvas ActionBtn":"false","OutCanvas CancelBtn":"false","OutCanvas ActionBtn":"false","--!need AnalogMove.js!--":"","Analog Move":"false","Analog Sensitivity":"1.8"}}
];
