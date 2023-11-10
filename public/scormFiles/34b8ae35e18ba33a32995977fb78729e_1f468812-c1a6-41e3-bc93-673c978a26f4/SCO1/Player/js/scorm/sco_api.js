// Set to true to turn on the debug window
var _bDebug = false;

/* Global variables start with an underscore "_" */
var _sAPI = ""; /* the name of the SCORM API "API" or "API_1484_11" */
var apiHandle = null; /* SCORM API */
var _bCommTerminated = false; // true when SCORM communications have been terminated
var _bErrDisplayed = false; // true when scormGetLastError() was called and errCode >= "900"

/*
* call getAPI() to make sure we have set the apiHandle and _sAPI
*/
getAPI();

/* SESSION FUNCTIONS */

/*
* initilize the communications with the LMS
*/
function initCommunications() {
	return scormInitialize();
}

/*
* terminate the communications with the LMS
*/
function termCommunications() {
    // catch errors in LMS handling terminate
    try {
        scormTerminate();
    } catch (e) {
        if (window._LmsTermError) alert(_LmsTermError);
    }
}

/*
* tell the LMS to restore the bookmark, suspend_data and other SCORM data items when the next session starts
*/
function learnerWillReturn(bWillReturn) {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, set the exit data */
		if (bWillReturn)
			scormSetValue("cmi.exit", "suspend");
		else
			scormSetValue("cmi.exit", "normal");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, set the exit data */
		if (bWillReturn)
			scormSetValue("cmi.core.exit", "suspend");
		else
			scormSetValue("cmi.core.exit", "");
	}
}

/* LAUNCH CONDITIONS */

/*
* return true if this is the first launch of the SCO for the learner
*/
function isFirstLaunch() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, get the entry value */
		var sReturn = scormGetValue("cmi.entry");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, get the entry value */
		var sReturn = scormGetValue("cmi.core.entry");
	} else {
		/* no SCORM communications, this will always be the first launch */
		return true;
	}
	
	/* see if this is the first launch */
	if (sReturn != "ab-initio") {
		/* it is not the first laucnh */
		return false;
	}
	
	/* must be the first launch launch */
	return true;
}

/*
* return true if this is the first launch of the SCO for the learner
*/
function getLaunchData() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the launch data */
		return scormGetValue("cmi.launch_data");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, return the launch data */
		return scormGetValue("cmi.launch_data");
	
	} else {
		/* no SCORM communications */
		return "";
	}
}

/*
* return the credit value, "credit" or "no-credit"
*/
function getCredit() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the launch data */
		return scormGetValue("cmi.credit");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, return the launch data */
		return scormGetValue("cmi.core.credit");
	} else {
		/* no SCORM communications */
		return "credit";
	}
}

/*
* return the mode value, "browse", "normal" or "review"
*/
function getMode() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the launch data */
		return scormGetValue("cmi.mode");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, return the launch data */
		return scormGetValue("cmi.core.lesson_mode");
	} else {
		/* no SCORM communications */
		return "normal";
	}
}

/* TIME FUNCTIONS */

/* This global is set by a call to startSessionTime() - it contains the start time of this session */
_timeSessionStart = null;

/*
* Start the session time
*
*	Returns: the session start time in milliseconds
*/
function startSessionTime() {
	/* set a global to the start time, we will use this later to get the session time */
	_timeSessionStart = new Date();
	
	return _timeSessionStart;
}

/*
* set the session time
*	timeStart - the session start time in milliseconds
*/
function setSessionTime(timeStart) {
	/* get the current date and time */
	var dateNow = new Date();
	var timeNow = dateNow.getTime();
	
	/* calculate the elapsed time from the session start time to now */
	var timeElapsed = Math.round((timeNow - timeStart) / 1000);
	
	/* format the elapsed time */
	var sTime = formatTime(timeElapsed);
	
	/* see if this is SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is, set the session time */
		scormSetValue("cmi.session_time", sTime);
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, set the session time */
		scormSetValue("cmi.core.session_time", sTime);
	}
}

/*
* get the maximum time allowed for this SCO, this will return a time in seconds or an empty string ""
*/
function getMaxTimeAllowed() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the maximum time allowed */
		return scormGetValue("cmi.max_time_allowed");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, get the maximum time allowed */
		var sReturn = scormGetValue("cmi.student_data.max_time_allowed");
		
		/* see if this string is empty */
		if (sReturn == "") {
			/* it is, return it */
			return "";
		} else {
			/* this is a hhhh:mm:ss value, convert it */
			var aParts = sReturn.split(':');
			if (aParts.length == 3) {
				return "PT" + aParts[0] * 3600 + aParts[1] * 60 + (aParts[2] - 0) + "S";
			} else {
				return "";
			}
		}
	} else {
		/* no SCORM communications, return as if max time was not set in the manifest */
		return "";
	}
}

/*
* get the time limit action, returns
*	"exit,message"
*	"continue,message"
*	"exit,no message"
*	"continue,no message" (default)
*/
function getTimeLimitAction() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the data */
		return scormGetValue("cmi.time_limit_action");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, return the data */
		return scormGetValue("cmi.student_data.time_limit_action");
	} else {
		/* no SCORM communications */
		return "continue,no message";
	}
}

