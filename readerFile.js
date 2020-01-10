const fs = require('fs')
const errorConfig = require('./errorConfig')
const {socket} = require('./client');
const Events = require('./event');


class readerFile{
    constructor(){
        this.len = 100000; // length is an integer specifying the number of bytes to read.
        this.buff = Buffer.alloc(this.len); // buffer is the buffer that the data will be written to.
        this.pos = 0; //position is an argument specifying where to begin reading from in the file
        this.offset =0; // offset is the offset in the buffer to start writing at. (?)
        this.file = './log.txt'; // file's path
        this.lastFileMessage = "";
    }

   readFile(){
        fs.writeFileSync('D:\\'+'Node.js\\'+'Cliente\\'+'log.txt', '') ;
        let begin = 0
        let change = 0
        let data = ''
        
        fs.watch('D:\\'+'Node.js\\'+'Cliente\\'+'log.txt', { encoding: 'buffer' }, (eventType, filename) => { 
            let stat = fs.statSync(this.file, (err,stat)=>{})
            this.len = stat.size
            change +=1
            if(change == 2){
            let reader =  fs.createReadStream('D:\\'+'Node.js\\'+'Cliente\\'+'log.txt', {
                flag: 'a+',
                encoding: 'ascii',
                start: begin,
                end: stat.size
            });
             //this.offset, this.len, this.pos
           reader.on('data', function (chunk) {
             
                //console.log(chunk);
                //console.log('start: ', begin)
                //console.log('End: ', stat.size)
                begin = stat.size;  // ---> NUEVO COMIENZO DE LECTURA
                //data = chunk   
               // console.log('Envia data: ', chunk) // --> SEE CHUNK READ
                let message = chunk;

                
               
                var expR =  /Error|Warning/gi
                var comparar = message.match(expR)

                if(comparar != null){
                    //console.log('Valor a comparar: ', comparar[0].length)
                    let valueLength = comparar[0].length
                    //console.log('Expr: ',  message.match(expR))
                    let tipoAlerta =   message.match(expR) // ----> tipo de alerta
                   // console.log('Desde: ',  message.search(expR))
                    let valueFrom=  message.search(expR)
                    let search = valueFrom + valueLength
                    let finish = message.length
                    //console.log('Message:' +  message.slice(search, finish))
                    let msj =  message.slice(search, finish)
                    let time = chunk.substring(13,18)
                    let date = chunk.substring(2,12)
                    
                   

            let error = new errorConfig();
            error.readFile();
            let event = error.events;
            event.forEach(element => {
                if(element.message){
                    let eType = element.type;
                    let eMessage = element.message;
                    let station = '5de59c31716768216c7c72d5';
                    let service = '5dd950d9fd0ce531e46a47e3';
                    let alert = {
                        element , station , service, date,time
                    }
                    
                    if (msj.match(eMessage) && tipoAlerta[0] == eType ){  
                        socket.emit('emitAlert', {alert})
                        console.log('Alerta enviada.')
                      }
                }
            })
                }

            
            
            change = 0
          
        })
    }
})
   }
    

    match(msg){
        console.log('Lee data: ', msg)
        let message = msg;
        var expR =  /Error|Warning/gi
        var comparar = message.match(expR)
        if(comparar != null){
           // console.log('Valor a comparar: ', comparar[0].length)
            let valueLength = comparar[0].length
            //console.log('Expr: ',  message.match(expR))
            let tipoAlerta =   message.match(expR) // ----> tipo de alerta
            //console.log('Desde: ',  message.search(expR))
            let valueFrom=  message.search(expR)
            let search = valueFrom + valueLength
            let finish = message.length
            //console.log('Message:' +  message.slice(search, finish))
            let msj =  message.slice(search, finish)
            //this.getProperty(tipoAlerta,'message', msj)




        }
        
    }

    getProperty(alertType , propertyName, value) {
        let error = new errorConfig();
        error.readFile();
        let event = error.events;
        
        event.forEach(element => {
            if(element.message){
                let eType = element.type;
                let eMessage = element.message;
                if(eType.match(alertType[0])){
                    console.log('????')
                }
                
                if (value.match(element.message) && eType.match(alertType[0]) ){
                   
                    console.log('Re contra Pasa!')
                  }
            }
        

         if(value.match(element.message)){
             console.log('Mismo msg')
         }
        /* if(alertType[0].match(element.type)){
             console.log('Mismo tipo')
         }*/

       });
      };

  
}


module.exports= readerFile;


