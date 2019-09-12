var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');
// start webserver on port 8000
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(8000);
// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8000");
var line_history = [];
var import_history;
io.on('connection', function (socket) {
  if((typeof import_history)!== 'undefined'&&import_history!==null){
    socket.emit('import_image',import_history);
  }
  if(line_history!=[]){
    for (var i in line_history) {
      if(line_history[i]==null){
        var data={
          path:'',
          index:i,
          line_color:'black',
          line_width:0,
          text:null,
        }
        socket.emit('draw_line',data);
        socket.emit('erase_line',data);
      }
      else{
        if((typeof line_history[i].cx)!== 'undefined'){
          socket.emit('draw_rect',line_history[i]);
        }
        else if((typeof line_history[i].path)!== 'undefined'){
          socket.emit('draw_line',line_history[i]);
        }
      }
     }

  }
   socket.on('draw_line', function(data){
    line_history[data.index]=data;
    socket.broadcast.emit('draw_line', data);
   });
   socket.on('draw_rect', function(data){
    line_history[data.index]=data;
    socket.broadcast.emit('draw_rect', data);
   });
   socket.on('drag_line',function(data){
     line_history[data.index]=data;
    socket.broadcast.emit('drag_line', data);
   });
   socket.on('drag_rect',function(data){
    line_history[data.index]=data;
    socket.broadcast.emit('drag_rect', data);
  });
   socket.on('erase_line',function(data){
     line_history[data.index]=null;
    socket.broadcast.emit('erase_line', data);
  });
  socket.on('import_image',function(data){
    line_history=[];
    import_history=data;
   socket.broadcast.emit('import_image', data);
 });
  socket.on('clean_line', function(data){
    line_history=[];
    import_history=null;
     socket.broadcast.emit('clean_line', data);
  });

});
