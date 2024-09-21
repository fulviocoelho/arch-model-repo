import os
import sys
import shutil

sys.path.append(os.environ['APP_PATH'])

from tools import log, storage, must

log('Removing out')

ARCH_BASE_PATH = os.environ['APP_PATH'][0:len(os.environ['APP_PATH'])-12]

try:
    shutil.rmtree(f'{ARCH_BASE_PATH}/Docs')
except OSError as e:
    log("Error: %s - %s." % (e.filename, e.strerror))