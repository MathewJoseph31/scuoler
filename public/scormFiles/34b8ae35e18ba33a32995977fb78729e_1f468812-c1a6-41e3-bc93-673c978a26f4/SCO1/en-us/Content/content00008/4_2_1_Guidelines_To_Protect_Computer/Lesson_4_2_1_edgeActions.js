
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.lessonPlayButton=function(){sym.play("StartGame");};sym.lessonBeginGame=function(){sym.setVariable("Slide",0);};sym.lessonNextSlide=function(){var slide=sym.getVariable("Slide");slide+=1;sym.setVariable("Slide",slide);switch(slide)
{case 1:sym.play("Slide01");break;case 2:sym.play("Slide02");break;case 3:sym.play("Slide03");break;case 4:sym.play("Slide04");break;case 5:sym.play("Slide05");break;case 6:sym.play("Slide06");break;case 7:sym.play("Slide07");break;case 8:sym.play("Slide08");break;case 9:sym.play("Slide09");break;case 10:sym.play("Slide10");break;case 11:sym.play("Slide11");break;case 12:sym.play("Slide12");break;case 13:sym.play("Slide13");break;case 14:sym.play("Slide14");break;case 15:sym.play("Slide15");break;case 16:sym.play("Slide16");break;case 17:sym.play("Slide17");break;case 18:sym.play("Slide18");break;case 19:sym.play("Slide19");break;}};sym.lessonSetText=function(text){sym.$("BottomText").html(text);};sym.lessonAvatarLookNormal=function(){sym.getSymbol("AvatarSitting").lookNormal();};sym.lessonAvatarLookSide=function(){sym.getSymbol("AvatarSitting").lookSide();};});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.getComposition().getStage().lessonBeginGame();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.stop();sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3250,function(sym,e){sym.play("Slide01");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3750,function(sym,e){sym.play("Slide02");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4250,function(sym,e){sym.play("Slide03");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4750,function(sym,e){sym.play("Slide04");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5250,function(sym,e){sym.play("Slide05");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5750,function(sym,e){sym.play("Slide06");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",6250,function(sym,e){sym.play("Slide07");});
//Edge binding end
})("stage");
//Edge symbol end:'stage'

//=========================================================

//=========================================================

//=========================================================

//=========================================================

//Edge symbol: 'StartScreen'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){var element=sym.$("StartText").html("Guidelines for Securing Your Computer");});
//Edge binding end
})("StartScreen");
//Edge symbol end:'StartScreen'

//=========================================================

//=========================================================

//Edge symbol: 'StartButton'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.$("PlayButton").play();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
})("StartButton");
//Edge symbol end:'StartButton'

//=========================================================

//=========================================================

//Edge symbol: 'PlayButton'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.setVariable("Clicked",0);sym.$("PlayButton_p").hide();sym.$("PlayButton").show();sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","click",function(sym,e){sym.setVariable("Clicked",1);sym.play("Click");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseleave",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("PlayButton_p").hide();sym.$("PlayButton").show();}});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle}","mouseenter",function(sym,e){sym.$("PlayButton_p").show();sym.$("PlayButton").hide();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3500,function(sym,e){sym.getComposition().getStage().lessonPlayButton();sym.stop();});
//Edge binding end
})("PlayButton");
//Edge symbol end:'PlayButton'

//=========================================================

//Edge symbol: 'AvatarSmile'
(function(symbolName){})("AvatarSmile");
//Edge symbol end:'AvatarSmile'

//=========================================================

//=========================================================

//Edge symbol: 'AvatarOlderAsianFemaleSittingBlink_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",6889,function(sym,e){sym.play("Loop");});
//Edge binding end
})("AvatarBlink");
//Edge symbol end:'AvatarBlink'

//=========================================================

