import os
import json

class storage:
    _APP_PATH = os.environ['APP_PATH']

    def set(self, data):
        with open(f'{self._APP_PATH}/storage/data.json', 'w', encoding='utf8') as f:
            f.write(json.dumps(data))

    def get(self):
        with open(f'{self._APP_PATH}/storage/data.json', 'r', encoding='utf8') as f:
            return json.loads(f.read())

    def clear(self):
        with open(f'{self._APP_PATH}/storage/data.json', 'w', encoding='utf8') as f:
            f.write(json.dumps({}))