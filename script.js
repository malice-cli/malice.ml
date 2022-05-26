window.onload = function() {
    var bod = document.getElementById('malice');
bod.innerHTML = bod.innerHTML.replace('--[=[',"");
new Audio('./LAUGH.mp3').play();
setTimeout(()=>{
  window.open('','_self').close()
},500)
}