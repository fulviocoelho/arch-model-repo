import os
import sys
import json
import requests

sys.path.append(os.environ['APP_PATH'])

from tools import log, storage, must

log('starting test')

result = requests.get('https://api.publicapis.org/entries')

log(result.status_code)

body = json.loads(result.text)

log(body['count'])
log(len(body['entries']))

must(result.status_code).eq(200)
must(body['count']).bigger(0)
must(len(body['entries'])).bigger(0)
must(body['count']).eq(len(body['entries']))