/*
* get the total time for all sessions
*/
function getTotalTime() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the total time */
		return scormGetValue("cmi.total_time");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, get the total time */
		var sReturn = scormGetValue("cmi.core.total_time");
		
		/* see if this string is empty */
		if (sReturn == "") {
			/* it is, return it */
			return "";
		} else {
			/* this is a hhhh:mm:ss value, convert it */
			var aParts = sReturn.split(':');
			if (aParts.length == 3) {
				return "PT" + aParts[0] * 3600 + aParts[1] * 60 + (aParts[2] - 0) + "S";
			} else {
				return "";
			}
		}
	} else {
		/* no SCORM communications */
		return "";
	}
}

/* STATE MANAGEMENT FUNCTIONS */

/*
* get the learner name
*/
function getLearnerName() {
    /* see if this SCORM 2004 */
    if (_sAPI == "API_1484_11") {
        /* it is SCORM 2004 */
        return scormGetValue("cmi.learner_name");
    } else if (_sAPI == "API") {
        /* it is SCORM 1.2 */
        return scormGetValue("cmi.core.student_name");
    } else {
        /* no SCORM communications */
        return "";
    }

}

/*
* get the learner id
*/
function getLearnerId() {
    /* see if this SCORM 2004 */
    if (_sAPI == "API_1484_11") {
        /* it is SCORM 2004 */
        return scormGetValue("cmi.learner_id");
    } else if (_sAPI == "API") {
        /* it is SCORM 1.2 */
        return scormGetValue("cmi.core.student_id");
    } else {
        /* no SCORM communications */
        return "";
    }
}


/*
* get the bookmark string, previously set
*/
function getBookmark() {
    /* see if this SCORM 2004 */
    if (_sAPI == "API_1484_11") {
        /* it is SCORM 2004, return the bookmark data */
        return scormGetValue("cmi.location");
    } else if (_sAPI == "API") {
        /* it is SCORM 1.2, return the bookmark data */
        return scormGetValue("cmi.core.lesson_location");
    } else {
        /* no SCORM communications */
        return "";
    }
}

/*
* set the learner comment
*/
function setComment(sComment) {
    /* see if this SCORM 2004 */
    if (_sAPI == "API_1484_11") {
        /* it is SCORM 2004, set the comment */
        scormSetValue("cmi.comments_from_learner.0.comment", sComment + "");
    } else if (_sAPI == "API") {
        /* it is SCORM 1.2, set the comment data */
        scormSetValue("cmi.comments", sComment + "");
    }
}



/*
* get the learner comment
*/
function getComment() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the comment */
	    return scormGetValue("cmi.comments_from_learner.0.comment");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, return the comment */
	    return scormGetValue("cmi.comments");
	} else {
		/* no SCORM communications */
		return "";
	}
}

/*
* set the bookmark string
*/
function setBookmark(sLocation) {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, set the bookmark data */
		scormSetValue("cmi.location", sLocation+"");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, set the bookmark data */
		scormSetValue("cmi.core.lesson_location", sLocation+"");
	}
}

/*
* get the suspend data string, previously set
*/
function getSuspendData() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11" || _sAPI == "API") {
		/* it is SCORM 2004 or SCORM 1.2, return the suspend data */
		return scormGetValue("cmi.suspend_data");
	} else {
		/* no SCORM communications */
		return "";
	}
}

/*
* set the suspend data string
*/
function setSuspendData(sSuspend) {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11" || _sAPI == "API") {
		/* it is SCORM 2004, set the suspend data */
		scormSetValue("cmi.suspend_data", sSuspend+"");
	}
}

/* COMPLETION FUNCTIONS */

/*
* set the completion status to "completed", "incomplete", "not attempted", "unknown"
*/
function setCompletionStatus(sCompletion) {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, set the completion status */
		scormSetValue("cmi.completion_status", sCompletion+"");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, see if this is a valid completion status for SCORM 1.2 */
		if (sCompletion == "completed" || sCompletion == "incomplete" || sCompletion == "not attempted") {
			/* this is a valid value, get the current value */
			var sReturn = scormGetValue("cmi.core.lesson_status");
			
			/* see it the completion value is already set to passed or failed (this is done with setPassFail())*/
			if (sReturn == "passed" || sReturn == "failed") {
				/* it is, see if we are trying to set the value to something other than completed */
				/* we do not want to replace pass/fail with completed */
				if (sCompletion == "incomplete" || sCompletion == "not attempted") {
					/* we are, set it */
					scormSetValue("cmi.core.lesson_status", sCompletion+"");
				}
			} else {
				/* not passed or failed, so OK to set */
				//alert("setCompletiontatus" + sCompletion);
				scormSetValue("cmi.core.lesson_status", sCompletion+"");
			}
		}
	}
}

