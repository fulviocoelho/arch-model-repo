import os
import sys
import shutil

sys.path.append(os.environ['APP_PATH'])

from tools import log, storage, must

ARCH_BASE_PATH = os.environ['APP_PATH'][0:len(os.environ['APP_PATH'])-12]

import os
os.chdir(f'{ARCH_BASE_PATH}/toolbox/api-builder-cli')
os.system("yarn && yarn build")