import os
import sys
import shutil

sys.path.append(os.environ['APP_PATH'])

from tools import log, storage, must

ARCH_BASE_PATH = os.environ['APP_PATH'][0:len(os.environ['APP_PATH'])-12]

FOLDERS = [
    "Docs",
    "Diagramas",
    "API-Projects"
]

for folder in FOLDERS:
    path_folder = f'{ARCH_BASE_PATH}/{folder}'
    if not os.path.exists(path_folder):
        os.makedirs(path_folder)