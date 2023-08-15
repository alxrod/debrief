export class ArticleNode {
  // constructor
  constructor(article) {
    if (article.metadata) {
      this.metadata_id = article.metadata._id
    }
    this.id = article.id
    this.upload_path = article.upload_path
    this.cur = this.makeAudio(article.upload_path)

    // Elem ordering
    this.next = null
    this.prev = null

  }

  makeAudio = (upload_path) => {
    const url = "https://debrief-summaries.s3.amazonaws.com/" + upload_path
    if (upload_path === "") {
      return new Audio()
    }
    var a = new Audio(url);
    a.playbackRate=1.2;
    return a
  }

  play = () => {
    this.cur.play()
  }

  pause = () => {
    this.cur.pause()
  }

  resume = () => {
    this.cur.play()
  }
  
  reset = () => {
    this.cur.pause()
    const endFunc = this.cur.onended
    this.cur = this.makeAudio(this.upload_path)
    this.cur.onended = endFunc
    this.cur.play()
  }
}
// linkedlist class
export default class ArticleLinkedList {
  constructor(endCallback) {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.endCallback = endCallback;
  }

  composeOnEnd = (cur, next) => {
    const ended = this.endCallback
    return function () {
      ended(cur)
      if (next !== null) {
        next.cur.play()
      }
    }
  };

  setAfter(first, second) {
    first.next = second
    if (second !== null) {
      second.prev = first
    }
    first.cur.onended = this.composeOnEnd(first, second)
  }

  add(article) {
    // creates a new node
    var node = new ArticleNode(article);

    // list is empty
    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }

    if (node.prev) {
      this.setAfter(node.prev, node)
    }
    this.setAfter(node, node.next)

    this.size++;
    return node;
  }
  
  insertAt(element, index) {
    if (index < 0 || index > this.size)
      return console.log("Please enter a valid index.");
    else {
      // creates a new node
      var node = new ArticleNode(element);
      var curr, prev, next;

      

      // add the element to the
      // first index
      if (index == 0) {
        if (this.head === null) {
          this.head = node;
          this.tail = node;
          this.setAfter(node, null);
        } else {
          this.setAfter(node, this.head);
          this.head = node;
        }
      } else {
        curr = this.head;
        next = curr.next;
        var it = 0;

        while (it < index) {
            it++;
            prev = curr;
            curr = curr.next;
        }

        // adding an element
        this.setAfter(prev, node)
        this.setAfter(node, curr)
      }
      this.size++;

      return node;
    }
  }
  

  removeFrom(index) {
    if (index < 0 || index >= this.size) {
      return console.log("Please Enter a valid index");
    } else {
      var curr, prev, it = 0;
      curr = this.head;
      prev = curr;

      if (index === 0) {
        this.head = curr.next;
      } else {
        while (it < index) {
          it++;
          prev = curr;
          curr = curr.next;
        }

        this.setAfter(prev, curr.next);
      }
      this.size--;

      return curr;
    }
  }

  // removes a given element from the
  // list
  removeElement(id) {
    var current = this.head;
    var prev = null;

    while (current != null) {
      if (current.id === id) {

        if (prev == null) {
          this.head = current.next;
        } else {
          this.setAfter(prev, current.next)
        }
        this.size--;
        return current;
      }
      prev = current;
      current = current.next;
    }
    return -1;
  }


  // finds the index of element
  indexOf(id) {
    var count = 0;
    var current = this.head;

    // iterate over the list
    while (current != null) {
// compare each element of the list
// with given element
      if (current.id === id)
        return count;
      count++;
      current = current.next;
    }

      // not found
      return -1;
  }

  // checks the list for empty
  isEmpty() {
    return this.size == 0;
  }

  haltPrior(current) {
    let cursor = current.prev
    while (cursor !== null) {
      cursor.cur.pause()
      cursor.cur.src = ""
    }
  }

  empty() {
    var current = this.head;
    var prev = null;

    while (current != null) {
      current.cur.pause()
      current.cur.src = ""
      current.cur.onended = function () {}
      prev = current;
      current = current.next;
      
    }
    
    this.head = null
    this.tail = null
    this.size = 0
    return -1;
  }

  // prints the list items
  printList() {
      var curr = this.head;
      var str = "";
      while (curr) {
          str += curr.id + " ";
          curr = curr.next;
      }
      console.log(str);
  }

}