var drawing = SVG('drawing').size(1024,600);
var socket  = io.connect();
//Array of all visible elements on canvas
var shapes = [];
let index = 0;
let shape;
//Determine whether an element is seleceted
var dragging=false;
//Determind which tool is selected
var penEnabled=false;
var eraserEnabled=false;
var hlEnabled=false;
var recEnabled=false;
var colorpicker='black';
var widthpicker=3;
//websocket functions
socket.on('draw_line',DrawNew);
function DrawNew(data){
  option = {
    'stroke': data.line_color,
    'stroke-width': data.line_width,
    'stroke-opacity': data.line_opacity,
    'fill':'none'
  };
  const shape = drawing.path(data.path).attr(option);
  shapes[index] = shape;
  index++;
  document.getElementById("code").value=data.text;
}
socket.on('draw_rect',DrawNewRec);
function DrawNewRec(data){
  option = {
    'stroke': data.line_color,
    'stroke-width': data.line_width,
    'stroke-opacity': 1,
    'fill':'none'
  };
  const shape = drawing.rect(data.width,data.height).attr(option).move(data.cx,data.cy);
  shapes[index] = shape;
  index++;
  document.getElementById("code").value=data.text;
}
socket.on('drag_line',DragNew);
function DragNew(data){
  option = {
    'stroke': data.line_color,
    'stroke-width': data.line_width,
    'stroke-opacity': data.line_opacity,
    'fill':'none'
  };
  const shape = drawing.path(data.path).attr(option);
  shapes[data.index].style({stroke:"none"});
  shapes[data.index].selectize(false, {deepSelect:true});
  shapes[data.index] = shape;
}
socket.on('drag_rect',DragNewRec);
function DragNewRec(data){
  option = {
    'stroke': data.line_color,
    'stroke-width': data.line_width,
    'stroke-opacity': 1,
    'fill':'none'
  };
  const shape = drawing.rect(data.width,data.height).attr(option).move(data.cx,data.cy);
  shapes[data.index].style({stroke:"none"});
  shapes[data.index].selectize(false, {deepSelect:true});
  shapes[data.index] = shape;
}
socket.on('erase_line',EraseNew);
function EraseNew(data){
  shapes[data.index].style({stroke:"none"});
  shapes[data.index].selectize(false, {deepSelect:true});
}
socket.on('clean_line',CleanNew);
function CleanNew(data){
  shapes=[];
  index=0;
  drawing.clear();
}
socket.on('import_image',ImportNew);
function ImportNew(data){
  newViewBoxWidth=1024;
  newViewBoxHeight=600;
  realclick=false;
  var simulateClick = function (elem) {
    var evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
	// If cancelled, don't dispatch our event
    var canceled = !elem.dispatchEvent(evt);
  };
  var someLink = document.querySelector('#clear');
  simulateClick(someLink);
  realclick=true;
  newViewBoxWidth=data.newViewBoxWidth;
  newViewBoxHeight=data.newViewBoxHeight;
  drawing.svg(data.text);
}
//Pick color and line width
function selectColor(e){
  colorpicker=window.getComputedStyle(e.target, null).backgroundColor;
}
function selectWidth(id){
  if(id=="thin"){
    widthpicker=3;
  }
  else if(id=="thick"){
    widthpicker=8;
  }
}
black.onclick=function(){
    unselect();
    dragging=false;
    black.classList.add('active');
    red.classList.remove('active');
    yellow.classList.remove('active');
    blue.classList.remove('active');
    green.classList.remove('active');
}
red.onclick=function(){
    unselect();
    dragging=false;
    red.classList.add('active');
    black.classList.remove('active');
    yellow.classList.remove('active');
    blue.classList.remove('active');
    green.classList.remove('active');
}
yellow.onclick=function(){
    unselect();
    dragging=false;
    yellow.classList.add('active');
    black.classList.remove('active');
    red.classList.remove('active');
    blue.classList.remove('active');
    green.classList.remove('active');
}
blue.onclick=function(){
    unselect();
    dragging=false;
    blue.classList.add('active');
    black.classList.remove('active');
    yellow.classList.remove('active');
    red.classList.remove('active');
    green.classList.remove('active');
}
green.onclick=function(){
    unselect();
    dragging=false;
    green.classList.add('active');
    black.classList.remove('active');
    yellow.classList.remove('active');
    blue.classList.remove('active');
    red.classList.remove('active');
}
//Canvas tools
pen.onclick=function(){
    unselect();
    dragging=false;
    penEnabled=true;
    eraserEnabled=false;
    hlEnabled=false;
    recEnabled=false;
    pen.classList.add('active');
    eraser.classList.remove('active');
    highlighter.classList.remove('active');
    rec.classList.remove('active');
    zoom_in.classList.remove('active');
    zoom_out.classList.remove('active');
 }