/*
* get the completion status, "completed", "incomplete", "not attempted", "unknown"
*/
function getCompletionStatus() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the completion status data */
		return scormGetValue("cmi.completion_status");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, get the compltetion status */
		var sCompletion = scormGetValue("cmi.core.lesson_status");
		
		/* SCORM 1.2 only has a single data item to store completion and pass/fail */
		/* so check to see if we have a failed or passed status, if so return the status as completed */
		if (sCompletion == "passed" || sCompletion == "failed") {
			return "completed";
		} else {
			return sCompletion;
		}
	} else {
		/* no SCORM communications */
		return "not attempted";
	}
}

/*
* set the completion status to a value between 0 and 1
*/
function setCompletionPercentage(sProgress) {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, set the completion percentage data */
		scormSetValue("cmi.progress_measure", sProgress+"");
	}
}

/*
* get the completion status, a value between 0 and 1 or "" if never set by the SCO
*/
function getCompletionPercentage() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the completion percentage data */
		return scormSetValue("cmi.progress_measure");
	}
	
	/* not defined in SCORM 1.2 so return "" */
	return "";
}

/*
* get the completion threshold, a value between 0 and 1 or "" if not defined
*/
function getCompletionThreshold() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the completion theshold data */
		return scormSetValue("cmi.completion_threshold");
	}
	
	/* not defined in SCORM 1.2 so return "" */
	return "";
}


/* PASS-FAIL FUNCTIONS */

/*
* set the completion status to "passed, "failed", "unknown"
*/
function setPassFail(sPassFail) {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, set the success status */
		scormSetValue("cmi.success_status", sPassFail+"");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2,set the completion status */
		scormSetValue("cmi.core.lesson_status", sPassFail+"");
	}
}

/*
* get the completion status, "passed, "failed", "unknown"
*/
function getPassFail() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the success status data */
		return scormGetValue("cmi.success_status");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, get the completion status data */
		var sReturn = scormGetValue("cmi.core.lesson_status");
		
		/* see if the status is passed or failed */
		if (sReturn == "passed" || sReturn == "failed") {
			/* it is, return it */
			return sReturn;
		} else {
			/* another status, so return "unknown" */
			return "unknown";
		}
	} else {
		/* no SCORM communications */
		return "unknown";
	}
}


/* SCORE FUNCTIONS */

/*
* get the passing score string, -1 to 1 */
function getPassingScore() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the passing score data */
		return scormGetValue("cmi.scaled_passing_score");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, get the mastery score data */
		var sReturn = scormGetValue("cmi.student_data.mastery_score");
		
		/* see if we have a value */
		if (sReturn == "") {
			/* we do not, return the default of 1.0 */
			return "1.0";
		} else {
			/* we do, divide by 100 ot make it a value between 0 and 1 */
			sReturn = (sReturn / 100) + "";
			
			/* return it */
			return sReturn;
		}
	} else {
		/* no SCORM communications */
		return "1.0";
	}
}

/*
* set the score from a value of -1 to 1
*/
function setScore(sScore) {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, set the scaled score data */
		scormSetValue("cmi.score.scaled", sScore+"");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, set the min and max scores */
		scormSetValue("cmi.core.score.min", "0");
		scormSetValue("cmi.core.score.max", "100");
		
		/* see if this is a negative value */
		if ((sScore - 0) < 0) {
			/* it is, SCORM cannot handle a negative value so set the score to 0 */
			scormSetValue("cmi.core.score.raw", "0");
		} else {
			/* multiply by 100 to get it in the range from 0 to 100 */
			scormSetValue("cmi.core.score.raw", (sScore * 100)+"");
		}
	}
}

/*
* get the score string, previously set
*/
function getScore() {
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is SCORM 2004, return the scaled score data */
		return scormGetValue("cmi.scaled.score");
	} else if (_sAPI == "API") {
		/* it is SCORM 1.2, return the score in a range from 0 to 100 data */
		return (scormGetValue("cmi.core.score.raw") / 100) + "";
	} else {
		/* no SCORM communications */
		return "";
	}
}

/* INTERACTION FUNCTIONS */

