@echo off
set "source=checklist-client\build"
set "destination=checklist-server\public"

del /q "%destination%\*"
for /d %%x in ("%destination%\*") do rd /s /q "%%x"

xcopy "%source%\*" "%destination%\" /E /Y

echo Deployment complete!
pause