eraser.onclick=function(){
    unselect();
    dragging=false;
    penEnabled=false;
    eraserEnabled=true;
    hlEnabled=false;
    recEnabled=false;
    pen.classList.remove('active');
    eraser.classList.add('active');
    highlighter.classList.remove('active');
    rec.classList.remove('active');
    zoom_in.classList.remove('active');
    zoom_out.classList.remove('active');
}
highlighter.onclick=function(){
    unselect();
    dragging=false;
    penEnabled=false;
    eraserEnabled=false;
    hlEnabled=true;
    recEnabled=false;
    pen.classList.remove('active');
    highlighter.classList.add('active');
    eraser.classList.remove('active');
    rec.classList.remove('active');
    zoom_in.classList.remove('active');
    zoom_out.classList.remove('active');
 }
rec.onclick=function(){
    unselect();
    dragging=false;
    penEnabled=false;
    eraserEnabled=false;
    hlEnabled=false;
    recEnabled=true;
    pen.classList.remove('active');
    eraser.classList.remove('active');
    highlighter.classList.remove('active');
    rec.classList.add('active');
    zoom_in.classList.remove('active');
    zoom_out.classList.remove('active');
}
var viewwidth=drawing.width();
var viewheight=drawing.height();
var coordinateX=0;
var coordinateY=0;
zoom_in.onmousedown=function(){
  viewwidth=viewwidth*0.8;
  viewheight=viewheight*0.8;
  drawing.viewbox(coordinateX, coordinateY, viewwidth,viewheight);
  pen.classList.remove('active');
  eraser.classList.remove('active');
  highlighter.classList.remove('active');
  rec.classList.remove('active');
  zoom_in.classList.add('active');
 }
zoom_in.onmouseup=function(){
    zoom_in.classList.remove('active');
 }
zoom_out.onmousedown=function(){
  viewwidth=viewwidth*1.25;
  viewheight=viewheight*1.25;
  drawing.viewbox(coordinateX, coordinateY, viewwidth,viewheight);
    pen.classList.remove('active');
    eraser.classList.remove('active');
    highlighter.classList.remove('active');
    rec.classList.remove('active');
    zoom_out.classList.add('active');
 }
zoom_out.onmouseup=function(){
    zoom_out.classList.remove('active');
 }
