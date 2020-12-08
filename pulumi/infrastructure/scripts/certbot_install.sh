#!/bin/bash
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -n --agree-tos -m $CERT_EMAIL -d $CERT_DOMAIN

# Setting cron job for certificate renew
(crontab -l 2>/dev/null; echo "00 1 * * 1 sudo certbot renew >> letsencrypt-renewal.log") | crontab -
(crontab -l 2>/dev/null; echo "30 1 * * 1 sudo systemctl restart nginx") | crontab -
