
(function () {
  var openComment, styles, time, writeStyleChar, writeStyles;
  
  writing_rate = 24;
  _throttle = {
    start: 4821,
    stop: 5344
  };




  texttotype = [
    `
                     
pre { left: 50%; }
~\`
var title = document.createElement("h1");
title.innerHTML = "malice.ml";
title.id = "title";
document.body.appendChild(title);
~
\`
#title { transition : color 0.5s; }
#title { color : #ac76e3; }
`];

  openComment = false;
  // body selector
  $body = document.getElementsByTagName("body")[0];

  // easily create element with id
  createElement = function (tag, id) {
    var el;
    el = document.createElement(tag);
    if (id) {
      el.id = id;
    }
    return el;
  };


  // create our primary elements
  _style_elem = createElement("style", "styleelement");

  _code_pre = createElement("pre", "codeblock");

  _script_area = createElement("div", "jscript");

  // append our primary elements to the body
  $body.appendChild(_style_elem);

  $body.appendChild(_code_pre);

  $body.appendChild(_script_area);

  // select our primary elements
  $style_elem = document.getElementById("styleelement");

  $code_pre = document.getElementById("codeblock");

  $script_area = document.getElementById("jscript");

  // tracking states
  openComment = false;

  openInteger = false;

  openString = false;

  prevAsterisk = false;

  prevSlash = false;

  // script syntax highlighting logic
  scriptSyntax = function (string, which) {
    var s;

    // if end of integer (%, ., or px too)
    if (openInteger && !which.match(/[0-9\.]/) && !openString && !openComment) {
      s = string.replace(/([0-9\.]*)$/, "<em class=\"int\">$1</em>" + which);

      // open comment detection
    } else if (which === '*' && !openComment && prevSlash) {
      openComment = true;
      s = string + which;

      // closed comment detection    
    } else if (which === '/' && openComment && prevAsterisk) {
      openComment = false;
      s = string.replace(/(\/[^(\/)]*\*)$/, "<em class=\"comment\">$1/</em>");

      // var detection
    } else if (which === 'r' && !openComment && string.match(/[\n ]va$/)) {
      s = string.replace(/va$/, "<em class=\"var\">var</em>");

      // operator detection
    } else if (which.match(/[\!\=\-\?]$/) && !openString && !openComment) {
      s = string + "<em class=\"operator\">" + which + "</em>";
      // pre paren detection
    } else if (which === "(" && !openString && !openComment) {
      s = string.replace(/(\.)?(?:([^\.\n]*))$/, "$1<em class=\"method\">$2</em>(");

      // detecting quotes    
    } else if (which === '"' && !openComment) {
      s = openString ? string.replace(/(\"[^"\\]*(?:\\.[^"\\]*)*)$/, "<em class=\"string\">$1\"</em>") : string + which;

      // detecting run script command ~
    } else if (which === "~" && !openComment) {
      s = string + "<em class=\"run-command\">" + which + "</em>";



    } else {
      // ignore syntax temporarily or permanently
      s = string + which;
    }

    // return script formatted string    
    return s;
  };

  // style syntax highlighting logic
  styleSyntax = function (string, which) {
    var crazy_reghex, preformatted_string, s;

    // if end of integer (%, ., or px too), close it and continue
    if (openInteger && !which.match(/[0-9\.\%pxems]/) && !openString && !openComment) {
      preformatted_string = string.replace(/([0-9\.\%pxems]*)$/, "<em class=\"int\">$1</em>");
    } else {
      preformatted_string = string;
    }

    // open comment detection
    if (which === '*' && !openComment && prevSlash) {
      openComment = true;
      s = preformatted_string + which;

      // closed comment detection    
    } else if (which === '/' && openComment && prevAsterisk) {
      openComment = false;
      s = preformatted_string.replace(/(\/[^(\/)]*\*)$/, "<em class=\"comment\">$1/</em>");

      // wrap style declaration
    } else if (which === ':') {
      s = preformatted_string.replace(/([a-zA-Z- ^\n]*)$/, '<em class="key">$1</em>:');

      // wrap style value 
    } else if (which === ';') {
      // detect hex code
      crazy_reghex = /((#[0-9a-zA-Z]{6})|#(([0-9a-zA-Z]|\<em class\=\"int\"\>|\<\/em\>){12,14}|([0-9a-zA-Z]|\<em class\=\"int\"\>|\<\/em\>){8,10}))$/;

      // is hex    
      if (preformatted_string.match(crazy_reghex)) {
        s = preformatted_string.replace(crazy_reghex, '<em class="hex">$1</em>;');
      } else {
        // is standard value      
        s = preformatted_string.replace(/([^:]*)$/, '<em class="value">$1</em>;');
      }
      // wrap selector
    } else if (which === '{') {
      s = preformatted_string.replace(/(.*)$/, '<em class="selector">$1</em>{');
    } else {

      // ignore syntax temporarily or permanently
      s = preformatted_string + which;
    }
    // return style formatted string    
    return s;
  };

  __js = false;

  _code_block = "";

  // write a single character
  writeChar = function (which) {
    var char, code_html, prior_block_match, prior_comment_match, script_tag;

    // toggle CSS/JS on `
    if (which === "`") {
      // reset it to empty string so as not to show in DOM    
      which = "";
      __js = !__js;
    }

    // Using JS  
    if (__js) {
      // running a command block. initiated with "~"
      if (which === "~" && !openComment) {
        script_tag = createElement("script");
        // two matches based on prior scenario
        prior_comment_match = /(?:\*\/([^\~]*))$/;
        prior_block_match = /([^~]*)$/;
        if (_code_block.match(prior_comment_match)) {
          script_tag.innerHTML = _code_block.match(prior_comment_match)[0].replace("*/", "") + "\n\n";
        } else {

          script_tag.innerHTML = _code_block.match(prior_block_match)[0] + "\n\n";
        }
        $script_area.innerHTML = "";
        $script_area.appendChild(script_tag);
      }
      char = which;
      code_html = scriptSyntax($code_pre.innerHTML, char);



    } else {

      // Using CSS
      char = which === "~" ? "" : which;

      $style_elem.innerHTML += char;

      code_html = styleSyntax($code_pre.innerHTML, char);

    }

    // set states    
    prevAsterisk = which === "*";
    prevSlash = (which === "/") && !openComment;
    openInteger = which.match(/[0-9]/) || (openInteger && which.match(/[\.\%pxems]/)) ? true : false;
    if (which === '"') {
      openString = !openString;
    }
    // add text to code block variable for regex matching.
    _code_block += which;

    // add character to pre
    return $code_pre.innerHTML = code_html;
  };

  // write all the chars
  writeChars = function (message, index, interval) {
    if (index < message.length) {
      if (index >= _throttle.start && index < _throttle.stop) {
        interval = 2;
      } else {
        interval = writing_rate;
      }
      $code_pre.scrollTop = $code_pre.scrollHeight;
      writeChar(message[index++]);
      return setTimeout((function () {
        return writeChars(message, index, interval);
      }), interval);
    }
  };

  // detect url parameters
  getURLParam = function (key, url) {
    var match;
    if (typeof url === 'undefined') {
      url = window.location.href;
    }
    match = url.match('[?&]' + key + '=([^&]+)');
    if (match) {
      return match[1];
    } else {
      return 0;
    }
  };


  // initiate the script
  writeChars(texttotype[0], 0, writing_rate);
  
}).call(this);