//Scroll the canvas by arrow keys
document.getElementById("drawing").addEventListener("keydown", function(event){
  const key = event.key.toLowerCase();
  if(key=="arrowdown"){
    coordinateY+=(viewheight*0.05);
    drawing.viewbox(coordinateX,coordinateY, viewwidth,viewheight);
  }
  if(key=="arrowup"){
    coordinateY-=(viewheight*0.05);
    drawing.viewbox(coordinateX,coordinateY, viewwidth,viewheight);
  }
  if(key=="arrowright"){
    coordinateX+=(viewwidth*0.05);
    drawing.viewbox(coordinateX,coordinateY, viewwidth,viewheight);
  }
  if(key=="arrowleft"){
    coordinateX-=(viewwidth*0.05);
    drawing.viewbox(coordinateX,coordinateY, viewwidth,viewheight);
  }
});
var realclick=true;
clear.onclick=function(){
  shapes = [];
  index=0;
  pen.classList.remove('active');
  eraser.classList.remove('active');
  highlighter.classList.remove('active');
  rec.classList.remove('active');
  drawing.clear();
  coordinateX=0;
  coordinateY=0;
  viewwidth=1024;
  viewheight=600;
  drawing.viewbox(coordinateX, coordinateY, viewwidth,viewheight);
  if(realclick==true){
    socket.emit('clean_line',{line:'here'});
  }
}
download.onmousedown=function(){
    unselect();
    dragging=false;
    penEnabled=false;
    eraserEnabled=false;
    hlEnabled=false;
    recEnabled=false;
    pen.classList.remove('active');
    eraser.classList.remove('active');
    highlighter.classList.remove('active');
    rec.classList.remove('active');
    zoom_in.classList.remove('active');
    zoom_out.classList.remove('active');
    download.classList.add('active');
    var svg = document.getElementById("drawing");
  var serializer = new XMLSerializer();
  var source = serializer.serializeToString(svg);
  if(source.indexOf("0 0 1024 600\"/></div>")!=-1){
    source="<?xml version=\"1.0\" standalone=\"no\"?><div xmlns=\"http://www.w3.org/1999/xhtml\" id=\"drawing\" tabindex=\"0\"><svg id=\"SvgjsSvg1001\" width=\"1024\" height=\"600\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:svgjs=\"http://svgjs.com/svgjs\"><defs id=\"SvgjsDefs1002\"/></svg></div>";
    var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href=url;
    a.download='My Annotation';
    a.click();
    return;
  }
  var index= source.search(/viewBox=/);
  var index1= source.search(/"=""/);
  var k=0;
  var replaceViewBox="";
  if(index!=-1&&index1==-1){
    replaceViewBox="";
    for(k=index+9;k<source.length-index-9;k++){
      if(source[k]=="\""||source[k]=="\'"){
        break;
      }
      replaceViewBox+=source[k];
    }
    source= source.replace(replaceViewBox, "0,0,1024,600");
  }
  else if(index!=-1&&index1!=-1){
    replaceViewBox="";
        for(k=index+9;k<source.length-index-9;k++){
      if(source[k]=="\""||source[k]=="\'"){
        break;
      }
      replaceViewBox+=source[k];
    }
    source= source.replace(replaceViewBox, "0 0 "+newViewBoxWidth+" "+newViewBoxHeight);
    var newViewBox="viewBox=\"0 0  "+newViewBoxWidth+" "+newViewBoxHeight+"\"";
    source=source.replace(/"=""/,newViewBox);
  }
  else if(index==-1&&index1!=-1){
    var newViewBox="viewBox=\"0 0  "+newViewBoxWidth+" "+newViewBoxHeight+"\"";
    source=source.replace(/"=""/,newViewBox);
  }  if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');}
  if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');}
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
  var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.href=url;
  a.download='My Annotation';
  a.click();
 }
download.onmouseup=function(){
    download.classList.remove('active');
 }
//Textarea tools
//User can copy current SVG content
copybutton.onclick=function(){
  var textBox = document.getElementById("code");
  textBox.select();
  document.execCommand("copy");
}
//User can empty SVG content in the SVG text area
emptybutton.onclick=function(){
  document.getElementById("code").value ="";
}
var newViewBoxWidth=1024;
var newViewBoxHeight=600;
applybutton.onclick=function(){
  newViewBoxWidth=1024;
  newViewBoxHeight=600;
  realclick=false;
  var simulateClick = function (elem) {
    var evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
	// If cancelled, don't dispatch our event
    var canceled = !elem.dispatchEvent(evt);
  };
  var someLink = document.querySelector('#clear');
  simulateClick(someLink);
  realclick=true;
  var textBox = document.getElementById("code").value;
  var index= textBox.search(/viewBox=/);
  var front=false;
  var removeViewBox="";
  for(k=index;k<textBox.length-index;k++){
    if(textBox[k]=="\""||textBox[k]=="\'"){
      if(front==false){
        front=true;
      }
      else{
        break;
      }
    }
    removeViewBox+=textBox[k];
  }
  var regexStr= removeViewBox.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g);
  newViewBoxWidth=regexStr[3];
  newViewBoxHeight=regexStr[4];
  textBox=textBox.replace(removeViewBox,'');
  drawing.svg(textBox);
  var data={
    newViewBoxWidth:newViewBoxWidth,
    newViewBoxHeight:newViewBoxHeight,
    text:textBox
  }
  socket.emit('import_image',data);
}
//User can draw a rectangle
//User can draw use a pen
const getDrawObject = () => {
  option = {
  'stroke': colorpicker,
  'stroke-width': widthpicker,
  'stroke-opacity': 1,
  'fill':'none'
};
  if(dragging==true){
    return;
  }
  if(penEnabled==true){
    return drawing.polyline().attr(option);
  }
  else if(hlEnabled==true){
    option = {
      'stroke': colorpicker,
      'stroke-width': widthpicker,
      'stroke-opacity':0.5,
      'fill':'none'
    };
    return drawing.polyline().attr(option);
  }
  else if(recEnabled==true){
       opacity=1;// Holds event, current Point-coords and matrix
       return drawing.rect().attr(option);
  }
}
drawing.on('mousedown', event => {
  selected=1;
  const shape = getDrawObject();
  shapes[index] = shape;
  shape.draw(event);
});
drawing.on('mousemove', event => {
  if ((penEnabled==true && shapes[index])||(hlEnabled==true && shapes[index])) {
    shapes[index].draw('point', event);
  }
});
drawing.on('mouseup', event => {
  if (penEnabled==true||hlEnabled==true) {
    shapes[index].draw('stop', event);
    var origin=shapes[index].attr("points");
    const shape =BezierCurve(origin,colorpicker,widthpicker);
    const newshape=drawing.path(shape).attr(option);
   shapes[index].replace(newshape);
   shapes[index]=newshape;
    if(newshape.length()<=2){
      document.getElementById("code").value ="";
      shapes[index].remove();
      index--;
    }
    else{
      if(penEnabled==true){
        var text="<path d=\""+shapes[index].attr('d')+"\" style=\"stroke-width:"+widthpicker+";stroke:"+colorpicker+";fill-opacity:0\"/>";
        document.getElementById("code").value=text;
        var data={
          path:shapes[index].attr("d"),
          index:index,
          line_color:colorpicker,
          line_width:widthpicker,
          text:text
        }
        socket.emit('draw_line',data);
      }
      else if(hlEnabled==true){
        var text="<path d=\""+shapes[index].attr('d')+"\" style=\"stroke-width:"+widthpicker+";stroke:"+colorpicker+";stroke-opacity:0.5;fill-opacity:0\"/>";
        document.getElementById("code").value=text;
        var data={
          path:shapes[index].attr("d"),
          index:index,
          line_color:colorpicker,
          line_width:widthpicker,
          line_opacity:0.5,
          text:text
        }
        socket.emit('draw_line',data);
      }
    }
  } else {
    shapes[index].draw(event);
    if(recEnabled==true){
      if(shapes[index].attr('width')<=1&&shapes[index].attr('height')<=1){
        document.getElementById("code").value ="";
        shapes[index].remove();
        index--;
      }
      else{
        var text="<rect x=\""+shapes[index].attr('x')+"\" y=\""+shapes[index].attr('y')+"\" width=\""+shapes[index].attr('width')+"\"height=\""+shapes[index].attr('height')+"\" style=\"stroke-width:"+widthpicker+";stroke:"+colorpicker+";fill-opacity:0\"/>";
        document.getElementById("code").value=text;
        var data={
          width:shapes[index].attr('width'),
          height:shapes[index].attr('height'),
          cx:shapes[index].attr('x'),
          cy:shapes[index].attr('y'),
          index:index,
          line_color:colorpicker,
          line_width:widthpicker,
          text:text
        }
        socket.emit('draw_rect',data);
      }
    }
    else{
      document.getElementById("code").value ="";
    }
  }
  index++;
});
//User can view the SVG content once draw an element
//User can select SVG content
function unselect(){
  var i;
  for(i=0;i<index;i++){
    if (typeof shapes[i].fixed === "function") {
      shapes[i].fixed();
    }
    shapes[i].selectize(false, {deepSelect:true}).resize('stop');
  }
}
var object='';
var eraseobject='';
var click = function() {
  unselect();
  if(penEnabled==true||hlEnabled==true){
    if(this.toString().includes("Path")){
      object=this.toString();
      this.selectize({deepSelect:true}).resize();
      this.draggy();
      dragging=true;
      selected--;
    }
    else{
      return;
    }
  }
  else if(recEnabled==true){
    if(this.toString().includes("Rect")){
      object=this.toString();
      this.selectize({deepSelect:true}).resize();
      this.draggy();
      dragging=true;
      selected--;
    }
    else{
      return;
    }
  }
  else if(eraserEnabled==true){
    eraseobject=this.toString();
    var i=0;
    for(i=0;i<index;i++){
      if(eraseobject==shapes[i]){
        var data={
          index:i,
        }
        socket.emit('erase_line',data);
        object='';
      }
    }
    this.style({stroke:"none"});
    this.selectize(false, {deepSelect:true});
  }
}
var selected=1;
drawing.on("mousedown", event => {
  var i=0;
  for(i=0;i<index;i++){
    shapes[i].on('click', click);
  }
});
drawing.on("mouseup", event => {
  if(object!=''){
    if(object.includes("Path")){
      var i=0;
      for(i=0;i<index;i++){
        if(object==shapes[i]){
          var data={
            path:shapes[i].attr("d"),
            index:i,
            line_color:shapes[i].attr('stroke'),
            line_width:shapes[i].attr('stroke-width'),
            line_opacity:shapes[i].attr('stroke-opacity')
          }
          socket.emit('drag_line',data);
        }
        else{
          continue;
        }
      }
    }
    else{
      var i=0;
      for(i=0;i<index;i++){
        if(object==shapes[i]){
          var data={
            width:shapes[i].attr('width'),
            height:shapes[i].attr('height'),
            cx:shapes[i].attr('x'),
            cy:shapes[i].attr('y'),
            index:i,
            line_color:shapes[i].attr('stroke'),
            line_width:shapes[i].attr('stroke-width'),
          }
          socket.emit('drag_rect',data);
        }
        else{
          continue;
        }
      }
    }
  }

  if(selected==1){
      unselect();
      dragging=false;
  }
});
// This is custom extension of line, polyline, polygon which doesn't draw the circle on the line.
SVG.Element.prototype.draw.extend('line polyline polygon', {

  init:function(e){
    // When we draw a polygon, we immediately need 2 points.
    // One start-point and one point at the mouse-position
    this.set = new SVG.Set();
    var p = this.startPoint,
        arr = [
          [p.x, p.y],
          [p.x, p.y]
        ];

    this.el.plot(arr);
  },
  // The calc-function sets the position of the last point to the mouse-position (with offset ofc)
  calc:function (e) {
    var arr = this.el.array().valueOf();
    arr.pop();

    if (e) {
      var p = this.transformPoint(e.clientX, e.clientY);
      arr.push(this.snapToGrid([p.x, p.y]));
    }

    this.el.plot(arr);
  },
  point:function(e){

    if (this.el.type.indexOf('poly') > -1) {
      // Add the new Point to the point-array
      var p = this.transformPoint(e.clientX, e.clientY),
          arr = this.el.array().valueOf();

      arr.push(this.snapToGrid([p.x, p.y]));

      this.el.plot(arr);

      // Fire the `drawpoint`-event, which holds the coords of the new Point
      this.el.fire('drawpoint', {event:e, p:{x:p.x, y:p.y}, m:this.m});

      return;
    }

    // We are done, if the element is no polyline or polygon
    this.stop(e);

  },
  clean:function(){

    // Remove all circles
    this.set.each(function () {
      this.remove();
    });
    this.set.clear();
    delete this.set;
  },
});
function BezierCurve(str,colorpicker,widthpicker){
  var words = str.split(' ');
  var size =1;
  var arrayOfArrays = "";
for (var i=1; i<words.length; i+=size) {
  arrayOfArrays+="\["
                        +words.slice(i,i+size)+"\], ";
}
  const smoothing = 0.12
  const svg = document.getElementById('drawing')
  const points = eval('\['+arrayOfArrays + '\]');
  const line = (pointA, pointB) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
      length: Math.sqrt(Math.pow(lengthX, 2)+ Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    }
  }
  const controlPoint = (lineCalc, smooth) => (current, previous, next, reverse) =>{
    const p = previous || current;
    const n = next || current;
    const l = lineCalc(p, n);
    const angle = l.angle + (reverse ? Math.PI : 0);
    const length = l.length * smooth;
    const x= current[0]+Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
  }
  const bezierCommand = (controlPointCalc) => (point, i, a) => {
    const [cpsX, cpsY] = controlPointCalc(a[i - 1], a[i - 2], point);
    const [cpeX, cpeY] = controlPointCalc(point, a[i - 1], a[i + 1], true);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
  }
  var d;
  const svgPath = (points, command) => {
    d = points.reduce((acc, point, i, a) => i === 0
      ? `M ${point[0]},${point[1]}`
      : `${acc} ${command(point, i, a)}`
  , '')
    return `<path d="${d}" fill="none" stroke="${colorpicker}" stroke-width=${widthpicker}>`
  }
  const controlPointCalc = controlPoint(line, smoothing);
  const bezierCommandCalc = bezierCommand(controlPointCalc);
  svgPath(points, bezierCommandCalc);
  //svg.innerHTML+=svgPath(points, bezierCommandCalc);
  return d;
}
