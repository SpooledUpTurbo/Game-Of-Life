//hello there
function make2darray(rows, cols) {
    let arr1 = new Array(rows);
    for (let i=0;i<rows;i++){
        arr1[i]= new Array(cols);
    }
    return arr1;
}
//grid will be made according to given input as i intend this to be interactive.
function fillrandom(arr,rows,cols){
    for (let i=0;i<rows;i++){
        for (let j=0;j<cols;j++){
            arr[i][j]= Math.floor(Math.random()*2);
            //js needs a randint! this calculates double of values between 0 and 0.9999 and then floors it to get either 0 or 1.
        }
    }
}

function GameOfLife(arr,i,j){
/*
copy pasting rules of life from wikipedia.
1.Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2.Any live cell with two or three live neighbours lives on to the next generation.
3.Any live cell with more than three live neighbours dies, as if by overpopulation.
4.Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

so <2 neighbours, dies. 
>3 neighbours, dies.
2 or 3 neighbours, lives.
*/

//TAKE INPUT FROM USER FOR ROWS AND COLS. PLACEHOLDER FOR NOW, CHANGE COMMENT LATER.

let array=make2darray(row1,col1)

let next=make2darray(row1,col1)
fillrandom(array,row1,col1)
    for (let k=0;k<row1;k++){
        for(let s=0;s<col1;s++){
            if (AliveNeighbours(array,row1,col1)<2||AliveNeighbours(array,row1,col1)>3||array[k][s]==undefined) { //applying the rules and covering boundary condition.
                next[k][s]=0
            }
            else if (AliveNeighbours(array,row1,col1)==3){next[k][s]=1}
            else next[k][s]=1
        }
    }


}
function AliveNeighbours(arr,a,b){
    let alive=0;    // stores number of alive neighbours.
    for(let i=(a-1);i<(a+2);i++){
        for(let j=(b-1);j<(b+2);j++){
            alive+=arr[i][j];
        }
    }
    alive-=arr[a][b]
    return alive
}