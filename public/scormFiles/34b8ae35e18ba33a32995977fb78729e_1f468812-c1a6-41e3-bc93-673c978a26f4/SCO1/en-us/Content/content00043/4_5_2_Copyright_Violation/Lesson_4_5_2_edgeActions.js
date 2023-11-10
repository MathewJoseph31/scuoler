
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.lessonPlayButton=function(){sym.play("StartGame");};sym.lessonBeginGame=function(){sym.setVariable("Slide",0);};sym.lessonNextSlide=function(){var slide=sym.getVariable("Slide");slide+=1;sym.setVariable("Slide",slide);switch(slide)
{case 1:sym.play("Slide01");break;case 2:sym.play("Slide02");break;case 3:sym.play("Slide03");break;case 4:sym.play("Slide04");break;case 5:sym.play("Slide05");break;case 6:sym.play("Slide06");break;case 7:sym.play("Slide07");break;case 8:sym.play("Slide08");break;case 9:sym.play("Slide09");break;case 10:sym.play("Slide10");break;case 11:sym.play("Slide11");break;case 12:sym.play("Slide12");break;case 13:sym.play("Slide13");break;case 14:sym.play("Slide14");break;case 15:sym.play("Slide15");break;case 16:sym.play("Slide16");break;case 17:sym.play("Slide17");break;case 18:sym.play("Slide18");break;case 19:sym.play("Slide19");break;}};sym.lessonSetText=function(text){sym.$("BottomText").html(text);};sym.lessonAvatarLookNormal=function(){sym.getSymbol("AvatarSitting").lookNormal();};sym.lessonAvatarLookSide=function(){sym.getSymbol("AvatarSitting").lookSide();};});
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
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",6750,function(sym,e){sym.play("Slide08");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7250,function(sym,e){sym.play("Slide09");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",7750,function(sym,e){sym.play("Slide10");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",8250,function(sym,e){sym.play("Slide11");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",8750,function(sym,e){sym.play("Slide12");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",9250,function(sym,e){sym.play("Slide13");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",9750,function(sym,e){sym.play("Slide14");});
//Edge binding end
})("stage");
//Edge symbol end:'stage'

//=========================================================

//=========================================================

//Edge symbol: 'StartScreen'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){var element=sym.$("StartText").html("Copyright Violation and Prevention");});
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

//Edge symbol: 'Slide01'
(function(symbolName){Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Using someone's copyrighted intellectual property without their permission is called a copyright violation.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2250,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
})("Slide01");
//Edge symbol end:'Slide01'

//=========================================================

//Edge symbol: 'EvilDude'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3900,function(sym,e){sym.play("Loop");});
//Edge binding end
})("EvilDude");
//Edge symbol end:'EvilDude'

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

//Edge symbol: 'Slide01_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("For example, when you pay for a song download, you purchase a copy of that song for your personal enjoyment. You do not have permission to make more copies of the song and give them to your friends on CDs or through file sharing.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3750,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5000,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide02");
//Edge symbol end:'Slide02'

//=========================================================

//Edge symbol: 'Slide02_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Copyright laws also apply to written material, logos, photographs, art, and even software. Illegally obtaining a copy of someone's music, photography, art, writing, or software without permission is called piracy.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",10250,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",11500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide03");
//Edge symbol end:'Slide03'

//=========================================================

//Edge symbol: 'EvilDudePirate'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3890,function(sym,e){sym.play("Loop");});
//Edge binding end
})("EvilDudePirate");
//Edge symbol end:'EvilDudePirate'

//=========================================================

//Edge symbol: 'Slide03_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("All forms of Internet piracy are illegal and unethical.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3250,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide04");
//Edge symbol end:'Slide04'

//=========================================================

//Edge symbol: 'PirateItems'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",24000,function(sym,e){sym.play("Loop");});
//Edge binding end
})("PirateItems");
//Edge symbol end:'PirateItems'

//=========================================================

//Edge symbol: 'Slide04_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Misuse of copyright also happens when you download copyrighted material without the owner's permission or download something without paying the copyright fee, if one exists. Sharing copyrighted material without permission on file sharing sites is also a violation of copyright.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",9750,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",11000,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide05");
//Edge symbol end:'Slide05'

//=========================================================

