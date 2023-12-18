from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher

import json

menu_list: List[Dict[Text, Any]] = json.load(open('database/menu.json', 'r'))['items']
menu = dict()
for dish in menu_list:
    menu[dish['name'].upper()] = { 'price': dish['price'], 'preparation_time': dish['preparation_time'] }

class ProcessOrder(Action):

    def name(self) -> Text:
        return "action_process_order"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        item = tracker.get_slot("order_item")
        special = tracker.get_slot("order_special")

        if not item.upper() in menu:
            dispatcher.utter_message(f"We don't have {item} in menu, sorry.")
            return []

        dispatcher.utter_message(f"Your order: {item}{f' {special}' if special else ''}. Is it right?")
        
        return [SlotSet("order_item", item), SlotSet("order_special", special)]