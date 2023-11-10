
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play(0);});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.lessonSetText=function(text)
{sym.$("BannerText").html(text);};sym.startGame=function()
{sym.setVariable("Scene",0);sym.setVariable("LockArrowClickCount",0);sym.getComposition().getStage().playNextScene();sym.setVariable("GameOver",0);sym.setVariable("EnemyKillCount",0);sym.setVariable("damageCount","0");sym.setVariable("currentEnemy","-1");sym.setVariable("enemyLeft","0");};sym.endGame=function()
{sym.$("ReplayButton").show();sym.$("EndButton").show();}
sym.endAll=function()
{sym.$("ReplayButton").hide();sym.$("EndButton").hide();sym.$("Intruder_Click").hide();sym.$("Malware_Click").hide();sym.$("Virus_Click").hide();sym.$("Cannon_Intruder").hide();sym.$("Cannon_Virus").hide();sym.$("Cannon_Malware").hide();sym.$("Cannon_mount").hide();sym.$("Cannon_mount2").hide();sym.$("Cannon_mount3").hide();sym.$("Harddrive_0").hide();sym.$("Harddrive_1").hide();sym.$("Harddrive_2").hide();sym.$("Harddrive_3").hide();sym.$("Background").hide();sym.$("BannerGroup").hide();sym.$("Computer").hide();sym.$("SittingAvatar").hide();sym.$("Office").hide();sym.$("StartAvatar").show();sym.$("StartExplosion").show();sym.$("CenterText").show();sym.$("CenterText").html("Congratulations on finishing this lesson! Close this window to return to the course.");}
sym.longArrowClicked=function(arrowID)
{var clickCount=sym.getVariable("LockArrowClickCount");switch(arrowID)
{case 0:clickCount++;sym.$("AntiVirus_LA").css({opacity:1.0});sym.$("AntiVirus_LA2").css({opacity:0.6});sym.$("AntiVirus_LA3").css({opacity:0.6});sym.$("Sidecannon_Intruder").css({opacity:0.6});sym.$("Sidecannon_Malware").css({opacity:0.6});sym.$("Sidecannon_Virus").css({opacity:1.0});sym.$("Cannon_fire_Virus").css({opacity:1.0});sym.$("Cannon_fire_Malware").css({opacity:0.6});sym.$("Cannon_fire_Intruder").css({opacity:0.6});sym.$("Enemy_Virus2").css({opacity:1.0});sym.$("Enemy_Malware2").css({opacity:0.6});sym.$("Enemy_Intruder2").css({opacity:0.6});sym.lessonSetText("Antivirus software protects you from malicious programs. These programs can sneak onto a computer from websites or email attachments.");sym.$("LA_Text1_2").show();sym.$("LA_Text1_2Copy").show();sym.$("LA_Text2_2").hide();sym.$("LA_Text2_2Copy").hide();sym.$("LA_Text3_2").hide();sym.$("LA_Text3_2Copy").hide();break;case 1:clickCount++;sym.$("AntiVirus_LA").css({opacity:0.6});sym.$("AntiVirus_LA2").css({opacity:1.0});sym.$("AntiVirus_LA3").css({opacity:0.6});sym.$("Sidecannon_Intruder").css({opacity:0.6});sym.$("Sidecannon_Malware").css({opacity:1.0});sym.$("Sidecannon_Virus").css({opacity:0.6});sym.$("Cannon_fire_Virus").css({opacity:0.6});sym.$("Cannon_fire_Malware").css({opacity:1.0});sym.$("Cannon_fire_Intruder").css({opacity:0.6});sym.$("Enemy_Virus2").css({opacity:0.6});sym.$("Enemy_Malware2").css({opacity:1.0});sym.$("Enemy_Intruder2").css({opacity:0.6});sym.lessonSetText("Email filters prevent malicious emails from appearing in your Inbox and move them to the Junk Email folder. Emails might contain a link to a malicious website, coax a user to reveal logon information, or have a virus attached.");sym.$("LA_Text1_2").hide();sym.$("LA_Text1_2Copy").hide();sym.$("LA_Text2_2").show();sym.$("LA_Text2_2Copy").show();sym.$("LA_Text3_2").hide();sym.$("LA_Text3_2Copy").hide();break;case 2:clickCount++;sym.$("AntiVirus_LA").css({opacity:0.6});sym.$("AntiVirus_LA2").css({opacity:0.6});sym.$("AntiVirus_LA3").css({opacity:1.0});sym.$("Sidecannon_Intruder").css({opacity:1.0});sym.$("Sidecannon_Malware").css({opacity:0.6});sym.$("Sidecannon_Virus").css({opacity:0.6});sym.$("Cannon_fire_Virus").css({opacity:0.6});sym.$("Cannon_fire_Malware").css({opacity:0.6});sym.$("Cannon_fire_Intruder").css({opacity:1.0});sym.$("Enemy_Virus2").css({opacity:0.6});sym.$("Enemy_Malware2").css({opacity:0.6});sym.$("Enemy_Intruder2").css({opacity:1.0});sym.lessonSetText("Privacy settings protect your information on a website. You might want to restrict who can see your information or prevent automated webbots from extracting your information.");sym.$("LA_Text1_2").hide();sym.$("LA_Text1_2Copy").hide();sym.$("LA_Text2_2").hide();sym.$("LA_Text2_2Copy").hide();sym.$("LA_Text3_2").show();sym.$("LA_Text3_2Copy").show();break;};sym.setVariable("LockArrowClickCount",clickCount);if(clickCount>=3)
{sym.$("NextArrow").show();}};sym.playNextScene=function()
{var scene=sym.getVariable("Scene");scene+=1;sym.setVariable("Scene",scene);switch(scene)
{case 1:sym.lessonSetText("There are several ways your computer and your data can be compromised. You will review the three basics of computer safety. Click the computer to continue.");sym.play("Scene1");break;case 2:sym.lessonSetText("The three main ways to protect your computer are to use antivirus software, email filters, and privacy settings. Each method is designed to target a specific issue. Click a safety strategy to learn what it targets.");sym.play("Scene2");break;}};sym.startShooter=function()
{sym.$("ReplayButton").hide();sym.$("EndButton").hide();sym.setVariable("GameOver",0);sym.setVariable("EnemyKillCount",0);sym.setVariable("damageCount","0");sym.setVariable("currentEnemy","-1");sym.setVariable("enemyLeft","0");sym.$("AntiVirus_LA").hide();sym.$("AntiVirus_LA2").hide();sym.$("AntiVirus_LA3").hide();sym.$("Sidecannon_Intruder").hide();sym.$("Sidecannon_Malware").hide();sym.$("Sidecannon_Virus").hide();sym.$("Cannon_fire_Virus").hide();sym.$("Cannon_fire_Malware").hide();sym.$("Cannon_fire_Intruder").hide();sym.$("Enemy_Virus2").hide();sym.$("Enemy_Malware2").hide();sym.$("Enemy_Intruder2").hide();sym.$("LA_Text1_2").hide();sym.$("LA_Text1_2Copy").hide();sym.$("LA_Text2_2").hide();sym.$("LA_Text2_2Copy").hide();sym.$("LA_Text3_2").hide();sym.$("LA_Text3_2Copy").hide();sym.$("NextArrow").hide();sym.$("Intruder_Click").show();sym.$("Malware_Click").show();sym.$("Virus_Click").show();sym.$("Cannon_Intruder").show();sym.$("Cannon_Virus").show();sym.$("Cannon_Malware").show();sym.$("Cannon_mount").show();sym.$("Cannon_mount2").show();sym.$("Cannon_mount3").show();sym.$("Harddrive_0").show();sym.$("Harddrive_1").show();sym.$("Harddrive_2").show();sym.$("Harddrive_3").show();sym.lessonSetText("In this game, your computer will be attacked by different malicious programs. Your goal is to select the proper defense to prevent it from reaching your hard drive.");setTimeout(sym.spawnEnemy(),5000);}
sym.damage=function()
{var damage=sym.getVariable("damageCount");var hd="Harddrive_"+damage;sym.$(hd).hide();damage++;sym.setVariable("damageCount",damage);if(damage>=3)
{sym.setVariable("GameOver",1);sym.lessonSetText("Oh no! The programs got through your defenses. Game over!");console.log("Game over");sym.endGame();return;}
sym.spawnEnemy();};sym.fire=function(cannonID)
{var enemy=sym.getVariable("currentEnemy");var enemyType=enemy.getEnemyType();if(enemyType==cannonID)
{switch(cannonID)
{case 0:var cannon=sym.$("Cannon_Virus");var fireType="Virus";break;case 1:var cannon=sym.$("Cannon_Malware");var fireType="Malware";break;case 2:var cannon=sym.$("Cannon_Intruder");var fireType="Intruder";break;}
var enemyTop=enemy.getEnemyTop();var enemyLeft=sym.getVariable("enemyLeft");var enemyX=(enemyLeft+132)/2;var enemyY=(enemyTop+132)/2;var cannonLeft=cannon.position().left;var cannonTop=cannon.position().top;var cannonX=(cannonLeft+100)/2;var cannonY=(cannonTop+165)/2;var xTarget=enemyX-cannonX;var yTarget=enemyY-cannonY;var rads=Math.atan2(yTarget,xTarget);var new_projectile=sym.createChildSymbol("Projectile","Stage");var projectile_sym=new_projectile.getSymbolElement();projectile_sym.css({"position":"absolute","top":cannonTop,"left":cannonLeft});projectile_sym.animate({top:enemyTop+20,left:enemyLeft},200);setTimeout(function(){new_projectile.deleteSymbol()},200);var angle=(rads*(180/Math.PI))+90;cannon.css('transform','rotate('+angle+'deg)');cannon.css('-moz-transform','rotate('+angle+'deg)');cannon.css('-webkit-transform','rotate('+angle+'deg)');cannon.css('-o-transform','rotate('+angle+'deg)');var new_explosion=sym.createChildSymbol("Explosion","Stage");var explosion_sym=new_explosion.getSymbolElement();explosion_sym.css({"position":"absolute","top":enemyTop-120,"left":enemyLeft-25});new_explosion.play("Boom");enemy.destroy();enemy.deleteSymbol();var timeoutID=setTimeout(function(){new_explosion.deleteSymbol()},200);sym.setVariable("TimeoutID",timeoutID);var killCount=sym.getVariable("EnemyKillCount");killCount++;sym.setVariable("EnemyKillCount",killCount);if(killCount>=10)
{sym.lessonSetText("Congratulations! You successfully defended your computer!");sym.setVariable("GameOver",1);sym.endGame();}
var gameOver=sym.getVariable("GameOver");if(gameOver!=1)
{sym.spawnEnemy();}}};sym.spawnEnemy=function()
{var new_enemy=sym.createChildSymbol("Enemy","Stage");var enemy_sym=new_enemy.getSymbolElement();var new_left=Math.floor((Math.random()*924)+1);var enemyType=Math.floor((Math.random()*3));sym.setVariable("enemyLeft",new_left);enemy_sym.css({"position":"absolute","top":-90,"left":new_left});enemy_sym.show();new_enemy.setEnemyType(enemyType);new_enemy.descend();sym.setVariable("currentEnemy",new_enemy);};});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5328,function(sym,e){sym.play("Scene1Loop");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_LA_Rect3}","mouseenter",function(sym,e){sym.$("Arrow3_H").show();sym.$("Arrow3").hide();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_LA_Rect3}","mouseleave",function(sym,e){sym.$("Arrow3_H").hide();sym.$("Arrow3").show();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_LA_Rect2}","mouseenter",function(sym,e){sym.$("Arrow2_H").show();sym.$("Arrow2").hide();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_LA_Rect2}","mouseleave",function(sym,e){sym.$("Arrow2_H").hide();sym.$("Arrow2").show();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_LA_Rect1}","mouseenter",function(sym,e){sym.$("Arrow1_H").show();sym.$("Arrow1").hide();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_LA_Rect1}","mouseleave",function(sym,e){sym.$("Arrow1_H").hide();sym.$("Arrow1").show();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_LA_Rect1}","click",function(sym,e){sym.longArrowClicked(0);});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_LA_Rect2}","click",function(sym,e){sym.longArrowClicked(1);});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_LA_Rect3}","click",function(sym,e){sym.longArrowClicked(2);});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Intruder_Click}","click",function(sym,e){sym.fire(2);});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Malware_Click}","click",function(sym,e){sym.fire(1);});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Virus_Click}","click",function(sym,e){sym.fire(0);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",9500,function(sym,e){});
//Edge binding end
})("stage");
//Edge symbol end:'stage'

