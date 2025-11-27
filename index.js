const fs=require('fs');
const {exec}=require('child_process');
const {join}=require('path');
const {appendFileSync,readFileSync,existsSync}=fs;


const URL="https://chatgpt.com/c/69279f58-ab30-832d-abbb-8ca857fe1d35";
const LogsFile=join(__dirname,'LogsFile.txt');
const TimeOutURL=5000;
const LIMITELOGS=3;
const Headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
};

function contarLineas() {
  if (!existsSync(LogsFile)) return 0;
  const contenido = readFileSync(LogsFile, "utf8");
  return contenido.trim().split("\n").length;
}

//function para limpiar el archivo de logs si excede el límite
function CleaningLogs() {

}



// Function to execute a shell command and return it as a Promise
function execCommand(){
   const comando = `curl -s -w "\\n" "${URL}" -o /dev/null ${Object.entries(Headers).map(([key, value]) => `-H "${key}: ${value}"`).join(' ')} && echo "Log limit reached, cleaning logs..." && if [ $(wc -l < "${[LogsFile]}") -ge ${[LogsFile]} ]; then echo "" > "${LogsFile}"; fi`; 

   exec(comando, (err, stdout, stderr,clear) => {
    const DateNow=new Date().toISOString();
    let LogCommand=`\n[${DateNow}]\n`  

        console.log("Log limit reached, cleaning logs...");
          if(err){
        LogCommand+=`Error: ${err.message}\n`;
       }        
       if(stderr){
        LogCommand+=`Stderr: ${stderr}\n`;
       }
       if(stdout){
        LogCommand+=`Stdout: ${stdout}\n`;
       }
    if(clear && clear.length>2){
        LogCommand+=`Clear: ${clear}\n`;
    }
  
       appendFileSync(LogsFile,LogCommand);
       console.log(`Log written to ${LogsFile}${LogCommand}`, "utf8");
})};

setInterval(execCommand, TimeOutURL);