/*
* set the interaction data except for the objective information
*	sNum - the # of the interaction to set. If this is null, the interaction will be added to the end of the collection (list) of interactions.
*	sId - the id of the interaction
*	sType - the type of the interaction, "true-false, "choice", "fill-in" "long-fill-in", "likert", "matching", "performance", "sequencing", "numeric", "other"
*	sResponse - the response provided by the learner
*	sCorrect - the correct answer
*	sResult - "correct", "incorrect", "unanticipated", "neutral" or "x.y" a character string containing a real number
*	sWeight - the weight of this question, can be null
*	nLatency - the time the learner took to respond to the question in milliseconds, can be null
*	sDescription - the description of this interaction, can be null
*	sIdObjective - the id of the objective, can be null
*/
function setInteraction(sNum,sId,sType,sResponse,sCorrect,sResult,sWeight,nLatency,sDescription,sIdObjective) {
	var nLen, aPairs;
	
	// see if we have a # of an interaction to set
	if (sNum == null) {
		// we do not, get the count of interactions from the LMS */
		sNum = scormGetValue("cmi.interactions._count");
	}

	/* see if this is SCORM 1.2 */
	if (_sAPI == "API") {
		/* it is, modify the responses from SCORM 2004 format to SCORM 1.2 format */
		
		/* see if the result is set to the word "incorrect" */
		if (sResult == "incorrect") {
			/* it is, set it to wrong */
			sResult = "wrong";
		}
		
		/* see if this is true-false */
		if (sType == "true-false") {
			/* it is, modify the responses from "true to "t", "false" to "f" */
			if (sResponse == "true") sResponse = "t";
			else if (sResponse == "false") sResponse = "f";
			
			/* modify the correct answer from "t" or "1" to "true, "f" or "0" to "false" */
			if (sCorrect == "true") sCorrect = "t";
			else if (sCorrect == "false") sCorrect = "f";
		} else if (sType == "choice" || sType == "sequencing") {
			/* this is a choice or sequencing interaction, see if there are [,] separators */
			if (sResponse.indexOf('[,]') != -1) {
				/* there are, replace [.] with commas */
				var aResponses = sResponse.split('[,]');
				sResponse = aResponses.join(',');
			}
			
			/* see if there are [,] separators for the correct answer */
			if (sCorrect.indexOf('[,]') != -1) {
				/* there are, replace them with commas */
				var aCorrect = sCorrect.split('[,]');
				sCorrect = aCorrect.join(',');
			}
		} else if (sType == "matching") {
			/* this is a matching interaction, see if there are [,] separators for the response */
			if (sResponse.indexOf('[,]') != -1) {
				/* there are, break them apart */
				var aResponses = sResponse.split('[,]');
				
				/* loop through the responses */
				nLen = aResponses.length;
				for (var i=0; i<nLen; i++) {
					/* see if the responses are separated by a [.] */
					if (aResponses[i].indexOf("[.]") != -1) {
						/* there are, replace them with a period */
						aPairs = aResponses[i].split("[.]");
						aResponses[i] = aPairs.join(".");
					}
				}
				
				/* recombine with commas */
				sResponse = aResponses.join(',');
			}
			
			/* see if there are [,] separators for the correct answer */
			if (sCorrect.indexOf('[,]') != -1) {
				/* there are, break them apart */
				var aCorrect = sCorrect.split('[,]');
				
				/* loop through the responses */
				nLen = aCorrect.length;
				for (var i=0; i<nLen; i++) {
					/* see if the responses are separated by a [.] */
					if (aCorrect[i].indexOf("[.]") != -1) {
						/* there are, replace them with a period */
						aPairs = aCorrect[i].split("[.]");
						aCorrect[i] = aPairs.join(".");
					}
				}
				
				/* recombine with commas */
				sCorrect = aCorrect.join(',');
			}
		} else if (sType == "numeric") {
			/* this is a numeric interaction, see if find a colon in the correct answer */
			if (sCorrect.indexOf() != -1) {
				/* we did, break it apart */
				aPairs = sCorrect.split("[:]");
				
				/* see if the first part contains a number */
				if (aPairs[0] != "") {
					/* it does, use it as the correct response */
					sCorrect = aPairs[0];
				} else {
					/* use the second number */
					sCorrect = aPairs[1];
				}
			}
		}
	}
		
	/* tell the LMS about the interaction */
	var sInt = "cmi.interactions." + sNum + ".";
	scormSetValue(sInt + "id", sId);
	scormSetValue(sInt + "type", sType);
	if (_sAPI == "API_1484_11")
		scormSetValue(sInt + "learner_response", sResponse);		
	else
		scormSetValue(sInt + "student_response", sResponse);
	scormSetValue(sInt + "correct_responses.0.pattern", sCorrect);
	scormSetValue(sInt + "result", sResult);
	var dateNow = new Date();
	if (_sAPI == "API_1484_11")
		scormSetValue(sInt + "timestamp", dateToTimestamp(dateNow));	
	else
		scormSetValue(sInt + "time", getHMS(dateNow));
				
	if (sWeight!=null) scormSetValue(sInt + "weighting", sWeight);
	if (nLatency != null) scormSetValue(sInt + "latency", formatTime(Math.round(nLatency / 1000)) + "");
	if (sDescription != null && _sAPI == "API_1484_11") scormSetValue(sInt + "description", sDescription);
	if (sIdObjective != null) scormSetValue(sInt + "objectives.0.id", sIdObjective);
}

