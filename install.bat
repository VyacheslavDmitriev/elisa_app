schtasks /create /sc ONLOGON /tn Elisa\elisa_start /tr "'%PUBLIC%\Elisa\run.bat'"
schtasks /create /sc MINUTE /mo 30 /tn Elisa\elisa_update /tr "'%PUBLIC%\Elisa\run.bat'"
@REM schtasks /create /sc MINUTE /tn Elisa\elisa_update /tr "'%PUBLIC%\Elisa\run.bat'"