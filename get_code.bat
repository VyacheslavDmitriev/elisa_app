echo off
curl -s -O https://mdc-elisa.ru/web_services/price/stock_items.json -w "%%{http_code}"