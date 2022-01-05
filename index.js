const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

const {menu} = require('./helpers/menu')
const {states} = require('./helpers/stages')

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    
});

var orders_final = []
var message_choix_menu = "This is our menu, please choose a number :  \n"



var cpt = 0;
client.on('message', message => {
   // console.log(cpt,getStage(cpt))
    
    if(cpt == 2){
        message.reply('Your order is under process');
        orders_final.push({
           // client_number : "6454444",
            order : message.body
        })
    }
    //stage 2
    if(cpt == 3){
        
        if(message.body.toLowerCase() === 'o' ) {
            cpt = 1 
            //message.reply(getStage(cpt))
            if(message.body == 1 || message.body == 2 || message.body == 3)
                orders_final.push({
                   // client_number : "6454444",
                    order : parseInt(message.body)
                   
                })
        }    
        
    }

   message.reply(getStage(cpt));
    cpt ++;
});


function getStage(stage){
    if(stage == 1){
        states[1].message = ""
        for (let index = 0; index < menu.length; index++) {
            //states[1].message +=  +index+1 +' '+menu[index].item +' '+menu[index].prix+' $'+'\n'
            states[1].message +=`${+index+1}-${menu[index].item} ${menu[index].prix}$ \n`;
        }
        return message_choix_menu+states[1].message
    
    }
    if(stage == 3 ){
        for (let index = 0; index < orders_final.length; index++) {
            
            states[3].cost +=  menu[orders_final[index].order - 1].prix
            
        }
       // return message_choix_menu+states[1].message
        
        
       //return states[stage].message+' it will cost you '+states[3].cost+' $';
        return`${states[stage].message} it will cost you ${states[3].cost}$`;
    }
    else if(states[stage]){
            return states[stage].message;
    }
        
    
}



client.initialize();