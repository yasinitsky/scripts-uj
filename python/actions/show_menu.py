from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher

import json

menu: List[Dict[Text, Any]] = json.load(open('database/menu.json', 'r'))['items']

class ShowMenu(Action):

    def name(self) -> Text:
        return "action_show_menu"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        message = "Here's list of available dishes: \n"
        for dish in menu:
            message += dish['name'] + " - " + str(dish['price']) + "$ \n"
        
        dispatcher.utter_message(message)
        
        return []