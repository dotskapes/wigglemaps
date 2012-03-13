function cnode (data, parent) {
    this.prev = null;
    this.next = null;
    this.data = data;
};

function clist () {
    this.head = null;
    this.current = null;
    this.length = 0;
    
    this.next = function () {
	if (this.length > 0) {
	    this.current = this.current.next;
	}
    };

    this.append = function (data) {
	if (this.length > 0) {
	    var node = new cnode (data);
	    node.prev = this.head.prev;
	    node.next = this.head;
	    this.head.prev.next = node;
	    this.head.prev = node;
	    this.length ++;
	}
	else {
	    var node = new cnode (data);
	    this.head = node;
	    this.current = node;
	    this.length = 1;
	    node.next = node;
	    node.prev = node;
	}
    };
    
    this.remove = function () {
	if (this.length > 0) {
	    if (this.length > 1) {
		var node = this.current;
		node.next.prev = node.prev;
		node.prev.next = node.next;
		this.current = node.next;
		this.length --;
		if (node == this.head)
		    this.head = this.current;
		return node;
	    }
	    else {
		var node = this.current;
		this.head = null;
		this.current = null;
		this.length = 0;
		return node;
	    }
	}	
    }
};