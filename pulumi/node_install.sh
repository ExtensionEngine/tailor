#!/bin/bash

# echo "Hello Ivo" > hello.txt
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install node

git clone https://github.com/ikovac/express-hello-world.git
cd express-hello-world
npm i
# npm start

sudo apt install nginx -y
