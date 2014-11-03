$(document).ready(function () {

    // ======================================================================
    // ======================================================================

    var form = '';
    var inmotion = false;
    var id = 0;
    var beingEdit = {};
	var beingDragged = null;
    var mouseStart = 
    {
        'x': 0,
        'y': 0,
        'originalCo': {
            'x': 0,
            'y': 0
        }
    };
    var items = new Array();
    var lineData = {};
    var canvas = $('#ACanvas')[0];
    canvas.width=1200;
    canvas.height=700;
    var canvasLeft = $('#ACanvas').offset().left;
    var canvasTop = $('#ACanvas').offset().top;
    var ctx = canvas.getContext('2d');
    var img1=document.getElementById("COMID1");
    var img2=document.getElementById("COMID2");
	var img3=document.getElementById("COMID3");
	var img4=document.getElementById("COMID4");
	var img5=document.getElementById("COMID5");
	var img6=document.getElementById("COMID6");
	var img7=document.getElementById("COMID7");
	var img8=document.getElementById("COMID8");

    $('#COMID1').bind('click', function () {
        form = (form == 'sine'? '' : 'sine');
    });
    $('#COMID2').bind('click', function () {form = (form == 'add'? '' : 'add');});
	$('#COMID3').bind('click', function () {form = (form == 'product'? '' : 'product');});
	$('#COMID4').bind('click', function () {form = (form == 'constant'? '' : 'constant');});
	$('#COMID5').bind('click', function () {form = (form == 'gain'? '' : 'gain');});
	$('#COMID6').bind('click', function () {form = (form == 'tofile'? '' : 'tofile');});
	$('#COMID7').bind('click', function () {form = (form == 'gaussian'? '' : 'gaussian');});
	$('#COMID8').bind('click', function () {form = (form == 'analog'? '' : 'analog');});
/////
    $('#TOOLID1').bind('click', function () {
        form = (form == 'line'? '' : 'line');
    });
    $('#TOOLID2').bind('click', function () {form = (form == 'era'? '' : 'era');});

    // ======================================================================
    // ======================================================================
    function Element(type) { 
        this.type = type;
        this.id = id++;
    };

    Element.prototype._popUp = function() {
    };

    function Component(type, x, y, width, height) {
        Element.call(this, type);
        this.type = type; 
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.attr = new Object();
		this.attr1 = new Object();
        switch(this.type) {
            case 'sine': {
			    this.btype = 'Sin';
			    this.name = 'Sine Wave\\nFunction';
				this.inPorts = [1];
                this.inPortPos = [0, 37];
                this.outPorts = [1];
                this.outPortPos = [75, 37];
			    this.ports = [1, 1];
				this.position = [this.x, this.y, this.x + this.width, this.y + this.height]
				this.attr1.SineType = '"Time based"'
                this.attr.Amplitude = 1;//
                this.attr.frequency = 1;//
                this.attr.bias = 0;//
				this.attr1.TimeSource = '"Use external signal"';
				this.attr1.SampleTime = '"0"';
                break;
            }
			case 'add': {
			    this.btype = 'Sum';
			    this.name = 'Add';
				this.inPorts = [1,2];
                this.inPortPos = [0, 20, 0, 55];
				this.outPorts = [1];
                this.outPortPos = [75, 37];
			    this.ports = [2, 1];
				this.position = [this.x, this.y, this.x + this.width, this.y + this.height]
				this.attr1.InputSameDT = 'off';
				this.attr1.OutDataTypeMode = '"Inherit via internal rule"';
				this.attr1.OutScaling = '"2^-10"';
				this.attr1.SaturateOnIntegerOverflow = 'off';
				break;
			}
			case 'product': {
			    this.btype = 'Product';
			    this.name = 'Product';
				this.inPorts = [1,2];
                this.inPortPos = [0, 19, 0, 56];
				this.outPorts = [1];
                this.outPortPos = [75, 37];
			    this.ports = [2, 1];
				this.position = [this.x, this.y, this.x + this.width, this.y + this.height]
				this.attr1.InputSameDT = 'off';
				this.attr1.OutDataTypeMode = '"Inherit via internal rule"';
				this.attr1.SaturateOnIntegerOverflow = 'off';
				break;
			}
            case 'constant': {
			    this.btype = 'Constant';
			    this.name = 'Constant';
				this.inPorts = [];
                this.inPortPos = [];
				this.outPorts = [1];
                this.outPortPos = [75, 37];
			    this.ports = [0,1];
				this.position = [this.x, this.y, this.x + this.width, this.y + this.height]
				this.attr.Value = 1;//
				break;
			}
			case 'gain': {
			    this.btype = 'Gain';
			    this.name = 'Gain';
				this.inPorts = [1,1];
                this.inPortPos = [0, 37];
				this.outPorts = [1];
                this.outPortPos = [75, 37];
			    this.ports = [1, 1];
				this.position = [this.x, this.y, this.x + this.width, this.y + this.height]
			    this.attr.Gain = 1;//
				this.attr1.ParameterDataTypeMode = '"Inherit via internal rule"';
				this.attr1.OutDataTypeMode = '"Inherit via internal rule"';
				this.attr1.SaturateOnIntegerOverflow = 'off';
				break;
			}
			case 'fofile': {
			    this.btype = 'ToFile';
			    this.name = 'To File';
                this.inPorts = [1];
                this.inPortPos = [0, 37];
				this.outPorts = [];
                this.outPortPos = [];
			    this.ports = [1, 0];
				this.position = [this.x, this.y, this.x + this.width, this.y + this.height]
				this.attr1.Filename = '"simulinksample.mat"';
				break;
			}
			case 'gaussian': {
			    this.btype = 'Reference';
			    this.BlockType = 'Reference';
				this.name = 'Gaussian Noise\\nGenerator';
                this.inPorts = [];
                this.inPortPos = [];
				this.outPorts = [1];
                this.outPortPos = [75, 37];
			    this.ports = [0, 1];
				this.position = [this.x, this.y, this.x + this.width, this.y + this.height]
				this.attr1.FontName = '\"Arial\"';
				this.attr1.FontSize = '10';
				this.attr1.SourceBlock = '"commnoisgen2/Gaussian Noise\\nGenerator"';
				this.attr1.SourceType = '"Gaussian Noise Generator"';
				this.attr1.ShowPortLabels = 'on';
				this.attr.m = 0;//
				this.attr.d = 1;//
				this.attr.s = 41;//
				this.attr1.Ts = '"1"';
				this.attr1.frameBased = 'off';
				this.attr1.sampPerFrame = '"1"';
				this.attr1.orient = 'off';
				break;
			}
			case 'analog': {
			    this.btype = 'Reference';
			    this.Name = 'Analog'
				this.outPorts = [1];
                this.outPortPos = [75, 37];
                this.inPorts = [1];
                this.inPortPos = [0, 37];
			    this.ports = [1, 1];
				this.position = [this.x, this.y, this.x + this.width, this.y + this.height]
				this.attr1.FontSize = '10';
				this.attr1.SourceBlock = '"dsparch4/Analog\\nFilter Design"';
				this.attr1.SourceType = '"Analog Filter Design"';
				this.attr1.method = '"Butterworth"';
				this.attr1.filttype = '"Lowpass"';
				this.attr.N = 8;//
				this.attr.Wlo = 30;//
				this.attr1.Whi = '"80"';
				this.attr1.Rp = '"2"';
				this.attr1.Rs = '"40"';
				break;
			}
            default: break;
        }
    };

    Component.prototype = new Element(); 

    Component.prototype._draw = function() {
        switch(this.type) {
            case 'sine': {
                ctx.drawImage(img1,this.x - this.width / 2, this.y - this.height / 2);
                break;
            }
            case 'add': {
                ctx.drawImage(img2,this.x - this.width / 2, this.y - this.height / 2);
                break;
            }
			case 'product': {
                ctx.drawImage(img3,this.x - this.width / 2, this.y - this.height / 2);
                break;
            }
			case 'constant': {
                ctx.drawImage(img4,this.x - this.width / 2, this.y - this.height / 2);
                break;
            }
			case 'gain': {
                ctx.drawImage(img5,this.x - this.width / 2, this.y - this.height / 2);
                break;
            }
			case 'tofile': {
                ctx.drawImage(img6,this.x - this.width / 2, this.y - this.height / 2);
                break;
            }
			case 'gaussian': {
                ctx.drawImage(img7,this.x - this.width / 2, this.y - this.height / 2);
                break;
            }
			case 'analog': {
                ctx.drawImage(img8,this.x - this.width / 2, this.y - this.height / 2);
                break;
            }
            default: break;
        }
    };

    Component.prototype._setAttr = function(arr) {
        switch(this.type) {
            case sine: {
                this.attr.amplitude = arr[0];
                this.attr.frequency = arr[1];
                this.attr.bias = arr[2];
                break;
            }
            case constant: {this.attr.Value = arr[0];break;}
			case gain: {this.attr.gain = arr[0];break;}
			case gaussian: {
			    this.attr.m = arr[0];
		    	this.attr.d = arr[1];
			    this.attr.s = arr[2];
			    break;
			}
			case analog: {
			    this.attr.N = arr[0];
			    this.attr.Wlo = arr[1];
			    break;
			}
            default: break;
        }
    };

    Component.prototype._popUp = function() {
        beingEdit = this;
        var popUpWindow = $('#'+this.type);     // 获取到编辑窗这个dom元素
        popUpWindow.css({     //调整编辑窗位置
            'left': this.x + this.width / 2 + canvasLeft,
            'top': this.y + this.height / 2 + canvasTop
        });

        switch(this.type) {     //$(xxx).val(a)
            case 'sine': {
                $(popUpWindow.find('input[type=text]')[0]).val(this.attr.amplitude);
                $(popUpWindow.find('input[type=text]')[1]).val(this.attr.frequency);
                $(popUpWindow.find('input[type=text]')[2]).val(this.attr.phase);
                break;
            }
            case 'constant': {
                $(popUpWindow.find('input[type=text]')[0]).val(this.attr.constant);
                break;
            }
			case 'gain': {
                $(popUpWindow.find('input[type=text]')[0]).val(this.attr.gain);
                break;
            }
			case 'gaussian': {
                $(popUpWindow.find('input[type=text]')[0]).val(this.attr.mean);
                $(popUpWindow.find('input[type=text]')[1]).val(this.attr.variance);
                $(popUpWindow.find('input[type=text]')[2]).val(this.attr.initil);
                break;
            }
			case 'analog': {
                $(popUpWindow.find('input[type=text]')[0]).val(this.attr.filter);
                $(popUpWindow.find('input[type=text]')[1]).val(this.attr.edge);
                break;
            }
            default: break;
        }

        popUpWindow.show(); 
    };

	Component.prototype._getMDL = function () {
        var res = '';
        res += 'Block {\n    BlockType    ' + this.btype + '\n    Name    ';
        res += '"' + this.name + this.id + '"\n    Ports    [';
        // res += this.ports.join(',') + ']\n    Position    [';
        res += this.ports.join(',') + ']\n    Position    [';
        res += this.position.join(',') + ']\n';
        for (var i in this.attr) {
            res += '    ' + i + '    "' + this.attr[i] + '"\n'
        }
		for (var i in this.attr1) {
            res += '    ' + i + '    ' + this.attr1[i] + '\n'
        }
        res += '}\n';
        return res;
    }

    function Line(width, startx, starty) {
        Element.call(this, 'line');
        this.start = {'x': startx, 'y': starty};
        this.width = width;
        this.srcIsOut = true;
        this.isValid = true;
        this.srcBlock = -1;
        this.srcPort = -1;
        this.dstBlock = -1;
        this.dstPort = -1;
    };

    Line.prototype = new Element();

    Line.prototype._endLine = function(endx, endy) {
        this.end = {'x': endx, 'y': endy};
    }

	Line.prototype._startLine = function(startx, starty) {
        this.start = {'x': startx, 'y': starty};
    }
	
	Line.prototype._endPort = function(item, portNum, isOut) {
        if(isOut == true && this.srcIsOut == true || isOut == false && this.srcIsOut == false) {
            return false;
        } else if (this.srcIsOut != true) {
            this.srcIsOut = true;
            this.isValid = true;
            this.dstBlock = this.srcBlock;
            this.dstPort = this.srcPort;
            this.srcBlock = item.id;
            this.srcPort = portNum;

            if(isOut) {
                this._endLine(item.x + item.outPortPos[(portNum-1)*2] - item.width / 2, item.y + item.outPortPos[(portNum-1)*2 + 1] - item.height / 2);
            } else {
                this._endLine(item.x + item.inPortPos[(portNum-1)*2] - item.width / 2, item.y + item.inPortPos[(portNum-1)*2 + 1] - item.height / 2);
            }
            return true;
        }
        else {
            this.isValid = true;
            this.dstBlock = item.id;
            this.dstPort = portNum;            
            if(isOut) {
                this._endLine(item.x + item.outPortPos[(portNum-1)*2] - item.width / 2, item.y + item.outPortPos[(portNum-1)*2 + 1] - item.height / 2);
            } else {
                this._endLine(item.x + item.inPortPos[(portNum-1)*2] - item.width / 2, item.y + item.inPortPos[(portNum-1)*2 + 1] - item.height / 2);
            }
            return true;
        }
    }

	Line.prototype._startPort = function(item, portNum, isOut) {
        this.srcBlock = item.id;
        this.srcPort = portNum;
        this.srcIsOut = isOut;
        if(isOut) {
            this._startLine(item.x + item.outPortPos[(portNum-1)*2] - item.width / 2, item.y + item.outPortPos[(portNum-1)*2 + 1] - item.height / 2);
        } else {
            this._startLine(item.x + item.inPortPos[(portNum-1)*2] - item.width / 2, item.y + item.inPortPos[(portNum-1)*2 + 1] - item.height / 2);
        }
    }
	
	Line.prototype._getMDL = function() {
        var src = getItem(this.srcBlock);
        var dst = getItem(this.dstBlock);
        var res = '';
        res +=  '\nLine { \n    SrcBlock    ';
        res += '"' + src.name + src.id + '"\n    SrcPort    ';
        res += this.srcPort + '\n    DstBlock    ';
        res += '\"' + dst.name + dst.id + '"\n    DstPort    ';
        res += this.dstPort + '\n}\n';
        return res;
    }

    Line.prototype._draw = function() {
        ctx.beginPath();
        if(this.isValid == true) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
        } else {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
        }
        
        ctx.moveTo(this.start.x,this.start.y);
        ctx.lineTo(this.end.x,this.end.y);
        ctx.stroke(); 
    }
	
	Component.prototype._set = function(x, y) {
		this.x = x;
        this.y = y;
	}

    // ======================================================================
    // ======================================================================
    $('#ACanvas').bind('mousedown', function (e) {
        var eventX = e.pageX - canvasLeft;
        var eventY = e.pageY - canvasTop;
        switch(form) {
            case 'sine': {
                var com = new Component(form, eventX, eventY, 75, 75); 
                items.push(com);
				form = '';
                break;
            }
                
            case 'add': {
				var com = new Component(form, eventX, eventY, 75, 75);
                items.push(com); 
				form = '';
                break;
            }
			case 'product': {
				var com = new Component(form, eventX, eventY, 75, 75);
                items.push(com); 
				form = '';
                break;
            }
			case 'constant': {
				var com = new Component(form, eventX, eventY, 75, 75);
                items.push(com); 
				form = '';
                break;
            }
			case 'gain': {
				var com = new Component(form, eventX, eventY, 75, 75);
                items.push(com); 
				form = '';
                break;
            }
			case 'tofile': {
				var com = new Component(form, eventX, eventY, 75, 75);
                items.push(com); 
				form = '';
                break;
            }
			case 'gaussian': {
				var com = new Component(form, eventX, eventY, 75, 75);
                items.push(com); 
				form = '';
                break;
            }
			case 'analog': {
				var com = new Component(form, eventX, eventY, 75, 75);
                items.push(com); 
				form = '';
                break;
            }
////////
            case 'line': {
                lineData = new Line(1, eventX, eventY);
				inmotion = true;
				for(var cnt in items) {
                    if(items[cnt] instanceof Component) {
                        var res = getPort(items[cnt], eventX, eventY);
                        if(res[0] != -1) {
                            lineData._startPort(items[cnt], res[0], res[1]);
                            lineData._endLine(eventX, eventY);
                            items.push(lineData);
                            lineData._draw();
                            return;
                        }
                    }
                }
				lineData._startLine(eventX, eventY);				
				lineData._endLine(eventX, eventY);
				items.push(lineData);
				lineData._draw();
                break;
            }
            case 'era': {
                for (var x in items) {
                    if (isIntersected(eventX, eventY, items[x])) {
                        items.splice(x, 1);
                    }
                }
                break;
            }
            default: {
                $('.comattr').hide();
                for (var x in items) {
                    if (isIntersected(eventX, eventY, items[x])) {
                        beingDragged = items[x];
                        mouseStart = {'x': eventX, 'y': eventY, 'originalCo': {'x': beingDragged.x, 'y': beingDragged.y}};                     
                    }
                }                
            };
        };
        drawall();
    });

    $('#ACanvas').bind('mousemove', function (e) {
	    var eventX = e.pageX - canvasLeft;
		var eventY = e.pageY - canvasTop;
        switch(form) {
            case 'line': {
                if(inmotion){
                    lineData._endLine(eventX, eventY);
                }
                drawall();
                break;
            }
            default: {
                if(beingDragged != null) {
                    var x = eventX - mouseStart.x + mouseStart.originalCo.x;
                    var y = eventY - mouseStart.y + mouseStart.originalCo.y;
                    beingDragged._set(x, y);
                }
                drawall();
            };
        }
    });

    $('#ACanvas').bind('mouseup', function (e) {
	    var eventX = e.pageX - canvasLeft;
        var eventY = e.pageY - canvasTop;
        switch(form) {
            case 'line': {
                inmotion = false;
				for(var cnt in items) {
                    if(items[cnt] instanceof Component) {
                        var res = getPort(items[cnt], eventX, eventY);
                        if(res[0] != -1) {
                            var endSucceed = lineData._endPort(items[cnt], res[0], res[1]);
                            if(endSucceed) {
                                lineData._draw();
                            } else {
                                items.pop();
                            }
                            return;
                        }
                    }
                }
                lineData._endLine(eventX, eventY);
                lineData.isValid = false;
                lineData._draw();
                break;
            }
            default: {
                if(beingDragged != null) {
                    if(eventX == mouseStart.x && eventY == mouseStart.y) {
                        $('.comattr').hide(); 
                        for (var x in items) {
                            if (isIntersected(eventX, eventY, items[x])) {
                                items[x]._popUp();
                            }
                        }
                        drawall();                    
                    }
                    beingDragged = null;
                }
			}
			break;
        }
    });

    // ======================================================================
    // ======================================================================
	function getPort(item, eventX, eventY) {
        for (var x in item.inPorts) {
            var px = item.inPortPos[x*2];
            var py = item.inPortPos[x*2 + 1];
            var dx = px + item.x - eventX - item.width / 2;
            var dy = py + item.y - eventY - item.height / 2;
            if(dx*dx + dy*dy <= 400) {
                return [item.inPorts[x], false];
            }
        }
        for (var x in item.outPorts) {
            var px = item.outPortPos[x*2];
            var py = item.outPortPos[x*2 + 1];
            var dx = px + item.x - eventX - item.width / 2;
            var dy = py + item.y - eventY - item.height / 2;
            if(dx*dx + dy*dy <= 400) {
                return [item.outPorts[x], true];
            }
        }
        return [-1, false];
    }
	
	$('#save').bind('click', function() {
        var str = $('textarea').val();
        var tmp = str;
        for(var x in items) {
            if(items[x].type == 'line') {
                if(items[x].isValid == true) {
                    tmp += items[x]._getMDL();
                }
            }
            else {
                tmp += items[x]._getMDL();
            }
        }
        tmp += '}\n}';

        $.post('fileio.php',
        {
          'filename':'simulinksample.mdl',
          'data':tmp
        },
        function(data,status){
        });
    });


    function getItem(itemID) {
        for (var x in items) {
            if(items[x].id == itemID)
                return items[x];
        }
        return null;
    }
	
    $('.submit').bind('click', function () {
        var popUpWindow = $(this).parent().parent();
        var array = [];
        $(this).prev().children('input[type=text]').each(function() {     //each()，取到所有文本框里的当前值，然后将其放到array中
            array.push($(this).val());
        });

        beingEdit._setAttr(array);     //把array作为参数，使用component的_setAttr()方法将其设置为attr值
        popUpWindow.hide();
    });

    $('.menu').bind('click', function () {
        $(this).next().slideToggle(500);
    });
	
	$(".comattr").draggable();

    function isIntersected(x, y, element) {
        var res = false;
        if(element.type != 'line') {
            if (element.x - element.width/2 <= x && element.x + element.width/2 >= x && element.y - element.height/2 <= y && element.y + element.height/2 >= y) 
                return true;
        }
        else {
             var a = Math.sqrt(Math.pow(element.start.x-x,2)+Math.pow(element.start.y-y,2));
			 var b = Math.sqrt(Math.pow(element.end.x-x,2)+Math.pow(element.end.y-y,2));
			 var c = Math.sqrt(Math.pow(element.end.x-element.start.x,2)+Math.pow(element.end.y-element.start.y,2));
			 if (Math.abs(a+b-c<1))
			     return true;
        }
        return res;
    }

    function drawall() {
        ctx.clearRect(0,0,1200,700);
        for(var x in items) {
            items[x]._draw();
        }
    }
});