from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher

import json
from datetime import datetime

opening_time: Dict[Text, Dict] = json.load(open('database/opening_hours.json', 'r'))['items']

class IsOpen(Action):

    def name(self) -> Text:
        return "action_is_open"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
             
        day = next(tracker.get_latest_entity_values("day"), None)
        time = next(tracker.get_latest_entity_values("time"), None)

        if not day:
            dispatcher.utter_message("Cannot recognize day that you provide. I'm sorry.")
            return []
        
        if not time:
            dispatcher.utter_message("Cannot recognize time that you provide. I'm sorry.")
            return []
        
        if not day in opening_time:
            dispatcher.utter_message("You provided wrong name of the day.")
            return []
        
        if not ':' in time:
            time += ':00'

        try:
            time = datetime.strptime(time, '%H:%M')
        except:
            dispatcher.utter_message("You provided wrong time.")
            return []

        working_time = opening_time[day]
        answer = ""
        print(time)
        print(working_time)
        if datetime(1900, 1, 1, hour=working_time['open']) <= time <= datetime(1900, 1, 1, hour=working_time['close']):
            answer = f"We are open on {day} at {time.strftime('%H:%M')}."
        else:
            answer = f"We are close on {day} at {time.strftime('%H:%M')}."

        dispatcher.utter_message(answer)
        
        return []