//=========================================================

//Edge symbol: 'PlayButton'
(function(symbolName){Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseenter",function(sym,e){sym.$("Button_Play").show();sym.$("Button_Play_p").hide();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseleave",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("Button_Play").hide();sym.$("Button_Play_p").show();}});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","click",function(sym,e){sym.setVariable("Clicked",1);sym.play("click");});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.setVariable("Clicked",0);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3500,function(sym,e){sym.getComposition().getStage().startGame();sym.stop();});
//Edge binding end
})("PlayButton");
//Edge symbol end:'PlayButton'

//=========================================================

//Edge symbol: 'SittingAvatar'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",6000,function(sym,e){sym.play(0);});
//Edge binding end
})("SittingAvatar");
//Edge symbol end:'SittingAvatar'

//=========================================================

//Edge symbol: 'Computer'
(function(symbolName){Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseenter",function(sym,e){sym.$("computer").hide();sym.$("computer_press").show();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseleave",function(sym,e){sym.$("computer").show();sym.$("computer_press").hide();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","click",function(sym,e){var compClicked=sym.getVariable("ComputerClicked");if(!compClicked)
{sym.setVariable("ComputerClicked",1);sym.getComposition().getStage().playNextScene();}});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.setVariable("ComputerClicked",0);});
//Edge binding end
})("Computer");
//Edge symbol end:'Computer'

