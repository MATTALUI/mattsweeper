$(document).ready(()=>{
  $('#startGame').on('click', startGame);
  $('#grid').on('click','td', selectSquare)
  $(window).on('resize', ()=>{
    $('td').width(screen.width/info.getWidth());
    $('td').height($('td').width());
  });
});
const info = gameInfo();





function gameInfo(){
  let gameOver = false;
  let width = 0;
  let height = 0;
  let mines = 0;
  let mineLocations = [];
  return {
    getMineCount: function(){
      return mines;
    },
    setMineCount: function(number){
      mines = mines + number;
      return 'done';
    },
    getWidth: function(){
      return width
    },
    setWidth: function(number){
      width = number;
    },
    getHeight: function(){
      return height;
    },
    setHeight: function(number){
      height = number;
    },
    getMineLocations: function(){
      return mineLocations
    },
    setMineLocations: function(){
      if (mineLocations.length > 0){
        return 'mine locations are already set!'
      }
      while(mineLocations.length < mines){
        let row = Math.ceil(Math.random()*height)
        let colomn = Math.ceil(Math.random()*width)
        let index = `${row}-${colomn}`
        if(mineLocations.indexOf(index) === -1 && index != event.target.id){
          mineLocations.push(index)
        }
      }

    },
    checkState: function(){
      return gameOver;
    },
    gameOver: function(){
      gameOver = true;
    }
  }
}

function startGame(){
  $('#initForm').hide();
  info.setMineCount(Number($('#mines').val()));
  info.setHeight(Number($('#rows').val()));
  info.setWidth(Number($('#colomns').val()));
  for (let row = 1; row <= info.getHeight();row++){
    $('#grid').append(`<tr id="row-${row}"></tr>`);
    for (let colomn = 1; colomn <= info.getWidth(); colomn++){
      $(`#row-${row}`).append(`<td id="${row}-${colomn}"></td>`)
    }
  }
  $('td').width(screen.width/info.getWidth());
  $('td').height($('td').width());
  $('td').addClass('hidden');
  $('td').contextmenu(()=>{
    event.preventDefault();
    if ($(`#${event.target.id}`).html() === '<img src="https://png.icons8.com/dusk/50/flag-2">'){
      $(`#${event.target.id}`).html('');
    }else{
      $(`#${event.target.id}`).html('<img src="https://png.icons8.com/dusk/50/flag-2">');
    }
  })
}

function selectSquare(){
  if (info.getMineLocations().length === 0){
    info.setMineLocations();
    console.log('set up all of the mines');
  }
  if (info.getMineLocations().indexOf(event.target.id) != -1){
    showMines();
    info.gameOver();
  }
  if (info.checkState()){
    alert('game over!');
    // if (confirm('play again?')){
    //   location.reload();
    // }
    return;
  }
  console.log((event.target.id));
  let surroundingMines = checkSurrounding(getSurrounding(event.target.id));
  $(`#${event.target.id}`).removeClass('hidden');
  $(`#${event.target.id}`).addClass('revealed');
  $(`#${event.target.id}`).html(surroundingMines);

}

function showMines(){
  for (let i =0; i < info.getMineLocations().length; i++){
    console.log(info.getMineLocations()[i]);
    $(`#${info.getMineLocations()[i]}`).removeClass('hidden');
    $(`#${info.getMineLocations()[i]}`).removeClass('revealed');
    $(`#${info.getMineLocations()[i]}`).addClass('mineReveal');
  }
}
function getSurrounding(index){
	let surrounding = [];
	let row = Number(index.split('-')[0]);
	let colomn = Number(index.split('-')[1]);
	surrounding.push(`${row-1}-${colomn-1}`);
	surrounding.push(`${row-1}-${colomn}`);
	surrounding.push(`${row-1}-${colomn+1}`);
	surrounding.push(`${row}-${colomn-1}`);
	surrounding.push(`${row}-${colomn+1}`);
	surrounding.push(`${row+1}-${colomn-1}`);
	surrounding.push(`${row+1}-${colomn}`);
	surrounding.push(`${row+1}-${colomn+1}`);
	return surrounding;
}
function checkSurrounding(array){
  return array.filter((indexNotation)=>{
    return (info.getMineLocations().indexOf(indexNotation) != -1)
  }).length
}
