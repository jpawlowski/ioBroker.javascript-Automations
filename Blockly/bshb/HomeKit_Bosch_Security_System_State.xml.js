var profile, state;


createState("bshb.0.SecuritySystemTargetState", 3, JSON.parse('{ "type": "number", "role": "state", "read": true, "write": true, "min": 0, "max": 3 }'), async function () {
  on({id: "javascript.0.bshb.0.SecuritySystemTargetState"/*bshb.0.SecuritySystemTargetState*/, change: "any", ack: false}, async function (obj) {
    var value = obj.state.val;
    var oldValue = obj.oldState.val;
    if ((obj.state ? obj.state.val : "") == 0) {
      setState("bshb.0.intrusionDetectionControl.individualProtection"/*Individual Protection*/, true);
    } else if ((obj.state ? obj.state.val : "") == 1) {
      setState("bshb.0.intrusionDetectionControl.fullProtection"/*Full Protection*/, true);
    } else if ((obj.state ? obj.state.val : "") == 2) {
      setState("bshb.0.intrusionDetectionControl.partialProtection"/*Partial Protection*/, true);
    } else {
      setState("bshb.0.intrusionDetectionControl.disarmProtection"/*Disarm Protection*/, true);
    }
  });
  createState("bshb.0.SecuritySystemCurrentState", 3, JSON.parse('{ "type": "number", "role": "state", "read": true, "write": false, "min": 0, "max": 4 }'), async function () {
    on({id: "bshb.0.intrusionDetectionSystem.SurveillanceAlarm.value"/*IDS.SurveillanceAlarm.value*/, change: "ne", ack: true}, async function (obj) {
      var value = obj.state.val;
      var oldValue = obj.oldState.val;
      if ((obj.state ? obj.state.val : "") == 'ALARM_ON' || (obj.state ? obj.state.val : "") == 'ALARM_MUTED') {
        setState("javascript.0.bshb.0.SecuritySystemCurrentState"/*bshb.0.SecuritySystemCurrentState*/, 4, true);
      } else if ((obj.state ? obj.state.val : "") == 'ALARM_OFF') {
        setState("javascript.0.bshb.0.SecuritySystemCurrentState"/*bshb.0.SecuritySystemCurrentState*/, getState("javascript.0.bshb.0.SecuritySystemTargetState").val, true);
      }
    });
    on({id: "bshb.0.intrusionDetectionSystem.IntrusionDetectionControl.value"/*IDS.IntrusionDetectionControl.value*/, change: "ne", ack: true}, async function (obj) {
      var value = obj.state.val;
      var oldValue = obj.oldState.val;
      profile = getState("bshb.0.intrusionDetectionSystem.IntrusionDetectionControl.activeProfile").val;
      if (profile == 1) {
        state = 2;
      } else if (profile == 2) {
        state = 0;
      } else {
        state = 1;
      }
      if ((obj.state ? obj.state.val : "") == 'SYSTEM_ARMING') {
        setState("javascript.0.bshb.0.SecuritySystemTargetState"/*bshb.0.SecuritySystemTargetState*/, state, true);
      } else if ((obj.state ? obj.state.val : "") == 'SYSTEM_ARMED') {
        setState("javascript.0.bshb.0.SecuritySystemTargetState"/*bshb.0.SecuritySystemTargetState*/, state, true);
        setStateDelayed("javascript.0.bshb.0.SecuritySystemCurrentState"/*bshb.0.SecuritySystemCurrentState*/, state, true, 500, true);
      } else if ((obj.state ? obj.state.val : "") == 'SYSTEM_DISARMED') {
        setState("javascript.0.bshb.0.SecuritySystemTargetState"/*bshb.0.SecuritySystemTargetState*/, 3, true);
        setStateDelayed("javascript.0.bshb.0.SecuritySystemCurrentState"/*bshb.0.SecuritySystemCurrentState*/, 3, true, 1000, true);
      }
    });
  });
});
