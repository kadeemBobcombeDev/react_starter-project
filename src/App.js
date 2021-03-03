import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Board, showBoard } from './Board.js';
import { User } from './User.js';
import io from 'socket.io-client';


const socket = io(); //connects to socket connection


function App() {

const [isShown, setShown] = useState(true); 
const [userCount, setUserCount] = useState(0);
const inputRef = useRef(null);    
const [users, setUsers] = useState([]);
const [currentUser, setCurrentUser] = useState('');
const [count, setCount] = useState(0);
const [player1, setPlayer1] = useState('');
const [player2, setPlayer2] = useState('');
const [spectators, setSpectators] = useState([]);
const [canPlay, setCanPlay] = useState([]);
//const [isLoggedIn, setLoggedIn] = useState(false);


function getCurrentUser() {
    const user = inputRef.current.value;
    let newCount = count + 1;
    let sendUsers = users;
    let player1 = '';
    let player2 = '';
    let spectatorList = [];
    //(newCount === 1 ? setPlayer1(user) : null);
    //(newCount === 2 ? setPlayer2(user) : null);
    //(newCount > 2 ? setSpectators(spectators => [...spectators, user]) : null);

    setCurrentUser(user);
    setUsers([...sendUsers, user]);
    setCount(newCount);
   
    player1 = newCount === 1 ? user : null;   
    player2 = newCount === 2 ? user : null;
  
    if (newCount === 1) {
        setPlayer1(player1);
        socket.emit('new user', {
            user: user,
            count: newCount,
            player : 'X'
        
        })
        
    };    
    
    if (newCount === 2) {
        setPlayer2(player2);
        socket.emit('new user', {
            user: user,
            count: newCount,
            player : 'O'
        
        })
        
    };        
    
     if (newCount > 2) {
        //spectatorList  [...spectatorList, user];

        setSpectators([...spectators, user]);
        //need to update list
        socket.emit('new user', {
            user: user,
            count: newCount,
            player : 'spectator'
        
        })
     };
    
    //setLoggedIn(true);
    showBoard();
    
}

function onShowHide() {
    setShown((prevShown) => {
        return !prevShown;
        
    });
}

    
useEffect(() => {
    
    socket.on('new user',(data) => {
        setUserCount(prevCount => prevCount + 1);
        //console.log(data);
        setUsers(prevUser => [...prevUser, data['user']]);
        setCount(data['count']);


    });


}, []);    

return (
    <div className="App">
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={() => getCurrentUser()} >Login!</button>
            <div>You are logged in as: {currentUser}</div>
            <div>Users in Lobby{users.map((item) => (
                <li>{item}</li>
            ))}
            </div>
        </div>
        <div> 
            <Board currentUser={currentUser} />
        </div>
    </div>
        
    );
    
}


export default App;
