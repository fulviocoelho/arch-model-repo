import os
import sys
import shutil

sys.path.append(os.environ['APP_PATH'])

from tools import log, storage, must

ARCH_BASE_PATH = os.environ['APP_PATH'][0:len(os.environ['APP_PATH'])-12]

try:
    os.remove(f'{ARCH_BASE_PATH}/yarn.lock')
except OSError as e:
    log("Error: %s - %s." % (e.filename, e.strerror))

try:
    os.remove(f'{ARCH_BASE_PATH}/config.json')
except OSError as e:
    log("Error: %s - %s." % (e.filename, e.strerror))