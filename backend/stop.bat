cd C:\sg\web 
FOR /F "tokens=5 delims= " %P IN ('netstat -a -n -o ^|
 findstr :3333') DO TaskKill.exe /PID %P /T /F
pause