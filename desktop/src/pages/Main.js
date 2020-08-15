import React from 'react';
import electron from 'electron';
const BrowserWindow = electron.BrowserWindow;


export default class Home extends React.Component {

  onClick = () => {

    setTimeout(() => { alert('Abriu a janela') }, 2000);


    
  }

  render(){
    return ( 
        <div>
          <button onClick={this.onClick}> Click me </button>
        </div>
    )
  }
 }