//=========================================================

//=========================================================

//Edge symbol: 'HardDrive'
(function(symbolName){})("HardDrive");
//Edge symbol end:'HardDrive'

//=========================================================

//Edge symbol: 'Projectile'
(function(symbolName){})("Projectile");
//Edge symbol end:'Projectile'

//=========================================================

//Edge symbol: 'Explosion'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",250,function(sym,e){sym.play(0);});
//Edge binding end
})("Explosion");
//Edge symbol end:'Explosion'

//=========================================================

//Edge symbol: 'Intruder'
(function(symbolName){Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.setVariable("enemyType","0");sym.setVariable("enemyState","0");sym.setVariable("currentEnemy","Enemy_Virus");sym.setVariable("timeout","0");sym.getState=function(){return sym.getVariable("enemyState");};sym.setState=function(state){sym.setVariable("enemyState",state);};sym.getCurrentEnemy=function(){return sym.getVariable("currentEnemy");};sym.setCurrentEnemy=function(enemy){sym.setVariable("currentEnemy",enemy);};sym.descend=function()
{var currentEnemy=sym.getCurrentEnemy();sym.$(currentEnemy).animate({'top':'1000'},20000);setTimeout(function(){sym.checkPosition()},100);};sym.getEnemyTop=function()
{var currentEnemy=sym.getCurrentEnemy();var top=sym.$(currentEnemy).position().top;return top;};sym.checkPosition=function()
{var currentEnemy=sym.getCurrentEnemy();var position=sym.$(currentEnemy).position().top;if(position>=500)
{sym.destroy();sym.getComposition().getStage().damage();}
else
{var timeOutId=setTimeout(function(){sym.checkPosition()},100);sym.setVariable("timeout",timeOutId);}};sym.getEnemyType=function(){return sym.getVariable("enemyType");};sym.setEnemyType=function(type)
{sym.setVariable("enemyType",type);switch(type)
{case 0:sym.setVariable("currentEnemy","Enemy_Virus");sym.$("Enemy_Virus").show();sym.$("Enemy_Malware").hide();sym.$("Enemy_Intruder").hide();break;case 1:sym.setVariable("currentEnemy","Enemy_Malware");sym.$("Enemy_Virus").hide();sym.$("Enemy_Malware").show();sym.$("Enemy_Intruder").hide();break;case 2:sym.setVariable("currentEnemy","Enemy_Intruder");sym.$("Enemy_Virus").hide();sym.$("Enemy_Malware").hide();sym.$("Enemy_Intruder").show();}};sym.destroy=function()
{var timeOutId=sym.getVariable("timeout");clearInterval(timeOutId);sym.setState(2);sym.$("Enemy_Virus").hide();sym.$("Enemy_Malware").hide();sym.$("Enemy_Intruder").hide();};});
//Edge binding end
})("Enemy");
//Edge symbol end:'Enemy'

