#!/usr/bin/env node
const { prompt } = require('enquirer');
const cmd = require('node-cmd');
const shell = require('shelljs');
const getos = require('getos');
const path = require('path');
const chalk = require('chalk');
const error = chalk.bold.red;
// Linux: ~/Android/Sdk
// Mac: ~/Library/Android/sdk
// Windows: %LOCALAPPDATA%\Android\sdk
let sdk = []
let defaultPath = ''
getos(function(e,data) {
    if(e) return console.log(e)
    sdk = []
    if(data.os.search(/win32/gi) !== -1){
         defaultPath = '%LOCALAPPDATA%\\Android\\sdk'
    } else if(data.os.search(/linx/gi) !== -1){
         defaultPath = '~/Android/Sdk'
    } else if(data.os.search(/darwin/gi) !== -1){
         defaultPath = '~/Library/Android/sdk'
    }

    sdk.push(defaultPath);
    sdk.push('emulator');
    sdk.push('emulator');
    let sdkpath = path.join.apply(null,sdk);
     cmd.get(`${sdkpath} -list-avds`,async function(err, data, stderr){
        if(err) {
            console.log(error(`Could not find android emulator sdk in default location '${sdkpath}'`))
            return;
        }
        let devices = data.split("\r\n");

        if(!devices.length){
            console.log(error("No Devices Found !!"))
            return;
        }
    
        try{
            const response = await prompt({
                type: 'select',
                name: 'avd',
                message: 'Select a virtual device ?',
                choices: data.split("\r\n")
            });
            
            if(response.avd) {
                if (shell.exec(`${sdkpath} -avd ${response.avd}`).code !== 0) {
                    shell.exit(1);
                  }
            }
    
        } catch (e) {
            console.log(chalk.yellow('Aborted !!'))
        }

     
    })
})

