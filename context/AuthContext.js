
//      ___       __    __  .___________. __    __    ______   ______   .__   __. .___________. _______ ___   ___ .___________.
//      /   \     |  |  |  | |           ||  |  |  |  /      | /  __  \  |  \ |  | |           ||   ____|\  \ /  / |           |
//     /  ^  \    |  |  |  | `---|  |----`|  |__|  | |  ,----'|  |  |  | |   \|  | `---|  |----`|  |__    \  V  /  `---|  |----`
//    /  /_\  \   |  |  |  |     |  |     |   __   | |  |     |  |  |  | |  . `  |     |  |     |   __|    >   <       |  |     
//   /  _____  \  |  `--'  |     |  |     |  |  |  | |  `----.|  `--'  | |  |\   |     |  |     |  |____  /  .  \      |  |     
//  /__/     \__\  \______/      |__|     |__|  |__|  \______| \______/  |__| \__|     |__|     |_______|/__/ \__\     |__|     
                                                                                                                             
import React from 'react';

// this is the equivalent to the createStore method of Redux
// https://redux.js.org/api/createstore

// el Context API es una manera de guardar variables de estado a traves de diferentes componentes en el arbol
// con React.createContext({}) se crea el contexto y no toma ningun argumento, porque los valores se definen en el
// Componente que tiene el Context.Provider. Notas de la documentacion:

//   Crea un objeto Context. Cuando React renderiza un componente que se suscribe a este objeto Context, 
// este leerá el valor de contexto actual del Provider más cercano en el árbol.
//   El argumento defaultValue es usado únicamente cuando un componente no tiene un Provider superior a él en el árbol. 
// Esto puede ser útil para probar componentes de forma aislada sin contenerlos. 
// Nota: pasar undefined como valor al Provider no hace que los componentes que lo consumen utilicen defaultValue.
// https://es.reactjs.org/docs/context.html#reactcreatecontext




const AuthContext = React.createContext({});

export default  AuthContext;