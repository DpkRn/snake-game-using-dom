const maze=document.querySelector('.maze')
function createUI(){
    Array.from({length:12}).forEach((_,i)=>{
        Array.from({length:12}).forEach((_,j)=>{
            const cell=document.createElement('div');
            cell.classList.add('cell')
            cell.dataset.row=`${i}`;
            cell.dataset.col=`${j}`;
            cell.tabIndex=0;
            maze.appendChild(cell);
        })
    })
}


let r=0;
let c=1;
let currKey='ArrowRight'
let body=[[0,0]];
let head=[r,c];
let escaped=null;
let id=null;
let speed=1000;
let score=0;
let isLost=false;

let food=[];
let isUnSettedFood=false;


function setFood(){
    const foodRow=Math.floor(Math.random()*12);
    const foodCol=Math.floor(Math.random()*12);
    if(head[0]==foodRow&&head[1]==foodCol){
        setFood();
    }
    if(body.some(item=>item[0]==foodRow&&item[1]==foodCol)){
        setFood();
    }
    food=[foodRow,foodCol];
    console.log(food)
    const foodCell=document.querySelector(`.cell[data-row="${food[0]}"][data-col="${food[1]}"]`);
    console.log(foodCell)
    foodCell.classList.add('food');
}

function unsetFood(){
    const foodCell=document.querySelector(`.cell[data-row="${food[0]}"][data-col="${food[1]}"]`);
    foodCell.classList.remove('food');
    isUnSettedFood=true;
}

function addNewTail(){

    const tail = body[0];
    const next = body[1];

    let dx = 0, dy = 0;
    if (next) {
        dx = tail[0] - next[0];
        dy = tail[1] - next[1];
    } else {
        if(currKey === 'ArrowRight') dy = -1;
        else if(currKey === 'ArrowLeft') dy = 1;
        else if(currKey === 'ArrowUp') dx = 1;
        else if(currKey === 'ArrowDown') dx = -1;
    }

    const newTail = [tail[0] + dx, tail[1] + dy];
    body.unshift(newTail); 
}
function isCollapse(){
    return body.some(item=>item[0]==head[0]&&item[1]==head[1])
}

function isEaten(){
    return head[0]==food[0]&&head[1]==food[1];
}

function setSnake(){
    const curr=document.querySelector(`.cell[data-row="${head[0]}"][data-col="${head[1]}"]`);
    body.forEach((item)=>{
        const curr=document.querySelector(`.cell[data-row="${item[0]}"][data-col="${item[1]}"]`);
        curr.classList.add('previous');

    })
    curr.classList.add('head');
}

function unsetSnake(){
    const tail=document.querySelector(`.cell[data-row="${escaped[0]}"][data-col="${escaped[1]}"]`);
    const head=document.querySelector(`.cell[data-row="${body[body.length-1][0]}"][data-col="${body[body.length-1][1]}"]`);
    tail.classList.remove('previous');
    head.classList.remove('head');
}


function setMove(){
    if(currKey==='ArrowRight'){
        c++;
    }else if(currKey==='ArrowLeft'){
        c--;
    }else if(currKey==='ArrowDown'){
        r++;
    }else if(currKey==='ArrowUp'){
        r--;
    }
    escaped=body.shift();
    body.push(head);
    head=[r,c];
    unsetSnake();

}

function checkBoundary(){
    if(head[0]<0||head[0]>=12||head[1]<0||head[1]>=12||isCollapse()){
        clearInterval(id);
        isLost=true;
        alert('lost');
        return true;
    }
    return false;

}


function interval(){
    id=setInterval(()=>{
        setMove();
        if(checkBoundary()) return;
        if(isEaten()){
            score++;
            addNewTail()
            unsetFood();
            setFood();
            speed-=50;
            clearInterval(id)
            id=interval();
        }

        setSnake();
},speed)
return id;
}



document.addEventListener('keydown',(e)=>{
    const key=e.key;
    const allowedKey=['ArrowLeft','ArrowRight','ArrowDown','ArrowUp'];
    if(allowedKey.includes(key)){
        currKey=key;
    }
})
createUI();
setFood();
id=interval();