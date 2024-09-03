echo off
for /f %%c in ('get_code.bat') do set code=%%c
echo code --- %code%
if %code%==200 (
	echo const _dateTime="%DATE% %TIME%" > actual_time.js
	echo const _tableItems= > stock_items.js
	type stock_items.json >> stock_items.js
	echo Sucsess
) else echo Error