/*
* Get the index of an interaction from its ID
*	sStart - the starting index - use "0" if you want to start from the beginning
*	sId - the ID of the interaction that you would like to find
*
*	RETURNS: always null for SCORM 1.2 (SCORM 1.2 cannot read interactions). The index of the interaction if we find a match, else null
*/
function getInteractionIndex(sStart, sId) {
	/* see if this is SCORM 1.2 */
	if (_sAPI == "API") {
		/* it is, we cannot read interactions in SCORM 1.2 so return a null */
		return null;
	}
	
	/* get the count of interactions */
	var nTotal = scormGetValue("cmi.interactions._count") - 0;
	
	/* the start number is a character value, convert to integer */
	var nStart = sStart - 0;
	
	/* see if the number of interactions is less than the starting index */
	if ((nTotal-1) < nStart) {
		/* it is, no more interactions past this start index */
		return null;
	}	
	
	/* loop through the collection of interactions */
	for (; nStart < nTotal; nStart++) {
		/* get the interaction ID */
		var sIdCurrent = scormGetValue("cmi.interactions." + nStart + ".id");
		
		/* see if this is a match */
		if (sIdCurrent == sId) {
			/* it is, return the index */
			return nStart + "";
		}
	}
	
	/* we did not find a match for the ID so return a NULL */
	return null;
}

/* OBJECTIVE FUNCTIONS */

/*
* Set an objective
*	sNum - the # of the objective to set. If this is null, the objective will be added at the end of the collection (list) of objectives.
*	sId - the ID of this objective
*	sCompletion - the completion status of the objective - "completed", "incomplete", "not attempted", "unknown"
*	sPercentComplete - the percent complete as a decimal value, 0 is 0% complete, 0.5 is 50% complete, 1 is 100% complete, can be null
*	sPassFail - the pass/fail status (progress measure) - "passed", "failed", "unknown", can be null
*	sScore - the score of the objective - a decimal value from -1 to 1, can be null
*	sDescription - the description of the SCO, can be null
*/
function setObjective(sNum,sId,sCompletion,sPercentComplete,sPassFail,sScore,sDescription) {
	// see if we have a # of an objective to set
	if (sNum == null) {
		// we do not, get the count of objectives from the LMS */
		sNum = scormGetValue("cmi.objectives._count");
	}
	
	/* tell the LMS about the objective */
	var sObj = "cmi.objectives." + sNum + ".";
	scormSetValue(sObj + "id", sId);
	
	/* see if this SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is, set the SCORM 2004 items for this objective */
		scormSetValue(sObj + "completion_status", sCompletion);
		if (sPercentComplete != null) scormSetValue(sObj + "progress_measure", sPercentComplete);
		if (sPassFail != null) scormSetValue(sObj + "success_status", sPassFail);
		if (sScore != null) scormSetValue(sObj + "score.scaled", sScore);
		if (sDescription != null) scormSetValue(sObj + "description", sDescription);
	} else if (_sAPI == "API") {
		/* set the SCORM 1.2 items for this objective */
		if (sCompletion == "unknown") sCompletion = "incomplete";		
		scormSetValue(sObj + "status", sCompletion);
		if (sPassFail == "passed" || sPassFail == "failed") scormSetValue(sObj + "status", sPassFail);
		if (sScore != null) {
			scormSetValue(sObj + "score.min", "0");
			scormSetValue(sObj + "score.max", "100");
			scormSetValue(sObj + "score.raw", (Math.round(sScore * 100000) / 1000) + "");
		}
	}
}
	
/*
* Get the index of an objective from its ID
*	sStart - the starting index - use "0" if you want to start from the beginning
*	sId - the ID of the objective that you would like to find
*
*	RETURNS: The index of the objective if we find a match, else null
*/
function getObjectiveIndex(sStart, sId) {
	/* get the count of objectives */
	var nTotal = scormGetValue("cmi.objectives._count") - 0;
	
	/* the start number is a character value, convert to integer */
	var nStart = sStart - 0;
	
	/* see if the number of objectives is less than the starting index */
	if ((nTotal-1) < nStart) {
		/* it is, no more interactions past this start index */
		return null;
	}	
	
	/* loop through the collection of objectives */
	for (; nStart < nTotal; nStart++) {
		/* get the objective ID */
		var sIdCurrent = scormGetValue("cmi.objectives." + nStart + ".id");
		
		/* see if this is a match */
		if (sIdCurrent == sId) {
			/* it is, return the index */
			return nStart + "";
		}
	}
	
	/* we did not find a match for the ID so return a NULL */
	return null;
}

/*
* Get the count of objectives
*/
function getObjectiveCount() {
	/* return the count */
	return scormGetValue("cmi.objectives._count") - 0;
}

/*
* Get the objective score
*/
function getObjectiveScore(sIndex) {
	if (_sAPI == "API") {
		/* get the score as a number */
		var nScore = scormGetValue("cmi.objectives." + sIndex + ".score.raw") - 0;
		
		/* return the number to a fraction between 0 and 1 and round it to the nearest 1/1000th */
		nScore = (Math.round(nScore * 1000) / 100000);
		return nScore + "";
	} else {
		return scormGetValue("cmi.objectives." + sIndex + ".score.scaled");
	}
}

/*
* get the objective completion status
*/
function getObjectiveCompletionStatus(sIndex) {
	/* see if this is 1.2 */
	if (_sAPI == "API") {
		/* it is */
		return scormGetValue("cmi.objectives." + sIndex + ".status");
	} else {
		/* SCORM 2004 */
		return scormGetValue("cmi.objectives." + sIndex + ".completion_status");
	}
}

