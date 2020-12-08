#!/bin/bash
sudo apt update
sudo apt install nginx -y
sudo cp ./ivo.extnsn.com /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/ivo.extnsn.com /etc/nginx/sites-enabled/
sudo systemctl restart nginx