//=========================================================

//=========================================================

//=========================================================

//Edge symbol: 'NextArrow'
(function(symbolName){Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.setVariable("ArrowClicked",0);sym.$("Arrow_Next_p").hide();sym.$("Arrow_Next").show();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","click",function(sym,e){sym.setVariable("ArrowClicked",1);sym.play("Clicked");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseleave",function(sym,e){if(!sym.getVariable("ArrowClicked"))
{sym.$("Arrow_Next_p").hide();sym.$("Arrow_Next").show();}});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseenter",function(sym,e){sym.$("Arrow_Next_p").show();sym.$("Arrow_Next").hide();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3500,function(sym,e){sym.getComposition().getStage().startShooter();});
//Edge binding end
})("NextArrow");
//Edge symbol end:'NextArrow'

//=========================================================

//Edge symbol: 'RedoButton'
(function(symbolName){Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","click",function(sym,e){sym.setVariable("Clicked",1);sym.play("click");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseenter",function(sym,e){sym.$("Button_Redo").show();sym.$("Button_Redo_p").hide();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseleave",function(sym,e){sym.$("Button_Redo").hide();sym.$("Button_Redo_p").show();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.setVariable("Clicked",0);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3500,function(sym,e){sym.getComposition().getStage().startShooter();});
//Edge binding end
})("RedoButton");
//Edge symbol end:'RedoButton'

//=========================================================

//Edge symbol: 'NextArrow_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3500,function(sym,e){sym.getComposition().getStage().endAll();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.setVariable("ArrowClicked",0);sym.$("Arrow_Next_p").hide();sym.$("Arrow_Next").show();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","click",function(sym,e){sym.setVariable("ArrowClicked",1);sym.play("Clicked");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseleave",function(sym,e){if(!sym.getVariable("ArrowClicked"))
{sym.$("Arrow_Next_p").hide();sym.$("Arrow_Next").show();}});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseenter",function(sym,e){sym.$("Arrow_Next_p").show();sym.$("Arrow_Next").hide();});
//Edge binding end
})("EndArrow");
//Edge symbol end:'EndArrow'
})(jQuery,AdobeEdge,"EDGE-136904080");
// SIG // Begin signature block
// SIG // MIIauwYJKoZIhvcNAQcCoIIarDCCGqgCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFLSneZx9zCbA
// SIG // 5fre7+7zSyyK2LczoIIVgjCCBMMwggOroAMCAQICEzMA
// SIG // AAA0JDFAyaDBeY0AAAAAADQwDQYJKoZIhvcNAQEFBQAw
// SIG // dzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBMB4XDTEzMDMyNzIw
// SIG // MDgyNVoXDTE0MDYyNzIwMDgyNVowgbMxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xDTALBgNVBAsTBE1PUFIxJzAlBgNVBAsT
// SIG // Hm5DaXBoZXIgRFNFIEVTTjpCOEVDLTMwQTQtNzE0NDEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBAOUaB60KlizUtjRkyzQg8rwEWIKLtQncUtRwn+Jc
// SIG // LOf1aqT1ti6xgYZZAexJbCkEHvU4i1cY9cAyDe00kOzG
// SIG // ReW7igolqu+he4fY8XBnSs1q3OavBZE97QVw60HPq7El
// SIG // ZrurorcY+XgTeHXNizNcfe1nxO0D/SisWGDBe72AjTOT
// SIG // YWIIsY9REmWPQX7E1SXpLWZB00M0+peB+PyHoe05Uh/4
// SIG // 6T7/XoDJBjYH29u5asc3z4a1GktK1CXyx8iNr2FnitpT
// SIG // L/NMHoMsY8qgEFIRuoFYc0KE4zSy7uqTvkyC0H2WC09/
// SIG // L88QXRpFZqsC8V8kAEbBwVXSg3JCIoY6pL6TUAECAwEA
// SIG // AaOCAQkwggEFMB0GA1UdDgQWBBRfS0LeDLk4oNRmNo1W
// SIG // +3RZSWaBKzAfBgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7
// SIG // syuwwzWzDzBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9NaWNyb3NvZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsG
// SIG // AQUFBwEBBEwwSjBIBggrBgEFBQcwAoY8aHR0cDovL3d3
// SIG // dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBBQUAA4IBAQAPQlCg1R6t
// SIG // Fz8fCqYrN4pnWC2xME8778JXaexl00zFUHLycyX25IQC
// SIG // xXUccVhDq/HJqo7fym9YPInnL816Nexm19Veuo6fV4aU
// SIG // EKDrUTetV/YneyNPGdjgbXYEJTBhEq2ljqMmtkjlU/JF
// SIG // TsW4iScQnanjzyPpeWyuk2g6GvMTxBS2ejqeQdqZVp7Q
// SIG // 0+AWlpByTK8B9yQG+xkrmLJVzHqf6JI6azF7gPMOnleL
// SIG // t+YFtjklmpeCKTaLOK6uixqs7ufsLr9LLqUHNYHzEyDq
// SIG // tEqTnr+cg1Z/rRUvXClxC5RnOPwwv2Xn9Tne6iLth4yr
// SIG // sju1AcKt4PyOJRUMIr6fDO0dMIIE7DCCA9SgAwIBAgIT
// SIG // MwAAALARrwqL0Duf3QABAAAAsDANBgkqhkiG9w0BAQUF
// SIG // ADB5MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSMwIQYDVQQDExpN
// SIG // aWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQTAeFw0xMzAx
// SIG // MjQyMjMzMzlaFw0xNDA0MjQyMjMzMzlaMIGDMQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMQ0wCwYDVQQLEwRNT1BSMR4wHAYD
// SIG // VQQDExVNaWNyb3NvZnQgQ29ycG9yYXRpb24wggEiMA0G
// SIG // CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDor1yiIA34
// SIG // KHy8BXt/re7rdqwoUz8620B9s44z5lc/pVEVNFSlz7SL
// SIG // qT+oN+EtUO01Fk7vTXrbE3aIsCzwWVyp6+HXKXXkG4Un
// SIG // m/P4LZ5BNisLQPu+O7q5XHWTFlJLyjPFN7Dz636o9UEV
// SIG // XAhlHSE38Cy6IgsQsRCddyKFhHxPuRuQsPWj/ov0DJpO
// SIG // oPXJCiHiquMBNkf9L4JqgQP1qTXclFed+0vUDoLbOI8S
// SIG // /uPWenSIZOFixCUuKq6dGB8OHrbCryS0DlC83hyTXEmm
// SIG // ebW22875cHsoAYS4KinPv6kFBeHgD3FN/a1cI4Mp68fF
// SIG // SsjoJ4TTfsZDC5UABbFPZXHFAgMBAAGjggFgMIIBXDAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDAzAdBgNVHQ4EFgQUWXGm
// SIG // WjNN2pgHgP+EHr6H+XIyQfIwUQYDVR0RBEowSKRGMEQx
// SIG // DTALBgNVBAsTBE1PUFIxMzAxBgNVBAUTKjMxNTk1KzRm
// SIG // YWYwYjcxLWFkMzctNGFhMy1hNjcxLTc2YmMwNTIzNDRh
// SIG // ZDAfBgNVHSMEGDAWgBTLEejK0rQWWAHJNy4zFha5TJoK
// SIG // HzBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWND
// SIG // b2RTaWdQQ0FfMDgtMzEtMjAxMC5jcmwwWgYIKwYBBQUH
// SIG // AQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY0NvZFNpZ1BD
// SIG // QV8wOC0zMS0yMDEwLmNydDANBgkqhkiG9w0BAQUFAAOC
// SIG // AQEAMdduKhJXM4HVncbr+TrURE0Inu5e32pbt3nPApy8
// SIG // dmiekKGcC8N/oozxTbqVOfsN4OGb9F0kDxuNiBU6fNut
// SIG // zrPJbLo5LEV9JBFUJjANDf9H6gMH5eRmXSx7nR2pEPoc
// SIG // sHTyT2lrnqkkhNrtlqDfc6TvahqsS2Ke8XzAFH9IzU2y
// SIG // RPnwPJNtQtjofOYXoJtoaAko+QKX7xEDumdSrcHps3Om
// SIG // 0mPNSuI+5PNO/f+h4LsCEztdIN5VP6OukEAxOHUoXgSp
// SIG // Rm3m9Xp5QL0fzehF1a7iXT71dcfmZmNgzNWahIeNJDD3
// SIG // 7zTQYx2xQmdKDku/Og7vtpU6pzjkJZIIpohmgjCCBbww
// SIG // ggOkoAMCAQICCmEzJhoAAAAAADEwDQYJKoZIhvcNAQEF
// SIG // BQAwXzETMBEGCgmSJomT8ixkARkWA2NvbTEZMBcGCgmS
// SIG // JomT8ixkARkWCW1pY3Jvc29mdDEtMCsGA1UEAxMkTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // MB4XDTEwMDgzMTIyMTkzMloXDTIwMDgzMTIyMjkzMlow
// SIG // eTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWlj
// SIG // cm9zb2Z0IENvZGUgU2lnbmluZyBQQ0EwggEiMA0GCSqG
// SIG // SIb3DQEBAQUAA4IBDwAwggEKAoIBAQCycllcGTBkvx2a
// SIG // YCAgQpl2U2w+G9ZvzMvx6mv+lxYQ4N86dIMaty+gMuz/
// SIG // 3sJCTiPVcgDbNVcKicquIEn08GisTUuNpb15S3GbRwfa
// SIG // /SXfnXWIz6pzRH/XgdvzvfI2pMlcRdyvrT3gKGiXGqel
// SIG // cnNW8ReU5P01lHKg1nZfHndFg4U4FtBzWwW6Z1KNpbJp
// SIG // L9oZC/6SdCnidi9U3RQwWfjSjWL9y8lfRjFQuScT5EAw
// SIG // z3IpECgixzdOPaAyPZDNoTgGhVxOVoIoKgUyt0vXT2Pn
// SIG // 0i1i8UU956wIAPZGoZ7RW4wmU+h6qkryRs83PDietHdc
// SIG // pReejcsRj1Y8wawJXwPTAgMBAAGjggFeMIIBWjAPBgNV
// SIG // HRMBAf8EBTADAQH/MB0GA1UdDgQWBBTLEejK0rQWWAHJ
// SIG // Ny4zFha5TJoKHzALBgNVHQ8EBAMCAYYwEgYJKwYBBAGC
// SIG // NxUBBAUCAwEAATAjBgkrBgEEAYI3FQIEFgQU/dExTtMm
// SIG // ipXhmGA7qDFvpjy82C0wGQYJKwYBBAGCNxQCBAweCgBT
// SIG // AHUAYgBDAEEwHwYDVR0jBBgwFoAUDqyCYEBWJ5flJRP8
// SIG // KuEKU5VZ5KQwUAYDVR0fBEkwRzBFoEOgQYY/aHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvbWljcm9zb2Z0cm9vdGNlcnQuY3JsMFQGCCsGAQUF
// SIG // BwEBBEgwRjBEBggrBgEFBQcwAoY4aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3NvZnRS
// SIG // b290Q2VydC5jcnQwDQYJKoZIhvcNAQEFBQADggIBAFk5
// SIG // Pn8mRq/rb0CxMrVq6w4vbqhJ9+tfde1MOy3XQ60L/svp
// SIG // LTGjI8x8UJiAIV2sPS9MuqKoVpzjcLu4tPh5tUly9z7q
// SIG // QX/K4QwXaculnCAt+gtQxFbNLeNK0rxw56gNogOlVuC4
// SIG // iktX8pVCnPHz7+7jhh80PLhWmvBTI4UqpIIck+KUBx3y
// SIG // 4k74jKHK6BOlkU7IG9KPcpUqcW2bGvgc8FPWZ8wi/1wd
// SIG // zaKMvSeyeWNWRKJRzfnpo1hW3ZsCRUQvX/TartSCMm78
// SIG // pJUT5Otp56miLL7IKxAOZY6Z2/Wi+hImCWU4lPF6H0q7
// SIG // 0eFW6NB4lhhcyTUWX92THUmOLb6tNEQc7hAVGgBd3TVb
// SIG // Ic6YxwnuhQ6MT20OE049fClInHLR82zKwexwo1eSV32U
// SIG // jaAbSANa98+jZwp0pTbtLS8XyOZyNxL0b7E8Z4L5UrKN
// SIG // MxZlHg6K3RDeZPRvzkbU0xfpecQEtNP7LN8fip6sCvsT
// SIG // J0Ct5PnhqX9GuwdgR2VgQE6wQuxO7bN2edgKNAltHIAx
// SIG // H+IOVN3lofvlRxCtZJj/UBYufL8FIXrilUEnacOTj5XJ
// SIG // jdibIa4NXJzwoq6GaIMMai27dmsAHZat8hZ79haDJLmI
// SIG // z2qoRzEvmtzjcT3XAH5iR9HOiMm4GPoOco3Boz2vAkBq
// SIG // /2mbluIQqBC0N1AI1sM9MIIGBzCCA++gAwIBAgIKYRZo
// SIG // NAAAAAAAHDANBgkqhkiG9w0BAQUFADBfMRMwEQYKCZIm
// SIG // iZPyLGQBGRYDY29tMRkwFwYKCZImiZPyLGQBGRYJbWlj
// SIG // cm9zb2Z0MS0wKwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBD
// SIG // ZXJ0aWZpY2F0ZSBBdXRob3JpdHkwHhcNMDcwNDAzMTI1
// SIG // MzA5WhcNMjEwNDAzMTMwMzA5WjB3MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
// SIG // ggEKAoIBAQCfoWyx39tIkip8ay4Z4b3i48WZUSNQrc7d
// SIG // GE4kD+7Rp9FMrXQwIBHrB9VUlRVJlBtCkq6YXDAm2gBr
// SIG // 6Hu97IkHD/cOBJjwicwfyzMkh53y9GccLPx754gd6udO
// SIG // o6HBI1PKjfpFzwnQXq/QsEIEovmmbJNn1yjcRlOwhtDl
// SIG // KEYuJ6yGT1VSDOQDLPtqkJAwbofzWTCd+n7Wl7PoIZd+
// SIG // +NIT8wi3U21StEWQn0gASkdmEScpZqiX5NMGgUqi+YSn
// SIG // EUcUCYKfhO1VeP4Bmh1QCIUAEDBG7bfeI0a7xC1Un68e
// SIG // eEExd8yb3zuDk6FhArUdDbH895uyAc4iS1T/+QXDwiAL
// SIG // AgMBAAGjggGrMIIBpzAPBgNVHRMBAf8EBTADAQH/MB0G
// SIG // A1UdDgQWBBQjNPjZUkZwCu1A+3b7syuwwzWzDzALBgNV
// SIG // HQ8EBAMCAYYwEAYJKwYBBAGCNxUBBAMCAQAwgZgGA1Ud
// SIG // IwSBkDCBjYAUDqyCYEBWJ5flJRP8KuEKU5VZ5KShY6Rh
// SIG // MF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAXBgoJkiaJ
// SIG // k/IsZAEZFgltaWNyb3NvZnQxLTArBgNVBAMTJE1pY3Jv
// SIG // c29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eYIQ
// SIG // ea0WoUqgpa1Mc1j0BxMuZTBQBgNVHR8ESTBHMEWgQ6BB
// SIG // hj9odHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2Ny
// SIG // bC9wcm9kdWN0cy9taWNyb3NvZnRyb290Y2VydC5jcmww
// SIG // VAYIKwYBBQUHAQEESDBGMEQGCCsGAQUFBzAChjhodHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01p
// SIG // Y3Jvc29mdFJvb3RDZXJ0LmNydDATBgNVHSUEDDAKBggr
// SIG // BgEFBQcDCDANBgkqhkiG9w0BAQUFAAOCAgEAEJeKw1wD
// SIG // RDbd6bStd9vOeVFNAbEudHFbbQwTq86+e4+4LtQSooxt
// SIG // YrhXAstOIBNQmd16QOJXu69YmhzhHQGGrLt48ovQ7DsB
// SIG // 7uK+jwoFyI1I4vBTFd1Pq5Lk541q1YDB5pTyBi+FA+mR
// SIG // KiQicPv2/OR4mS4N9wficLwYTp2OawpylbihOZxnLcVR
// SIG // DupiXD8WmIsgP+IHGjL5zDFKdjE9K3ILyOpwPf+FChPf
// SIG // wgphjvDXuBfrTot/xTUrXqO/67x9C0J71FNyIe4wyrt4
// SIG // ZVxbARcKFA7S2hSY9Ty5ZlizLS/n+YWGzFFW6J1wlGys
// SIG // OUzU9nm/qhh6YinvopspNAZ3GmLJPR5tH4LwC8csu89D
// SIG // s+X57H2146SodDW4TsVxIxImdgs8UoxxWkZDFLyzs7BN
// SIG // Z8ifQv+AeSGAnhUwZuhCEl4ayJ4iIdBD6Svpu/RIzCzU
// SIG // 2DKATCYqSCRfWupW76bemZ3KOm+9gSd0BhHudiG/m4LB
// SIG // J1S2sWo9iaF2YbRuoROmv6pH8BJv/YoybLL+31HIjCPJ
// SIG // Zr2dHYcSZAI9La9Zj7jkIeW1sMpjtHhUBdRBLlCslLCl
// SIG // eKuzoJZ1GtmShxN1Ii8yqAhuoFuMJb+g74TKIdbrHk/J
// SIG // mu5J4PcBZW+JC33Iacjmbuqnl84xKf8OxVtc2E0bodj6
// SIG // L54/LlUWa8kTo/0xggSlMIIEoQIBATCBkDB5MQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMSMwIQYDVQQDExpNaWNyb3NvZnQg
// SIG // Q29kZSBTaWduaW5nIFBDQQITMwAAALARrwqL0Duf3QAB
// SIG // AAAAsDAJBgUrDgMCGgUAoIG+MBkGCSqGSIb3DQEJAzEM
// SIG // BgorBgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgor
// SIG // BgEEAYI3AgEVMCMGCSqGSIb3DQEJBDEWBBQQgGi7+b7T
// SIG // AbGmZtParW+ErhNaiTBeBgorBgEEAYI3AgEMMVAwTqAm
// SIG // gCQATQBpAGMAcgBvAHMAbwBmAHQAIABMAGUAYQByAG4A
// SIG // aQBuAGehJIAiaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L2xlYXJuaW5nIDANBgkqhkiG9w0BAQEFAASCAQDEsNXS
// SIG // 4icIsxhJjoFOmEvZpDfpStBV+ddzWoQb3fAkqhU68EhD
// SIG // DcgqVAhRpLFJm1em4bnJvTFEwCj4MstxHmkOYIS7h5Ip
// SIG // wXJeLyvKvCV8mkAg7KI7UnFwe6YxfyEXT8VFBhNmhFPa
// SIG // z2+zaJgD79mIr3vGR+xp9n07SWsAc5A58iKqmtvqB1PQ
// SIG // wX5HnVcNlA2o6Z33eIGi/nG6RYHmRAlnZwZQTjT0PctY
// SIG // mMP9MHO6K0gL+TRjITNyzhNBKGtMjxCQ09esCjJ6+TGQ
// SIG // ZIwtfodGAu/xG3krqBfCGznfZMVqQ1D/h28KsNgqbDFE
// SIG // 9gxPssmpLy3kU/I1P+FKBXKNJgGjoYICKDCCAiQGCSqG
// SIG // SIb3DQEJBjGCAhUwggIRAgEBMIGOMHcxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFBDQQITMwAAADQkMUDJoMF5jQAAAAAANDAJ
// SIG // BgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3
// SIG // DQEHATAcBgkqhkiG9w0BCQUxDxcNMTQwNDA4MjMxNTM2
// SIG // WjAjBgkqhkiG9w0BCQQxFgQUMCOlkplyiGQMoPa9KkoO
// SIG // hPiv8J8wDQYJKoZIhvcNAQEFBQAEggEA3O5CZImcUU5w
// SIG // LnJNwQ9fS45oXI+R0sdTFmF9VT/xcOS5MMsTKfOP+qUl
// SIG // e783KHMrA6b0b7cItakL790gX+dDb0dE6l8as52P/j8P
// SIG // xAj6p860DiASNVTDcfpoWDcLzKSkx3oq2NfnoY/+lgkL
// SIG // /Jj3Spj15hYs40QvaR4vQWmWj27o2NzWKoVhc9dbrGXv
// SIG // qosIaDNEWxXW2gw6hcOMc9wlByAJ3E4SZDFEWCEt108j
// SIG // is7/pue0bn2nqLdEyN52OWjIKFbb9FCDHk7SQl7Y82Lu
// SIG // C9pLCxwc4qxjuIgMxSjx9NbUglqz0SZdu6AXmfhzPzWR
// SIG // MMEIS9dIrdMd1e/j+7ZfrQ==
// SIG // End signature block
