import os
import sys
import json
import requests

sys.path.append(os.environ['APP_PATH'])

from tools import log, storage, must

log('starting test')

result = requests.get('https://google.com.br')

log(result.status_code)
log(result.text)

must(result.status_code).eq(200)