from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher

import json
import datetime

menu_list: List[Dict[Text, Any]] = json.load(open('database/menu.json', 'r'))['items']
menu = dict()
for dish in menu_list:
    menu[dish['name'].upper()] = { 'price': dish['price'], 'preparation_time': dish['preparation_time'] }

class ConfirmOrder(Action):

    def name(self) -> Text:
        return "action_confirm_order"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        item = tracker.get_slot("order_item").upper()
        special = tracker.get_slot("order_special")

        ready_time = datetime.datetime.now() + datetime.timedelta(hours=menu[item]['preparation_time'])

        dispatcher.utter_message(f"Your order has been placed. It will be ready at {ready_time.strftime('%H:%M')}.")
        
        return []