/*
* Get the objective progress measure
*/
function getObjectiveCompletionPercentage(sIndex) {
	if (_sAPI == "API") {
		return "";
	} else {
		return scormGetValue("cmi.objectives." + sIndex + ".progress_measure");
	}
}

/*
* get the objective success status
* 	returns passed, failed or unknown
*/
function getObjectivePassFail(sIndex) {
	if (_sAPI == "API") {
			return "";
	} else {
		return scormSetValue("cmi.objectives." + sIndex + ".success_status");
	}
}


/*
* Get the objective description
*/
function getObjectiveDescription(sIndex) {
	if (_sAPI == "API") {
		return "";
	} else {
		return scormGetValue("cmi.objectives." + sIndex + ".description");
	}
}

/* TYPE OF COMMUNICATION FUNCTIONS */

/*
* return true if we can communicate with the LMS, else false
*/
function canCommunicateWithLMS() {
	if (apiHandle != null) {
		/* we found a SCORM API adapter */
		return true;
	}
	
	/* did not find the adapter */
	return false;
}

/*
* return the type of communications with the LMS
*/
function getCommunicationsType() {
	/* see if this is SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* this is SCORM 2004 */
		return "SCORM 2004";
	} else if (_sAPI == "API") {
		/* it is */
		return "SCORM 1.2";
	}
	
	/* no adapter found */
	return "none";
}


/* LOWER LEVEL FUNCTIONS DIRECT COMMUNICATIONS WITH THE SCORM 1.2 and SCORM 2004 RUNTIME API */

/*
* call the SCORM initialize function
*/
function scormInitialize() {
	var API = getAPI();
	if (API == null)
		return "true";

	/* call the correct SCORM function */
	if (_sAPI == "API")
		var result = API.LMSInitialize("");
	else
		var result = API.Initialize("");
		
	showDebug('called Initialize, return=' + result);
		
	return result;
}

/*
* call the SCORM finish function
*/
function scormTerminate() {
	var API = getAPI();
	if (API == null)
		return "false";
		
	/* call the correct SCORM function */
	if (_sAPI == "API")
		var result = API.LMSFinish("");
	else
		var result = API.Terminate("");

	showDebug('called Finish/Terminate, return=' + result);

	// remember we have terminated SCORM communciations
	_bCommTerminated = true;

	return result;
}

/*
* call the SCORM commit function
*/
function scormCommit() {
	var API = getAPI();
	if (API == null)
		return "false";
		
	/* call the correct SCORM function */
	if (_sAPI == "API")
		var result = API.LMSCommit("");
	else
		var result = API.Commit("");
	
	showDebug('called Commit, return=' + result);
	return result;
}

/*
* call the SCORM GetValue function
*/
function scormGetValue(name) {
	var API = getAPI();
	if (API == null && !_bCommTerminated) {
	    courseController.alert("There was an error communicating with the LMS - could not find the API adapter in GetValue(" + name+ ")");
	    return "";
	}

	try {
        /* call the correct SCORM function */
	    if (_sAPI == "API") {
		    var value = API.LMSGetValue(name);
		    var errCode = API.LMSGetLastError();
	    } else {
		    var value = API.GetValue(name);
		    var errCode = API.GetLastError();
	    }
    } catch (e) {
        courseController.alert("There was an error communicating with the LMS - JavaScript error in GetValue(" + name + ")");
    }
	
	showDebug('called GetValue:' + name+ ', return=' + value + ' error code=' + errCode);
	
	/* see if there is an error */
	if (errCode != "0" && !_bCommTerminated) {
		/* there is, return an empty string */
	    courseController.alert("There was an error communicating with the LMS. Getting: " + name + ". Error code:" + errCode);
        return "";
	} else {
		return value;
	}
}

/*
* call the SCORM SetValue function
*/
function scormSetValue(name, value) {
	var API = getAPI();
	if (API == null && !_bCommTerminated) {
	    courseController.alert("There was an error communicating with the LMS - could not find the API adapter in SetValue(" + name + ")");
	    return "true";
	}

	try {
	    /* call the correct SCORM function */
	    if (_sAPI == "API")
	        var result = API.LMSSetValue(name, value);
	    else
	        var result = API.SetValue(name, value);
	} catch (e) {
	    courseController.alert("There was an error communicating with the LMS - JavaScript error in SetValue(" + name + "," + value + ")");
	}

	// see if there was an error
	if (result != "true" && !_bCommTerminated) {
	    courseController.alert("There was an error communicating with the LMS. Setting: " + name + " to " + value);
    }
    
    showDebug('called SetValue:' + name+ ', value=' + value + ' return =' + result);
	return result;
}

/*
* call the SCORM GetLastError function
*/
function scormGetLastError() {
	var API = getAPI(), errCode = "";
	if (API == null) {
		/* there is no API available, by returning a not implemented
		*  error code, we let caller assume that the last SCORM
		*  function failed */
		return "401";
	}

	/* call the correct SCORM function */
	if (_sAPI == "API")
		errCode = API.LMSGetLastError();
	else
	    errCode = API.GetLastError();

	return errCode;
}

