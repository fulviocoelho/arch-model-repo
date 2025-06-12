import os
import subprocess
import shutil
import tempfile

def main():
    # Define o nome do repositório e o nome da pasta a ser copiada
    repositorio = "https://github.com/fulviocoelho/arch-model-repo.git"
    pasta_para_copiar = "toolbox/update"

    # print(os.getcwd())
    root_folder = os.getcwd()
    temp_folder = os.path.join(os.getcwd(), '.temp-repo')
    updater = os.path.join(os.getcwd(), 'toolbox', 'updater')
    arch_repo_toolbox = os.path.join(temp_folder, 'arch-model-repo', 'toolbox')
    
    print("Criando pasta temporaria")
    if not os.path.exists(temp_folder):
        os.makedirs(temp_folder)
    
    # if not os.path.exists(toolbox):
    #     os.makedirs(toolbox)

    print("Clonando repositorio")
    os.chdir(temp_folder)
    os.system(f'git clone {repositorio}')

    print("Copiando updater")
    os.chdir(arch_repo_toolbox)
    shutil.copytree('updater', updater, dirs_exist_ok=True)

    print("Instalando dependencias NPM")
    os.chdir(root_folder)
    os.system('yarn add rimraf')
    os.system('npm pkg set type=module')

    print("Realizando update")
    # shutil.rmtree(temp_folder)
    os.system('node ./toolbox/updater/clean.js && node ./toolbox/updater/update.js && node ./toolbox/updater/clean.js && yarn setup')


if __name__ == "__main__":
    main()