//Edge symbol: 'Slide01'
(function(symbolName){Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("An unsecured computer is an invitation to trouble. Let's look at some steps you should take to keep your computer safe from ill intent and harm.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4750,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",6000,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
})("Slide01");
//Edge symbol end:'Slide01'

//=========================================================

//=========================================================

//=========================================================

//Edge symbol: 'NextQuestion'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle3}","mouseenter",function(sym,e){sym.$("Arrow_Next_p").show();sym.$("Arrow_Next").hide();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle3}","mouseleave",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("Arrow_Next_p").hide();sym.$("Arrow_Next").show();}});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.setVariable("Clicked",0);sym.$("Arrow_Next_p").hide();sym.$("Arrow_Next").show();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.setVariable("Clicked",0);sym.$("Arrow_Next_p").hide();sym.$("Arrow_Next").show();sym.play("Loop");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle3}","click",function(sym,e){sym.setVariable("Clicked",1);sym.play("Click");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3500,function(sym,e){sym.getParentSymbol().slideExit();sym.stop();});
//Edge binding end
})("NextQuestion");
//Edge symbol end:'NextQuestion'

//=========================================================

//Edge symbol: 'EvilDude'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
})("EvilDude");
//Edge symbol end:'EvilDude'

//=========================================================

//Edge symbol: 'EvilAvatar'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2652,function(sym,e){sym.play("Loop");});
//Edge binding end
})("EvilAvatar");
//Edge symbol end:'EvilAvatar'

//=========================================================

//Edge symbol: 'AvatarSmile_1'
(function(symbolName){})("AvatarFrown");
//Edge symbol end:'AvatarFrown'

//=========================================================

//Edge symbol: 'Slide01_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("So how did your wall come out? If there are any gaps you may want to review this tutorial again. Remember to always protect your computer and data from strangers, viruses and user error with the simple and smart steps you've learned here.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1750,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3000,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide08");
//Edge symbol end:'Slide08'

//=========================================================

//Edge symbol: 'Slide02_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("An unsecured computer is an invitation to trouble. Let's look at some steps you should take to keep your computer safe from itt intent and harm.");});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("AvatarBackground");
//Edge symbol end:'AvatarBackground'

//=========================================================

//Edge symbol: 'Question01'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.getParentSymbol().questionCorrect();sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2000,function(sym,e){sym.getParentSymbol().questionWrong();sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3000,function(sym,e){sym.getParentSymbol().questionWrong();sym.stop();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.answerSelected1=function(){sym.play("Answer1");};sym.answerSelected2=function(){sym.play("Answer2");};sym.answerSelected3=function(){sym.play("Answer3");};});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getSymbol("AnswerBox1").$("TextBox").html("A. A stranger");sym.getSymbol("AnswerBox2").$("TextBox").html("B. Your dog");sym.getSymbol("AnswerBox3").$("TextBox").html("C. Your spouse");});
//Edge binding end
})("Question01");
//Edge symbol end:'Question01'

//=========================================================

//Edge symbol: 'AnswerBox1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.setVariable("Clicked",0);sym.$("AnswerBox_hover").hide();sym.$("AnswerBox_press").hide();sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","click",function(sym,e){sym.setVariable("Clicked",1);sym.play("Click");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","mouseleave",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("AnswerBox_hover").hide();}});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","mouseenter",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("AnswerBox_hover").show();}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2250,function(sym,e){sym.getParentSymbol().answerSelected1();sym.stop();});
//Edge binding end
})("AnswerBox1");
//Edge symbol end:'AnswerBox1'

//=========================================================

//Edge symbol: 'AnswerBox1_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.setVariable("Clicked",0);sym.$("AnswerBox_hover").hide();sym.$("AnswerBox_press").hide();sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2250,function(sym,e){sym.getParentSymbol().answerSelected2();sym.stop();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","click",function(sym,e){sym.setVariable("Clicked",1);sym.play("Click");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","mouseleave",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("AnswerBox_hover").hide();}});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","mouseenter",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("AnswerBox_hover").show();}});
//Edge binding end
})("AnswerBox2");
//Edge symbol end:'AnswerBox2'

//=========================================================

//Edge symbol: 'AnswerBox2_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.setVariable("Clicked",0);sym.$("AnswerBox_hover").hide();sym.$("AnswerBox_press").hide();sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2250,function(sym,e){sym.getParentSymbol().answerSelected3();sym.stop();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","click",function(sym,e){sym.setVariable("Clicked",1);sym.play("Click");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","mouseleave",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("AnswerBox_hover").hide();}});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","mouseenter",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("AnswerBox_hover").show();}});
//Edge binding end
})("AnswerBox3");
//Edge symbol end:'AnswerBox3'

