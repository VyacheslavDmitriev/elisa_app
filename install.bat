schtasks /create /sc ONLOGON /tn Elisa\elisa_start /tr "'%PUBLIC%\Elisa\build_file.bat'"
schtasks /create /sc HOURLY /mo 3 /tn Elisa\elisa_update /tr "'%PUBLIC%\Elisa\build_file.bat'"