/*
* call the SCORM GetErrorString function
*/
function scormGetErrorString() {
	var API = getAPI();
	if (API == null)
		return "";

	/* call the correct SCORM function */
	if (_sAPI == "API")
		return API.LMSGetErrorString();
	else
		return API.GetErrorString();
}

/*
* call the SCORM GetDiagnostic function
*/
function scormGetDiagnostic() {
	var API = getAPI();
	if (API == null)
		return "";

	/* call the correct SCORM function */
	if (_sAPI == "API")
		return API.LMSGetDiagnostic();
	else
		return API.GetDiagnostic();
}



/*** PRIVATE FUNCTIONS USED TO SUPPORT THE TOOLKIT'S PUBLIC FUNCTIONS ***/

/*
* return an ISO 8601 time stamp given a JavaScript date object. The time stamp is in the format required for SCORM 2004.
*/
function dateToTimestamp(date) {
	/* get the parts of the date in UTC time */
	var year    = date.getUTCFullYear();
	var month   = date.getUTCMonth() + 1;
	var day     = date.getUTCDate();
	var hours   = date.getUTCHours();
	var minutes = date.getUTCMinutes();
	var seconds = date.getUTCSeconds();
	var milli   = Math.round(date.getUTCMilliseconds() / 10);

	/* pad a zero if the value is a single digit */
	month   = (month < 10)   ? "0" + month   : month;
	day     = (day < 10)     ? "0" + day     : day;
	hours   = (hours < 10)   ? "0" + hours   : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
	milli   = (milli < 10)   ? "0" + milli   : milli;

	/* assemble the 8601 timestamp and return it */
	return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "." + milli + "Z";
}

/*
* return the current hours:minutes:seconds given a date object for SCORM 1.2
*/
function getHMS(dateNow) {
	var hh = dateNow.getHours();
	var mm = dateNow.getMinutes();
	var ss = dateNow.getSeconds();
	if (hh<10) hh = "0" + hh;
	if (mm<10) mm = "0" + mm;
	if (ss<10) ss = "0" + ss;
	
	if (_sAPI == "API") {
		return hh + ":" + mm + ":" + ss;
	} else {
		var month = dateNow.getMonth() + 1;
		if (month<10) month = "0" + month;
		var day = dateNow.getDate();
		if (day<10)   day   = "0" + day;
		return dateNow.getFullYear() + "-" + month + "-" + day + 
	           "T" + hh + ":" + mm + ":" + ss;
	}
}

/*
* Convert elapsed time in milliseconds to the correct SCORM format
*	timeRaw - the time returned by the JavaScript function date.getTime()
*/
function formatTime(timeRaw) {
	/* get the hours, minutes and seconds from the raw time */
	var hh = Math.floor(timeRaw / 3600);
	timeRaw -= hh * 3600;
	var mm = Math.floor(timeRaw / 60);
	timeRaw -= mm * 60;
	var ss = timeRaw;
	
	/* see if this is SCORM 2004 */
	if (_sAPI == "API_1484_11") {
		/* it is, return the correct value */
		return "PT" + hh + "H" + mm + "M" + ss + "S";
	} else if (_sAPI == "API") {	
		/* this is SCORM 1.2 pad the time values with a 0 if needed */
		if (hh<10) hh = "0" + hh;
		if (mm<10) mm = "0" + mm;
		if (ss<10) ss = "0" + ss;
		
		/* return the correct value */
		return hh + ":" + mm +":" + ss;
	}	
	
	/* no SCORM so return an empty string */
	return "";
}

/*
* get the index of an objective from its id
*/
function getIndexFromId(sId) {
	/* get the count of objectives */
	var nCount = scormGetValue("cmi.objectives._count") - 0;
	
	/* see if there is a count */
	if (nCount > 0) {
		/* there is, loop through the objective ids */
		for (var i=0; i<nCount; i++) {
			/* see if this is the index of the id */
			if (scormGetValue("cmi.objectives." + i + ".id") == sId) {
				/* it does, return the index */
				return i+"";
			}
		}
		
		/* no match, return null */
		return null;
	} else {
		/* not children, return null */
		return null;
	}
}

/*
* look up through the frameset hierarchy for the SCORM API
*/
function findAPI(win, apiName) {
    // the container may be in a different domain so use a try-catch to avoid an access violation
    try {
        /* see if the API is not in this window AND the parent is not null AND there is a parent window */
	    while ((win[apiName] == null) && (win.parent != null) && (win.parent != win)) {
		    /* did not find the API in this window, get the parent */
		    win = win.parent;
	    }
	
	    /* we found the API or ran out of parent windows, set the result */
	    apiHandle = win[apiName];
    } catch (e) {
        apiHandle = null;
    }
}

