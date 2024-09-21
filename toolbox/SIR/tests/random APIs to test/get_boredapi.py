import os
import sys
import json
import requests

sys.path.append(os.environ['APP_PATH'])

from tools import log, storage, must

log('starting test')

result = requests.get('https://www.boredapi.com/api/activity')

log(result.status_code)

body = json.loads(result.text)

log(body)

must(result.status_code).eq(200)
must('activity')._in(body)
must('key')._in(body)
must(body['type']).eq('cook')