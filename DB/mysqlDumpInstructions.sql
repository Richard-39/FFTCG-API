-- mysqldump for export data --

-- Open the CMD or shell to excecute the program. It's not on sql shell or workbench.
-- find the mysqldump.exe if it dont work in any place of your shell o cmd.
-- execute the next command. "--hex-blob" is necesary for export binary16 data. 
-- C:\Program Files\MySQL\MySQL Server 8.0\bin>mysqldump -u root -p --hex-blob fftcg > D:\card.sql