//Edge symbol: 'CoffeeShop'
(function(symbolName){})("CoffeeShop");
//Edge symbol end:'CoffeeShop'

//=========================================================

//Edge symbol: 'AvatarDebra'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3950,function(sym,e){sym.play("Loop");});
//Edge binding end
})("AvatarDebra");
//Edge symbol end:'AvatarDebra'

//=========================================================

//Edge symbol: 'AvatarDebra_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3950,function(sym,e){sym.play("Loop");});
//Edge binding end
})("AvatarDebraLook");
//Edge symbol end:'AvatarDebraLook'

//=========================================================

//Edge symbol: 'CoffeeShop_1'
(function(symbolName){})("CoffeeShop2");
//Edge symbol end:'CoffeeShop2'

//=========================================================

//Edge symbol: 'Slide05_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("If you use someone else's work and claim it as your own work it is called plagiarism.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4750,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",6000,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide06");
//Edge symbol end:'Slide06'

//=========================================================

//Edge symbol: 'AvatarMale'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2450,function(sym,e){sym.play("Loop");});
//Edge binding end
})("AvatarMale");
//Edge symbol end:'AvatarMale'

//=========================================================

//Edge symbol: 'AvatarMale_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3950,function(sym,e){sym.play("Loop");});
//Edge binding end
})("AvatarMaleLook");
//Edge symbol end:'AvatarMaleLook'

//=========================================================

//Edge symbol: 'Slide06_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Suppose someone copies and pastes a movie review from a website and then posts it on their own website and claims to be the author of that review: that is plagiarism. In some countries, even paraphrasing some of the words of the original article is considered plagiarism.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3250,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide07");
//Edge symbol end:'Slide07'

//=========================================================

//Edge symbol: 'AvatarMusic'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1750,function(sym,e){sym.play("Loop");});
//Edge binding end
})("AvatarMusic");
//Edge symbol end:'AvatarMusic'

//=========================================================

//Edge symbol: 'Slide07_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2750,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide08");
//Edge symbol end:'Slide08'

//=========================================================

//Edge symbol: 'Slide08_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Select the left arrow if the file is legal to download, or the right arrow if the file is not legal to download.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play("Loop");});
//Edge binding end
})("Slide09");
//Edge symbol end:'Slide09'

//=========================================================

//Edge symbol: 'LegalButton'
(function(symbolName){Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.setVariable("Clicked",0);sym.$("Button_legal_hover").hide();sym.$("Button_legal").show();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","click",function(sym,e){sym.setVariable("Clicked",1);sym.play("Click");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","mouseleave",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("Button_legal_hover").hide();sym.$("Button_legal").show();}});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","mouseenter",function(sym,e){sym.$("Button_legal_hover").show();sym.$("Button_legal").hide();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.setVariable("Clicked",0);sym.$("Button_legal_hover").hide();sym.$("Button_legal").show();sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.getParentSymbol().slideExit();sym.stop();});
//Edge binding end
})("LegalButton");
//Edge symbol end:'LegalButton'

//=========================================================

//Edge symbol: 'LegalButton_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.setVariable("Clicked",0);sym.$("Button_legal_hover").hide();sym.$("Button_legal").show();sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.getParentSymbol().slideExit();sym.stop();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.setVariable("Clicked",0);sym.$("Button_legal_hover").hide();sym.$("Button_legal").show();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","click",function(sym,e){sym.setVariable("Clicked",1);sym.play("Click");});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","mouseleave",function(sym,e){if(!sym.getVariable("Clicked"))
{sym.$("Button_legal_hover").hide();sym.$("Button_legal").show();}});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_Rectangle2}","mouseenter",function(sym,e){sym.$("Button_legal_hover").show();sym.$("Button_legal").hide();});
//Edge binding end
})("IllegalButton");
//Edge symbol end:'IllegalButton'

//=========================================================

//Edge symbol: 'Slide09_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Select the left arrow if the file is legal to download, or the right arrow if the file is not legal to download.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide10");
//Edge symbol end:'Slide10'

//=========================================================

//Edge symbol: 'Slide10_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Select the left arrow if the file is legal to download, or the right arrow if the file is not legal to download.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide11");
//Edge symbol end:'Slide11'

//=========================================================

//Edge symbol: 'Slide11_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Select the left arrow if the file is legal to download, or the right arrow if the file is not legal to download.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide12");
//Edge symbol end:'Slide12'

