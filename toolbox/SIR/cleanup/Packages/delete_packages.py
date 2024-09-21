import os
import sys
import shutil

sys.path.append(os.environ['APP_PATH'])

from tools import log, storage, must

PACOTES = [
    "requests",
    "termcolor",
    "emoji",
    "pyyaml"
]

for pacote in PACOTES:
    os.system(f'pip uninstall -y {pacote}')