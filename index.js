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
let bomb=[];
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
    const foodCell=document.querySelector(`.cell[data-row="${food[0]}"][data-col="${food[1]}"]`);
    foodCell.classList.add('food');
}

function setBomb(){
    const bombRow=Math.floor(Math.random()*12);
    const bombCol=Math.floor(Math.random()*12);
    if((head[0]==bombRow&&head[1]==bombCol)||(food[0]==bomb[0]&&food[1]==bomb[1])){
        setBomb();
    }
    if(body.some(item=>item[0]==bombRow&&item[1]==bombCol)){
        setBomb();
    }
    bomb=[bombRow,bombCol];
    const bombCell=document.querySelector(`.cell[data-row="${bomb[0]}"][data-col="${bomb[1]}"]`);
    bombCell.classList.add('bomb');
}

function setScore(){
    const p=document.querySelector('p');
    p.innerText=`SCORE: ${score}`;

}

function unsetFood(){
    const foodCell=document.querySelector(`.cell[data-row="${food[0]}"][data-col="${food[1]}"]`);
    foodCell.classList.remove('food');
}
function unsetBomb(){
    const bombCell=document.querySelector(`.cell[data-row="${bomb[0]}"][data-col="${bomb[1]}"]`);
    bombCell.classList.remove('bomb');
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
    if(head[0]<0||head[0]>=12||head[1]<0||head[1]>=12||isCollapse()||(bomb[0]==head[0]&&bomb[1]==head[1])){
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
            setScore();
            addNewTail()
            unsetFood();
            setFood();
            unsetBomb();
            setBomb();
            if(speed>100){
                speed-=50;
            }
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
setBomb();
id=interval();