/*
* return the SCORM 1.2 or SCORM 2004 API
*/
function getAPI() {
	/* return the API if we already found it */
	if (apiHandle != null)
		return apiHandle;

	/* look for the SCORM 20004 API up in the frameset */
	findAPI(window, 'API_1484_11');

	/* if we still have not found the SCORM 2004 API, look at the opener and it's frameset */
	if ((apiHandle == null) && (window.opener != null)) {
		findAPI(window.opener, 'API_1484_11');
    }
	
	/* see if we found the SCORM 2004 API */
	if (apiHandle == null) {
		/* we did not, look for the SCORM 1.2 API in the frameset */
		findAPI(window, 'API');
	
		/* if we still have not found the SCORM 2004 API, look at the opener and it's frameset */
		if ((apiHandle == null) && (window.opener != null)) {
			findAPI(window.opener, 'API');
        }

        /* if we still have not found the SCORM 2004 API, look at the opener's opener and it's frameset */
        // this is outside of the SCORM specification but look here because of the way we open the course in Learning Central when it lacks HTML 5 support
        if ((apiHandle == null) && (window.opener != null) && (window.opener.opener != null)) {
            findAPI(window.opener.opener, 'API');
        }
		
		/* see if we found the API */
		if (apiHandle != null) {
			/* we did, remember that we found the SCORM 1.2 API */
			_sAPI = 'API';
		}
	} else {
		/* we found the SCOM 2004 API, remember it */
		_sAPI = 'API_1484_11';
	}
	
	/* return it */
	return apiHandle;
}

var _wDebug = null;

function showDebug(sDebug) {

    // see if debug is turned on
    if (_bDebug) {
        // it is, see if we have created the debug window
        if (_wDebug == null) {
            // we have not, create the window
            _wDebug = open('', 'debugwindow', 'width=800,height=700,scrollbars=yes,resizable=yes');
            if (_wDebug != null) _wDebug.document.write('<html><head><title>Debug window</title></head><body>');
        }

        // write out the debug information
        if (_wDebug != null) _wDebug.document.write(sDebug + "<br>");

    }
}
// SIG // Begin signature block
// SIG // MIIauwYJKoZIhvcNAQcCoIIarDCCGqgCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFJilBcM8HWbz
// SIG // pVBZsMJpPYozSEDzoIIVgjCCBMMwggOroAMCAQICEzMA
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
// SIG // BgEEAYI3AgEVMCMGCSqGSIb3DQEJBDEWBBQDHkk5FjnZ
// SIG // 1t5L8eX9F2bSm1SDJzBeBgorBgEEAYI3AgEMMVAwTqAm
// SIG // gCQATQBpAGMAcgBvAHMAbwBmAHQAIABMAGUAYQByAG4A
// SIG // aQBuAGehJIAiaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L2xlYXJuaW5nIDANBgkqhkiG9w0BAQEFAASCAQCYI1XK
// SIG // MZUCpPL4+HNE+Jc3I5aOJbfeA948W6BcK+/yFdJ0Xu/s
// SIG // djyKV8AnFAsElqGEIIe1dh1gJ3RHntTvRpgRTaUgPbLp
// SIG // WFVeRNvCvd1cbmiW51ociuT50jqyn0tDirhWN2UoimKx
// SIG // DiO6QAdKBxbPp2MLBEjzL/qDU7xwNtF5dgX2NyQvVgMd
// SIG // nDxInZvAFM+y9mpx9Q0v00Besn2Fjt5lt2Rynx7O+S9w
// SIG // 9I5HrP8aeAHcDAu8MFCi9SUuh6lTYdQ6ltwqb3K9JkO8
// SIG // m25LahQDFzIfNmpD4YV4oycLsACNL+BWAIw5FaIf5j9s
// SIG // PCw3qgym1wjKrCdELXIOHXDS7c6QoYICKDCCAiQGCSqG
// SIG // SIb3DQEJBjGCAhUwggIRAgEBMIGOMHcxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFBDQQITMwAAADQkMUDJoMF5jQAAAAAANDAJ
// SIG // BgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3
// SIG // DQEHATAcBgkqhkiG9w0BCQUxDxcNMTMwNTE0MTcwMTI2
// SIG // WjAjBgkqhkiG9w0BCQQxFgQUiEYW9/4uSo4Bph6UHd55
// SIG // rkhDCY4wDQYJKoZIhvcNAQEFBQAEggEAMOAs6DkXySzG
// SIG // MtZiqefil9IjgNX+9SyeeyrgG7LCeVFCqMQM6wThVYJX
// SIG // ouTJHkghhWtJdog3BxgOwcZFYWMPXuEosMerpJa1tVyZ
// SIG // kVjETBT5ZGMASkNJQd7xTj5YM4GjFCrERGNJSSWfcSK5
// SIG // tXpJr2A87JJwCjtEiaZAgdeaLObFqxMGs68uM/LF8RpC
// SIG // Yo1P/kyVu+YnqSKkOZV2DlOgLQ1qA96NpWb7M8RqIUPv
// SIG // /bCLJ76RCcICi1MRVqhQHHEPf5blPwU6szOr1BkVM93R
// SIG // AscEaeSaTNfGkFIuWsj7Yv5BsZqs9JxosX8YVfDU3Ty6
// SIG // VgZvJvSFYwWtQxEYPDa09g==
// SIG // End signature block
