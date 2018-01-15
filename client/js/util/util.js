class Util {
  constructor() {

  }

  formatRegion() {
    return d3.format(",");
  }

  decodeUrl(url) {
    if (url && (url.slice(0,14) == 'https%3A%2F%2F' || url.slice(0,13) == 'http%3A%2F%2F'))
      return decodeURIComponent(url)
    else
      return url;
  }


  formatDate(d) {
    var padMinutes = function(n) {
        return String("00" + n).slice(-2);
    }
    var formatHours = function(h) {
      if (+h > 12) {
        return +h - 12;
      } else {
        return h;
      }
    }
    var getAmPm = function(h) {
      if (+h > 12) {
        return 'pm';
      } else {
        return 'am';
      }
    }
    return d.getMonth() + "-" + d.getDay() + "-" + d.getFullYear() + " " + formatHours(d.getHours()) + ":" + padMinutes(d.getMinutes()) + " " + getAmPm(d.getHours());
  }



  visibleHeight($el) {
      var elH = $el.outerHeight(),
          H = $(window).height(),
          r = $el[0].getBoundingClientRect(), t=r.top, b=r.bottom;
      return Math.max(0, t>0? Math.min(elH, H-t) : (b<H?b:H));
  }

  goToHome() {
    var homeUrl = window.location.protocol + "\/\/" + window.location.hostname + window.location.pathname;
    window.location.assign(homeUrl);
  }

  changeSiteStylesheet(cssHref) {

      var oldlink = $("#site-stylesheet")[0];

      var newlink = document.createElement("link");
      newlink.setAttribute("rel",  "stylesheet");
      newlink.setAttribute("id",   "site-stylesheet");
      newlink.setAttribute("type", "text/css");
      newlink.setAttribute("href", cssHref);

      document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
  }

  createDownloadLink(anchorSelector, str, fileName) {

    if(window.navigator.msSaveOrOpenBlob) {
      var fileData = [str];
      blobObject = new Blob(fileData);
      $(anchorSelector).click(function(){
        window.navigator.msSaveOrOpenBlob(blobObject, fileName);
      });
    } else {
      var url = "data:text/plain;charset=utf-8," + encodeURIComponent(str);
      $(anchorSelector).attr("download", fileName);
      $(anchorSelector).attr("href", url);
    }
    $(anchorSelector).animateIt('tada', 'animate-twice');
  }




  switchGenotype(gt) {
    if (gt != null && gt.length == 3) {
      return gt[2] +  gt[0];
    } else {
      return gt;
    }

  }

  endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  showStackTrace(e) {
    var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
        .replace(/^\s+at\s+/gm, '')
        .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
        .split('\n');
    console.log(stack);
  }

  getHumanRefNames(refName) {
      if (refName.indexOf("chr") == 0) {
        return "chr1 chr2 chr3 chr4 chr5 chr6 chr7 chr8 chr9 chr10 chr11 chr12 chr13 chr14 chr15 chr16 chr17 chr18 chr20 chr21 chr22 chrX chrY";
      } else {
        return "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 X Y";
      }
  }

  formatCurrentDateTime(delim) {
    var theDelim = delim ? delim : '-';
    var theTimeDelim = delim ? delim : ':';
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }


    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var theTime = hours + theTimeDelim + minutes + ampm;

    var today = mm + theDelim + dd + theDelim + yyyy + theDelim + theTime;
    return today;
  }

  stripTranscriptPrefix(transcriptId) {
    if (transcriptId == null) {
      console.log("null transcript id")
      return "";
    }
    var nameTokens = transcriptId.split('.');
    return nameTokens.length > 0 ? nameTokens[0] : transcriptId;
  }

  uniq(theArray) {
     return Array.from(new Set(theArray));
  }


  /*
  *
  *  Stream the app snapshot (html) to the emailServer which
  *  will email a description of the problem along with an html file attachment
  *  that is the snapshop of vcfiobio.
  */
  sendFeedbackEmail(name, email, note, htmlAttachment) {
    var client = BinaryClient(emailServer);

    // Strip of the #modal-report-problem from the URL
    var appURL = "";
    if (feedbackShowURL) {
      appURL = location.href;
      if (appURL.indexOf("#feedback-modal") > -1){
          appURL = appURL.substr(0, appURL.indexOf("#feedback-modal"));
      }
    }

    // Format the body of the email
    var htmlBody = '<span style="padding-right: 4px">Reported by:</span>' + name  + "<br><br>";
    htmlBody    += '<span style="padding-right: 4px">Email:</span>' + email  + "<br><br>";
    if (feedbackShowURL) {
      htmlBody +=  '<span style="padding-right: 51px">gene.iobio URL:</span>' + appURL + "<br><br>";
    }
    htmlBody += note + '<br><br>';

    var emailObject = {
        'from':     email,
        'to':       feedbackEmails,
        'subject':  'Feedback on gene.iobio',
        'body':     htmlBody
     };
     if (feedbackAttachScreenCapture && htmlAttachment) {
      emailObject.filename = 'gene.iobio.screencapture.' + util.formatCurrentDateTime('.') + '.html';
     } else {
      emailObject.filename = '';
     }

    client.on('open', function(stream){
      var stream = client.createStream(emailObject);
      if (feedbackAttachScreenCapture && htmlAttachment) {
        stream.write(htmlAttachment);
      }
      stream.end();
    });
  }


  sendFeedbackReceivedEmail(emailTo) {
    var client = BinaryClient(emailServer);

    // Format the body of the email
    var htmlBody = 'Thank you for your feedback on gene.iobio.  We will review your email as soon as possible.';
    htmlBody     += '<br><br>';
      htmlBody     += 'Best regards,<br>';
      htmlBody     += 'The IOBIO team';

    var emailObject = {
        'from':     feedbackEmails,
        'to':       emailTo,
        'subject':  'gene.iobio feedback received',
        'body':     htmlBody
     };

    client.on('open', function(stream){
      var stream = client.createStream(emailObject);
      stream.end();
    });
  }



  capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  percentage(a, showSign=true) {
    let me = this;
    var pct = a * 100;
    var places = 0;
    if (pct < .001) {
      places = 4;
    } else if (pct < .01) {
      places = 3;
    } else if (pct < .1) {
      places = 2
    } else if (pct < 1) {
      places = 1;
    } else {
      places = 0;
    }
    return me.round(pct, places) + (showSign ? "%" : "");
  }

  round(value, places) {
    return +(Math.round(value + "e+" + places)  + "e-" + places);
  }

  splitArray(a, n) {
    var len = a.length,out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i + size));
        i += size;
    }
    return out;
  }

  getRsId(variant) {
    var rsId = null;
    if (variant.vepVariationIds) {
      for (var key in variant.vepVariationIds) {
        if (key != 0 && key != '') {
          var tokens = key.split("&");
          tokens.forEach( function(id) {
            if (id.indexOf("rs") == 0) {
              rsId = id;
            }
          });
        }
      }
    }
    return rsId;
  }

  getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    var hits = {};

    var matchExact = function(r, str) {
      var match = str.match(r);
      return match != null && str.indexOf(match[0]) == 0;
    }

    var getMatch = function(string, regex, index) {
      index || (index = 1); // default to the first capturing group
      var matches = [];
      var match = regex.exec(string);
      if (match && match.length > index && match[index]) {
        return match[index];
      } else {
        return null;
      }
    }


    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (typeof sParam == 'string' || sParam instanceof String) {
          if (sParameterName[0] == sParam)
          {
              return sParameterName[1];
          }
      } else {
        var match = getMatch(sParameterName[0], sParam)
        if ( match) {
          hits[sParameterName[0]] = sParameterName[1];
        }
      }
    }

    if (Object.keys(hits).length == 0)
      return undefined;
    else
      return hits;
  }


  addCommas(nStr) {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }


  updateUrl(paramName, value) {
    var params = {};
    // turn params into hash
    window.location.search.split('&').forEach(function(param){
      if (param != '') {
        param = param.split('?').length == 1 ? param : param.split('?')[1];
        var fields = param.split('=');
        params[fields[0]] = fields[1];
      }
    });
    params[paramName] = value;
    var search = [];
    Object.keys(params).forEach(function(key) {
      search.push(key + '=' + params[key]);
    })
      window.history.replaceState(null,null,'?'+search.join('&'));
  }

  removeUrl(paramName) {
    var params = {};
    // turn params into hash, but leave out the specified parameter
    window.location.search.split('&').forEach(function(param){
      if (param.indexOf(paramName) == 0) {

      } else if (param != '') {
        param = param.split('?').length == 1 ? param : param.split('?')[1];
        var fields = param.split('=');
        params[fields[0]] = fields[1];
      }
    });
    var search = [];
    Object.keys(params).forEach(function(key) {
      search.push(key + '=' + params[key]);
    })
    window.history.replaceState(null,null,'?'+search.join('&'));

  }


  isChrome() {
    var isChromium = window.chrome,
      winNav = window.navigator,
      vendorName = winNav.vendor,
      isOpera = winNav.userAgent.indexOf("OPR") > -1,
      isIEedge = winNav.userAgent.indexOf("Edge") > -1,
      isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
      return true;
    } else if (
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
      isOpera === false &&
      isIEedge === false
    ) {
      return true;
    } else {
      return false;
    }
  }



  /**
   * detect IE
   * returns version of IE or false, if browser is not Internet Explorer
   */
  detectIE() {
      var ua = window.navigator.userAgent;

      var msie = ua.indexOf('MSIE ');
      if (msie > 0) {
          // IE 10 or older => return version number
          return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }

      var trident = ua.indexOf('Trident/');
      if (trident > 0) {
          // IE 11 => return version number
          var rv = ua.indexOf('rv:');
          return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }

      var edge = ua.indexOf('Edge/');
      if (edge > 0) {
         // IE 12 => return version number
         return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }

      // other browser
      return false;
  }

  detectSafari() {
    return (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1);
  }



  // Function from David Walsh: http://davidwalsh.name/css-animation-callback
  whichTransitionEvent() {
    var t,
        el = document.createElement("fakeelement");

    var transitions = {
      "transition"      : "transitionend",
      "OTransition"     : "oTransitionEnd",
      "MozTransition"   : "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions){
      if (el.style[t] !== undefined){
        return transitions[t];
      }
    }
  }


}