//=========================================================

//Edge symbol: 'Slide10_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Select the left arrow if the file is legal to download, or the right arrow if the file is not legal to download.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide13");
//Edge symbol end:'Slide13'

//=========================================================

//Edge symbol: 'Slide09_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){sym.getComposition().getStage().lessonSetText("Select the left arrow if the file is legal to download, or the right arrow if the file is not legal to download.");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play("Loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4500,function(sym,e){sym.getComposition().getStage().lessonNextSlide();});
//Edge binding end
Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){sym.slideExit=function(){sym.play("Exit");};});
//Edge binding end
})("Slide14");
//Edge symbol end:'Slide14'

//=========================================================

//Edge symbol: 'StartScreen_1'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){var element=sym.$("StartText").html("Now you know the basics of copyright violation and prevention. Close this window to return to the course.");});
//Edge binding end
})("EndScreen");
//Edge symbol end:'EndScreen'
})(jQuery,AdobeEdge,"EDGE-93768921");
// SIG // Begin signature block
// SIG // MIIauwYJKoZIhvcNAQcCoIIarDCCGqgCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFK7rbCBhvUT3
// SIG // 0oegJbNbtaPEymTdoIIVgjCCBMMwggOroAMCAQICEzMA
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
// SIG // BgEEAYI3AgEVMCMGCSqGSIb3DQEJBDEWBBTNUgeyxUmp
// SIG // nF1zWZCeDO2MOib7TjBeBgorBgEEAYI3AgEMMVAwTqAm
// SIG // gCQATQBpAGMAcgBvAHMAbwBmAHQAIABMAGUAYQByAG4A
// SIG // aQBuAGehJIAiaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L2xlYXJuaW5nIDANBgkqhkiG9w0BAQEFAASCAQBJZYBc
// SIG // uSanw8HY50CeNsR/m8vjROF62N7K6dsoJxZvjlDheM6p
// SIG // eN6bus6PN4+gnJzvNcb0/CMRKC5Gy9H7+3Eqg9UQWJ1r
// SIG // nfkaWvkEaY0hBlSRF8xvLMzk5SyEmsbeaTmSVAgaDH9P
// SIG // LSSGGoYwb4ShFTyhovVP4vlUfz6A6npoRqqUrXRyd8d7
// SIG // q5mJJiG8gQx2xt0hiuDESccHq3KDIQhWepRcTlOgO4Yd
// SIG // vt2DVn/Vbb5nqCqHZED44UliraKfdrP7RosGwFDlavQW
// SIG // rSifwC/pLiYply840fgKMf5dLKd9aZ5cCQ8N0rVTiyTi
// SIG // dpJGTte96hOGPAWCimbM1vH/z6I/oYICKDCCAiQGCSqG
// SIG // SIb3DQEJBjGCAhUwggIRAgEBMIGOMHcxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFBDQQITMwAAADQkMUDJoMF5jQAAAAAANDAJ
// SIG // BgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3
// SIG // DQEHATAcBgkqhkiG9w0BCQUxDxcNMTQwNDA4MjMxNTM3
// SIG // WjAjBgkqhkiG9w0BCQQxFgQUJ7hzkos5+Htz0VuypVhU
// SIG // 7w4e/5IwDQYJKoZIhvcNAQEFBQAEggEAaZoOsr/9pRIg
// SIG // 3NbalmN4i/gdPvtMlWTt0TSmBxSYQVLPI4eWZNfKqLje
// SIG // l5gFZQ0sSJ5HKOxOPhyeKafUG0LUrwvPag9poCJo19Zl
// SIG // eipRNor0LhZjzc9gEb++QbnMtfpxQkQyEogMOXNO50f0
// SIG // stGQlFiKS08QR8iBX0BzodQtT+9JCGbLq+u5VoeXbVDY
// SIG // RnbKrv1Af/64FGZEwBaACkx0/b1GkusApH9rFzjpwezA
// SIG // qhV3WEttO2x/+YfcnwwaKV68Dd2bLopqFdYn1fY6yXIN
// SIG // K+wQGTgVIImzMeUW5PsGxtcMi+y9UYh/OZ/S9Wr/mBcb
// SIG // juDJrNkI/9WKDpy/Tl9n2g==
// SIG // End signature block
