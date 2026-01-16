Linux Installation (Mandatory)

To run LIGHT on Linux, you must prepare your environment by installing system-level dependencies. We have provided an automation script to make this process easier.
1. Run the Dependency Installer

Open your terminal in the project root folder and execute:

chmod +x install_deps.sh

./install_deps.sh

What this script does:
    Detects your Linux distribution (Debian, Arch, or Fedora).
    Installs required media engines (mplayer, mpg123, aplay).
    Configures network tools (curl).
    Installs Node.js libraries (npm install).
    Sets correct read/write permissions for the game folders.

How to Play

Once the dependencies are installed, you can start the game:
chmod +x LIGHT.sh

./LIGHT.sh or click on the sh files

Note: For the best experience, press F11 for fullscreen terminal mode.