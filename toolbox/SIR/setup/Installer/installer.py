import os
import sys
import shutil

sys.path.append(os.environ['APP_PATH'])

from tools import log, storage, must

ARCH_BASE_PATH = os.environ['APP_PATH'][0:len(os.environ['APP_PATH'])-12]

INSTALLER_PATH = f'{ARCH_BASE_PATH}/installer.py'

try:
    if not os.path.exists(INSTALLER_PATH):
        os.remove(INSTALLER_PATH)
except OSError as e:
    log("Error: %s - %s." % (e.filename, e.strerror))