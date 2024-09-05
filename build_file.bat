echo off
cd %PUBLIC%\Elisa
for /f %%c in ('get_code.bat') do set code=%%c
echo code --- %code%
if %code%==200 (
	echo const _dateTime="%DATE% %TIME%" > inc/actual_time.js
	echo const _tableItems= > inc/stock_items.js
	type stock_items.json >> inc/stock_items.js
	echo const _coorderedItems= > inc/coordered_items.js
	type coordered_items.json >> inc/coordered_items.js
	echo Sucsess
) else echo Error
exit