//=========================================================

//Edge symbol: 'Slide02_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("One way to keep your data safe from others who may have contact with your computer is to create user accounts authorizing only those you choose the privilege of unrestricted access.");sym.$("WallBlockGroup").hide();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",9250,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",10500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};sym.questionCorrect=function(){sym.play("AnswerCorrect");};sym.questionWrong=function(){sym.play("AnswerWrong");};});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3250,function(sym,e){sym.play("WaitForAnswer");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7500,function(sym,e){sym.play("NextSlide");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5500,function(sym,e){sym.$("RectangleLeft").hide();sym.$("RectangleLeftTop").hide();sym.play("NextSlide");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",8000,function(sym,e){sym.getComposition().getStage().lessonSetText("You can grant access to any number of people and set various levels of that access. This allows you to set different restrictions depending on the individual, for example, a child.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7000,function(sym,e){sym.$("WallBlockGroup").hide();sym.$("WallBlockGroup").css("display:none");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4000,function(sym,e){sym.$("WallBlockGroup").show();});
//Edge binding end
})("Slide03");
//Edge symbol end:'Slide03'

//=========================================================

//Edge symbol: 'Slide03_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("You can set up a username and password to add security to your computer. In an office environment each employee would have their own unique username and password.");sym.$("WallBlockGroup").hide();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3250,function(sym,e){sym.play("WaitForAnswer");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4000,function(sym,e){sym.$("WallBlockGroup").show();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5500,function(sym,e){sym.$("RectangleLeft").hide();sym.$("RectangleLeftTop").hide();sym.play("NextSlide");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7000,function(sym,e){sym.$("WallBlockGroup").hide();sym.$("WallBlockGroup").css("display:none");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7500,function(sym,e){sym.play("NextSlide");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",8000,function(sym,e){sym.getComposition().getStage().lessonSetText("Although it is typically okay if someone knows your user name, you want to keep your password a secret. Choose a password that is difficult to guess and includes letters and numbers.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",9250,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",10500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};sym.questionCorrect=function(){sym.play("AnswerCorrect");};sym.questionWrong=function(){sym.play("AnswerWrong");};});
//Edge binding end
})("Slide04");
//Edge symbol end:'Slide04'

//=========================================================

//Edge symbol: 'Question01_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getSymbol("AnswerBox1").$("TextBox").html("PASSWORD");sym.getSymbol("AnswerBox2").$("TextBox").html("Mydogspot");sym.getSymbol("AnswerBox3").$("TextBox").html("S1ng1ng1nth3Rain");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.getParentSymbol().questionWrong();sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2000,function(sym,e){sym.getParentSymbol().questionWrong();sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3000,function(sym,e){sym.getParentSymbol().questionCorrect();sym.stop();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.answerSelected1=function(){sym.play("Answer1");};sym.answerSelected2=function(){sym.play("Answer2");};sym.answerSelected3=function(){sym.play("Answer3");};});
//Edge binding end
})("Question02");
//Edge symbol end:'Question02'

//=========================================================

//Edge symbol: 'Slide04_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("If you need to leave your computer unattended, lock the computer to prevent unwanted access and to hide your screen from prying eyes. Only individuals who have the correct user name and password can unlock it.");sym.$("WallBlockGroup").hide();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3250,function(sym,e){sym.play("WaitForAnswer");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4000,function(sym,e){sym.$("WallBlockGroup").show();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5500,function(sym,e){sym.$("RectangleLeft").hide();sym.$("RectangleLeftTop").hide();sym.play("NextSlide");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7000,function(sym,e){sym.$("WallBlockGroup").hide();sym.$("WallBlockGroup").css("display:none");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7500,function(sym,e){sym.play("NextSlide");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",8000,function(sym,e){});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",9250,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",10500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};sym.questionCorrect=function(){sym.play("AnswerCorrect");};sym.questionWrong=function(){sym.play("AnswerWrong");};});
//Edge binding end
})("Slide05");
//Edge symbol end:'Slide05'

//=========================================================

