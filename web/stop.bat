cd C:\sg\web 
FOR /F "tokens=5 delims= " %P IN ('netstat -a -n -o ^|
 findstr :5000') DO TaskKill.exe /PID %P /T /F