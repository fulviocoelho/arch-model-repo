import os
import sys
import shutil

sys.path.append(os.environ['APP_PATH'])

from tools import log, storage, must

ARCH_BASE_PATH = os.environ['APP_PATH'][0:len(os.environ['APP_PATH'])-12]

try:
    shutil.rmtree(f'{ARCH_BASE_PATH}/toolbox/api-builder-cli/lib')
except OSError as e:
    log("Error: %s - %s." % (e.filename, e.strerror))

try:
    shutil.rmtree(f'{ARCH_BASE_PATH}/toolbox/api-builder-cli/node_modules')
except OSError as e:
    log("Error: %s - %s." % (e.filename, e.strerror))

try:
    os.remove(f'{ARCH_BASE_PATH}/toolbox/api-builder-cli/yarn.lock')
except OSError as e:
    log("Error: %s - %s." % (e.filename, e.strerror))

try:
    os.remove(f'{ARCH_BASE_PATH}/toolbox/api-builder-cli/package-lock.json')
except OSError as e:
    log("Error: %s - %s." % (e.filename, e.strerror))