//Edge symbol: 'Question02_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getSymbol("AnswerBox1").$("TextBox").html("When writing an email");sym.getSymbol("AnswerBox2").$("TextBox").html("When you leave your desk");sym.getSymbol("AnswerBox3").$("TextBox").html("When stretching in your chair");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.getParentSymbol().questionWrong();sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2000,function(sym,e){sym.getParentSymbol().questionCorrect();sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3000,function(sym,e){sym.getParentSymbol().questionWrong();sym.stop();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.answerSelected1=function(){sym.play("Answer1");};sym.answerSelected2=function(){sym.play("Answer2");};sym.answerSelected3=function(){sym.play("Answer3");};});
//Edge binding end
})("Question03");
//Edge symbol end:'Question03'

//=========================================================

//Edge symbol: 'Slide05_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("You must also protect your computer from dangerous viruses and spyware that can be picked up from the internet. Some of the nastier ones can do considerable harm. To prevent this from happening, install antivirus and antispyware software into your computer.");sym.$("WallBlockGroup").hide();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3250,function(sym,e){sym.play("WaitForAnswer");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4000,function(sym,e){sym.$("WallBlockGroup").show();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5500,function(sym,e){sym.$("RectangleLeft").hide();sym.$("RectangleLeftTop").hide();sym.play("NextSlide");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7000,function(sym,e){sym.$("WallBlockGroup").hide();sym.$("WallBlockGroup").css("display:none");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7500,function(sym,e){sym.play("NextSlide");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",8000,function(sym,e){sym.getComposition().getStage().lessonSetText("You can also create a barrier against harmful content with a firewall. Windows Firewall is a tool you can easily set up through Windows and includes a built-in antispyware program as well.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",9250,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",10500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};sym.questionCorrect=function(){sym.play("AnswerCorrect");};sym.questionWrong=function(){sym.play("AnswerWrong");};});
//Edge binding end
})("Slide06");
//Edge symbol end:'Slide06'

//=========================================================

//Edge symbol: 'Question03_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getSymbol("AnswerBox1").$("TextBox").html("Guard dog and disinfectant");sym.getSymbol("AnswerBox2").$("TextBox").html("Firewall and a bullwhip");sym.getSymbol("AnswerBox3").$("TextBox").html("Firewall and antivirus software");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.getParentSymbol().questionWrong();sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2000,function(sym,e){sym.getParentSymbol().questionWrong();sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3000,function(sym,e){sym.getParentSymbol().questionCorrect();sym.stop();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.answerSelected1=function(){sym.play("Answer1");};sym.answerSelected2=function(){sym.play("Answer2");};sym.answerSelected3=function(){sym.play("Answer3");};});
//Edge binding end
})("Question04");
//Edge symbol end:'Question04'

//=========================================================

//Edge symbol: 'Slide06_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Data encryption allows you to make your data unreadable unless you authorize otherwise. It converts readable data into an unreadable code until it is \"decrypted\". This prevents data from being visible or copied if your computer is stolen or lost.");sym.$("WallBlockGroup").hide();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3250,function(sym,e){sym.play("WaitForAnswer");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4000,function(sym,e){sym.$("WallBlockGroup").show();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5500,function(sym,e){sym.$("RectangleLeft").hide();sym.$("RectangleLeftTop").hide();sym.play("NextSlide");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7000,function(sym,e){sym.$("WallBlockGroup").hide();sym.$("WallBlockGroup").css("display:none");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7500,function(sym,e){sym.play("NextSlide");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",8000,function(sym,e){sym.getComposition().getStage().lessonSetText("Not all loss of data comes from outsiders. User error can also create problems if you do not back up your data. This simply means saving your data on various storage devices such as USB flash drives or other data storage options.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",9250,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",10500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};sym.questionCorrect=function(){sym.play("AnswerCorrect");};sym.questionWrong=function(){sym.play("AnswerWrong");};});
//Edge binding end
})("Slide07");
//Edge symbol end:'Slide07'

//=========================================================

