echo off
curl -s -O https://mdc-elisa.ru/web_services/coordered/coordered_items.json
curl -s -O https://mdc-elisa.ru/web_services/price/stock_items.json -w "%%{http_code}"