//Edge symbol: 'Question04_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getSymbol("AnswerBox1").$("TextBox").html("Copy everything by hand onto paper");sym.getSymbol("AnswerBox2").$("TextBox").html("Use a USB flashdrive");sym.getSymbol("AnswerBox3").$("TextBox").html("Buy a second computer");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.getParentSymbol().questionWrong();sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2000,function(sym,e){sym.getParentSymbol().questionCorrect();sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3000,function(sym,e){sym.getParentSymbol().questionWrong();sym.stop();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.answerSelected1=function(){sym.play("Answer1");};sym.answerSelected2=function(){sym.play("Answer2");};sym.answerSelected3=function(){sym.play("Answer3");};});
//Edge binding end
})("Question05");
//Edge symbol end:'Question05'

//=========================================================

//Edge symbol: 'StartScreen_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){var element=sym.$("StartText").html("Now you know the basics of computer protection. Close this window to return to the course.");});
//Edge binding end
})("EndScreen");
//Edge symbol end:'EndScreen'
})(jQuery,AdobeEdge,"EDGE-22990726");
// SIG // Begin signature block
// SIG // MIIauwYJKoZIhvcNAQcCoIIarDCCGqgCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFL9Yy8qTFosD
// SIG // 0luzIBJBdc0XYjrKoIIVgjCCBMMwggOroAMCAQICEzMA
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
// SIG // BgEEAYI3AgEVMCMGCSqGSIb3DQEJBDEWBBSbV02QZSie
// SIG // fKzg54vLAQayTQGaqjBeBgorBgEEAYI3AgEMMVAwTqAm
// SIG // gCQATQBpAGMAcgBvAHMAbwBmAHQAIABMAGUAYQByAG4A
// SIG // aQBuAGehJIAiaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L2xlYXJuaW5nIDANBgkqhkiG9w0BAQEFAASCAQCrJdM8
// SIG // SKaSEjAZNv++9kt9Eaa5VlLyfgZL33U+Xxbvcb+41Uy0
// SIG // xceS/Hm4AzmQ0FlWnvPxeL9qR5P9Cxmw+LnJk7AHOQBt
// SIG // VvyLw8JI2dCGDvsjK0TCYt07ynzKJQScLVdHjWLSRV6x
// SIG // IaTcPO3YNBzBv3sK/PuVLVOUwqL1f62l/gtwAb01JpN5
// SIG // TOgIBWGTG0SWUA9gKv5LWwGLHPe7zQPX2wx8tx+MBhDr
// SIG // NOf9Ghz1UaVbnsHx2p0JoyufLoJBGO+zfj2vkMZtzBLQ
// SIG // 3FGNG5xu7trQldk2lbX85+rwVUJZTArXjAXGfEeW//Oe
// SIG // tRxjEBFtfsj4z+XfVa1gqXDGUeZgoYICKDCCAiQGCSqG
// SIG // SIb3DQEJBjGCAhUwggIRAgEBMIGOMHcxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFBDQQITMwAAADQkMUDJoMF5jQAAAAAANDAJ
// SIG // BgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3
// SIG // DQEHATAcBgkqhkiG9w0BCQUxDxcNMTQwNDA4MjMxNTM2
// SIG // WjAjBgkqhkiG9w0BCQQxFgQU4fjdruk0MF+q2o/dPwIF
// SIG // 1I/LR1owDQYJKoZIhvcNAQEFBQAEggEAaRCuJE+7PIxf
// SIG // JYYGRgOSMAhof8F5uNCS1SRY/9VxpXX6GuwCDW1OLXXN
// SIG // ZY3EqfAE+dNJs3AhX+UCE30tduD6Wdl1hPtrZa2FarDx
// SIG // MuWzd55HqLtm7vHV+qLvZwCBktXRZTAwxZXsVpr0xx/2
// SIG // yl7kdAgYiGGfhWZ+9TpnkJxi9o8wRohfdD63DNtXBEcH
// SIG // YjDpLDoHZCvFZipJLTYHYjg7Nwer1yyn4eyZ1j+ylCeJ
// SIG // ejcFqpE6HdxFnflokXIJzoNmPu09E0W1SxaYcXjw6dM1
// SIG // NIz7EtRw2CWIgvO+dWptmif6Ncli1LQS/wvoMbEm70jo
// SIG // iFxi8PP3Ofeaql3QSAicfA==
// SIG // End signature block
